/**
 * Payroll Report Analytics Type Definitions.
 * Types for the enterprise payroll analytics dashboard with
 * KPI cards, interactive charts, drill-downs, and reconciliation metadata.
 */

import type { ReportKey, ReportFilterConfig, ComparisonMode } from "./reports";

export interface ReportKpiCard {
  id: string;
  label: string;
  value: string | number | null;
  formattedValue: string;
  previousValue?: string | number | null;
  previousFormattedValue?: string;
  changePercent?: number | null;
  changeDirection?: "up" | "down" | "flat";
  secondaryLabel?: string;
  secondaryValue?: string;
  filterKey?: keyof ReportFilterConfig;
  filterValue?: string;
  accentColor?: "brand" | "success" | "warning" | "danger" | "muted";
  statusNote?: string;
}

export interface ReportDashboardKpi {
  reportKey: ReportKey;
  title: string;
  description: string;
  primaryKpiLabel: string;
  primaryKpiValue: string;
  primaryKpiRawValue?: number | null;
  secondaryLabel?: string;
  secondaryValue?: string;
  previousPeriodValue?: string;
  changePercent?: number | null;
  changeDirection?: "up" | "down" | "flat";
  recordCount?: number | null;
  lastUpdated?: string;
  sourceStatus?: "ok" | "unavailable" | "error";
  sourceError?: string;
}

export interface ChartDataPoint {
  label: string;
  filterKey?: string;
  filterValue?: string;
  [key: string]: string | number | null | undefined;
}

export interface ChartSeries {
  dataKey: string;
  name: string;
  color: string;
  type?: "line" | "bar" | "area";
  stackId?: string;
}

export interface ReportChartData {
  chartId: string;
  title: string;
  subtitle?: string;
  chartType:
    | "line"
    | "bar"
    | "horizontal_bar"
    | "grouped_bar"
    | "stacked_bar"
    | "donut"
    | "pie"
    | "histogram"
    | "waterfall";
  data: ChartDataPoint[];
  series: ChartSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  formatType?: "currency" | "number" | "percentage";
  drillDownFilterKey?: keyof ExtendedReportFilterConfig;
}

export interface ReportReconciliationSummary {
  title: string;
  isBalanced: boolean;
  items: Array<{
    label: string;
    value: string;
    tone?: "default" | "success" | "warning" | "danger";
  }>;
  discrepancyMessage?: string | null;
}

export interface ReportAnalyticsResponse {
  reportKey: ReportKey;
  title: string;
  description: string;
  generatedAt: string;
  periodLabel: string;
  filtersApplied: ReportFilterConfig;
  kpiCards: ReportKpiCard[];
  charts: ReportChartData[];
  summaryTotals?: Record<string, number | string | null>;
  reconciliation?: ReportReconciliationSummary | null;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  meta?: Record<string, unknown>;
}

export interface ReportFilterOptions {
  departments: FilterOption[];
  designations: FilterOption[];
  locations: FilterOption[];
  branches: FilterOption[];
  costCenters: FilterOption[];
  employmentTypes: FilterOption[];
  payrollPeriods: FilterOption[];
  payrollRuns: FilterOption[];
  payrollStatuses: FilterOption[];
  paymentStatuses: FilterOption[];
  paymentModes: FilterOption[];
  financialYears: FilterOption[];
  employees: FilterOption[];
}

