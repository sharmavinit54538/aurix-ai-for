import { api } from "@/api";
import {
  DeductionRule,
  DeductionsFilters,
  DeductionsSummaryKPIs,
  DeductionAuditLog,
  DeductionAIInsight,
  DeductionCategoryGroup,
} from "@/features/admin/payroll/components/deductions/deductionsTypes";

export const DEDUCTION_CATEGORY_GROUPS: DeductionCategoryGroup[] = [
  "STATUTORY",
  "VOLUNTARY",
  "RECOVERY",
  "PENALTY",
  "CUSTOM",
];

const INITIAL_DEDUCTION_RULES: DeductionRule[] = [
  {
    id: "ded-101",
    code: "DED-PF-001",
    name: "Employee Provident Fund (EPF)",
    description: "Statutory employee PF contribution of 12% on Basic Salary (capping ceiling at ₹15,000 basic).",
    categoryGroup: "STATUTORY",
    category: "PF",
    calculationMethod: "FORMULA",
    formulaExpression: "MIN(BASIC, 15000) * 0.12",
    fixedAmount: 0,
    percentage: 12,
    maxLimit: 1800,
    minLimit: 0,
    employeeCount: 412,
    effectiveDate: "2026-04-01",
    status: "ACTIVE",
    complianceType: "MANDATORY_STATUTORY",
    recurrence: "Monthly",
    approvalStatus: "APPROVED",
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Compliance Officer", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-04-01" },
    ],
    createdOn: "2026-04-01",
    updatedOn: "2026-07-01",
    createdBy: "Compliance Officer",
  },
  {
    id: "ded-102",
    code: "DED-ESI-002",
    name: "Employee State Insurance (ESI)",
    description: "Statutory ESI contribution of 0.75% for employees with gross salary <= ₹21,000.",
    categoryGroup: "STATUTORY",
    category: "ESI",
    calculationMethod: "CONDITIONAL",
    formulaExpression: "IF(GROSS <= 21000, GROSS * 0.0075, 0)",
    fixedAmount: 0,
    percentage: 0.75,
    maxLimit: 157.5,
    minLimit: 0,
    employeeCount: 98,
    effectiveDate: "2026-04-01",
    status: "ACTIVE",
    complianceType: "MANDATORY_STATUTORY",
    recurrence: "Monthly",
    approvalStatus: "APPROVED",
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Compliance Officer", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-04-01" },
    ],
    createdOn: "2026-04-01",
    updatedOn: "2026-07-01",
    createdBy: "Compliance Officer",
  },
  {
    id: "ded-103",
    code: "DED-PT-003",
    name: "Professional Tax (PT)",
    description: "State-wise statutory professional tax deduction slab rules (Karnataka / Maharashtra / Telangana).",
    categoryGroup: "STATUTORY",
    category: "Professional Tax",
    calculationMethod: "CONDITIONAL",
    formulaExpression: "IF(GROSS >= 15000, 200, 0)",
    fixedAmount: 200,
    percentage: 0,
    maxLimit: 200,
    minLimit: 0,
    employeeCount: 412,
    effectiveDate: "2026-04-01",
    status: "ACTIVE",
    complianceType: "MANDATORY_STATUTORY",
    recurrence: "Monthly",
    approvalStatus: "APPROVED",
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Compliance Officer", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-04-01" },
    ],
    createdOn: "2026-04-01",
    updatedOn: "2026-07-01",
    createdBy: "Compliance Officer",
  },
  {
    id: "ded-104",
    code: "DED-INS-101",
    name: "Corporate Group Health Insurance",
    description: "Voluntary employee copay for family health insurance coverage top-up.",
    categoryGroup: "VOLUNTARY",
    category: "Health Insurance",
    calculationMethod: "FIXED",
    formulaExpression: "1500",
    fixedAmount: 1500,
    percentage: 0,
    maxLimit: 1500,
    minLimit: 1500,
    employeeCount: 280,
    effectiveDate: "2026-04-01",
    status: "ACTIVE",
    complianceType: "VOLUNTARY_POLICY",
    recurrence: "Monthly",
    approvalStatus: "APPROVED",
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-04-01" },
      { role: "Compliance Officer", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-04-01" },
    ],
    createdOn: "2026-04-01",
    updatedOn: "2026-07-01",
    createdBy: "HR Manager",
  },
  {
    id: "ded-105",
    code: "DED-LOAN-201",
    name: "Company Salary Loan EMI Recovery",
    description: "Monthly principal + interest recovery for company personal and emergency loans.",
    categoryGroup: "RECOVERY",
    category: "Loan EMI",
    calculationMethod: "FORMULA",
    formulaExpression: "LOAN_BALANCE / LOAN_TENURE",
    fixedAmount: 12500,
    percentage: 0,
    maxLimit: 25000,
    minLimit: 5000,
    employeeCount: 34,
    effectiveDate: "2026-05-01",
    status: "ACTIVE",
    complianceType: "INTERNAL_RECOVERY",
    recurrence: "Monthly",
    approvalStatus: "APPROVED",
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-05-01" },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-05-01" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-05-01" },
      { role: "Compliance Officer", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-05-01" },
    ],
    createdOn: "2026-05-01",
    updatedOn: "2026-07-01",
    createdBy: "Finance Manager",
  },
];

