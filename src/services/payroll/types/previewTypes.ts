import type { PayrollStatus } from "./runTypes";

export interface PayrollPreviewSummary {
  employeeCount: number | null;
  grossPayroll: number | null;
  totalEarnings?: number | null;
  totalDeductions: number | null;
  netPayroll: number | null;
  employerCost: number | null;
  employerContribution?: number | null;
  [key: string]: unknown;
}

export interface PayrollEmployeeEarnings {
  basic?: number | null;
  hra?: number | null;
  allowances?: number | null;
  specialAllowance?: number | null;
  conveyance?: number | null;
  overtime?: number | null;
  bonus?: number | null;
  incentives?: number | null;
  other?: number | null;
  [key: string]: unknown;
}

export interface PayrollEmployeeDeductions {
  pf?: number | null;
  esi?: number | null;
  pt?: number | null; // Professional Tax
  tds?: number | null; // Income Tax
  incomeTax?: number | null;
  loan?: number | null;
  advance?: number | null;
  other?: number | null;
  [key: string]: unknown;
}

export interface PayrollEmployeeAttendance {
  workingDays?: number | null;
  paidDays?: number | null;
  unpaidDays?: number | null;
  leaveDays?: number | null;
  overtimeHours?: number | null;
  lopDays?: number | null;
  [key: string]: unknown;
}

export interface PayrollPreviewEmployee {
  id: string;
  employeeId: string;
  name: string;
  email?: string;
  designation?: string;
  department?: string;
  location?: string;
  grossEarnings: number | null;
  totalDeductions: number | null;
  netPay: number | null;
  employerContribution?: number | null;
  status?: string;
  validationStatus?: "valid" | "warning" | "error" | string;
  issuesCount?: number;
  issues?: Array<{
    id?: string;
    severity?: string;
    message: string;
  }>;
  earnings?: PayrollEmployeeEarnings;
  deductions?: PayrollEmployeeDeductions;
  attendance?: PayrollEmployeeAttendance;
  joiningDate?: string | null;
  employmentStatus?: string | null;
  financialYear?: string | null;
  periodName?: string | null;
  periodId?: string | null;
  runStatus?: string | null;
  calculationStatus?: string | null;
  statutory?: {
    employee?: {
      epf?: number | null;
      esi?: number | null;
      pt?: number | null;
      other?: number | null;
    };
    employer?: {
      epf?: number | null;
      esi?: number | null;
      eps?: number | null;
      edli?: number | null;
      other?: number | null;
    };
  } | null;
  salaryStructure?: {
    name?: string;
    effectiveDate?: string;
    basic?: number | null;
    allowances?: number | null;
    components?: Record<string, unknown>;
  } | null;
  ytd?: {
    gross?: number | null;
    deductions?: number | null;
    tax?: number | null;
    employeeContributions?: number | null;
    employerContributions?: number | null;
    netPay?: number | null;
  } | null;
  previousComparison?: {
    previousGross?: number | null;
    currentGross?: number | null;
    previousDeductions?: number | null;
    currentDeductions?: number | null;
    previousNetPay?: number | null;
    currentNetPay?: number | null;
  } | null;
  audit?: {
    calculatedAt?: string | null;
    lastRecalculatedAt?: string | null;
    version?: string | null;
    source?: string | null;
  } | null;
  bankInfo?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    paymentMode?: string;
  } | null;
  [key: string]: unknown;
}

export interface GetRunEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  validationStatus?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface GetRunEmployeesResponse {
  items: PayrollPreviewEmployee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PayrollPreviewValidationIssue {
  id: string;
  category?: string;
  message: string;
  employeeId?: string;
  employeeName?: string;
}

export interface PayrollPreviewData {
  runId: string;
  periodId?: string | null;
  periodName?: string | null;
  status: PayrollStatus;
  runDate?: string | null;
  generatedAt?: string | null;
  summary: PayrollPreviewSummary | null;
  validation?: {
    errors: PayrollPreviewValidationIssue[];
    warnings: PayrollPreviewValidationIssue[];
  } | null;
  [key: string]: unknown;
}