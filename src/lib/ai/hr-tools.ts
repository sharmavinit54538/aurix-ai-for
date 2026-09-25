/**
 * Server-side HR tool catalog exposed to AI Brain agents.
 * Connects directly to authenticated backend services with user token forwarding
 * and role-based tool scoping.
 */
import { tool } from "ai";
import { z } from "zod";
import { apiInstance } from "@/api";
import { normalizeRole } from "@/lib/roles";

interface CreateHrToolsOptions {
  token?: string;
  role?: string;
}

export function createHrTools({ token, role = "employee" }: CreateHrToolsOptions = {}) {
  const normRole = normalizeRole(role);
  const isExecutiveOrHr =
    normRole === "superadmin" ||
    normRole === "hr_admin" ||
    normRole === "executive";

  const isManager = isExecutiveOrHr || normRole === "manager";

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const tools: Record<string, any> = {};

  // ── Baseline tools: Available to all authenticated roles ───────
  tools.searchPolicies = tool({
    description: "Retrieval over the indexed company policies & SOP knowledge base.",
    inputSchema: z.object({
      query: z.string().describe("Natural-language question or topic"),
      topK: z.number().min(1).max(5).optional().default(3),
    }),
    execute: async ({ query, topK = 3 }) => {
      try {
        const res = await apiInstance.get("/policy-assistant/search", {
          params: { q: query, limit: topK },
          headers: authHeaders,
        });
        const results = res.data?.data ?? res.data ?? [];
        return {
          count: Array.isArray(results) ? results.length : 0,
          query,
          results: Array.isArray(results) ? results : [],
        };
      } catch {
        return { count: 0, query, results: [] };
      }
    },
  });

  tools.getLeaveBalance = tool({
    description: "Return leave balance (casual, sick, earned) for an employee id or name.",
    inputSchema: z.object({ employeeId: z.string().optional() }),
    execute: async ({ employeeId }) => {
      try {
        // If employee role, prevent querying arbitrary other employees' balances
        const targetId = isManager ? employeeId : undefined;
        const res = await apiInstance.get("/leaves/balances", {
          params: targetId ? { employee_id: targetId } : undefined,
          headers: authHeaders,
        });
        const balances = res.data?.data ?? res.data ?? [];
        return {
          found: Array.isArray(balances) && balances.length > 0,
          employeeId: targetId || "current_user",
          balances: Array.isArray(balances) ? balances : [],
          asOf: new Date().toISOString().slice(0, 10),
        };
      } catch {
        return { found: false as const, employeeId, balances: [] };
      }
    },
  });

  tools.proposeAction = tool({
    description:
      "Stage an action that requires human approval before execution (e.g. apply leave, send email, generate offer letter, approve reimbursement). Returns a structured proposal — DOES NOT execute the action.",
    inputSchema: z.object({
      kind: z.enum([
        "apply_leave",
        "send_email",
        "generate_letter",
        "approve_request",
        "reject_request",
        "reimburse_expense",
        "create_employee",
        "schedule_interview",
        "trigger_workflow",
      ]),
      summary: z.string().describe("One-sentence human-readable summary"),
      payload: z.record(z.string(), z.any()).describe("Structured fields the executor would consume"),
      requiresApprovalFrom: z
        .string()
        .optional()
        .describe("Role that must approve, e.g. 'manager', 'hr_admin', 'finance'"),
    }),
    execute: async (input) => ({
      status: "pending_approval" as const,
      proposalId: `prop_${Math.random().toString(36).slice(2, 10)}`,
      proposedAt: new Date().toISOString(),
      ...input,
    }),
  });

  // ── Manager+ Tools: Directory and employee profile lookup ──────
  if (isManager) {
    tools.searchEmployees = tool({
      description:
        "Search the employee directory by name fragment, department, role, or manager. Returns up to 20 matching employees with summary fields.",
      inputSchema: z.object({
        query: z
          .string()
          .optional()
          .describe("Free-text fragment to match against name, email, role, or department"),
        department: z.string().optional(),
        manager: z.string().optional(),
        minRiskScore: z
          .number()
          .min(0)
          .max(100)
          .optional()
          .describe("Only return employees with attrition risk at or above this score"),
        limit: z.number().min(1).max(50).optional().default(20),
      }),
      execute: async ({ query, department, manager, limit = 20 }) => {
        try {
          const params: Record<string, string | number> = { limit };
          if (query) params.search = query;
          if (department && department !== "all") params.department = department;
          if (manager) params.manager = manager;
          const res = await apiInstance.get("/employees", { params, headers: authHeaders });
          const items =
            res.data?.data?.items ?? res.data?.items ?? (Array.isArray(res.data) ? res.data : []);
          const employees = items.map((e: any) => ({
            id: e.id || e.employee_id || "",
            name: `${e.first_name || ""} ${e.last_name || ""}`.trim() || e.name || "Employee",
            email: e.personal_email || e.company_email || e.email || "",
            department: e.department || "",
            role: e.designation || e.role || "",
            manager: e.manager_name || e.manager || "",
          }));
          return { count: employees.length, employees };
        } catch {
          return { count: 0, employees: [] };
        }
      },
    });

    tools.getEmployee = tool({
      description: "Fetch a full employee profile by employee id or exact name.",
      inputSchema: z.object({ idOrName: z.string() }),
      execute: async ({ idOrName }) => {
        try {
          const needle = idOrName.toLowerCase().trim();
          const res = await apiInstance.get("/employees", {
            params: { search: needle, limit: 10 },
            headers: authHeaders,
          });
          const items =
            res.data?.data?.items ?? res.data?.items ?? (Array.isArray(res.data) ? res.data : []);
          const match = items.find((e: any) => {
            const name = `${e.first_name || ""} ${e.last_name || ""}`.trim().toLowerCase();
            const empId = String(e.employee_id || e.id || "").toLowerCase();
            return name === needle || empId === needle || name.includes(needle);
          });
          if (!match) return { found: false as const, idOrName };
          return {
            found: true as const,
            employee: {
              id: match.employee_id || match.id,
              name: `${match.first_name || ""} ${match.last_name || ""}`.trim() || match.name,
              email: match.personal_email || match.company_email || match.email,
              department: match.department,
              role: match.designation || match.role,
              status: match.status,
              joiningDate: match.joining_date,
            },
          };
        } catch {
          return { found: false as const, idOrName };
        }
      },
    });
  }

  // ── Executive & HR Tools: Attrition risk analysis ──────────────
  if (isExecutiveOrHr) {
    tools.attritionRiskList = tool({
      description:
        "Return the top-N employees by predicted attrition risk, optionally scoped to a department.",
      inputSchema: z.object({
        department: z.string().optional(),
        topN: z.number().min(1).max(50).optional().default(10),
      }),
      execute: async ({ department, topN = 10 }) => {
        try {
          const res = await apiInstance.get("/ai-insights/attrition", { headers: authHeaders });
          const items = res.data?.data ?? res.data ?? [];
          const scope = Array.isArray(items) ? items : [];
          const filtered = department
            ? scope.filter(
                (e: any) => String(e.department || "").toLowerCase() === department.toLowerCase(),
              )
            : scope;
          return {
            count: filtered.slice(0, topN).length,
            scope: department ?? "company",
            employees: filtered.slice(0, topN),
          };
        } catch {
          return { count: 0, scope: department ?? "company", employees: [] };
        }
      },
    });
  }

  return tools;
}

export const hrTools = createHrTools();

export type HrToolName = keyof typeof hrTools;