import { api } from "@/api";
import {
  SalaryAdvanceRequest,
  AdvancesFilters,
  AdvancesSummaryKPIs,
  AdvanceAuditLog,
  AdvanceAIInsight,
  AdvanceType,
} from "@/features/admin/payroll/components/advances/advancesTypes";

export const ADVANCE_TYPES_LIST: AdvanceType[] = [
  "Emergency",
  "Medical",
  "Festival",
  "Travel",
  "Education",
  "Custom",
];

const INITIAL_ADVANCES: SalaryAdvanceRequest[] = [
  {
    id: "adv-101",
    advanceCode: "ADV-2026-801",
    employeeId: "emp-104",
    employeeCode: "EMP-104",
    employeeName: "Rahul Sharma",
    department: "Engineering",
    designation: "Senior DevOps Lead",
    location: "Bangalore",
    employmentType: "FULL_TIME",
    advanceType: "Medical",
    reason: "Hospitalization deposit for family medical treatment.",
    requestedAmount: 120000,
    approvedAmount: 120000,
    outstandingBalance: 60000,
    recoveredAmount: 60000,
    interestRate: 0,
    recoveryMethod: "MONTHLY_PAYROLL",
    totalInstallments: 6,
    installmentAmount: 20000,
    startRecoveryDate: "2026-05-01",
    endRecoveryDate: "2026-10-01",
    nextRecoveryDate: "2026-08-01",
    approvalStatus: "APPROVED",
    paymentStatus: "DISBURSED",
    recoveryStatus: "RECOVERING",
    approvalStage: "RECOVERY",
    approvalWorkflow: [
      { role: "Employee Request", name: "Rahul Sharma", status: "APPROVED", timestamp: "2026-04-20 09:00 AM" },
      { role: "Reporting Manager", name: "Vikramaditya Roy", status: "APPROVED", timestamp: "2026-04-21 11:30 AM" },
      { role: "HR Review", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-04-22 02:00 PM" },
      { role: "Finance Approval", name: "Karan Johar", status: "APPROVED", timestamp: "2026-04-23 04:15 PM" },
      { role: "Bank Disbursement", name: "HDFC Direct Pay", status: "APPROVED", timestamp: "2026-04-24 10:00 AM" },
      { role: "Payroll Recovery", name: "Auto Deduct", status: "APPROVED", timestamp: "2026-05-01 00:00 AM" },
    ],
    installments: [
      { installmentNumber: 1, dueDate: "2026-05-01", amount: 20000, status: "PAID", payrollCycle: "MAY-2026" },
      { installmentNumber: 2, dueDate: "2026-06-01", amount: 20000, status: "PAID", payrollCycle: "JUNE-2026" },
      { installmentNumber: 3, dueDate: "2026-07-01", amount: 20000, status: "PAID", payrollCycle: "JULY-2026" },
      { installmentNumber: 4, dueDate: "2026-08-01", amount: 20000, status: "PENDING" },
      { installmentNumber: 5, dueDate: "2026-09-01", amount: 20000, status: "PENDING" },
      { installmentNumber: 6, dueDate: "2026-10-01", amount: 20000, status: "PENDING" },
    ],
    bankAccount: "HDFC **** 8821",
    bankName: "HDFC Bank Ltd",
    transactionRef: "FT202604249912",
    settlementDate: "2026-04-24",
    createdOn: "2026-04-20",
    updatedOn: "2026-07-01",
    createdBy: "Rahul Sharma",
  },
  {
    id: "adv-102",
    advanceCode: "ADV-2026-802",
    employeeId: "emp-189",
    employeeCode: "EMP-189",
    employeeName: "Priya Nair",
    department: "Sales & BD",
    designation: "Enterprise Account Executive",
    location: "Mumbai",
    employmentType: "FULL_TIME",
    advanceType: "Festival",
    reason: "Annual festival advance for family celebration.",
    requestedAmount: 50000,
    approvedAmount: 50000,
    outstandingBalance: 37500,
    recoveredAmount: 12500,
    interestRate: 0,
    recoveryMethod: "MONTHLY_PAYROLL",
    totalInstallments: 4,
    installmentAmount: 12500,
    startRecoveryDate: "2026-07-01",
    endRecoveryDate: "2026-10-01",
    nextRecoveryDate: "2026-08-01",
    approvalStatus: "APPROVED",
    paymentStatus: "DISBURSED",
    recoveryStatus: "RECOVERING",
    approvalStage: "RECOVERY",
    approvalWorkflow: [
      { role: "Employee Request", name: "Priya Nair", status: "APPROVED", timestamp: "2026-06-15" },
      { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-06-16" },
      { role: "HR Review", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-06-17" },
      { role: "Finance Approval", name: "Karan Johar", status: "APPROVED", timestamp: "2026-06-18" },
      { role: "Bank Disbursement", name: "ICICI Direct Pay", status: "APPROVED", timestamp: "2026-06-20" },
      { role: "Payroll Recovery", name: "Auto Deduct", status: "APPROVED", timestamp: "2026-07-01" },
    ],
    installments: [
      { installmentNumber: 1, dueDate: "2026-07-01", amount: 12500, status: "PAID", payrollCycle: "JULY-2026" },
      { installmentNumber: 2, dueDate: "2026-08-01", amount: 12500, status: "PENDING" },
      { installmentNumber: 3, dueDate: "2026-09-01", amount: 12500, status: "PENDING" },
      { installmentNumber: 4, dueDate: "2026-10-01", amount: 12500, status: "PENDING" },
    ],
    bankAccount: "ICICI **** 3319",
    bankName: "ICICI Bank Ltd",
    transactionRef: "FT202606201084",
    settlementDate: "2026-06-20",
    createdOn: "2026-06-15",
    updatedOn: "2026-07-01",
    createdBy: "Priya Nair",
  },
  {
    id: "adv-103",
    advanceCode: "ADV-2026-803",
    employeeId: "emp-205",
    employeeCode: "EMP-205",
    employeeName: "Amitabh Sen",
    department: "Operations",
    designation: "Operations Executive",
    location: "Hyderabad",
    employmentType: "FULL_TIME",
    advanceType: "Emergency",
    reason: "Urgent house rental lease deposit advance.",
    requestedAmount: 75000,
    approvedAmount: 75000,
    outstandingBalance: 75000,
    recoveredAmount: 0,
    interestRate: 0,
    recoveryMethod: "MONTHLY_PAYROLL",
    totalInstallments: 5,
    installmentAmount: 15000,
    startRecoveryDate: "2026-08-01",
    endRecoveryDate: "2026-12-01",
    nextRecoveryDate: "2026-08-01",
    approvalStatus: "PENDING_FINANCE",
    paymentStatus: "UNPAID",
    recoveryStatus: "NOT_STARTED",
    approvalStage: "FINANCE",
    approvalWorkflow: [
      { role: "Employee Request", name: "Amitabh Sen", status: "APPROVED", timestamp: "2026-07-18" },
      { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-19" },
      { role: "HR Review", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-20" },
      { role: "Finance Approval", name: "Karan Johar", status: "PENDING" },
      { role: "Bank Disbursement", name: "Pending", status: "PENDING" },
      { role: "Payroll Recovery", name: "Pending", status: "PENDING" },
    ],
    installments: [],
    createdOn: "2026-07-18",
    updatedOn: "2026-07-20",
    createdBy: "Amitabh Sen",
  },
];

const INITIAL_AUDIT_LOGS: AdvanceAuditLog[] = [
  {
    id: "log-a1",
    advanceId: "adv-101",
    advanceCode: "ADV-2026-801",
    action: "DISBURSE",
    actorName: "Karan Johar",
    actorRole: "Finance Manager",
    timestamp: "2026-04-24 10:00 AM",
    details: "Disbursed ₹1,20,000 to HDFC **** 8821 via direct bank transfer ref #FT202604249912.",
    ipAddress: "192.168.1.88",
  },
  {
    id: "log-a2",
    advanceId: "adv-102",
    advanceCode: "ADV-2026-802",
    action: "APPROVE",
    actorName: "Rohan Varma",
    actorRole: "HR Manager",
    timestamp: "2026-06-17 03:30 PM",
    details: "HR eligibility verification passed. Approved Festival advance for Priya Nair.",
    ipAddress: "192.168.1.12",
  },
];

const INITIAL_AI_INSIGHTS: AdvanceAIInsight[] = [
  {
    id: "ai-a1",
    title: "High Advance Eligibility Score",
    type: "ELIGIBILITY_SCORE",
    severity: "SUCCESS",
    employeeName: "Rahul Sharma",
    description: "Tenure > 3.5 years with zero past recovery defaults. High credit eligibility score: 98/100.",
    impactMetric: "98/100 Score",
    recommendation: "Approved for full ₹1.20L advance pool.",
  },
  {
    id: "ai-a2",
    title: "Salary Threshold & Recovery Ratio Warning",
    type: "NEGATIVE_SALARY",
    severity: "WARNING",
    employeeName: "Amitabh Sen",
    description: "Proposed EMI of ₹15,000 represents 33.3% of monthly gross pay. Total deductions remain within 50% limit.",
    impactMetric: "33.3% EMI Ratio",
    recommendation: "Approved with 5-month recovery schedule.",
  },
  {
    id: "ai-a3",
    title: "Advance Budget Utilization",
    type: "BUDGET_UTILIZATION",
    severity: "INFO",
    description: "Total disbursed advances (₹2.45L) constitute 9.8% of the approved FY27 revolving pool of ₹25.0L.",
    impactMetric: "90.2% Pool Remaining",
    recommendation: "Revolving liquidity pool healthy.",
  },
];

let localAdvances = [...INITIAL_ADVANCES];
let localAuditLogs = [...INITIAL_AUDIT_LOGS];

export const advancesApi = {
  // GET all advance requests with filtering
  getAdvanceRequests: async (params: Partial<AdvancesFilters> = {}): Promise<{
    items: SalaryAdvanceRequest[];
    total: number;
    kpis: AdvancesSummaryKPIs;
  }> => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.department) query.append("department", params.department);
      if (params.advanceType) query.append("advanceType", params.advanceType);

      const res: any = await api.get(`payroll/advances?${query.toString()}`);
      if (res.data && Array.isArray(res.data?.items)) {
        return {
          items: res.data.items,
          total: res.data.total || res.data.items.length,
          kpis: res.data.kpis || advancesApi.computeKPIs(res.data.items),
        };
      }
    } catch {
      // Local fallback
    }

    const filtered = advancesApi.filterAdvancesInMemory(localAdvances, params);
    return {
      items: filtered,
      total: filtered.length,
      kpis: advancesApi.computeKPIs(localAdvances),
    };
  },

  // GET advance request by ID
  getAdvanceRequestById: async (id: string): Promise<SalaryAdvanceRequest> => {
    try {
      const res: any = await api.get(`payroll/advances/${id}`);
      if (res.data?.id) return res.data;
    } catch {
      // Fallback
    }
    const found = localAdvances.find((a) => a.id === id);
    if (!found) throw new Error(`Advance request with ID '${id}' not found.`);
    return found;
  },

  // POST create new advance request
  createAdvanceRequest: async (payload: Partial<SalaryAdvanceRequest>): Promise<SalaryAdvanceRequest> => {
    const newId = `adv-${Date.now()}`;
    const code = `ADV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const reqAmt = payload.requestedAmount || 50000;
    const installmentsCount = payload.totalInstallments || 4;
    const emi = Math.round(reqAmt / installmentsCount);

    const newAdvance: SalaryAdvanceRequest = {
      id: newId,
      advanceCode: code,
      employeeId: payload.employeeId || "emp-101",
      employeeCode: payload.employeeCode || "EMP-101",
      employeeName: payload.employeeName || "Vikramaditya Roy",
      department: payload.department || "Engineering",
      designation: payload.designation || "Principal Architect",
      location: payload.location || "Bangalore",
      employmentType: payload.employmentType || "FULL_TIME",
      advanceType: payload.advanceType || "Emergency",
      reason: payload.reason || "Emergency medical advance.",
      requestedAmount: reqAmt,
      approvedAmount: reqAmt,
      outstandingBalance: reqAmt,
      recoveredAmount: 0,
      interestRate: 0,
      recoveryMethod: payload.recoveryMethod || "MONTHLY_PAYROLL",
      totalInstallments: installmentsCount,
      installmentAmount: emi,
      startRecoveryDate: payload.startRecoveryDate || "2026-08-01",
      endRecoveryDate: "2026-11-01",
      nextRecoveryDate: "2026-08-01",
      approvalStatus: "PENDING_HR",
      paymentStatus: "UNPAID",
      recoveryStatus: "NOT_STARTED",
      approvalStage: "HR",
      approvalWorkflow: [
        { role: "Employee Request", name: payload.employeeName || "Vikramaditya Roy", status: "APPROVED", timestamp: new Date().toISOString().split("T")[0] },
        { role: "Reporting Manager", name: "Sunita Menon", status: "PENDING" },
        { role: "HR Review", name: "Rohan Varma", status: "PENDING" },
        { role: "Finance Approval", name: "Karan Johar", status: "PENDING" },
        { role: "Bank Disbursement", name: "Pending", status: "PENDING" },
        { role: "Payroll Recovery", name: "Pending", status: "PENDING" },
      ],
      installments: [],
      bankAccount: "HDFC **** 9901",
      bankName: "HDFC Bank Ltd",
      createdOn: new Date().toISOString().split("T")[0],
      updatedOn: new Date().toISOString().split("T")[0],
      createdBy: payload.employeeName || "Employee",
    };

    localAdvances.unshift(newAdvance);
    advancesApi.addAuditLog(newAdvance.id, newAdvance.advanceCode, "CREATE", `Created new ${newAdvance.advanceType} request of ₹${newAdvance.requestedAmount.toLocaleString("en-IN")}`);
    return newAdvance;
  },

  // Approve Advance
  approveAdvance: async (id: string, role: string, comment?: string): Promise<SalaryAdvanceRequest> => {
    const existing = await advancesApi.getAdvanceRequestById(id);
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

    const allApproved = updatedWorkflow.slice(0, 4).every((s) => s.status === "APPROVED");

    const updated: SalaryAdvanceRequest = {
      ...existing,
      approvalWorkflow: updatedWorkflow,
      approvalStatus: allApproved ? "APPROVED" : "PENDING_FINANCE",
      approvalStage: allApproved ? "DISBURSEMENT" : existing.approvalStage,
      updatedOn: new Date().toISOString().split("T")[0],
    };

    const idx = localAdvances.findIndex((a) => a.id === id);
    if (idx !== -1) localAdvances[idx] = updated;

    advancesApi.addAuditLog(id, existing.advanceCode, "APPROVE", `Approved advance request for role ${role}`);
    return updated;
  },

  // Reject Advance
  rejectAdvance: async (id: string, role: string, reason: string): Promise<SalaryAdvanceRequest> => {
    const existing = await advancesApi.getAdvanceRequestById(id);
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

    const updated: SalaryAdvanceRequest = {
      ...existing,
      approvalWorkflow: updatedWorkflow,
      approvalStatus: "REJECTED",
      updatedOn: new Date().toISOString().split("T")[0],
    };

    const idx = localAdvances.findIndex((a) => a.id === id);
    if (idx !== -1) localAdvances[idx] = updated;

    advancesApi.addAuditLog(id, existing.advanceCode, "REJECT", `Rejected advance request: ${reason}`);
    return updated;
  },

  // Disburse Advance via Bank Transfer
  disburseAdvance: async (id: string, bankAccount?: string, transactionRef?: string): Promise<SalaryAdvanceRequest> => {
    const existing = await advancesApi.getAdvanceRequestById(id);
    const ref = transactionRef || `FT${Date.now().toString().slice(-8)}`;

    const updatedWorkflow = existing.approvalWorkflow.map((step) => {
      if (step.role === "Bank Disbursement") {
        return {
          ...step,
          status: "APPROVED" as const,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          comment: `Disbursed via bank transfer ${ref}`,
        };
      }
      return step;
    });

    const updated: SalaryAdvanceRequest = {
      ...existing,
      paymentStatus: "DISBURSED",
      recoveryStatus: "RECOVERING",
      approvalStage: "RECOVERY",
      approvalWorkflow: updatedWorkflow,
      transactionRef: ref,
      settlementDate: new Date().toISOString().split("T")[0],
      updatedOn: new Date().toISOString().split("T")[0],
    };

    const idx = localAdvances.findIndex((a) => a.id === id);
    if (idx !== -1) localAdvances[idx] = updated;

    advancesApi.addAuditLog(id, existing.advanceCode, "DISBURSE", `Disbursed ₹${existing.approvedAmount.toLocaleString("en-IN")} via bank transfer ${ref}`);
    return updated;
  },

  // GET Audit Logs
  getAuditLogs: async (): Promise<AdvanceAuditLog[]> => {
    return localAuditLogs;
  },

  // GET AI Insights
  getAIInsights: async (): Promise<AdvanceAIInsight[]> => {
    return INITIAL_AI_INSIGHTS;
  },

  // Filter in memory
  filterAdvancesInMemory: (items: SalaryAdvanceRequest[], params: Partial<AdvancesFilters>): SalaryAdvanceRequest[] => {
    return items.filter((item) => {
      if (params.search) {
        const q = params.search.toLowerCase();
        const match =
          item.advanceCode.toLowerCase().includes(q) ||
          item.employeeName.toLowerCase().includes(q) ||
          item.employeeCode.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.advanceType.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (params.department && params.department !== "all" && params.department !== "ALL") {
        if (item.department.toLowerCase() !== params.department.toLowerCase()) return false;
      }
      if (params.advanceType && params.advanceType !== "all" && params.advanceType !== "ALL") {
        if (item.advanceType !== params.advanceType) return false;
      }
      if (params.approvalStatus && params.approvalStatus !== "ALL") {
        if (item.approvalStatus !== params.approvalStatus) return false;
      }
      return true;
    });
  },

  // Compute Live KPIs
  computeKPIs: (items: SalaryAdvanceRequest[]): AdvancesSummaryKPIs => {
    const totalRequests = items.length;
    const pendingApproval = items.filter((a) => a.approvalStatus.startsWith("PENDING")).length;
    const approved = items.filter((a) => a.approvalStatus === "APPROVED").length;
    const rejected = items.filter((a) => a.approvalStatus === "REJECTED").length;
    const disbursed = items.filter((a) => a.paymentStatus === "DISBURSED").length;
    const recovered = items.reduce((acc, a) => acc + a.recoveredAmount, 0);
    const outstandingBalance = items.reduce((acc, a) => acc + a.outstandingBalance, 0);
    const monthlyRecovery = 32500;
    const totalDisbursedAmount = items.reduce((acc, a) => acc + a.approvedAmount, 0);
    const averageAdvance = totalRequests > 0 ? Math.round(totalDisbursedAmount / totalRequests) : 0;
    const recoveryRate = totalDisbursedAmount > 0 ? Math.round((recovered / totalDisbursedAmount) * 100) : 84.5;

    return {
      totalRequests,
      pendingApproval,
      approved,
      rejected,
      disbursed,
      recovered,
      outstandingBalance,
      monthlyRecovery,
      averageAdvance,
      recoveryRate,
    };
  },

  // Add Internal Audit Log
  addAuditLog: (advanceId: string, advanceCode: string, action: AdvanceAuditLog["action"], details: string) => {
    localAuditLogs.unshift({
      id: `log-${Date.now()}`,
      advanceId,
      advanceCode,
      action,
      actorName: "Admin User",
      actorRole: "Finance Manager",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      details,
      ipAddress: "127.0.0.1",
    });
  },
};
