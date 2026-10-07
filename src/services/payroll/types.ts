import axios from "axios";

// ── Types ─────────────────────────────────────────────────────────────

export interface PayrollPeriod {
  id: string;
  name: string; // e.g., "April 2026", "March 2026"
  startDate: string;
  endDate: string;
  payDate?: string;
  status?: PayrollStatus;
  employeeCount?: number | null;
  periodMonth?: number;
  periodYear?: number;
  isCurrent?: boolean;
  isLocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  remarks?: string;
  [key: string]: unknown;
}

export interface GetPeriodsParams {
  page?: number;
  limit?: number;
  status?: string;
  year?: number;
  month?: number;
  search?: string;
  company_id?: string;
}

export interface GetPeriodsResponse {
  items: PayrollPeriod[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePeriodPayload {
  name: string;
  startDate: string;
  endDate: string;
  payDate: string;
  periodMonth?: number;
  periodYear?: number;
  remarks?: string;
  companyId?: string;
}

export interface PayrollSummary {
  employeeCount: number | null;
  grossPayroll: number | null;
  totalDeductions: number | null;
  netPayroll: number | null;
  employerCost: number | null;
}

export type PayrollStatus =
  | "Draft"
  | "Open"
  | "Processing"
  | "Provision Generated"
  | "Under Review"
  | "Pending Approval"
  | "Approved"
  | "Finalized"
  | "Closed"
  | "Locked"
  | "Void"
  | "Failed"
  | string;

export type ReadinessStatus = "Ready" | "Warning" | "Error";

export type PayrollReadinessArea =
  | "Employee Data"
  | "Salary Structures"
  | "Attendance"
  | "Leave Data"
  | "Overtime"
  | "Loans / Advances"
  | "Tax / Statutory Configuration";

export interface PayrollReadinessItem {
  area: PayrollReadinessArea;
  status: ReadinessStatus;
  details?: string;
}

export interface PayrollReadiness {
  items: PayrollReadinessItem[];
  isReady?: boolean;
}

export interface PayrollIssue {
  id: string;
  type: "error" | "warning";
  category: string;
  message: string;
  employeeId?: string;
  employeeName?: string;
}

export interface PayrollIssues {
  errors: PayrollIssue[];
  warnings: PayrollIssue[];
}

export interface PayrollRun {
  id: string;
  periodId: string;
  periodName: string;
  employeeCount: number | null;
  grossPayroll: number | null;
  netPayroll: number | null;
  status: PayrollStatus;
  runDate: string | null;
}

export interface PayrollDashboardData {
  period: PayrollPeriod | null;
  summary: PayrollSummary | null;
  status: PayrollStatus | null;
  readiness: PayrollReadiness | null;
  issues: PayrollIssues | null;
  recentRuns: PayrollRun[] | null;
}

export interface RunPayrollResponse {
  success: boolean;
  status?: string;
  message?: string;
  runId?: string;
  [key: string]: unknown;
}

export interface PayrollRunStep {
  id: string;
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed" | string;
  details?: string;
  order?: number;
}

export interface PayrollRunValidationIssue {
  id: string;
  severity: "critical" | "warning" | "info" | string;
  category?: string;
  message: string;
  employeeId?: string;
  employeeName?: string;
  resolved?: boolean;
}

export interface PayrollRunStatus {
  runId: string;
  jobId?: string | null;
  periodId?: string | null;
  periodName?: string | null;
  status: PayrollStatus;
  progress?: number | null;
  currentStep?: string | null;
  employees?: {
    total?: number | null;
    processed?: number | null;
    failed?: number | null;
  } | null;
  steps?: PayrollRunStep[] | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
  validationIssues?: PayrollRunValidationIssue[] | null;
  startedAt?: string | null;
  completedAt?: string | null;
  [key: string]: unknown;
}

export interface CancelRunResponse {
  success: boolean;
  message?: string;
  status?: string;
  [key: string]: unknown;
}

export interface RetryRunResponse {
  success: boolean;
  message?: string;
  runId?: string;
  jobId?: string;
  status?: string;
  [key: string]: unknown;
}

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

export interface PayrollValidationIssue {
  id: string;
  severity: "critical" | "error" | "warning" | "info" | string;
  category?: string;
  code?: string;
  message: string;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  component?: string;
  blocking?: boolean;
  status?: string;
  detectedAt?: string;
  resolved?: boolean;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  source?: string;
  [key: string]: unknown;
}

export interface PayrollValidationSummary {
  runId: string;
  status: string;
  periodName?: string | null;
  periodId?: string | null;
  runStatus?: string | null;
  totalIssues: number;
  errorsCount: number;
  warningsCount: number;
  affectedEmployeesCount: number;
  blockingCount?: number | null;
  lastValidatedAt?: string | null;
  issues: PayrollValidationIssue[];
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

export interface PayrollApprovalInfo {
  status?: string | null;
  approvedBy?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  rejectedBy?: string | null;
  rejectedByName?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  comments?: string | null;
  canApprove?: boolean;
  canReject?: boolean;
  blockingReasons?: string[];
  [key: string]: unknown;
}

export interface PayrollAuditRecord {
  action: string;
  user?: string | null;
  userName?: string | null;
  timestamp?: string | null;
  comment?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
  [key: string]: unknown;
}

export interface PayrollReviewData {
  runId: string;
  periodId?: string | null;
  periodName?: string | null;
  status: PayrollStatus;
  validationStatus?: string | null;
  runDate?: string | null;
  generatedAt?: string | null;
  lastUpdatedAt?: string | null;
  summary: PayrollPreviewSummary | null;
  validation: {
    status?: string | null;
    totalIssues: number;
    errorsCount: number;
    warningsCount: number;
    affectedEmployeesCount: number;
    blockingCount?: number | null;
    issues?: PayrollValidationIssue[];
  } | null;
  approval: PayrollApprovalInfo | null;
  auditLog?: PayrollAuditRecord[] | null;
  [key: string]: unknown;
}

export interface ApprovePayrollPayload {
  comments?: string;
  notes?: string;
}

export interface ApprovePayrollResponse {
  success: boolean;
  message?: string;
  status?: PayrollStatus;
  approval?: PayrollApprovalInfo;
  [key: string]: unknown;
}

export interface RejectPayrollPayload {
  reason: string;
  comments?: string;
}

export interface RejectPayrollResponse {
  success: boolean;
  message?: string;
  status?: PayrollStatus;
  [key: string]: unknown;
}

export interface PayrollFinalizationInfo {
  isFinalized?: boolean;
  isLocked?: boolean;
  finalizedBy?: string | null;
  finalizedByName?: string | null;
  finalizedAt?: string | null;
  finalizationNotes?: string | null;
  referenceNumber?: string | null;
  canFinalize?: boolean;
  blockingReasons?: string[];
  [key: string]: unknown;
}

export interface FinalizePayrollPayload {
  notes?: string;
  lock?: boolean;
}

export interface FinalizePayrollResponse {
  success: boolean;
  message?: string;
  status?: PayrollStatus;
  isFinalized?: boolean;
  isLocked?: boolean;
  finalizedAt?: string | null;
  finalizedBy?: string | null;
  finalization?: PayrollFinalizationInfo;
  [key: string]: unknown;
}

export interface PayrollFinalizationData {
  runId: string;
  periodId?: string | null;
  periodName?: string | null;
  status: PayrollStatus;
  isLocked?: boolean;
  isFinalized?: boolean;
  validationStatus?: string | null;
  approvalStatus?: string | null;
  runDate?: string | null;
  generatedAt?: string | null;
  lastUpdatedAt?: string | null;
  summary: PayrollPreviewSummary | null;
  validation: {
    status?: string | null;
    totalIssues: number;
    errorsCount: number;
    warningsCount: number;
    affectedEmployeesCount: number;
    blockingCount?: number | null;
  } | null;
  approval: PayrollApprovalInfo | null;
  finalization: PayrollFinalizationInfo | null;
  auditLog?: PayrollAuditRecord[] | null;
  [key: string]: unknown;
}

// ── Step 9: Final Payslip Interfaces ──────────────────────────────────

export interface PayrollPayslipEmployeeInfo {
  id: string;
  name: string;
  department?: string | null;
  designation?: string | null;
  location?: string | null;
  joiningDate?: string | null;
  employmentStatus?: string | null;
  pan?: string | null;
  uan?: string | null;
  pfNumber?: string | null;
  esiNumber?: string | null;
  bankInfo?: {
    bankName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
    paymentMode?: string | null;
  } | null;
}

export interface PayrollPayslipEarnings {
  basic?: number | null;
  hra?: number | null;
  conveyance?: number | null;
  specialAllowance?: number | null;
  medicalAllowance?: number | null;
  otherAllowances?: number | null;
  overtime?: number | null;
  bonus?: number | null;
  incentives?: number | null;
  arrears?: number | null;
  reimbursements?: number | null;
  otherEarnings?: number | null;
  grossEarnings?: number | null;
  components?: Array<{
    name: string;
    amount: number | null;
    type?: string | null;
    frequency?: string | null;
  }>;
}

export interface PayrollPayslipDeductions {
  pf?: number | null;
  esi?: number | null;
  pt?: number | null;
  tds?: number | null;
  loan?: number | null;
  advance?: number | null;
  otherDeductions?: number | null;
  totalDeductions?: number | null;
  components?: Array<{
    name: string;
    amount: number | null;
    type?: string | null;
  }>;
}

export interface PayrollPayslipStatutory {
  employeePf?: number | null;
  employerPf?: number | null;
  employeeEsi?: number | null;
  employerEsi?: number | null;
  pt?: number | null;
  tds?: number | null;
  eps?: number | null;
  edli?: number | null;
  other?: Record<string, unknown> | number | null;
}

export interface PayrollPayslipEmployerContributions {
  pf?: number | null;
  esi?: number | null;
  eps?: number | null;
  edli?: number | null;
  total?: number | null;
  components?: Array<{ name: string; amount: number | null }>;
}

export interface PayrollPayslipAttendance {
  workingDays?: number | null;
  paidDays?: number | null;
  lopDays?: number | null;
  leaveDays?: number | null;
  presentDays?: number | null;
  holidays?: number | null;
  weeklyOffs?: number | null;
  overtimeHours?: number | null;
  [key: string]: unknown;
}

export interface PayrollPayslipYTD {
  grossEarnings?: number | null;
  taxableIncome?: number | null;
  tds?: number | null;
  employeePf?: number | null;
  employerPf?: number | null;
  esi?: number | null;
  netPay?: number | null;
  [key: string]: unknown;
}

export interface PayrollPayslipDocument {
  pdfUrl?: string | null;
  downloadUrl?: string | null;
  documentId?: string | null;
  hasDocument?: boolean;
  mimeType?: string | null;
}

export interface PayrollPayslipData {
  id: string;
  runId: string;
  employeeId: string;
  payslipNumber?: string | null;
  referenceNumber?: string | null;
  periodName?: string | null;
  periodId?: string | null;
  financialYear?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  paymentDate?: string | null;
  finalizedAt?: string | null;
  finalizedByName?: string | null;
  status: string;
  isFinalized: boolean;
  isLocked?: boolean;
  employee: PayrollPayslipEmployeeInfo;
  attendance: PayrollPayslipAttendance;
  earnings: PayrollPayslipEarnings;
  deductions: PayrollPayslipDeductions;
  statutory?: PayrollPayslipStatutory | null;
  employerContributions?: PayrollPayslipEmployerContributions | null;
  netPay: number | null;
  netPayInWords?: string | null;
  salaryStructure?: {
    name?: string | null;
    effectiveDate?: string | null;
    components?: Record<string, unknown> | null;
  } | null;
  ytd?: PayrollPayslipYTD | null;
  document?: PayrollPayslipDocument | null;
  notes?: string | null;
  [key: string]: unknown;
}

export interface PayslipHistoryItem {
  id: string;
  runId?: string | null;
  employeeId?: string | null;
  employeeName?: string | null;
  department?: string | null;
  periodName?: string | null;
  financialYear?: string | null;
  payslipNumber?: string | null;
  netPay?: number | null;
  grossEarnings?: number | null;
  totalDeductions?: number | null;
  status?: string | null;
  isFinalized?: boolean;
  finalizedAt?: string | null;
  paymentDate?: string | null;
  hasDocument?: boolean;
  [key: string]: unknown;
}

export interface GeneratePayslipsPayload {
  employeeIds?: string[];
  force?: boolean;
  format?: "pdf" | "html" | string;
}

export interface GeneratePayslipsResponse {
  success: boolean;
  message?: string;
  generatedCount?: number;
  totalCount?: number;
  documentIds?: string[];
  [key: string]: unknown;
}