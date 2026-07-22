export type DeductionCategoryGroup =
  | "STATUTORY"
  | "VOLUNTARY"
  | "RECOVERY"
  | "PENALTY"
  | "CUSTOM";

export type DeductionCategory =
  // Statutory
  | "PF"
  | "ESI"
  | "Professional Tax"
  | "Income Tax (TDS)"
  | "Labour Welfare Fund"
  // Voluntary
  | "Health Insurance"
  | "Life Insurance"
  | "NPS"
  | "Meal Card"
  | "Transport Recovery"
  | "Company Assets"
  // Recovery
  | "Loan EMI"
  | "Salary Advance"
  | "Notice Period Recovery"
  | "Training Recovery"
  | "Uniform Recovery"
  | "Device Recovery"
  // Penalty
  | "Late Coming"
  | "Unauthorized Leave"
  | "Damage Recovery"
  // Custom
  | "Custom Deduction";

export type CalculationMethod = "FIXED" | "PERCENTAGE" | "FORMULA" | "CONDITIONAL";

export type DeductionStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type ComplianceType = "MANDATORY_STATUTORY" | "VOLUNTARY_POLICY" | "INTERNAL_RECOVERY";

export interface ApprovalStep {
  role: "HR Manager" | "Payroll Admin" | "Finance Manager" | "Compliance Officer";
  name: string;
  avatar?: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  timestamp?: string;
  comment?: string;
}

export interface DeductionRule {
  id: string;
  code: string; // e.g. "DED-PF-001"
  name: string;
  description: string;
  categoryGroup: DeductionCategoryGroup;
  category: string;
  calculationMethod: CalculationMethod;
  formulaExpression: string;
  fixedAmount?: number;
  percentage?: number;
  maxLimit?: number;
  minLimit?: number;
  employeeCount: number;
  effectiveDate: string;
  status: DeductionStatus;
  complianceType: ComplianceType;
  recurrence: "Monthly" | "Quarterly" | "One Time" | "Recurring";
  approvalStatus: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  approvalStage: "HR" | "PAYROLL" | "FINANCE" | "COMPLIANCE" | "PUBLISHED";
  approvalWorkflow: ApprovalStep[];
  createdOn: string;
  updatedOn: string;
  createdBy: string;
}

export interface DeductionsSummaryKPIs {
  totalDeductionRules: number;
  activeRules: number;
  inactiveRules: number;
  statutoryDeductions: number;
  customDeductions: number;
  loanRecoveries: number;
  advanceRecoveries: number;
  monthlyDeductionAmount: number;
  annualDeductionAmount: number;
  complianceScore: number; // e.g. 99.4%
}

export interface DeductionsFilters {
  search: string;
  employee: string;
  department: string;
  designation: string;
  location: string;
  employmentType: string;
  deductionType: string;
  categoryGroup: string;
  payrollCycle: string;
  status: string;
  financialYear: string;
  page: number;
  limit: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export interface DeductionAuditLog {
  id: string;
  deductionId: string;
  deductionCode: string;
  action: "CREATE" | "EDIT" | "ACTIVATE" | "DEACTIVATE" | "ASSIGN" | "BULK_ASSIGN" | "GENERATE_IMPACT";
  actorName: string;
  actorRole: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface DeductionAIInsight {
  id: string;
  title: string;
  type: "DUPLICATE" | "EXCESSIVE_RECOVERY" | "COMPLIANCE_RISK" | "NEGATIVE_SALARY" | "POLICY_VIOLATION";
  severity: "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
  employeeName?: string;
  description: string;
  impactMetric: string;
  recommendation: string;
}

export interface PayrollWaterfallItem {
  stage: string;
  amount: number;
  type: "EARNING" | "ALLOWANCE" | "STATUTORY_DEDUCTION" | "VOLUNTARY_DEDUCTION" | "NET_SALARY";
  color: string;
}