export interface ExtendedReportFilterConfig extends ReportFilterConfig {
  year?: number;
  month?: number;
  dateFrom?: string;
  dateTo?: string;
  runId?: string;
  branch?: string;
  workLocation?: string;
  paymentMode?: string;
  comparisonPeriodId?: string;
  comparisonMode?: ComparisonMode;
  comparePreviousPeriod?: boolean;
  comparePreviousYear?: boolean;
  cutoffDate?: string;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ComponentBreakdown {
  code: string;
  name: string;
  type: "earning" | "deduction" | "employer_contribution";
  amountPaise: number;
  amountFormatted: string;
  percentage?: number;
}

export interface EmployeePayrollDetail {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  employmentType: string;
  salaryStructure?: string;
  periodLabel: string;
  runId?: string;
  workingDays?: number | null;
  paidDays?: number | null;
  lwpDays?: number | null;
  earnings: ComponentBreakdown[];
  deductions: ComponentBreakdown[];
  employerContributions: ComponentBreakdown[];
  grossEarnings: number | null;
  grossEarningsFormatted: string;
  totalDeductions: number | null;
  totalDeductionsFormatted: string;
  netSalary: number | null;
  netSalaryFormatted: string;
  employerCost: number | null;
  employerCostFormatted: string;
  totalCost: number | null;
  totalCostFormatted: string;
  payrollStatus: string;
  paymentStatus?: string;
  bankInfo?: {
    bankName?: string;
    accountNumberMasked?: string;
    ifscCode?: string;
    paymentMode?: string;
    utr?: string;
  } | null;
  previousComparison?: {
    previousGross?: number | null;
    currentGross?: number | null;
    previousDeductions?: number | null;
    currentDeductions?: number | null;
    previousNetPay?: number | null;
    currentNetPay?: number | null;
  } | null;
}

export interface ReportRouteConfig {
  key: ReportKey;
  title: string;
  path: string;
  icon: string;
  description: string;
  primaryKpiTitle: string;
}

export const REPORT_ROUTES: ReportRouteConfig[] = [
  {
    key: "payroll_register",
    title: "Payroll Register",
    path: "/dashboard/payroll/reports/payroll-register",
    icon: "FileText",
    description: "Complete employee-level salary calculation ledger",
    primaryKpiTitle: "Total Gross Payroll",
  },
  {
    key: "salary_statement",
    title: "Salary Statement",
    path: "/dashboard/payroll/reports/salary-statement",
    icon: "Receipt",
    description: "Official earnings and statutory withholdings summary",
    primaryKpiTitle: "Total Net Salary",
  },
  {
    key: "department_payroll",
    title: "Department-wise Payroll",
    path: "/dashboard/payroll/reports/department-wise",
    icon: "Building2",
    description: "Compensation costs grouped by department",
    primaryKpiTitle: "Total Department Cost",
  },
  {
    key: "cost_center_payroll",
    title: "Cost Center-wise Payroll",
    path: "/dashboard/payroll/reports/cost-center-wise",
    icon: "Layers",
    description: "Financial allocation and budget variance by cost center",
    primaryKpiTitle: "Allocated Payroll Cost",
  },
  {
    key: "bank_advice",
    title: "Bank Advice Report",
    path: "/dashboard/payroll/reports/bank-advice",
    icon: "Landmark",
    description: "Bank transfer schedule, UTRs, and disbursement reconciliation",
    primaryKpiTitle: "Total Payable Amount",
  },
  {
    key: "payroll_variance",
    title: "Payroll Variance Report",
    path: "/dashboard/payroll/reports/variance",
    icon: "ArrowLeftRight",
    description: "Period-over-period payroll comparison analysis",
    primaryKpiTitle: "Net Payroll Difference",
  },
  {
    key: "headcount_report",
    title: "Headcount Report",
    path: "/dashboard/payroll/reports/headcount",
    icon: "Users",
    description: "Workforce and payroll headcount reconciliation",
    primaryKpiTitle: "Closing Headcount",
  },
  {
    key: "ytd_payroll",
    title: "YTD Payroll Summary",
    path: "/dashboard/payroll/reports/ytd-summary",
    icon: "TrendingUp",
    description: "Indian FY (Apr–Mar) cumulative payroll and statutory summary",
    primaryKpiTitle: "YTD Gross Earnings",
  },
  {
    key: "accounting_export",
    title: "Accounting Journal Export",
    path: "/dashboard/payroll/reports/accounting-journal",
    icon: "BookOpen",
    description: "Double-entry GL journal balancing debit and credit entries",
    primaryKpiTitle: "Total Journal Debit",
  },
];
