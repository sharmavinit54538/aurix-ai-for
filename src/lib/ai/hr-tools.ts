/**
 * Server-side HR tool catalog exposed to AI Brain agents.
 *
 * Phase 1: in-process demo data so agents can demonstrate the full
 * loop (tool call → tool result → narrated answer) without a DB.
 * Swap these implementations for real DB / service calls in later phases —
 * the tool signatures are the public contract.
 */
import { tool } from "ai";
import { z } from "zod";

interface DemoEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  manager: string;
  joinedOn: string;
  ctcLpa: number;
  performance: number; // 0-100
  attendancePct: number; // 0-100
  unplannedAbsencesMtd: number;
  trainingCompletionPct: number;
  riskScore: number; // 0-100 attrition risk
  leaveBalance: { casual: number; sick: number; earned: number };
}

// Small, realistic demo roster used by every agent until DB is wired up.
const DEMO_EMPLOYEES: DemoEmployee[] = [
  { id: "E-1001", name: "Priya Singh",   email: "priya.singh@aurix.io",   department: "Engineering", role: "Senior Engineer",     manager: "Anita Rao",   joinedOn: "2021-03-14", ctcLpa: 28, performance: 88, attendancePct: 97, unplannedAbsencesMtd: 0, trainingCompletionPct: 100, riskScore: 18, leaveBalance: { casual: 4, sick: 6, earned: 11 } },
  { id: "E-1002", name: "Rahul Mehta",   email: "rahul.mehta@aurix.io",   department: "Engineering", role: "Engineer II",         manager: "Anita Rao",   joinedOn: "2022-07-01", ctcLpa: 18, performance: 62, attendancePct: 82, unplannedAbsencesMtd: 4, trainingCompletionPct: 40,  riskScore: 71, leaveBalance: { casual: 2, sick: 5, earned: 6 } },
  { id: "E-1003", name: "Anita Rao",     email: "anita.rao@aurix.io",     department: "Engineering", role: "Engineering Manager", manager: "Vikram Shah", joinedOn: "2019-01-10", ctcLpa: 46, performance: 91, attendancePct: 96, unplannedAbsencesMtd: 1, trainingCompletionPct: 90,  riskScore: 22, leaveBalance: { casual: 5, sick: 7, earned: 14 } },
  { id: "E-1004", name: "Maya Iyer",     email: "maya.iyer@aurix.io",     department: "Design",      role: "Senior Designer",     manager: "Karan Verma", joinedOn: "2020-11-22", ctcLpa: 24, performance: 84, attendancePct: 94, unplannedAbsencesMtd: 1, trainingCompletionPct: 80,  riskScore: 34, leaveBalance: { casual: 3, sick: 6, earned: 9 } },
  { id: "E-1005", name: "Vikram Shah",   email: "vikram.shah@aurix.io",   department: "Leadership",  role: "VP Engineering",      manager: "CEO",         joinedOn: "2017-05-02", ctcLpa: 78, performance: 93, attendancePct: 98, unplannedAbsencesMtd: 0, trainingCompletionPct: 100, riskScore: 12, leaveBalance: { casual: 6, sick: 8, earned: 18 } },
  { id: "E-1006", name: "Karan Verma",   email: "karan.verma@aurix.io",   department: "Design",      role: "Design Lead",         manager: "Vikram Shah", joinedOn: "2019-09-15", ctcLpa: 38, performance: 80, attendancePct: 92, unplannedAbsencesMtd: 2, trainingCompletionPct: 70,  riskScore: 41, leaveBalance: { casual: 4, sick: 6, earned: 10 } },
  { id: "E-1007", name: "Neha Kapoor",   email: "neha.kapoor@aurix.io",   department: "Sales",       role: "Account Executive",   manager: "Sandeep Roy", joinedOn: "2023-02-01", ctcLpa: 14, performance: 58, attendancePct: 78, unplannedAbsencesMtd: 5, trainingCompletionPct: 25,  riskScore: 82, leaveBalance: { casual: 1, sick: 4, earned: 3 } },
  { id: "E-1008", name: "Sandeep Roy",   email: "sandeep.roy@aurix.io",   department: "Sales",       role: "Sales Manager",       manager: "Vikram Shah", joinedOn: "2018-04-19", ctcLpa: 42, performance: 76, attendancePct: 88, unplannedAbsencesMtd: 2, trainingCompletionPct: 60,  riskScore: 48, leaveBalance: { casual: 3, sick: 5, earned: 8 } },
];

const DEMO_POLICIES = [
  { id: "POL-LEAVE-001", title: "Leave Policy", section: "3.2 Casual Leave", content: "Each full-time employee accrues 12 casual leave days per calendar year, credited monthly. Unused casual leave does not carry over." },
  { id: "POL-LEAVE-002", title: "Leave Policy", section: "3.5 Paternity Leave", content: "Eligible employees are entitled to 15 working days of paid paternity leave, to be availed within 6 months of the child's birth." },
  { id: "POL-LEAVE-003", title: "Leave Policy", section: "3.4 Maternity Leave", content: "26 weeks of paid maternity leave as per the Maternity Benefit Act, 2017, with optional work-from-home for up to 12 weeks after returning." },
  { id: "POL-WFH-001",   title: "Remote Work Policy", section: "2.1 Eligibility", content: "Confirmed employees may work remotely up to 3 days per week subject to manager approval. Fully remote roles are evaluated case-by-case." },
  { id: "POL-POSH-001",  title: "PoSH Policy", section: "5 Complaint Process", content: "Complaints can be raised confidentially via posh@aurix.io or to any IC member. Inquiry must complete within 90 days under the PoSH Act, 2013." },
  { id: "POL-PAY-001",   title: "Payroll Policy", section: "4 Salary Cycle", content: "Salaries are credited on the last working day of each month. Payslips are available in the employee portal by the 1st of the following month." },
  { id: "POL-EXP-001",   title: "Reimbursement Policy", section: "2 WFH Internet", content: "Up to ₹1,500 / month is reimbursable for home internet on production of an invoice in the employee's name." },
];

