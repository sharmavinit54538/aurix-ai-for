import { api } from "@/api";
import {
  ReimbursementClaim,
  ReimbursementsFilters,
  ReimbursementsSummaryKPIs,
  ReimbursementAuditLog,
  ReimbursementAIInsight,
  ExpenseCategory,
} from "@/features/admin/payroll/components/reimbursements/reimbursementsTypes";

export const EXPENSE_CATEGORIES_LIST: ExpenseCategory[] = [
  "Travel",
  "Food",
  "Accommodation",
  "Fuel",
  "Internet",
  "Phone",
  "Medical",
  "Training",
  "Office Supplies",
  "Client Meeting",
  "Entertainment",
  "Relocation",
  "Other",
];

const INITIAL_CLAIMS: ReimbursementClaim[] = [
  {
    id: "clm-101",
    claimNumber: "CLM-2026-0841",
    employeeId: "emp-101",
    employeeCode: "EMP-101",
    employeeName: "Vikramaditya Roy",
    department: "Engineering",
    designation: "Principal Architect",
    expenseCategory: "Travel",
    expenseDate: "2026-07-10",
    submittedDate: "2026-07-12",
    claimAmount: 48500,
    approvedAmount: 48500,
    currency: "INR",
    taxAmount: 7398,
    businessPurpose: "Q3 Enterprise Tech Summit & Client Architecture Review in Bangalore HQ.",
    costCenter: "CC-ENG-TECH",
    project: "PROJ-AURIX-CORE",
    location: "Bangalore",
    paymentStatus: "SCHEDULED_PAYROLL",
    approvalStatus: "PAYROLL_APPROVED",
    approvalStage: "COMPLETED",
    approvalWorkflow: [
      { role: "Employee", name: "Vikramaditya Roy", status: "APPROVED", timestamp: "2026-07-12 09:15 AM", comment: "Submitted flight & hotel receipts." },
      { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-13 11:30 AM", comment: "Travel pre-approved under Q3 client budget." },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-14 02:45 PM", comment: "GST invoices verified and tax breakdown checked." },
      { role: "Payroll Admin", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-15 04:00 PM", comment: "Added to July 2026 salary run." },
    ],
    receipts: [
      {
        id: "rec-1",
        fileName: "IndiGo_Flight_Ticket_BLR.pdf",
        fileUrl: "#",
        fileType: "PDF",
        fileSize: "1.4 MB",
        uploadedAt: "2026-07-12",
        ocrVerified: true,
        extractedAmount: 24500,
        extractedVendor: "IndiGo Airlines",
      },
      {
        id: "rec-2",
        fileName: "Taj_Hotel_Invoice_Tax.pdf",
        fileUrl: "#",
        fileType: "PDF",
        fileSize: "2.8 MB",
        uploadedAt: "2026-07-12",
        ocrVerified: true,
        extractedAmount: 24000,
        extractedVendor: "Taj Hotels Ltd",
      },
    ],
    payrollCycle: "JULY-2026",
    payrollEntryId: "PY-ENTRY-9901",
    createdOn: "2026-07-12",
    updatedOn: "2026-07-15",
    policyWarnings: [],
    aiRiskScore: "LOW",
  },
  {
    id: "clm-102",
    claimNumber: "CLM-2026-0842",
    employeeId: "emp-104",
    employeeCode: "EMP-104",
    employeeName: "Rahul Sharma",
    department: "Engineering",
    designation: "Senior DevOps Lead",
    expenseCategory: "Internet",
    expenseDate: "2026-07-01",
    submittedDate: "2026-07-02",
    claimAmount: 2999,
    approvedAmount: 2999,
    currency: "INR",
    taxAmount: 457,
    businessPurpose: "Monthly High-Speed Gigabit Fiber Reimbursement for Remote Operations Call.",
    costCenter: "CC-DEVOPS",
    project: "PROJ-INFRA-CLOUD",
    location: "Bangalore",
    paymentStatus: "PAID",
    approvalStatus: "PAYROLL_APPROVED",
    approvalStage: "COMPLETED",
    approvalWorkflow: [
      { role: "Employee", name: "Rahul Sharma", status: "APPROVED", timestamp: "2026-07-02" },
      { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-03" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-04" },
      { role: "Payment Disbursed", name: "System Disbursal", status: "APPROVED", timestamp: "2026-07-05" },
    ],
    receipts: [
      {
        id: "rec-3",
        fileName: "Airtel_Fiber_Bill_July.pdf",
        fileUrl: "#",
        fileType: "PDF",
        fileSize: "420 KB",
        uploadedAt: "2026-07-02",
        ocrVerified: true,
        extractedAmount: 2999,
        extractedVendor: "Bharti Airtel Ltd",
      },
    ],
    createdOn: "2026-07-02",
    updatedOn: "2026-07-05",
    policyWarnings: [],
    aiRiskScore: "LOW",
  },
  {
    id: "clm-103",
    claimNumber: "CLM-2026-0843",
    employeeId: "emp-189",
    employeeCode: "EMP-189",
    employeeName: "Priya Nair",
    department: "Sales & BD",
    designation: "Enterprise Account Executive",
    expenseCategory: "Client Meeting",
    expenseDate: "2026-07-14",
    submittedDate: "2026-07-16",
    claimAmount: 18400,
    approvedAmount: 0,
    currency: "INR",
    taxAmount: 2800,
    businessPurpose: "Executive dinner with Fortune 500 Bank VP stakeholders at Oberoi.",
    costCenter: "CC-SALES-ENT",
    project: "PROJ-FINTECH-DEAL",
    location: "Mumbai",
    paymentStatus: "UNPAID",
    approvalStatus: "SUBMITTED",
    approvalStage: "MANAGER",
    approvalWorkflow: [
      { role: "Employee", name: "Priya Nair", status: "APPROVED", timestamp: "2026-07-16 02:10 PM", comment: "Receipt attached. Includes itemized invoice." },
      { role: "Reporting Manager", name: "Vikram Malhotra", status: "PENDING" },
      { role: "Finance Manager", name: "Karan Johar", status: "PENDING" },
      { role: "Payroll Admin", name: "Rohan Varma", status: "PENDING" },
    ],
    receipts: [
      {
        id: "rec-4",
        fileName: "Oberoi_Dinner_Receipt.jpeg",
        fileUrl: "#",
        fileType: "JPEG",
        fileSize: "1.8 MB",
        uploadedAt: "2026-07-16",
        ocrVerified: true,
        extractedAmount: 18400,
        extractedVendor: "The Oberoi Mumbai",
      },
    ],
    createdOn: "2026-07-16",
    updatedOn: "2026-07-16",
    policyWarnings: ["Amount exceeds default single meal policy limit of ₹10,000. Manager pre-approval flag required."],
    aiRiskScore: "MEDIUM",
  },
  {
    id: "clm-104",
    claimNumber: "CLM-2026-0844",
    employeeId: "emp-205",
    employeeCode: "EMP-205",
    employeeName: "Amitabh Sen",
    department: "Operations",
    designation: "Operations Executive",
    expenseCategory: "Fuel",
    expenseDate: "2026-07-18",
    submittedDate: "2026-07-18",
    claimAmount: 6500,
    approvedAmount: 0,
    currency: "INR",
    taxAmount: 0,
    businessPurpose: "Inter-site warehouse inspection travel fuel allowance.",
    costCenter: "CC-OPS-LOGISTICS",
    project: "PROJ-WAREHOUSE-EXP",
    location: "Hyderabad",
    paymentStatus: "UNPAID",
    approvalStatus: "FINANCE_APPROVED",
    approvalStage: "PAYROLL",
    approvalWorkflow: [
      { role: "Employee", name: "Amitabh Sen", status: "APPROVED", timestamp: "2026-07-18" },
      { role: "Reporting Manager", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-19" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-20" },
      { role: "Payroll Admin", name: "Rohan Varma", status: "PENDING" },
    ],
    receipts: [
      {
        id: "rec-5",
        fileName: "HPCL_Fuel_Bill.png",
        fileUrl: "#",
        fileType: "PNG",
        fileSize: "890 KB",
        uploadedAt: "2026-07-18",
        ocrVerified: true,
        extractedAmount: 6500,
        extractedVendor: "HPCL Station #402",
      },
    ],
    createdOn: "2026-07-18",
    updatedOn: "2026-07-20",
    policyWarnings: [],
    aiRiskScore: "LOW",
  },
];

const INITIAL_AUDIT_LOGS: ReimbursementAuditLog[] = [
  {
    id: "log-r1",
    claimId: "clm-101",
    claimNumber: "CLM-2026-0841",
    action: "ADD_PAYROLL_ENTRY",
    actorName: "Rohan Varma",
    actorRole: "Payroll Admin",
    timestamp: "2026-07-15 04:00 PM",
    details: "Approved reimbursement claim of ₹48,500 and generated payroll entry for July 2026 pay run.",
    ipAddress: "192.168.1.12",
  },
  {
    id: "log-r2",
    claimId: "clm-102",
    claimNumber: "CLM-2026-0842",
    action: "PROCESS_PAYMENT",
    actorName: "System Disbursal",
    actorRole: "Finance Bot",
    timestamp: "2026-07-05 10:00 AM",
    details: "Direct bank transfer payout of ₹2,999 completed via HDFC NEFT gateway.",
    ipAddress: "127.0.0.1",
  },
];

const INITIAL_AI_INSIGHTS: ReimbursementAIInsight[] = [
  {
    id: "ai-r1",
    title: "High Single Dinner Expense Alert",
    type: "HIGH_EXPENSE",
    severity: "WARNING",
    claimId: "clm-103",
    employeeName: "Priya Nair",
    description: "Claim CLM-2026-0843 for ₹18,400 (Client Meeting) is 84% higher than the team average of ₹10,000 for client dinners.",
    impactAmount: 18400,
    recommendation: "Request VP authorization letter before approving Finance sign-off.",
  },
  {
    id: "ai-r2",
    title: "Duplicate Fuel Bill Upload Check Passed",
    type: "DUPLICATE",
    severity: "SUCCESS",
    employeeName: "Amitabh Sen",
    description: "OCR scanner verified fuel receipt #402 for ₹6,500. No matching date or timestamp found in past 90 days.",
    impactAmount: 6500,
    recommendation: "Safe for automated payroll inclusion.",
  },
  {
    id: "ai-r3",
    title: "Q3 Department Travel Budget Forecast",
    type: "BUDGET_FORECAST",
    severity: "INFO",
    employeeName: "Engineering Team",
    description: "Engineering department has utilized 62% of Q3 reimbursement budget (₹4.85L / ₹7.80L).",
    impactAmount: 485000,
    recommendation: "Track upcoming Tech Summit claims in August cycle.",
  },
];

let localClaims = [...INITIAL_CLAIMS];
let localAuditLogs = [...INITIAL_AUDIT_LOGS];

export const reimbursementsApi = {
  // GET all claims with filtering
  getClaims: async (params: Partial<ReimbursementsFilters> = {}): Promise<{
    items: ReimbursementClaim[];
    total: number;
    kpis: ReimbursementsSummaryKPIs;
  }> => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.department) query.append("department", params.department);
      if (params.claimStatus) query.append("status", params.claimStatus);

      const res: any = await api.get(`payroll/reimbursements?${query.toString()}`);
      if (res.data && Array.isArray(res.data?.items)) {
        return {
          items: res.data.items,
          total: res.data.total || res.data.items.length,
          kpis: res.data.kpis || reimbursementsApi.computeKPIs(res.data.items),
        };
      }
    } catch {
      // Local fallback
    }

    const filtered = reimbursementsApi.filterClaimsInMemory(localClaims, params);
    return {
      items: filtered,
      total: filtered.length,
      kpis: reimbursementsApi.computeKPIs(localClaims),
    };
  },

  // GET claim by ID
  getClaimById: async (id: string): Promise<ReimbursementClaim> => {
    try {
      const res: any = await api.get(`payroll/reimbursements/${id}`);
      if (res.data?.id) return res.data;
    } catch {
      // Fallback
    }
    const found = localClaims.find((c) => c.id === id);
    if (!found) throw new Error(`Claim with ID '${id}' not found.`);
    return found;
  },

  // POST create new claim
  createClaim: async (payload: Partial<ReimbursementClaim>): Promise<ReimbursementClaim> => {
    const newId = `clm-${Date.now()}`;
    const claimNum = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newClaim: ReimbursementClaim = {
      id: newId,
      claimNumber: claimNum,
      employeeId: payload.employeeId || "emp-101",
      employeeCode: payload.employeeCode || "EMP-101",
      employeeName: payload.employeeName || "Vikramaditya Roy",
      department: payload.department || "Engineering",
      designation: payload.designation || "Principal Architect",
      expenseCategory: payload.expenseCategory || "Travel",
      expenseDate: payload.expenseDate || new Date().toISOString().split("T")[0],
      submittedDate: new Date().toISOString().split("T")[0],
      claimAmount: payload.claimAmount || 5000,
      approvedAmount: payload.claimAmount || 5000,
      currency: payload.currency || "INR",
      taxAmount: payload.taxAmount || 0,
      businessPurpose: payload.businessPurpose || "Business expense claim.",
      costCenter: payload.costCenter || "CC-ENG-GENERAL",
      project: payload.project || "PROJ-CORE",
      location: payload.location || "Global",
      paymentStatus: "UNPAID",
      approvalStatus: "SUBMITTED",
      approvalStage: "MANAGER",
      approvalWorkflow: [
        { role: "Employee", name: payload.employeeName || "Vikramaditya Roy", status: "APPROVED", timestamp: new Date().toISOString().replace("T", " ").slice(0, 16) },
        { role: "Reporting Manager", name: "Sunita Menon", status: "PENDING" },
        { role: "Finance Manager", name: "Karan Johar", status: "PENDING" },
        { role: "Payroll Admin", name: "Rohan Varma", status: "PENDING" },
      ],
      receipts: payload.receipts || [
        {
          id: `rec-${Date.now()}`,
          fileName: "Expense_Receipt_Document.pdf",
          fileUrl: "#",
          fileType: "PDF",
          fileSize: "1.2 MB",
          uploadedAt: new Date().toISOString().split("T")[0],
          ocrVerified: true,
          extractedAmount: payload.claimAmount || 5000,
        },
      ],
      createdOn: new Date().toISOString().split("T")[0],
      updatedOn: new Date().toISOString().split("T")[0],
      policyWarnings: [],
      aiRiskScore: "LOW",
    };

    localClaims.unshift(newClaim);
    reimbursementsApi.addAuditLog(newClaim.id, newClaim.claimNumber, "CREATE", `Submitted new reimbursement claim of ₹${newClaim.claimAmount}`);
    return newClaim;
  },

  // POST approve / reject claim
  approveClaim: async (id: string, role: string, comment?: string): Promise<ReimbursementClaim> => {
    const existing = await reimbursementsApi.getClaimById(id);
    const updatedWorkflow = existing.approvalWorkflow.map((step) => {
      if (step.role.toLowerCase().includes(role.toLowerCase())) {
        return {
          ...step,
          status: "APPROVED" as const,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          comment: comment || "Approved by authority.",
        };
      }
      return step;
    });

    const allApproved = updatedWorkflow.every((s) => s.status === "APPROVED");

    const updated: ReimbursementClaim = {
      ...existing,
      approvalWorkflow: updatedWorkflow,
      approvalStatus: allApproved ? "PAYROLL_APPROVED" : "FINANCE_APPROVED",
      approvedAmount: existing.claimAmount,
      approvalStage: allApproved ? "COMPLETED" : "PAYROLL",
      updatedOn: new Date().toISOString().split("T")[0],
    };

    const idx = localClaims.findIndex((c) => c.id === id);
    if (idx !== -1) localClaims[idx] = updated;

    reimbursementsApi.addAuditLog(id, existing.claimNumber, "APPROVE", `Approved claim for role ${role}`);
    return updated;
  },

  // POST reject claim
  rejectClaim: async (id: string, role: string, reason: string): Promise<ReimbursementClaim> => {
    const existing = await reimbursementsApi.getClaimById(id);
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

    const updated: ReimbursementClaim = {
      ...existing,
      approvalWorkflow: updatedWorkflow,
      approvalStatus: "REJECTED",
      updatedOn: new Date().toISOString().split("T")[0],
    };

    const idx = localClaims.findIndex((c) => c.id === id);
    if (idx !== -1) localClaims[idx] = updated;

    reimbursementsApi.addAuditLog(id, existing.claimNumber, "REJECT", `Rejected claim: ${reason}`);
    return updated;
  },

  // Bulk Approve Claims
  bulkApprove: async (claimIds: string[]): Promise<{ count: number }> => {
    let count = 0;
    for (const id of claimIds) {
      await reimbursementsApi.approveClaim(id, "Finance Manager", "Bulk approval action.");
      count++;
    }
    return { count };
  },

  // Add Payroll Entry
  addPayrollEntry: async (claimIds: string[], payrollCycle: string): Promise<{ success: boolean }> => {
    for (const id of claimIds) {
      const idx = localClaims.findIndex((c) => c.id === id);
      if (idx !== -1) {
        localClaims[idx] = {
          ...localClaims[idx],
          paymentStatus: "SCHEDULED_PAYROLL",
          payrollCycle,
          payrollEntryId: `PY-ENTRY-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        reimbursementsApi.addAuditLog(id, localClaims[idx].claimNumber, "ADD_PAYROLL_ENTRY", `Added reimbursement to cycle ${payrollCycle}`);
      }
    }
    return { success: true };
  },

  // Process Direct Payment
  processPayment: async (claimIds: string[]): Promise<{ success: boolean }> => {
    for (const id of claimIds) {
      const idx = localClaims.findIndex((c) => c.id === id);
      if (idx !== -1) {
        localClaims[idx] = {
          ...localClaims[idx],
          paymentStatus: "PAID",
        };
        reimbursementsApi.addAuditLog(id, localClaims[idx].claimNumber, "PROCESS_PAYMENT", `Disbursed direct bank transfer payout.`);
      }
    }
    return { success: true };
  },

  // GET Audit Logs
  getAuditLogs: async (): Promise<ReimbursementAuditLog[]> => {
    return localAuditLogs;
  },

  // GET AI Insights
  getAIInsights: async (): Promise<ReimbursementAIInsight[]> => {
    return INITIAL_AI_INSIGHTS;
  },

  // In-Memory Filter
  filterClaimsInMemory: (items: ReimbursementClaim[], params: Partial<ReimbursementsFilters>): ReimbursementClaim[] => {
    return items.filter((item) => {
      if (params.search) {
        const q = params.search.toLowerCase();
        const match =
          item.claimNumber.toLowerCase().includes(q) ||
          item.employeeName.toLowerCase().includes(q) ||
          item.employeeCode.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.businessPurpose.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (params.department && params.department !== "all" && params.department !== "ALL") {
        if (item.department.toLowerCase() !== params.department.toLowerCase()) return false;
      }
      if (params.expenseCategory && params.expenseCategory !== "all" && params.expenseCategory !== "ALL") {
        if (item.expenseCategory !== params.expenseCategory) return false;
      }
      if (params.claimStatus && params.claimStatus !== "all" && params.claimStatus !== "ALL") {
        if (item.approvalStatus !== params.claimStatus) return false;
      }
      if (params.paymentStatus && params.paymentStatus !== "all" && params.paymentStatus !== "ALL") {
        if (item.paymentStatus !== params.paymentStatus) return false;
      }
      return true;
    });
  },

  // Compute live KPIs
  computeKPIs: (items: ReimbursementClaim[]): ReimbursementsSummaryKPIs => {
    const totalClaims = items.length;
    const pendingApproval = items.filter((c) => c.approvalStatus === "SUBMITTED" || c.approvalStatus === "MANAGER_APPROVED").length;
    const approved = items.filter((c) => c.approvalStatus === "PAYROLL_APPROVED" || c.approvalStatus === "FINANCE_APPROVED").length;
    const rejected = items.filter((c) => c.approvalStatus === "REJECTED").length;
    const processing = items.filter((c) => c.paymentStatus === "PROCESSING" || c.paymentStatus === "SCHEDULED_PAYROLL").length;
    const paid = items.filter((c) => c.paymentStatus === "PAID").length;
    
    const totalAmount = items.reduce((acc, c) => acc + c.claimAmount, 0);
    const averageClaim = totalClaims > 0 ? Math.round(totalAmount / totalClaims) : 0;
    const monthlyExpense = totalAmount;
    const departmentExpense = Math.round(totalAmount * 0.45);

    return {
      totalClaims,
      pendingApproval,
      approved,
      rejected,
      processing,
      paid,
      totalAmount,
      averageClaim,
      monthlyExpense,
      departmentExpense,
    };
  },

  // Add Internal Audit Log
  addAuditLog: (claimId: string, claimNumber: string, action: ReimbursementAuditLog["action"], details: string) => {
    localAuditLogs.unshift({
      id: `log-${Date.now()}`,
      claimId,
      claimNumber,
      action,
      actorName: "Admin User",
      actorRole: "Finance Administrator",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      details,
      ipAddress: "127.0.0.1",
    });
  },
};