const INITIAL_AUDIT_LOGS: DeductionAuditLog[] = [
  {
    id: "log-d1",
    deductionId: "ded-101",
    deductionCode: "DED-PF-001",
    action: "GENERATE_IMPACT",
    actorName: "Sunita Menon",
    actorRole: "Payroll Admin",
    timestamp: "2026-07-01 09:30 AM",
    details: "Re-calculated monthly PF statutory deduction ceiling across 412 employees.",
    ipAddress: "192.168.1.45",
  },
  {
    id: "log-d2",
    deductionId: "ded-105",
    deductionCode: "DED-LOAN-201",
    action: "BULK_ASSIGN",
    actorName: "Karan Johar",
    actorRole: "Finance Manager",
    timestamp: "2026-07-10 02:15 PM",
    details: "Assigned Loan EMI recovery rule to 34 employees in active repayment schedules.",
    ipAddress: "192.168.1.88",
  },
];

const INITIAL_AI_INSIGHTS: DeductionAIInsight[] = [
  {
    id: "ai-d1",
    title: "Excessive Recovery Risk Alert",
    type: "EXCESSIVE_RECOVERY",
    severity: "CRITICAL",
    employeeName: "Sanjay Malhotra",
    description: "Combined loan EMI and advance recovery exceeds 50% of monthly gross salary, violating Section 7 of Payment of Wages Act.",
    impactMetric: "54% Recovery Ratio",
    recommendation: "Extend loan tenure by 6 months to cap monthly recovery at 35%.",
  },
  {
    id: "ai-d2",
    title: "Statutory Compliance Ceiling Check",
    type: "COMPLIANCE_RISK",
    severity: "SUCCESS",
    description: "100% of employees are accurately mapped to FY27 statutory Professional Tax and EPF capping limits.",
    impactMetric: "99.4% Compliance Score",
    recommendation: "Maintain current statutory configuration.",
  },
  {
    id: "ai-d3",
    title: "Duplicate Insurance Recovery Prevention",
    type: "DUPLICATE",
    severity: "WARNING",
    employeeName: "Amitabh Sen",
    description: "Detected dual deduction for Corporate Health Insurance (DED-INS-101) in current July pay cycle.",
    impactMetric: "Duplicate ₹1,500 Rule",
    recommendation: "Deactivate duplicate voluntary deduction.",
  },
];

let localDeductions = [...INITIAL_DEDUCTION_RULES];
let localAuditLogs = [...INITIAL_AUDIT_LOGS];