export const hrTools = {
  searchEmployees: tool({
    description: "Search the employee directory by name fragment, department, role, or manager. Returns up to 20 matching employees with summary fields.",
    inputSchema: z.object({
      query: z.string().optional().describe("Free-text fragment to match against name, email, role, or department"),
      department: z.string().optional(),
      manager: z.string().optional(),
      minRiskScore: z.number().min(0).max(100).optional().describe("Only return employees with attrition risk at or above this score"),
      limit: z.number().min(1).max(50).optional().default(20),
    }),
    execute: async ({ query, department, manager, minRiskScore, limit = 20 }) => {
      const q = (query ?? "").toLowerCase();
      const results = DEMO_EMPLOYEES.filter((e) => {
        if (q && !`${e.name} ${e.email} ${e.role} ${e.department}`.toLowerCase().includes(q)) return false;
        if (department && e.department.toLowerCase() !== department.toLowerCase()) return false;
        if (manager && !e.manager.toLowerCase().includes(manager.toLowerCase())) return false;
        if (minRiskScore !== undefined && e.riskScore < minRiskScore) return false;
        return true;
      }).slice(0, limit);
      return { count: results.length, employees: results };
    },
  }),

  getEmployee: tool({
    description: "Fetch a full employee profile by employee id (e.g. E-1001) or exact name.",
    inputSchema: z.object({ idOrName: z.string() }),
    execute: async ({ idOrName }) => {
      const needle = idOrName.toLowerCase().trim();
      const match = DEMO_EMPLOYEES.find(
        (e) => e.id.toLowerCase() === needle || e.name.toLowerCase() === needle,
      );
      if (!match) return { found: false as const, idOrName };
      return { found: true as const, employee: match };
    },
  }),

  getLeaveBalance: tool({
    description: "Return leave balance (casual, sick, earned) for an employee id or name. Defaults to the demo signed-in user E-1001 if no id provided.",
    inputSchema: z.object({ employeeId: z.string().optional() }),
    execute: async ({ employeeId }) => {
      const target = employeeId
        ? DEMO_EMPLOYEES.find((e) => e.id.toLowerCase() === employeeId.toLowerCase() || e.name.toLowerCase() === employeeId.toLowerCase())
        : DEMO_EMPLOYEES[0];
      if (!target) return { found: false as const, employeeId };
      return { found: true as const, employee: { id: target.id, name: target.name }, leaveBalance: target.leaveBalance, asOf: new Date().toISOString().slice(0, 10) };
    },
  }),

  attritionRiskList: tool({
    description: "Return the top-N employees by predicted attrition risk, optionally scoped to a department.",
    inputSchema: z.object({
      department: z.string().optional(),
      topN: z.number().min(1).max(50).optional().default(10),
    }),
    execute: async ({ department, topN = 10 }) => {
      const scope = department
        ? DEMO_EMPLOYEES.filter((e) => e.department.toLowerCase() === department.toLowerCase())
        : DEMO_EMPLOYEES;
      const ranked = [...scope]
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, topN)
        .map((e) => ({
          id: e.id, name: e.name, department: e.department, role: e.role,
          riskScore: e.riskScore, performance: e.performance,
          attendancePct: e.attendancePct, manager: e.manager,
        }));
      return { count: ranked.length, scope: department ?? "company", employees: ranked };
    },
  }),

  searchPolicies: tool({
    description: "Retrieval over the indexed company policies & SOP knowledge base. Returns the top matching policy snippets with section citations.",
    inputSchema: z.object({
      query: z.string().describe("Natural-language question or topic, e.g. 'paternity leave' or 'WFH internet reimbursement'"),
      topK: z.number().min(1).max(5).optional().default(3),
    }),
    execute: async ({ query, topK = 3 }) => {
      const terms = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
      const scored = DEMO_POLICIES.map((p) => {
        const hay = `${p.title} ${p.section} ${p.content}`.toLowerCase();
        const score = terms.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
        return { policy: p, score };
      })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((s) => s.policy);
      return { count: scored.length, query, results: scored };
    },
  }),

  proposeAction: tool({
    description: "Stage an action that requires human approval before execution (e.g. apply leave, send email, generate offer letter, approve reimbursement). Returns a structured proposal — DOES NOT execute the action.",
    inputSchema: z.object({
      kind: z.enum([
        "apply_leave", "send_email", "generate_letter", "approve_request",
        "reject_request", "reimburse_expense", "create_employee", "schedule_interview",
        "trigger_workflow",
      ]),
      summary: z.string().describe("One-sentence human-readable summary"),
      payload: z.record(z.string(), z.any()).describe("Structured fields the executor would consume"),
      requiresApprovalFrom: z.string().optional().describe("Role that must approve, e.g. 'manager', 'hr_admin', 'finance'"),
    }),
    execute: async (input) => ({
      status: "pending_approval" as const,
      proposalId: `prop_${Math.random().toString(36).slice(2, 10)}`,
      proposedAt: new Date().toISOString(),
      ...input,
    }),
  }),
};

export type HrToolName = keyof typeof hrTools;