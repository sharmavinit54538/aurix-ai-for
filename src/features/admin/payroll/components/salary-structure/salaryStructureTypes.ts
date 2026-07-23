export type ComponentCategory =
  | "BASIC"
  | "HRA"
  | "SPECIAL_ALLOWANCE"
  | "MEDICAL"
  | "TRAVEL"
  | "FOOD"
  | "PERFORMANCE_BONUS"
  | "VARIABLE_PAY"
  | "OVERTIME"
  | "SHIFT_ALLOWANCE"
  | "PF"
  | "ESI"
  | "PROFESSIONAL_TAX"
  | "INCOME_TAX"
  | "LOAN_EMI"
  | "ADVANCE_RECOVERY"
  | "LATE_PENALTY"
  | "EMPLOYER_PF"
  | "EMPLOYER_ESI"
  | "INSURANCE"
  | "GRATUITY"
  | "LWF"
  | "HEALTH_INSURANCE"
  | "LIFE_INSURANCE"
  | "MEAL_CARD"
  | "FUEL"
  | "MOBILE_REIMBURSEMENT"
  | "INTERNET_REIMBURSEMENT"
  | "STOCK_OPTIONS"
  | "RETENTION_BONUS"
  | "CUSTOM";

export type ComponentType = "EARNING" | "DEDUCTION" | "EMPLOYER_CONTRIBUTION" | "BENEFIT";

export type CalculationType = "FIXED" | "PERCENTAGE" | "FORMULA" | "CONDITIONAL";

export interface SalaryComponent {
  id: string;
  code: string;
  name: string;
  type: ComponentType;
  category: ComponentCategory;
  calculationType: CalculationType;
  value: number; // numeric value or percentage
  baseComponentCode?: string; // e.g. "BASIC", "GROSS", "CTC"
  formulaExpression?: string; // e.g. "BASIC * 0.50" or "IF(GROSS > 50000, 200, 150)"
  conditionExpression?: string; // e.g. "LOCATION == 'MH'"
  isTaxable: boolean;
  isStatutory: boolean;
  isFlexible: boolean;
  frequency: "MONTHLY" | "ANNUAL";
  description?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface StructureVersion {
  id: string;
  version: string; // e.g. "v2.1"
  effectiveFrom: string;
  effectiveTo?: string | null;
  changeSummary: string;
  createdBy: string;
  createdAt: string;
  status: "ACTIVE" | "SUPERSEDED" | "DRAFT";
  annualCtc?: number;
  componentsCount?: number;
}

export interface ApprovalStep {
  role: "HR Manager" | "Payroll Admin" | "Finance Manager" | "CFO";
  name: string;
  avatar?: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "SKIPPED";
  timestamp?: string;
  comments?: string;
}

export interface SalaryStructure {
  id: string;
  name: string;
  code: string;
  description: string;
  salaryGrade: string; // e.g. "L5 - Principal", "Grade A"
  salaryBand: string;  // e.g. "Band 4"
  department: string;  // e.g. "Engineering", "Sales", "All"
  designation: string; // e.g. "Senior Architect", "All"
  location: string;    // e.g. "Bangalore", "Hyderabad", "Global"
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN" | "EXECUTIVE" | "ALL";
  currency: string;
  annualCtc: number;
  monthlyCtc: number;
  grossSalaryMonthly: number;
  netSalaryMonthly: number;
  employerCostMonthly: number;
  grossSalaryFormula: string;
  netSalaryFormula: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED" | "PENDING_APPROVAL";
  version: string; // current active version
  versionCount: number;
  versions: StructureVersion[];
  employeesAssigned: number;
  components: SalaryComponent[];
  approvalStage: "HR" | "PAYROLL_ADMIN" | "FINANCE" | "CFO" | "PUBLISHED";
  approvalWorkflow: ApprovalStep[];
  effectiveFrom: string;
  effectiveTo?: string | null;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  complianceWarnings: string[];
  isLocked?: boolean;
}

export interface SalaryStructurePageMeta {
  companyName: string;
  financialYear: string;
}

export interface SalaryStructureSummaryKPIs {
  totalStructures: number;
  activeStructures: number;
  draftStructures: number;
  archivedStructures: number;
  employeesAssigned: number;
  averageCtc: number;
  totalEmployerCostMonthly: number;
  pendingApprovals: number;
}

export interface SalaryStructureFilters {
  search: string;
  department: string;
  designation: string;
  location: string;
  employmentType: string;
  salaryGrade: string;
  salaryBand: string;
  financialYear: string;
  status: string; // 'ALL' | 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'PENDING_APPROVAL'
  page: number;
  limit: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export interface SalaryStructureAuditLog {
  id: string;
  structureId: string;
  structureName: string;
  action: "CREATE" | "UPDATE" | "CLONE" | "ASSIGN" | "APPROVE" | "ARCHIVE" | "ROLLBACK";
  actorName: string;
  actorRole: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface SalaryStructureAIInsight {
  id: string;
  title: string;
  category: "BENCHMARK" | "COMPRESSION" | "EQUITY" | "FORECAST" | "SUGGESTION" | "COMPLIANCE" | "TAX";
  severity: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
  description: string;
  impactMetric: string;
  recommendation: string;
  appliedCount?: number;
}

export type SidebarTabId =
  | "overview"
  | "templates"
  | "earnings"
  | "allowances"
  | "deductions"
  | "employer_contributions"
  | "benefits"
  | "tax_components"
  | "compliance_rules"
  | "version_history"
  | "assignments"
  | "approval_workflow"
  | "audit_logs";