export const deductionsApi = {
  // GET all deduction rules with filtering
  getDeductionRules: async (params: Partial<DeductionsFilters> = {}): Promise<{
    items: DeductionRule[];
    total: number;
    kpis: DeductionsSummaryKPIs;
  }> => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.categoryGroup) query.append("categoryGroup", params.categoryGroup);

      const res: any = await api.get(`payroll/deductions?${query.toString()}`);
      if (res.data && Array.isArray(res.data?.items)) {
        return {
          items: res.data.items,
          total: res.data.total || res.data.items.length,
          kpis: res.data.kpis || deductionsApi.computeKPIs(res.data.items),
        };
      }
    } catch {
      // Local fallback
    }

    const filtered = deductionsApi.filterDeductionsInMemory(localDeductions, params);
    return {
      items: filtered,
      total: filtered.length,
      kpis: deductionsApi.computeKPIs(localDeductions),
    };
  },

  // GET deduction rule by ID
  getDeductionRuleById: async (id: string): Promise<DeductionRule> => {
    try {
      const res: any = await api.get(`payroll/deductions/${id}`);
      if (res.data?.id) return res.data;
    } catch {
      // Fallback
    }
    const found = localDeductions.find((d) => d.id === id);
    if (!found) throw new Error(`Deduction rule with ID '${id}' not found.`);
    return found;
  },

  // POST create new deduction rule
  createDeductionRule: async (payload: Partial<DeductionRule>): Promise<DeductionRule> => {
    const newId = `ded-${Date.now()}`;
    const code = `DED-CUST-${Math.floor(100 + Math.random() * 900)}`;

    const newRule: DeductionRule = {
      id: newId,
      code,
      name: payload.name || "Custom Allowance Recovery",
      description: payload.description || "Custom payroll deduction rule.",
      categoryGroup: payload.categoryGroup || "CUSTOM",
      category: payload.category || "Custom Deduction",
      calculationMethod: payload.calculationMethod || "FIXED",
      formulaExpression: payload.formulaExpression || `${payload.fixedAmount || 1000}`,
      fixedAmount: payload.fixedAmount || 1000,
      percentage: payload.percentage || 0,
      maxLimit: payload.maxLimit || 5000,
      minLimit: payload.minLimit || 0,
      employeeCount: payload.employeeCount || 45,
      effectiveDate: payload.effectiveDate || new Date().toISOString().split("T")[0],
      status: "ACTIVE",
      complianceType: payload.complianceType || "INTERNAL_RECOVERY",
      recurrence: payload.recurrence || "Monthly",
      approvalStatus: "APPROVED",
      approvalStage: "PUBLISHED",
      approvalWorkflow: [
        { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-21" },
        { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-21" },
        { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-07-21" },
        { role: "Compliance Officer", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-07-21" },
      ],
      createdOn: new Date().toISOString().split("T")[0],
      updatedOn: new Date().toISOString().split("T")[0],
      createdBy: "Payroll Admin",
    };

    localDeductions.unshift(newRule);
    deductionsApi.addAuditLog(newRule.id, newRule.code, "CREATE", `Created new deduction rule '${newRule.name}'`);
    return newRule;
  },

  // Toggle Status
  toggleStatus: async (id: string): Promise<DeductionRule> => {
    const existing = await deductionsApi.getDeductionRuleById(id);
    const newStatus = existing.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const updated: DeductionRule = { ...existing, status: newStatus, updatedOn: new Date().toISOString().split("T")[0] };

    const idx = localDeductions.findIndex((d) => d.id === id);
    if (idx !== -1) localDeductions[idx] = updated;

    deductionsApi.addAuditLog(id, existing.code, newStatus === "ACTIVE" ? "ACTIVATE" : "DEACTIVATE", `Toggled status to ${newStatus}`);
    return updated;
  },

  // Bulk Assign Deductions
  bulkAssignDeductions: async (criteria: { department: string; deductionId: string }): Promise<{ count: number }> => {
    const rule = localDeductions.find((d) => d.id === criteria.deductionId);
    if (rule) {
      rule.employeeCount += 25;
      deductionsApi.addAuditLog(rule.id, rule.code, "BULK_ASSIGN", `Bulk assigned rule '${rule.name}' to department ${criteria.department}`);
    }
    return { count: 25 };
  },

  // GET Audit Logs
  getAuditLogs: async (): Promise<DeductionAuditLog[]> => {
    return localAuditLogs;
  },

  // GET AI Insights
  getAIInsights: async (): Promise<DeductionAIInsight[]> => {
    return INITIAL_AI_INSIGHTS;
  },

  // Filter in memory
  filterDeductionsInMemory: (items: DeductionRule[], params: Partial<DeductionsFilters>): DeductionRule[] => {
    return items.filter((item) => {
      if (params.search) {
        const q = params.search.toLowerCase();
        const match =
          item.code.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.categoryGroup.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (params.categoryGroup && params.categoryGroup !== "all" && params.categoryGroup !== "ALL") {
        if (item.categoryGroup !== params.categoryGroup) return false;
      }
      if (params.status && params.status !== "ALL") {
        if (item.status !== params.status) return false;
      }
      return true;
    });
  },

  // Compute Live KPIs
  computeKPIs: (items: DeductionRule[]): DeductionsSummaryKPIs => {
    const totalDeductionRules = items.length;
    const activeRules = items.filter((d) => d.status === "ACTIVE").length;
    const inactiveRules = items.filter((d) => d.status === "INACTIVE").length;
    const statutoryDeductions = items.filter((d) => d.categoryGroup === "STATUTORY").length;
    const customDeductions = items.filter((d) => d.categoryGroup === "CUSTOM" || d.categoryGroup === "VOLUNTARY").length;
    const loanRecoveries = items.filter((d) => d.category === "Loan EMI").length;
    const advanceRecoveries = items.filter((d) => d.category === "Salary Advance").length;
    const monthlyDeductionAmount = 1485000;
    const annualDeductionAmount = monthlyDeductionAmount * 12;

    return {
      totalDeductionRules,
      activeRules,
      inactiveRules,
      statutoryDeductions,
      customDeductions,
      loanRecoveries,
      advanceRecoveries,
      monthlyDeductionAmount,
      annualDeductionAmount,
      complianceScore: 99.4,
    };
  },

  // Add Internal Audit Log
  addAuditLog: (deductionId: string, deductionCode: string, action: DeductionAuditLog["action"], details: string) => {
    localAuditLogs.unshift({
      id: `log-${Date.now()}`,
      deductionId,
      deductionCode,
      action,
      actorName: "Sunita Menon",
      actorRole: "Payroll Admin",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      details,
      ipAddress: "127.0.0.1",
    });
  },
};
