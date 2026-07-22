export type BonusType =
  | "Performance Bonus"
  | "Annual Bonus"
  | "Festival Bonus"
  | "Retention Bonus"
  | "Joining Bonus"
  | "Referral Bonus"
  | "Sales Incentive"
  | "Spot Award"
  | "Project Bonus"
  | "Quarterly Bonus"
  | "Long-Term Incentive"
  | "Stock Award"
  | "Custom Bonus";

export type ApprovalStatus =
  | "DRAFT"
  | "PENDING_HR"
  | "PENDING_COMP"
  | "PENDING_FINANCE"
  | "PENDING_CFO"
  | "PENDING_CEO"
  | "APPROVED"
  | "REJECTED";

export type PaymentStatus = "UNPAID" | "SCHEDULED_PAYROLL" | "PAID";

export type CalculationMode = "FIXED" | "PERCENTAGE_CTC" | "PERCENTAGE_BASIC" | "PERFORMANCE_SCORE" | "FORMULA";

export interface ApprovalStep {
  role: "HR Manager" | "Compensation Manager" | "Finance Manager" | "CFO" | "CEO" | "Payroll Admin";
  name: string;
  avatar?: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "SKIPPED";
  timestamp?: string;
  comment?: string;
}

export interface BonusAward {
  id: string;
  bonusCode: string; // e.g. "BNS-2026-901"
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  avatar?: string;
  department: string;
  designation: string;
  location: string;
  employmentType: string;
  bonusType: BonusType;
  bonusCycle: string; // e.g. "Q2 2026 Performance Bonus", "FY26 Annual Appraisal"
  performanceRating: number; // e.g. 4.8 / 5.0
  bonusAmount: number;
  currency: string;
  taxImpact: number;
  netPayout: number;
  payrollCycle?: string;
  payrollEntryId?: string;
  approvalStatus: ApprovalStatus;
  paymentStatus: PaymentStatus;
  approvalStage: "HR" | "COMPENSATION" | "FINANCE" | "CFO" | "CEO" | "PAYROLL" | "COMPLETED";
  approvalWorkflow: ApprovalStep[];
  calculationMode: CalculationMode;
  formulaExpression?: string;
  effectiveDate: string;
  createdOn: string;
  updatedOn: string;
  createdBy: string;
  aiSuggestions?: string[];
}

export interface BonusesSummaryKPIs {
  totalBonusBudget: number;
  allocatedBonus: number;
  pendingApproval: number;
  approvedBonuses: number;
  paidBonuses: number;
  outstandingBonus: number;
  averageBonus: number;
  topRewardedDepartment: string;
  topRewardedEmployee: string;
  budgetRemaining: number;
}

export interface BonusesFilters {
  search: string;
  employee: string;
  employeeId: string;
  department: string;
  designation: string;
  location: string;
  employmentType: string;
  bonusType: string;
  bonusCycle: string;
  financialYear: string;
  approvalStatus: string;
  paymentStatus: string;
  performanceRating: string; // 'ALL' | '4.5_ABOVE' | '4.0_ABOVE'
  minAmount?: number;
  maxAmount?: number;
  page: number;
  limit: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export interface BonusAuditLog {
  id: string;
  bonusId: string;
  bonusCode: string;
  action: "CREATE" | "APPROVE" | "REJECT" | "RECALCULATE" | "BULK_ALLOCATE" | "ADD_PAYROLL_ENTRY" | "GENERATE_LETTER";
  actorName: string;
  actorRole: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface BonusAIInsight {
  id: string;
  title: string;
  type: "RECOMMENDATION" | "BUDGET_OPTIMIZATION" | "PAY_EQUITY" | "RETENTION_RISK" | "BENCHMARK" | "FORECAST";
  severity: "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
  employeeName?: string;
  description: string;
  impactMetric: string;
  recommendation: string;
}
