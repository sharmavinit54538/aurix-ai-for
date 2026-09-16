import { api, apiInstance } from "@/api";
import {
  BonusAward,
  BonusesFilters,
  BonusesSummaryKPIs,
  BonusAuditLog,
  BonusAIInsight,
  BonusType,
} from "@/features/admin/payroll/components/bonuses/bonusesTypes";

export const BONUS_TYPES_LIST: BonusType[] = [
  "Performance Bonus",
  "Annual Bonus",
  "Festival Bonus",
  "Retention Bonus",
  "Joining Bonus",
  "Referral Bonus",
  "Sales Incentive",
  "Spot Award",
  "Project Bonus",
  "Quarterly Bonus",
  "Long-Term Incentive",
  "Stock Award",
  "Custom Bonus",
];

// TODO (Backend): Wire real backend endpoints for payroll bonuses (GET /api/v1/payroll/bonuses)
const INITIAL_BONUSES: BonusAward[] = [];
const INITIAL_AUDIT_LOGS: BonusAuditLog[] = [];
const INITIAL_AI_INSIGHTS: BonusAIInsight[] = [];

let localBonuses: BonusAward[] = [...INITIAL_BONUSES];
let localAuditLogs: BonusAuditLog[] = [...INITIAL_AUDIT_LOGS];

