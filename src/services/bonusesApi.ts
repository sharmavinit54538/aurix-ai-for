import { api } from "@/api";
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

const INITIAL_BONUSES: BonusAward[] = [
  {
    id: "bns-101",
    bonusCode: "BNS-2026-901",
    employeeId: "emp-101",
    employeeCode: "EMP-101",
    employeeName: "Vikramaditya Roy",
    department: "Engineering",
    designation: "Principal Architect",
    location: "Global / Bangalore",
    employmentType: "FULL_TIME",
    bonusType: "Performance Bonus",
    bonusCycle: "Q2 2026 High Performer Award",
    performanceRating: 4.9,
    bonusAmount: 180000,
    currency: "INR",
    taxImpact: 54000,
    netPayout: 126000,
    payrollCycle: "JULY-2026",
    payrollEntryId: "PY-BNS-7701",
    approvalStatus: "APPROVED",
    paymentStatus: "SCHEDULED_PAYROLL",
    approvalStage: "COMPLETED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-10 10:00 AM", comment: "Performance rating 4.9/5.0 verified with Q2 goals." },
      { role: "Compensation Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-11 11:30 AM", comment: "Band 4 performance multiplier applied." },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-12 02:15 PM", comment: "Bonus budget available in FY27 allocation." },
      { role: "CFO", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-07-13 04:00 PM", comment: "Approved." },
      { role: "CEO", name: "Vikram Malhotra", status: "APPROVED", timestamp: "2026-07-14 09:30 AM", comment: "Approved for executive payout." },
      { role: "Payroll Admin", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-15 11:00 AM", comment: "Added to July 2026 salary run." },
    ],
    calculationMode: "PERCENTAGE_BASIC",
    formulaExpression: "BASIC * 1.20",
    effectiveDate: "2026-07-01",
    createdOn: "2026-07-10",
    updatedOn: "2026-07-15",
    createdBy: "Sunita Menon",
    aiSuggestions: ["Exceeds average engineering bonus by 22% due to 4.9 rating."],
  },
  {
    id: "bns-102",
    bonusCode: "BNS-2026-902",
    employeeId: "emp-104",
    employeeCode: "EMP-104",
    employeeName: "Rahul Sharma",
    department: "Engineering",
    designation: "Senior DevOps Lead",
    location: "Bangalore",
    employmentType: "FULL_TIME",
    bonusType: "Project Bonus",
    bonusCycle: "Cloud Migration Milestone Award",
    performanceRating: 4.7,
    bonusAmount: 90000,
    currency: "INR",
    taxImpact: 27000,
    netPayout: 63000,
    payrollCycle: "JULY-2026",
    payrollEntryId: "PY-BNS-7702",
    approvalStatus: "APPROVED",
    paymentStatus: "PAID",
    approvalStage: "COMPLETED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-01" },
      { role: "Compensation Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-02" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-03" },
      { role: "CFO", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-07-04" },
      { role: "CEO", name: "Vikram Malhotra", status: "APPROVED", timestamp: "2026-07-04" },
      { role: "Payroll Admin", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-05" },
    ],
    calculationMode: "FIXED",
    formulaExpression: "90000",
    effectiveDate: "2026-07-01",
    createdOn: "2026-07-01",
    updatedOn: "2026-07-05",
    createdBy: "Rohan Varma",
    aiSuggestions: [],
  },
  {
    id: "bns-103",
    bonusCode: "BNS-2026-903",
    employeeId: "emp-189",
    employeeCode: "EMP-189",
    employeeName: "Priya Nair",
    department: "Sales & BD",
    designation: "Enterprise Account Executive",
    location: "Mumbai",
    employmentType: "FULL_TIME",
    bonusType: "Sales Incentive",
    bonusCycle: "Q2 Enterprise Target Achievement",
    performanceRating: 4.9,
    bonusAmount: 240000,
    currency: "INR",
    taxImpact: 72000,
    netPayout: 168000,
    approvalStatus: "PENDING_CFO",
    paymentStatus: "UNPAID",
    approvalStage: "CFO",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-16 10:00 AM" },
      { role: "Compensation Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-17 11:30 AM" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-18 02:00 PM" },
      { role: "CFO", name: "Ananya Roy", status: "PENDING" },
      { role: "CEO", name: "Vikram Malhotra", status: "PENDING" },
      { role: "Payroll Admin", name: "Rohan Varma", status: "PENDING" },
    ],
    calculationMode: "PERCENTAGE_CTC",
    formulaExpression: "CTC * 0.10",
    effectiveDate: "2026-07-15",
    createdOn: "2026-07-16",
    updatedOn: "2026-07-18",
    createdBy: "Sunita Menon",
    aiSuggestions: ["140% target achievement recorded in Sales CRM."],
  },
  {
    id: "bns-104",
    bonusCode: "BNS-2026-904",
    employeeId: "emp-205",
    employeeCode: "EMP-205",
    employeeName: "Amitabh Sen",
    department: "Operations",
    designation: "Operations Executive",
    location: "Hyderabad",
    employmentType: "FULL_TIME",
    bonusType: "Spot Award",
    bonusCycle: "Spot Recognition Award",
    performanceRating: 4.4,
    bonusAmount: 25000,
    currency: "INR",
    taxImpact: 7500,
    netPayout: 17500,
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
    calculationMode: "FIXED",
    formulaExpression: "25000",
    effectiveDate: "2026-07-20",
    createdOn: "2026-07-20",
    updatedOn: "2026-07-20",
    createdBy: "Sunita Menon",
    aiSuggestions: [],
  },
];

const INITIAL_AUDIT_LOGS: BonusAuditLog[] = [
  {
    id: "log-b1",
    bonusId: "bns-101",
    bonusCode: "BNS-2026-901",
    action: "ADD_PAYROLL_ENTRY",
    actorName: "Rohan Varma",
    actorRole: "Payroll Admin",
    timestamp: "2026-07-15 11:00 AM",
    details: "Approved performance bonus of ₹1,80,000 for Vikramaditya Roy and queued into July 2026 salary processing.",
    ipAddress: "192.168.1.12",
  },
  {
    id: "log-b2",
    bonusId: "bns-103",
    bonusCode: "BNS-2026-903",
    action: "APPROVE",
    actorName: "Karan Johar",
    actorRole: "Finance Manager",
    timestamp: "2026-07-18 02:00 PM",
    details: "Finance sign-off recorded for Q2 Sales Incentive payout.",
    ipAddress: "192.168.1.88",
  },
];

const INITIAL_AI_INSIGHTS: BonusAIInsight[] = [
  {
    id: "ai-b1",
    title: "High Performer Compensation Recommendation",
    type: "RECOMMENDATION",
    severity: "SUCCESS",
    employeeName: "Vikramaditya Roy",
    description: "Performance score 4.9/5.0 places employee in top 2% of Engineering cohort. Suggested bonus multiplier: 1.2x Basic.",
    impactMetric: "Top 2% Performance",
    recommendation: "Approved Q2 Performance Bonus of ₹1.80L.",
  },
  {
    id: "ai-b2",
    title: "Retention Risk & Pay Equity Alert",
    type: "RETENTION_RISK",
    severity: "WARNING",
    employeeName: "Priya Nair",
    description: "Sales Incentive ratio for Grade L3 is 18% below industry peer benchmarks in tech enterprise sales.",
    impactMetric: "High Retention Risk",
    recommendation: "Consider spot retention bonus in Q3 cycle.",
  },
  {
    id: "ai-b3",
    title: "FY27 Bonus Budget Optimization",
    type: "BUDGET_OPTIMIZATION",
    severity: "INFO",
    description: "Total allocated bonus (₹5.35L) is within 44% of the Q2 approved budget ceiling of ₹12.0L.",
    impactMetric: "56% Budget Remaining",
    recommendation: "Reallocate remaining pool for Spot Awards.",
  },
];

let localBonuses = [...INITIAL_BONUSES];
let localAuditLogs = [...INITIAL_AUDIT_LOGS];

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
    const mockEmps = [
      { id: "emp-301", code: "EMP-301", name: "Ananya Deshmukh", dept: allocation.department, role: "Senior Developer" },
      { id: "emp-302", code: "EMP-302", name: "Karthik Raja", dept: allocation.department, role: "Lead Engineer" },
      { id: "emp-303", code: "EMP-303", name: "Sanya Gupta", dept: allocation.department, role: "UI Designer" },
    ];

    for (const emp of mockEmps) {
      await bonusesApi.createBonus({
        employeeId: emp.id,
        employeeCode: emp.code,
        employeeName: emp.name,
        department: emp.dept,
        designation: emp.role,
        bonusType: allocation.bonusType,
        bonusAmount: allocation.amount,
      });
      count++;
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
  addPayrollEntry: async (bonusIds: string[], payrollCycle: string): Promise<{ success: boolean }> => {
    for (const id of bonusIds) {
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
};
