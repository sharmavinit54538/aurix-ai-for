/**
 * Payroll Reports & Exports Type Definitions and Central Registry.
 *
 * All report data, column definitions, and file exports are backend-driven.
 * Strictly adheres to Zero Production Mock Data and CSV injection mitigation.
 */

export type ReportKey =
  | "payroll_register"
  | "salary_statement"
  | "department_payroll"
  | "cost_center_payroll"
  | "bank_advice"
  | "payroll_variance"
  | "headcount_report"
  | "ytd_payroll"
  | "accounting_export";

export type ExportFormat = "csv" | "xlsx" | "pdf";

export type ComparisonMode =
  | "none"
  | "previous_period"
  | "previous_year"
  | "mom"
  | "qoq"
  | "yoy"
  | "custom";

export interface ReportFilterConfig {
  periodId?: string;
  financialYear?: string;
  month?: number;
  year?: number;
  dateFrom?: string;
  dateTo?: string;
  runId?: string;
  employeeId?: string;
  employeeStatus?: "active" | "inactive" | "terminated" | "on_leave";
  department?: string;
  designation?: string;
  branch?: string;
  workLocation?: string;
  location?: string;
  costCenter?: string;
  employmentType?: "full_time" | "part_time" | "contract" | "intern";
  payrollStatus?: string;
  paymentStatus?: string;
  paymentMode?: string;
  comparisonPeriodId?: string;
  comparisonMode?: ComparisonMode;
  comparePreviousPeriod?: boolean;
  comparePreviousYear?: boolean;
  cutoffDate?: string;
  search?: string;
}

export interface ReportColumnDef {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  isCurrency?: boolean;
  isDate?: boolean;
  isSensitive?: boolean;
}

export interface ReportRegistryItem {
  key: ReportKey;
  title: string;
  description: string;
  category: "operational" | "financial" | "compliance" | "variance";
  requiredPermission: string;
  allowedFormats: ExportFormat[];
  supportedFilters: Array<keyof ReportFilterConfig>;
  columns: ReportColumnDef[];
}

export interface ReportDataResponse {
  reportKey: ReportKey;
  title: string;
  generatedAt: string;
  periodLabel?: string;
  filtersApplied: ReportFilterConfig;
  totalRecords: number;
  page: number;
  limit: number;
  columns: ReportColumnDef[];
  rows: Record<string, unknown>[];
  summaryTotals?: Record<string, number | string | null>;
  kpiCards?: Array<Record<string, unknown>>;
  charts?: Array<Record<string, unknown>>;
  reconciliation?: Record<string, unknown>;
}

export interface AccountingExportEntry {
  id: string;
  payrollRunId: string;
  payrollRunReference?: string;
  payrollPeriod?: string;
  accountCode: string;
  accountName: string;
  accountType:
    | "earning"
    | "deduction"
    | "employer_contribution"
    | "bank_clearing"
    | "net_payable"
    | string;
  costCenter?: string;
  department?: string;
  accountingDate: string;
  debitAmountPaise: number;
  creditAmountPaise: number;
  debitFormatted: string;
  creditFormatted: string;
  referenceDescription: string;
  postingStatus?: string;
  accountingReference?: string;
  isMapped?: boolean;
}

export interface AccountingExportResponse {
  payrollRunId: string;
  periodName: string;
  accountingDate: string;
  totalDebitPaise: number;
  totalCreditPaise: number;
  isBalanced: boolean;
  unmappedCount?: number;
  postedCount?: number;
  pendingCount?: number;
  entries: AccountingExportEntry[];
}