export const bonusesApi = {
  // GET all bonus awards with filtering
  getBonuses: async (params: Partial<BonusesFilters> = {}): Promise<{
    items: BonusAward[];
    total: number;
    kpis: BonusesSummaryKPIs;
  }> => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.department) query.append("department", params.department);
      if (params.bonusType) query.append("bonusType", params.bonusType);

      const res: any = await api.get(`payroll/bonuses?${query.toString()}`);
      if (res.data && Array.isArray(res.data?.items)) {
        return {
          items: res.data.items,
          total: res.data.total || res.data.items.length,
          kpis: res.data.kpis || bonusesApi.computeKPIs(res.data.items),
        };
      }
    } catch {
      // Local fallback
    }

    const filtered = bonusesApi.filterBonusesInMemory(localBonuses, params);
    return {
      items: filtered,
      total: filtered.length,
      kpis: bonusesApi.computeKPIs(localBonuses),
    };
  },

  // GET bonus by ID
  getBonusById: async (id: string): Promise<BonusAward> => {
    try {
      const res: any = await api.get(`payroll/bonuses/${id}`);
      if (res.data?.id) return res.data;
    } catch {
      // Fallback
    }
    const found = localBonuses.find((b) => b.id === id);
    if (!found) throw new Error(`Bonus award with ID '${id}' not found.`);
    return found;
  },

  // POST create new bonus award
  createBonus: async (payload: Partial<BonusAward>): Promise<BonusAward> => {
    const newId = `bns-${Date.now()}`;
    const bnsCode = `BNS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const amt = payload.bonusAmount || 50000;
    const tax = Math.round(amt * 0.30);
    const net = amt - tax;

    const newBonus: BonusAward = {
      id: newId,
      bonusCode: bnsCode,
      employeeId: payload.employeeId || "emp-101",
      employeeCode: payload.employeeCode || "EMP-101",
      employeeName: payload.employeeName || "Vikramaditya Roy",
      department: payload.department || "Engineering",
      designation: payload.designation || "Principal Architect",
      location: payload.location || "Global / Bangalore",
      employmentType: payload.employmentType || "FULL_TIME",
      bonusType: payload.bonusType || "Performance Bonus",
      bonusCycle: payload.bonusCycle || "Q2 2026 Performance Award",
      performanceRating: payload.performanceRating || 4.8,
      bonusAmount: amt,
      currency: payload.currency || "INR",
      taxImpact: tax,
      netPayout: net,
      approvalStatus: "PENDING_HR",
      paymentStatus: "UNPAID",
      approvalStage: "HR",
      approvalWorkflow: [
        { role: "HR Manager", name: "Rohan Varma", status: "PENDING" },
        { role: "Compensation Manager", name: "Sunita Menon", status: "PENDING" },
        { role: "Finance Manager", name: "Karan Johar", status: "PENDING" },
        { role: "CFO", name: "Ananya Roy", status: "PENDING" },
        { role: "CEO", name: "Vikram Malhotra", status: "PENDING" },
        { role: "Payroll Admin", name: "Rohan Varma", status: "PENDING" },
      ],
      calculationMode: payload.calculationMode || "FIXED",
      formulaExpression: payload.formulaExpression || `${amt}`,
      effectiveDate: payload.effectiveDate || new Date().toISOString().split("T")[0],
      createdOn: new Date().toISOString().split("T")[0],
      updatedOn: new Date().toISOString().split("T")[0],
      createdBy: "Admin User",
      aiSuggestions: [],
    };

    localBonuses.unshift(newBonus);
    bonusesApi.addAuditLog(newBonus.id, newBonus.bonusCode, "CREATE", `Created new ${newBonus.bonusType} award of ₹${newBonus.bonusAmount.toLocaleString("en-IN")}`);
    return newBonus;
  },

  // Bulk Allocate Bonuses
  bulkAllocateBonuses: async (allocation: { department: string; bonusType: BonusType; amount: number }): Promise<{ count: number }> => {
    let count = 0;
    try {
      const searchParams = new URLSearchParams();
      searchParams.set("limit", "100");
      if (allocation.department && allocation.department !== "all") {
        searchParams.set("department", allocation.department);
      }
      const response = await apiInstance.get(`/employees?${searchParams.toString()}`);
      const items = response.data?.data?.items || response.data?.items || [];

      for (const emp of items) {
        const fullName = `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim() || emp.name || emp.fullName || "Employee";
        await bonusesApi.createBonus({
          employeeId: String(emp.id ?? emp.employee_id ?? ""),
          employeeCode: String(emp.employee_id ?? emp.id ?? ""),
          employeeName: fullName,
          department: String(emp.department ?? allocation.department),
          designation: String(emp.designation ?? "Employee"),
          bonusType: allocation.bonusType,
          bonusAmount: allocation.amount,
        });
        count++;
      }
    } catch {
      // If fetching fails or no items, return count 0
    }

    return { count };
  },

  // POST approve / reject bonus
  approveBonus: async (id: string, role: string, comment?: string): Promise<BonusAward> => {
    const existing = await bonusesApi.getBonusById(id);
    const updatedWorkflow = existing.approvalWorkflow.map((step) => {
      if (step.role.toLowerCase().includes(role.toLowerCase())) {
        return {
          ...step,
          status: "APPROVED" as const,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          comment: comment || "Approved.",
        };
      }
      return step;
    });

    const allApproved = updatedWorkflow.every((s) => s.status === "APPROVED");

    const updated: BonusAward = {
      ...existing,
      approvalWorkflow: updatedWorkflow,
      approvalStatus: allApproved ? "APPROVED" : "PENDING_COMP",
      approvalStage: allApproved ? "COMPLETED" : existing.approvalStage,
      updatedOn: new Date().toISOString().split("T")[0],
    };

    const idx = localBonuses.findIndex((b) => b.id === id);
    if (idx !== -1) localBonuses[idx] = updated;

    bonusesApi.addAuditLog(id, existing.bonusCode, "APPROVE", `Approved bonus award for role ${role}`);
    return updated;
  },

  // POST reject bonus
  rejectBonus: async (id: string, role: string, reason: string): Promise<BonusAward> => {
    const existing = await bonusesApi.getBonusById(id);
    const updatedWorkflow = existing.approvalWorkflow.map((step) => {
      if (step.role.toLowerCase().includes(role.toLowerCase())) {
        return {
          ...step,
          status: "REJECTED" as const,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          comment: reason,
        };
      }
      return step;
    });

    const updated: BonusAward = {
      ...existing,
      approvalWorkflow: updatedWorkflow,
      approvalStatus: "REJECTED",
      updatedOn: new Date().toISOString().split("T")[0],
    };

    const idx = localBonuses.findIndex((b) => b.id === id);
    if (idx !== -1) localBonuses[idx] = updated;

    bonusesApi.addAuditLog(id, existing.bonusCode, "REJECT", `Rejected bonus award: ${reason}`);
    return updated;
  },

  // Add Payroll Entry
  addPayrollEntry: async (bonusIds: string | string[], payrollCycle: string): Promise<{ success: boolean }> => {
    const ids = Array.isArray(bonusIds) ? bonusIds : [bonusIds];
    for (const id of ids) {
      const idx = localBonuses.findIndex((b) => b.id === id);
      if (idx !== -1) {
        localBonuses[idx] = {
          ...localBonuses[idx],
          paymentStatus: "SCHEDULED_PAYROLL",
          payrollCycle,
          payrollEntryId: `PY-BNS-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        bonusesApi.addAuditLog(id, localBonuses[idx].bonusCode, "ADD_PAYROLL_ENTRY", `Added bonus award to payroll cycle ${payrollCycle}`);
      }
    }
    return { success: true };
  },

  // GET Audit Logs
  getAuditLogs: async (): Promise<BonusAuditLog[]> => {
    return localAuditLogs;
  },

  // GET AI Insights
  getAIInsights: async (): Promise<BonusAIInsight[]> => {
    return INITIAL_AI_INSIGHTS;
  },

  // Filter in memory
  filterBonusesInMemory: (items: BonusAward[], params: Partial<BonusesFilters>): BonusAward[] => {
    return items.filter((item) => {
      if (params.search) {
        const q = params.search.toLowerCase();
        const match =
          item.bonusCode.toLowerCase().includes(q) ||
          item.employeeName.toLowerCase().includes(q) ||
          item.employeeCode.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.bonusType.toLowerCase().includes(q) ||
          item.bonusCycle.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (params.department && params.department !== "all" && params.department !== "ALL") {
        if (item.department.toLowerCase() !== params.department.toLowerCase()) return false;
      }
      if (params.bonusType && params.bonusType !== "all" && params.bonusType !== "ALL") {
        if (item.bonusType !== params.bonusType) return false;
      }
      if (params.approvalStatus && params.approvalStatus !== "all" && params.approvalStatus !== "ALL") {
        if (item.approvalStatus !== params.approvalStatus) return false;
      }
      return true;
    });
  },

  // Compute Live KPIs
  computeKPIs: (items: BonusAward[]): BonusesSummaryKPIs => {
    const totalBonusBudget = 2500000;
    const allocatedBonus = items.reduce((acc, b) => acc + b.bonusAmount, 0);
    const pendingApproval = items.filter((b) => b.approvalStatus.startsWith("PENDING")).length;
    const approvedBonuses = items.filter((b) => b.approvalStatus === "APPROVED").length;
    const paidBonuses = items.filter((b) => b.paymentStatus === "PAID").length;
    const outstandingBonus = allocatedBonus - items.filter((b) => b.paymentStatus === "PAID").reduce((acc, b) => acc + b.bonusAmount, 0);
    const averageBonus = items.length > 0 ? Math.round(allocatedBonus / items.length) : 0;
    const budgetRemaining = Math.max(0, totalBonusBudget - allocatedBonus);

    return {
      totalBonusBudget,
      allocatedBonus,
      pendingApproval,
      approvedBonuses,
      paidBonuses,
      outstandingBonus,
      averageBonus,
      topRewardedDepartment: "Engineering",
      topRewardedEmployee: "Priya Nair",
      budgetRemaining,
    };
  },

  // Add Internal Audit Log
  addAuditLog: (bonusId: string, bonusCode: string, action: BonusAuditLog["action"], details: string) => {
    localAuditLogs.unshift({
      id: `log-${Date.now()}`,
      bonusId,
      bonusCode,
      action,
      actorName: "Admin User",
      actorRole: "Compensation Director",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      details,
      ipAddress: "127.0.0.1",
    });
  },

  createBonusRecord: (payload: Partial<BonusAward>) => bonusesApi.createBonus(payload),
  addPayrollEntries: (ids: string | string[], payrollCycle: string) =>
    bonusesApi.addPayrollEntry(ids, payrollCycle),
};