// ── Central Report Registry ──────────────────────────────────────────
export const REPORT_REGISTRY: Record<ReportKey, ReportRegistryItem> = {
  payroll_register: {
    key: "payroll_register",
    title: "Payroll Register",
    description: "Complete employee-level salary calculation ledger for the selected cycle.",
    category: "operational",
    requiredPermission: "payroll.reports",
    allowedFormats: ["csv", "xlsx", "pdf"],
    supportedFilters: [
      "month",
      "year",
      "financialYear",
      "dateFrom",
      "dateTo",
      "periodId",
      "runId",
      "department",
      "designation",
      "employeeId",
      "employmentType",
      "branch",
      "workLocation",
      "costCenter",
      "payrollStatus",
    ],
    columns: [
      { key: "employeeCode", label: "Emp Code" },
      { key: "employeeName", label: "Employee Name" },
      { key: "department", label: "Department" },
      { key: "basicPay", label: "Basic", align: "right", isCurrency: true },
      { key: "hra", label: "HRA", align: "right", isCurrency: true },
      { key: "allowances", label: "Allowances", align: "right", isCurrency: true },
      { key: "grossEarnings", label: "Gross Earnings", align: "right", isCurrency: true },
      { key: "pfDeduction", label: "PF", align: "right", isCurrency: true },
      { key: "esiDeduction", label: "ESI", align: "right", isCurrency: true },
      { key: "ptDeduction", label: "PT", align: "right", isCurrency: true },
      { key: "tdsDeduction", label: "TDS", align: "right", isCurrency: true },
      { key: "totalDeductions", label: "Total Deductions", align: "right", isCurrency: true },
      { key: "netPay", label: "Net Pay", align: "right", isCurrency: true },
    ],
  },
  salary_statement: {
    key: "salary_statement",
    title: "Salary Statement",
    description:
      "Official summary statement of earnings, variable pay, and statutory withholdings.",
    category: "financial",
    requiredPermission: "payroll.reports",
    allowedFormats: ["csv", "xlsx", "pdf"],
    supportedFilters: [
      "month",
      "year",
      "financialYear",
      "periodId",
      "runId",
      "department",
      "designation",
      "employeeId",
      "employmentType",
      "branch",
      "workLocation",
      "payrollStatus",
    ],
    columns: [
      { key: "employeeCode", label: "Emp Code" },
      { key: "employeeName", label: "Employee Name" },
      { key: "department", label: "Department" },
      { key: "designation", label: "Designation" },
      { key: "bankName", label: "Bank" },
      { key: "accountNumberMasked", label: "Account No.", isSensitive: true },
      { key: "grossPay", label: "Gross Pay", align: "right", isCurrency: true },
      { key: "deductions", label: "Total Deductions", align: "right", isCurrency: true },
      { key: "netPayable", label: "Net Payable", align: "right", isCurrency: true },
    ],
  },
  department_payroll: {
    key: "department_payroll",
    title: "Department-wise Payroll",
    description:
      "Aggregated compensation costs and statutory burden grouped by organizational unit.",
    category: "financial",
    requiredPermission: "payroll.reports",
    allowedFormats: ["csv", "xlsx", "pdf"],
    supportedFilters: [
      "month",
      "year",
      "financialYear",
      "dateFrom",
      "dateTo",
      "periodId",
      "runId",
      "department",
      "branch",
      "workLocation",
      "employmentType",
      "payrollStatus",
    ],
    columns: [
      { key: "departmentName", label: "Department" },
      { key: "headcount", label: "Headcount", align: "right" },
      { key: "totalGross", label: "Total Gross", align: "right", isCurrency: true },
      { key: "totalDeductions", label: "Total Deductions", align: "right", isCurrency: true },
      { key: "totalNet", label: "Total Net", align: "right", isCurrency: true },
      { key: "employerCost", label: "Total CTC Burden", align: "right", isCurrency: true },
    ],
  },
  cost_center_payroll: {
    key: "cost_center_payroll",
    title: "Cost Center-wise Payroll",
    description:
      "Financial allocation breakdown, budget variance, and cost share by cost center.",
    category: "financial",
    requiredPermission: "payroll.reports",
    allowedFormats: ["csv", "xlsx", "pdf"],
    supportedFilters: [
      "month",
      "year",
      "financialYear",
      "periodId",
      "runId",
      "costCenter",
      "department",
      "branch",
      "payrollStatus",
    ],
    columns: [
      { key: "costCenterCode", label: "Cost Center Code" },
      { key: "costCenterName", label: "Cost Center Name" },
      { key: "employeeCount", label: "Employees", align: "right" },
      { key: "directSalary", label: "Direct Salary", align: "right", isCurrency: true },
      { key: "benefitsCost", label: "Employer Contributions", align: "right", isCurrency: true },
      { key: "allocatedTotal", label: "Allocated Total", align: "right", isCurrency: true },
    ],
  },
  bank_advice: {
    key: "bank_advice",
    title: "Bank Advice Report",
    description:
      "Schedule of bank transfers detailing beneficiary accounts, UTRs, and payment reconciliation.",
    category: "operational",
    requiredPermission: "payroll.disburse",
    allowedFormats: ["csv", "xlsx", "pdf"],
    supportedFilters: [
      "month",
      "year",
      "financialYear",
      "periodId",
      "runId",
      "department",
      "employeeId",
      "branch",
      "paymentStatus",
      "paymentMode",
    ],
    columns: [
      { key: "employeeCode", label: "Emp Code" },
      { key: "beneficiaryName", label: "Beneficiary Name" },
      { key: "bankName", label: "Bank Name" },
      { key: "accountNumberMasked", label: "Account No.", isSensitive: true },
      { key: "ifscCode", label: "IFSC Code" },
      { key: "amount", label: "Disbursement Amount", align: "right", isCurrency: true },
      { key: "paymentStatus", label: "Status" },
      { key: "utr", label: "UTR Number" },
    ],
  },
  payroll_variance: {
    key: "payroll_variance",
    title: "Payroll Variance Report",
    description:
      "Comparative delta analysis between current and prior payroll cycles with variance drivers.",
    category: "variance",
    requiredPermission: "payroll.reports",
    allowedFormats: ["csv", "xlsx", "pdf"],
    supportedFilters: [
      "month",
      "year",
      "financialYear",
      "dateFrom",
      "dateTo",
      "periodId",
      "runId",
      "department",
      "designation",
      "employeeId",
      "employmentType",
      "comparisonMode",
      "comparisonPeriodId",
    ],
    columns: [
      { key: "componentName", label: "Employee / Component" },
      { key: "previousMonth", label: "Previous Cycle", align: "right", isCurrency: true },
      { key: "currentMonth", label: "Current Cycle", align: "right", isCurrency: true },
      { key: "varianceAmount", label: "Variance Amount", align: "right", isCurrency: true },
      { key: "variancePercentage", label: "Variance %", align: "right" },
      { key: "explanation", label: "Change Reason" },
    ],
  },
  headcount_report: {
    key: "headcount_report",
    title: "Headcount Report",
    description:
      "Historical reconciliation of opening headcount, joiners, exits, and paid employees.",
    category: "operational",
    requiredPermission: "payroll.reports",
    allowedFormats: ["csv", "xlsx", "pdf"],
    supportedFilters: [
      "month",
      "year",
      "financialYear",
      "dateFrom",
      "dateTo",
      "periodId",
      "department",
      "designation",
      "employmentType",
      "branch",
      "workLocation",
      "payrollStatus",
    ],
    columns: [
      { key: "department", label: "Department" },
      { key: "openingCount", label: "Opening Count", align: "right" },
      { key: "joinersCount", label: "New Joiners", align: "right" },
      { key: "exitsCount", label: "Exits", align: "right" },
      { key: "closingCount", label: "Closing Count", align: "right" },
      { key: "processedInPayroll", label: "Paid Headcount", align: "right" },
    ],
  },
  ytd_payroll: {
    key: "ytd_payroll",
    title: "YTD Payroll Summary",
    description:
      "Indian FY (Apr–Mar) cumulative earnings, statutory deductions, and employer contributions.",
    category: "compliance",
    requiredPermission: "payroll.reports",
    allowedFormats: ["csv", "xlsx", "pdf"],
    supportedFilters: [
      "financialYear",
      "month",
      "cutoffDate",
      "employeeId",
      "department",
      "designation",
      "employmentType",
      "branch",
      "workLocation",
      "costCenter",
    ],
    columns: [
      { key: "employeeCode", label: "Emp Code" },
      { key: "employeeName", label: "Employee Name" },
      { key: "department", label: "Department" },
      { key: "ytdGross", label: "YTD Gross", align: "right", isCurrency: true },
      { key: "ytdPf", label: "YTD PF", align: "right", isCurrency: true },
      { key: "ytdTds", label: "YTD TDS", align: "right", isCurrency: true },
      { key: "ytdNet", label: "YTD Net Paid", align: "right", isCurrency: true },
    ],
  },
  accounting_export: {
    key: "accounting_export",
    title: "Accounting Journal Export",
    description: "General ledger double-entry journal balancing debit and credit allocations.",
    category: "financial",
    requiredPermission: "payroll.reports",
    allowedFormats: ["csv", "xlsx", "pdf"],
    supportedFilters: [
      "month",
      "year",
      "financialYear",
      "periodId",
      "runId",
      "department",
      "costCenter",
      "payrollStatus",
    ],
    columns: [
      { key: "accountCode", label: "GL Account Code" },
      { key: "accountName", label: "GL Account Name" },
      { key: "accountType", label: "Ledger Type" },
      { key: "department", label: "Department" },
      { key: "costCenter", label: "Cost Center" },
      { key: "debitFormatted", label: "Debit (INR)", align: "right" },
      { key: "creditFormatted", label: "Credit (INR)", align: "right" },
      { key: "referenceDescription", label: "Narration" },
    ],
  },
};
