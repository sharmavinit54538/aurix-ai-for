import apiInstance from "@/api/apiInstance";
import axios from "axios";
import { ApiError } from "@/api/client";

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
  other?: Record<string, any> | null;
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

// ── Helper to extract API data safely ─────────────────────────────────

function extractData<T = unknown>(res: unknown): T {
  const r = res as { data?: unknown; status?: number; headers?: unknown } | undefined;
  const body =
    r?.data !== undefined && (r?.status !== undefined || r?.headers !== undefined) ? r.data : res;

  if (body == null) return null as unknown as T;

  if (typeof body === "object") {
    const b = body as Record<string, unknown>;
    if ("data" in b && b.data !== undefined) return b.data as T;
    if ("result" in b && b.result !== undefined) return b.result as T;
  }

  return body as T;
}

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function normalizePayrollPeriod(item: unknown): PayrollPeriod {
  if (!item || typeof item !== "object") {
    return {
      id: "",
      name: "",
      startDate: "",
      endDate: "",
    };
  }

  const it = item as Record<string, unknown>;
  const id = String(it.id || it.cycle_id || it.period_id || it._id || "");
  const month = Number(it.period_month ?? it.month ?? 0) || undefined;
  const year = Number(it.period_year ?? it.year ?? 0) || undefined;

  let name = String(it.name || it.period_name || it.title || "");
  if (!name && month && year) {
    name = `${MONTH_NAMES[month] || `Month ${month}`} ${year}`;
  } else if (!name && (it.startDate || it.start_date)) {
    name = String(it.startDate || it.start_date);
  }

  const startDate = String(it.startDate || it.start_date || "");
  const endDate = String(it.endDate || it.end_date || "");
  const payDate = String(it.payDate || it.pay_date || "");
  const rawStatus = (it.status || (it.is_locked ? "Locked" : "Open")) as PayrollStatus;
  const employeeCount = it.employeeCount ?? it.employee_count ?? it.total_employees ?? null;
  const isLocked = Boolean(
    it.is_locked ||
    it.isLocked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );
  const isCurrent = Boolean(it.isCurrent || it.is_current);
  const createdAt = String(it.createdAt || it.created_at || "");
  const updatedAt = String(it.updatedAt || it.updated_at || "");
  const remarks = String(it.remarks || it.notes || "");

  return {
    id,
    name: name || "Unnamed Period",
    startDate,
    endDate,
    payDate,
    status: rawStatus,
    employeeCount: employeeCount != null ? Number(employeeCount) : null,
    periodMonth: month,
    periodYear: year,
    isCurrent,
    isLocked,
    createdAt,
    updatedAt,
    remarks,
  };
}

export function normalizePayrollRunStatus(runId: string, raw: unknown): PayrollRunStatus {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Processing",
    };
  }

  const r = raw as Record<string, unknown>;
  const status = (
    r.status ||
    r.run_status ||
    r.state ||
    r.job_status ||
    (r.is_completed ? "Completed" : r.is_failed ? "Failed" : "Processing")
  ) as PayrollStatus;

  const periodId = (r.periodId || r.period_id || r.cycleId || r.cycle_id || null) as string | null;
  const periodName = (r.periodName || r.period_name || r.cycle_name || r.name || null) as string | null;
  const jobId = (r.jobId || r.job_id || r.id || null) as string | null;

  // Real progress ONLY if provided as number
  let progress: number | null = null;
  if (typeof r.progress === "number" && !isNaN(r.progress)) {
    progress = Math.min(100, Math.max(0, r.progress));
  } else if (typeof r.percentage === "number" && !isNaN(r.percentage)) {
    progress = Math.min(100, Math.max(0, r.percentage));
  } else if (typeof r.percent_complete === "number" && !isNaN(r.percent_complete)) {
    progress = Math.min(100, Math.max(0, r.percent_complete));
  }

  const currentStep = (r.currentStep || r.current_step || r.step || r.operation || null) as string | null;

  // Real employees count ONLY if provided
  let employees: PayrollRunStatus["employees"] = null;
  const rawEmp = (r.employees || r.employee_counts || r.stats) as Record<string, unknown> | undefined;
  if (rawEmp && typeof rawEmp === "object") {
    employees = {
      total: (rawEmp.total ?? rawEmp.total_employees ?? r.totalEmployees ?? null) as number | null,
      processed: (rawEmp.processed ?? rawEmp.processed_count ?? r.processedEmployees ?? null) as number | null,
      failed: (rawEmp.failed ?? rawEmp.failed_count ?? null) as number | null,
    };
  } else if (
    r.totalEmployees != null ||
    r.processedEmployees != null ||
    r.employee_count != null
  ) {
    employees = {
      total: (r.totalEmployees ?? r.employee_count ?? r.total_count ?? null) as number | null,
      processed: (r.processedEmployees ?? r.processed_count ?? null) as number | null,
      failed: (r.failedEmployees ?? null) as number | null,
    };
  }

  // Steps if provided by backend
  let steps: PayrollRunStep[] | null = null;
  const rawSteps = r.steps || r.pipeline_steps || r.operations;
  if (Array.isArray(rawSteps)) {
    steps = rawSteps.map((s: unknown, idx: number) => {
      const step = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
      return {
        id: String(step.id || step.step_id || `step-${idx}`),
        name: String(step.name || step.title || step.step_name || `Step ${idx + 1}`),
        status: String(step.status || step.state || "pending"),
        details: (step.details || step.message || undefined) as string | undefined,
        order: step.order != null ? Number(step.order) : idx,
      };
    });
  }

  // Error details if provided by backend
  let error: PayrollRunStatus["error"] = null;
  if (r.error) {
    if (typeof r.error === "string") {
      error = { message: r.error };
    } else if (typeof r.error === "object") {
      const errObj = r.error as Record<string, unknown>;
      error = {
        code: (errObj.code || errObj.error_code) as string | undefined,
        message: String(errObj.message || errObj.detail || r.error),
      };
    }
  } else if (r.errorMessage || r.error_message) {
    error = { message: String(r.errorMessage || r.error_message) };
  }

  // Validation issues if provided by backend
  let validationIssues: PayrollRunValidationIssue[] | null = null;
  const rawIssues = r.validationIssues || r.validation_issues || r.issues;
  if (Array.isArray(rawIssues)) {
    validationIssues = rawIssues.map((iss: unknown, idx: number) => {
      const item = (iss && typeof iss === "object" ? iss : {}) as Record<string, unknown>;
      return {
        id: String(item.id || `issue-${idx}`),
        severity: String(item.severity || item.level || "warning"),
        category: (item.category || item.type || "General") as string,
        message: String(item.message || item.description || ""),
        employeeId: (item.employeeId || item.employee_id) as string | undefined,
        employeeName: (item.employeeName || item.employee_name) as string | undefined,
        resolved: Boolean(item.resolved),
      };
    });
  }

  return {
    runId,
    jobId,
    periodId,
    periodName,
    status,
    progress,
    currentStep,
    employees,
    steps,
    error,
    validationIssues,
    startedAt: (r.startedAt || r.started_at || null) as string | null,
    completedAt: (r.completedAt || r.completed_at || null) as string | null,
    ...r,
  };
}

export function normalizePayrollEmployee(item: unknown): PayrollPreviewEmployee {
  if (!item || typeof item !== "object") {
    return {
      id: "",
      employeeId: "",
      name: "Unknown Employee",
      grossEarnings: null,
      totalDeductions: null,
      netPay: null,
    };
  }

  const it = item as Record<string, unknown>;
  const id = String(it.id || it._id || it.employee_id || it.employeeId || "");
  const employeeId = String(
    it.employeeId || it.employee_id || it.emp_id || it.employee_code || it.code || id,
  );
  const name =
    (it.name ||
      it.employee_name ||
      it.employeeName ||
      (it.first_name ? `${it.first_name} ${it.last_name || ""}`.trim() : "") ||
      "Unnamed Employee") as string;
  const email = (it.email || it.work_email || undefined) as string | undefined;
  const designation = (it.designation || it.job_title || it.role || undefined) as string | undefined;
  const department = (it.department || it.dept || it.department_name || undefined) as string | undefined;
  const location = (it.location || it.branch || it.city || undefined) as string | undefined;

  const grossEarnings =
    it.grossEarnings ??
    it.gross_earnings ??
    it.grossSalary ??
    it.gross_salary ??
    it.gross ??
    null;
  const totalDeductions =
    it.totalDeductions ??
    it.total_deductions ??
    it.deductions_total ??
    it.deductions ??
    null;
  const netPay =
    it.netPay ?? it.net_pay ?? it.netSalary ?? it.net_salary ?? it.net ?? null;
  const employerContribution =
    it.employerContribution ?? it.employer_contribution ?? it.employer_cost ?? null;

  const status = (it.status || it.payroll_status || "Processed") as string;
  const validationStatus = (
    it.validationStatus || it.validation_status || (it.has_issues ? "warning" : "valid")
  ) as string;

  // Earnings breakdown if present
  const rawEarnings = (it.earnings || (it.salary_breakdown as Record<string, unknown> | undefined)?.earnings || (it.components as Record<string, unknown> | undefined)?.earnings) as Record<string, unknown> | undefined;
  const earnings: PayrollEmployeeEarnings | undefined = rawEarnings
    ? {
        basic: (rawEarnings.basic ?? rawEarnings.basic_monthly ?? null) as number | null,
        hra: (rawEarnings.hra ?? rawEarnings.hra_monthly ?? null) as number | null,
        allowances: (rawEarnings.allowances ?? rawEarnings.other_allowances ?? null) as number | null,
        specialAllowance: (rawEarnings.specialAllowance ?? rawEarnings.special_allowance ?? null) as number | null,
        conveyance: (rawEarnings.conveyance ?? rawEarnings.conveyance_monthly ?? null) as number | null,
        overtime: (rawEarnings.overtime ?? rawEarnings.overtime_amount ?? null) as number | null,
        bonus: (rawEarnings.bonus ?? rawEarnings.bonus_amount ?? null) as number | null,
        incentives: (rawEarnings.incentives ?? null) as number | null,
        other: (rawEarnings.other ?? null) as number | null,
        ...rawEarnings,
      }
    : undefined;

  // Deductions breakdown if present
  const rawDeductions =
    (it.deductions || (it.salary_breakdown as Record<string, unknown> | undefined)?.deductions || (it.components as Record<string, unknown> | undefined)?.deductions) as Record<string, unknown> | undefined;
  const deductions: PayrollEmployeeDeductions | undefined = rawDeductions
    ? {
        pf: (rawDeductions.pf ?? rawDeductions.epf ?? rawDeductions.provident_fund ?? null) as number | null,
        esi: (rawDeductions.esi ?? rawDeductions.esic ?? null) as number | null,
        pt: (rawDeductions.pt ?? rawDeductions.professional_tax ?? null) as number | null,
        tds: (rawDeductions.tds ?? rawDeductions.tax ?? rawDeductions.income_tax ?? null) as number | null,
        incomeTax: (rawDeductions.incomeTax ?? rawDeductions.income_tax ?? null) as number | null,
        loan: (rawDeductions.loan ?? rawDeductions.loan_deduction ?? null) as number | null,
        advance: (rawDeductions.advance ?? rawDeductions.advance_salary ?? null) as number | null,
        other: (rawDeductions.other ?? null) as number | null,
        ...rawDeductions,
      }
    : undefined;

  // Attendance metrics if present
  const rawAtt = (it.attendance || it.attendance_metrics) as Record<string, unknown> | undefined;
  const attendance: PayrollEmployeeAttendance | undefined = rawAtt
    ? {
        workingDays: (rawAtt.workingDays ?? rawAtt.working_days ?? rawAtt.total_days ?? null) as number | null,
        paidDays: (rawAtt.paidDays ?? rawAtt.paid_days ?? null) as number | null,
        unpaidDays: (rawAtt.unpaidDays ?? rawAtt.unpaid_days ?? rawAtt.loss_of_pay_days ?? null) as number | null,
        leaveDays: (rawAtt.leaveDays ?? rawAtt.leave_days ?? null) as number | null,
        overtimeHours: (rawAtt.overtimeHours ?? rawAtt.overtime_hours ?? null) as number | null,
        lopDays: (rawAtt.lopDays ?? rawAtt.lop_days ?? null) as number | null,
        ...rawAtt,
      }
    : undefined;

  // Issues if present
  const rawIssues = it.issues || it.validation_issues || [];
  const issues = Array.isArray(rawIssues)
    ? rawIssues.map((iss: unknown) => {
        const i = (iss && typeof iss === "object" ? iss : {}) as Record<string, unknown>;
        return {
          id: (i.id as string | undefined),
          severity: String(i.severity || "warning"),
          message: String(i.message || iss),
        };
      })
    : undefined;

  return {
    id,
    employeeId,
    name,
    email,
    designation,
    department,
    location,
    grossEarnings: grossEarnings != null ? Number(grossEarnings) : null,
    totalDeductions: totalDeductions != null ? Number(totalDeductions) : null,
    netPay: netPay != null ? Number(netPay) : null,
    employerContribution: employerContribution != null ? Number(employerContribution) : null,
    status,
    validationStatus,
    issuesCount: issues ? issues.length : (Number(it.issues_count) || 0),
    issues,
    earnings,
    deductions,
    attendance,
    joiningDate: (it.joiningDate || it.joining_date || it.doj || it.date_of_joining || null) as string | null,
    employmentStatus: (
      it.employmentStatus ||
      it.employment_status ||
      it.employee_type ||
      it.employment_type ||
      null
    ) as string | null,
    financialYear: (it.financialYear || it.financial_year || it.fy || null) as string | null,
    periodName: (it.periodName || it.period_name || it.cycle_name || null) as string | null,
    periodId: (it.periodId || it.period_id || it.cycle_id || null) as string | null,
    runStatus: (it.runStatus || it.run_status || it.payroll_status || null) as string | null,
    calculationStatus: (it.calculationStatus || it.calculation_status || null) as string | null,
    statutory: (it.statutory || it.statutory_contributions || null) as PayrollPreviewEmployee["statutory"],
    salaryStructure: (it.salaryStructure || it.salary_structure || null) as PayrollPreviewEmployee["salaryStructure"],
    ytd: (it.ytd || it.year_to_date || null) as PayrollPreviewEmployee["ytd"],
    previousComparison: (
      it.previousComparison || it.previous_comparison || it.comparison || null
    ) as PayrollPreviewEmployee["previousComparison"],
    audit: (it.audit || it.calculation_metadata || null) as PayrollPreviewEmployee["audit"],
    bankInfo: (it.bankInfo || it.bank_details || it.bank || null) as PayrollPreviewEmployee["bankInfo"],
    ...it,
  };
}

export function normalizePayrollPreviewData(runId: string, raw: unknown): PayrollPreviewData {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Provision Generated",
      summary: null,
    };
  }

  const r = raw as Record<string, unknown>;
  const periodId = (r.periodId || r.period_id || r.cycleId || r.cycle_id || null) as string | null;
  const periodName = (r.periodName || r.period_name || r.cycle_name || r.name || null) as string | null;
  const status = String(r.status || r.run_status || "Provision Generated");
  const runDate = (r.runDate || r.run_date || r.createdAt || r.created_at || null) as string | null;
  const generatedAt =
    (r.generatedAt || r.generated_at || r.updatedAt || r.updated_at || null) as string | null;

  // Raw summary
  const s = (r.summary || r.totals || r.stats || r) as Record<string, unknown>;
  const summary: PayrollPreviewSummary = {
    employeeCount:
      (s.employeeCount ?? s.employee_count ?? s.totalEmployees ?? s.total_employees ?? null) as number | null,
    grossPayroll: (s.grossPayroll ?? s.gross_payroll ?? s.totalGross ?? s.total_gross ?? null) as number | null,
    totalEarnings: (s.totalEarnings ?? s.total_earnings ?? s.grossPayroll ?? s.gross_payroll ?? null) as number | null,
    totalDeductions: (s.totalDeductions ?? s.total_deductions ?? s.deductions ?? null) as number | null,
    netPayroll: (s.netPayroll ?? s.net_payroll ?? s.totalNet ?? s.total_net ?? null) as number | null,
    employerCost: (s.employerCost ?? s.employer_cost ?? s.totalCost ?? s.total_cost ?? null) as number | null,
    employerContribution: (s.employerContribution ?? s.employer_contribution ?? null) as number | null,
  };

  // Raw validation
  let validation: PayrollPreviewData["validation"] = null;
  const v = (r.validation || r.validation_results) as Record<string, unknown> | undefined;
  if (v && typeof v === "object") {
    validation = {
      errors: Array.isArray(v.errors) ? (v.errors as Record<string, unknown>[]) : [],
      warnings: Array.isArray(v.warnings) ? (v.warnings as Record<string, unknown>[]) : [],
    };
  }

  return {
    runId,
    periodId,
    periodName,
    status,
    runDate,
    generatedAt,
    summary,
    validation,
    ...raw,
  };
}

export function normalizePayrollValidationSummary(
  runId: string,
  raw: unknown,
): PayrollValidationSummary {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Not Started",
      totalIssues: 0,
      errorsCount: 0,
      warningsCount: 0,
      affectedEmployeesCount: 0,
      blockingCount: null,
      issues: [],
    };
  }

  const rawObj = raw as Record<string, unknown>;
  let rawList: Record<string, unknown>[] = [];
  if (Array.isArray(raw)) {
    rawList = raw.filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (Array.isArray(rawObj.issues)) {
    rawList = (rawObj.issues as unknown[]).filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (Array.isArray(rawObj.items)) {
    rawList = (rawObj.items as unknown[]).filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (Array.isArray(rawObj.validation_issues)) {
    rawList = (rawObj.validation_issues as unknown[]).filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (Array.isArray(rawObj.validationIssues)) {
    rawList = (rawObj.validationIssues as unknown[]).filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (rawObj.validation && typeof rawObj.validation === "object") {
    const val = rawObj.validation as Record<string, unknown>;
    const errs = Array.isArray(val.errors)
      ? (val.errors as unknown[]).map((e: unknown) => ({
          ...((e && typeof e === "object" ? e : {}) as Record<string, unknown>),
          severity: "error",
          blocking: true,
        }))
      : [];
    const warns = Array.isArray(val.warnings)
      ? (val.warnings as unknown[]).map((w: unknown) => ({
          ...((w && typeof w === "object" ? w : {}) as Record<string, unknown>),
          severity: "warning",
          blocking: false,
        }))
      : [];
    rawList = [...errs, ...warns];
  }

  const issues: PayrollValidationIssue[] = rawList.map((item, idx) => {
    // Preserve backend-provided severity without guessing from text
    const rawSev =
      item.severity || item.level || item.type || (item.blocking ? "error" : "warning");
    const sev = String(rawSev).toLowerCase();

    // Preserve blocking ONLY if provided by backend; do not infer from text
    const blocking =
      item.blocking !== undefined
        ? Boolean(item.blocking)
        : item.is_blocking !== undefined
          ? Boolean(item.is_blocking)
          : undefined;

    return {
      id: String(item.id || item.issue_id || `issue-${idx}`),
      severity: sev,
      category: (item.category || item.type || item.module || "General") as string,
      code: (item.code || item.error_code || item.rule_id || item.ruleCode || undefined) as string | undefined,
      message: String(item.message || item.description || item.detail || "Validation issue detected"),
      employeeId: (item.employeeId || item.employee_id || item.emp_id || undefined) as string | undefined,
      employeeName: (item.employeeName || item.employee_name || item.name || undefined) as string | undefined,
      department: (item.department || item.dept || item.department_name || undefined) as string | undefined,
      component: (item.component || item.field || item.salary_component || undefined) as string | undefined,
      blocking,
      status: String(item.status || (item.resolved ? "resolved" : "open")),
      detectedAt: (item.detectedAt || item.detected_at || item.created_at || item.createdAt || undefined) as string | undefined,
      resolved: item.resolved !== undefined ? Boolean(item.resolved) : undefined,
      resolution: (item.resolution || item.resolution_notes || item.notes || undefined) as string | undefined,
      resolvedAt: (item.resolvedAt || item.resolved_at || undefined) as string | undefined,
      resolvedBy: (item.resolvedBy || item.resolved_by || undefined) as string | undefined,
      source: (item.source || item.reference || item.rule || undefined) as string | undefined,
      ...item,
    };
  });

  const errorsArr = Array.isArray(rawObj.errors) ? rawObj.errors : undefined;
  const errorsCount = Number(
    rawObj.errorsCount ??
      rawObj.errors_count ??
      errorsArr?.length ??
      issues.filter(
        (i) => i.severity === "error" || i.severity === "critical" || i.severity === "fatal",
      ).length,
  );
  const warningsArr = Array.isArray(rawObj.warnings) ? rawObj.warnings : undefined;
  const warningsCount = Number(
    rawObj.warningsCount ??
      rawObj.warnings_count ??
      warningsArr?.length ??
      issues.filter(
        (i) => i.severity === "warning" || i.severity === "advisory" || i.severity === "info",
      ).length,
  );
  const totalIssues = Number(rawObj.totalIssues ?? rawObj.total_issues ?? rawObj.total ?? issues.length);

  // Derive blocking count ONLY if backend provides blocking flags or counts
  const hasBlockingInfo =
    rawObj.blockingCount != null ||
    rawObj.blocking_count != null ||
    rawObj.blockingIssuesCount != null ||
    issues.some((i) => i.blocking !== undefined);

  const blockingCount: number | null = hasBlockingInfo
    ? Number(
        rawObj.blockingCount ??
          rawObj.blocking_count ??
          rawObj.blockingIssuesCount ??
          issues.filter((i) => i.blocking === true).length,
      )
    : null;

  const affectedEmps = new Set<string>();
  issues.forEach((i) => {
    if (i.employeeId) affectedEmps.add(i.employeeId);
  });
  const affectedEmployeesCount = Number(
    rawObj.affectedEmployeesCount ??
      rawObj.affected_employees ??
      rawObj.affectedEmployees ??
      (affectedEmps.size || 0),
  );

  let status = String(rawObj.status || rawObj.validation_status || rawObj.state || "");
  if (!status) {
    if (errorsCount > 0) status = "Failed";
    else if (warningsCount > 0) status = "Warning";
    else if (issues.length === 0) status = "Passed";
    else status = "Completed";
  }

  return {
    runId,
    status,
    periodName: (rawObj.periodName || rawObj.period_name || null) as string | null,
    periodId: (rawObj.periodId || rawObj.period_id || null) as string | null,
    runStatus: (rawObj.runStatus || rawObj.run_status || null) as string | null,
    totalIssues,
    errorsCount,
    warningsCount,
    affectedEmployeesCount,
    blockingCount,
    lastValidatedAt: (rawObj.lastValidatedAt || rawObj.last_validated_at || rawObj.validatedAt || rawObj.validated_at || null) as string | null,
    issues,
    ...rawObj,
  };
}

export function normalizePayrollReviewData(
  runId: string,
  raw: unknown,
  previewFallback?: PayrollPreviewData | null,
  validationFallback?: PayrollValidationSummary | null,
  statusFallback?: PayrollRunStatus | null,
): PayrollReviewData {
  const rawObj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const periodId =
    (rawObj.periodId ||
    rawObj.period_id ||
    rawObj.cycleId ||
    rawObj.cycle_id ||
    previewFallback?.periodId ||
    statusFallback?.periodId ||
    null) as string | null;

  const periodName =
    (rawObj.periodName ||
    rawObj.period_name ||
    rawObj.cycleName ||
    rawObj.cycle_name ||
    previewFallback?.periodName ||
    statusFallback?.periodName ||
    null) as string | null;

  const rawStatus = (rawObj.status ||
    rawObj.run_status ||
    rawObj.state ||
    previewFallback?.status ||
    statusFallback?.status ||
    "Under Review") as string;

  const runDate =
    (rawObj.runDate ||
    rawObj.run_date ||
    rawObj.createdAt ||
    rawObj.created_at ||
    previewFallback?.runDate ||
    null) as string | null;

  const generatedAt =
    (rawObj.generatedAt ||
    rawObj.generated_at ||
    rawObj.calculatedAt ||
    rawObj.calculated_at ||
    previewFallback?.generatedAt ||
    null) as string | null;

  const lastUpdatedAt =
    (rawObj.lastUpdatedAt ||
    rawObj.last_updated_at ||
    rawObj.updatedAt ||
    rawObj.updated_at ||
    rawObj.approvedAt ||
    rawObj.approved_at ||
    null) as string | null;

  // Summary extraction
  let summary: PayrollPreviewSummary | null = null;
  const rawSummary = (rawObj.summary || rawObj.totals || rawObj.stats || previewFallback?.summary) as Record<string, unknown> | undefined;
  if (rawSummary && typeof rawSummary === "object") {
    summary = {
      employeeCount:
        (rawSummary.employeeCount ??
        rawSummary.employee_count ??
        rawSummary.totalEmployees ??
        rawSummary.total_employees ??
        previewFallback?.summary?.employeeCount ??
        statusFallback?.employees?.total ??
        null) as number | null,
      grossPayroll:
        (rawSummary.grossPayroll ??
        rawSummary.gross_payroll ??
        rawSummary.totalGross ??
        rawSummary.total_gross ??
        previewFallback?.summary?.grossPayroll ??
        null) as number | null,
      totalEarnings:
        (rawSummary.totalEarnings ??
        rawSummary.total_earnings ??
        rawSummary.grossPayroll ??
        rawSummary.gross_payroll ??
        previewFallback?.summary?.totalEarnings ??
        null) as number | null,
      totalDeductions:
        (rawSummary.totalDeductions ??
        rawSummary.total_deductions ??
        rawSummary.deductions ??
        previewFallback?.summary?.totalDeductions ??
        null) as number | null,
      netPayroll:
        (rawSummary.netPayroll ??
        rawSummary.net_payroll ??
        rawSummary.totalNet ??
        rawSummary.total_net ??
        previewFallback?.summary?.netPayroll ??
        null) as number | null,
      employerCost:
        (rawSummary.employerCost ??
        rawSummary.employer_cost ??
        rawSummary.totalCost ??
        rawSummary.total_cost ??
        previewFallback?.summary?.employerCost ??
        null) as number | null,
      employerContribution:
        (rawSummary.employerContribution ??
        rawSummary.employer_contribution ??
        previewFallback?.summary?.employerContribution ??
        null) as number | null,
    };
  }

  // Validation details extraction
  let validation: PayrollReviewData["validation"] = null;
  const rawVal = (rawObj.validation || rawObj.validation_summary || validationFallback) as Record<string, unknown> | PayrollValidationSummary | undefined;
  if (rawVal && typeof rawVal === "object") {
    const valObj = rawVal as Record<string, unknown>;
    const rawValIssues = Array.isArray(valObj.issues) ? valObj.issues : undefined;
    validation = {
      status: (valObj.status || valObj.validation_status || validationFallback?.status || null) as string | null,
      totalIssues: Number(
        valObj.totalIssues ??
          valObj.total_issues ??
          validationFallback?.totalIssues ??
          (rawValIssues?.length || 0),
      ),
      errorsCount: Number(
        valObj.errorsCount ??
          valObj.errors_count ??
          validationFallback?.errorsCount ??
          (Array.isArray(valObj.errors) ? valObj.errors.length : 0),
      ),
      warningsCount: Number(
        valObj.warningsCount ??
          valObj.warnings_count ??
          validationFallback?.warningsCount ??
          (Array.isArray(valObj.warnings) ? valObj.warnings.length : 0),
      ),
      affectedEmployeesCount: Number(
        valObj.affectedEmployeesCount ??
          valObj.affected_employees ??
          validationFallback?.affectedEmployeesCount ??
          0,
      ),
      blockingCount:
        valObj.blockingCount != null
          ? Number(valObj.blockingCount)
          : valObj.blocking_count != null
            ? Number(valObj.blocking_count)
            : validationFallback?.blockingCount != null
              ? Number(validationFallback.blockingCount)
              : null,
      issues: Array.isArray(valObj.issues)
        ? (valObj.issues as PayrollValidationIssue[])
        : Array.isArray(validationFallback?.issues)
          ? validationFallback.issues
          : undefined,
    };
  }

  // Approval details extraction
  const rawApp = (rawObj.approval || rawObj.approval_status || rawObj) as Record<string, unknown> | undefined;
  let approval: PayrollApprovalInfo | null = null;
  if (rawApp && typeof rawApp === "object") {
    const appStatus =
      (rawApp.status ||
      rawApp.approval_status ||
      (String(rawStatus).toLowerCase() === "approved"
        ? "approved"
        : String(rawStatus).toLowerCase() === "rejected"
          ? "rejected"
          : "pending")) as PayrollApprovalInfo["status"];

    approval = {
      status: appStatus,
      approvedBy:
        (rawApp.approvedBy ||
        rawApp.approved_by ||
        rawApp.approver_id ||
        rawObj.approvedBy ||
        rawObj.approved_by ||
        null) as string | null,
      approvedByName:
        (rawApp.approvedByName ||
        rawApp.approved_by_name ||
        rawApp.approver_name ||
        rawObj.approvedByName ||
        rawObj.approved_by_name ||
        null) as string | null,
      approvedAt:
        (rawApp.approvedAt ||
        rawApp.approved_at ||
        rawObj.approvedAt ||
        rawObj.approved_at ||
        null) as string | null,
      rejectedBy:
        (rawApp.rejectedBy ||
        rawApp.rejected_by ||
        rawObj.rejectedBy ||
        rawObj.rejected_by ||
        null) as string | null,
      rejectedByName:
        (rawApp.rejectedByName ||
        rawApp.rejected_by_name ||
        rawObj.rejectedByName ||
        rawObj.rejected_by_name ||
        null) as string | null,
      rejectedAt:
        (rawApp.rejectedAt ||
        rawApp.rejected_at ||
        rawObj.rejectedAt ||
        rawObj.rejected_at ||
        null) as string | null,
      rejectionReason:
        (rawApp.rejectionReason ||
        rawApp.rejection_reason ||
        rawObj.rejectionReason ||
        rawObj.rejection_reason ||
        null) as string | null,
      comments:
        (rawApp.comments ||
        rawApp.comment ||
        rawApp.notes ||
        rawObj.approvalComments ||
        rawObj.approval_comments ||
        null) as string | null,
      canApprove: Boolean(rawApp.canApprove ?? rawApp.can_approve ?? true),
      canReject: Boolean(rawApp.canReject ?? rawApp.can_reject ?? true),
      blockingReasons: (rawApp.blockingReasons || rawApp.blocking_reasons || []) as string[],
      ...rawApp,
    };
  }

  // Audit log extraction
  let auditLog: PayrollAuditRecord[] | null = null;
  const rawAudit = rawObj.auditLog || rawObj.audit_log || rawObj.history || rawObj.timeline;
  if (Array.isArray(rawAudit)) {
    auditLog = (rawAudit as unknown[]).map((item: unknown) => {
      const it = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        action: String(it.action || it.event || "Update"),
        user: (it.user || it.user_id || null) as string | null,
        userName: (it.userName || it.user_name || it.name || null) as string | null,
        timestamp: (it.timestamp || it.created_at || it.createdAt || null) as string | null,
        comment: (it.comment || it.message || it.notes || null) as string | null,
        previousStatus: (it.previousStatus || it.previous_status || null) as string | null,
        newStatus: (it.newStatus || it.new_status || null) as string | null,
        ...it,
      };
    });
  }

  return {
    runId,
    periodId,
    periodName,
    status: rawStatus,
    validationStatus: validation?.status || null,
    runDate,
    generatedAt,
    lastUpdatedAt,
    summary,
    validation,
    approval,
    auditLog,
    ...rawObj,
  };
}

export function normalizePayrollFinalizationData(
  runId: string,
  raw: unknown,
  reviewFallback?: PayrollReviewData | null,
): PayrollFinalizationData {
  const rawObj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const periodId =
    (rawObj.periodId ||
    rawObj.period_id ||
    rawObj.cycleId ||
    rawObj.cycle_id ||
    reviewFallback?.periodId ||
    null) as string | null;

  const periodName =
    (rawObj.periodName ||
    rawObj.period_name ||
    rawObj.cycleName ||
    rawObj.cycle_name ||
    reviewFallback?.periodName ||
    null) as string | null;

  const rawStatus = (rawObj.status ||
    rawObj.run_status ||
    rawObj.state ||
    reviewFallback?.status ||
    "Approved") as string;

  const isLocked = Boolean(
    rawObj.isLocked ||
    rawObj.is_locked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );

  const isFinalized = Boolean(
    rawObj.isFinalized ||
    rawObj.is_finalized ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );

  const summary = (rawObj.summary || reviewFallback?.summary || null) as PayrollPreviewSummary | null;
  const validation = (rawObj.validation || reviewFallback?.validation || null) as PayrollReviewData["validation"];
  const approval = (rawObj.approval || reviewFallback?.approval || null) as PayrollApprovalInfo | null;

  const rawFin = (rawObj.finalization || rawObj.finalized || rawObj) as Record<string, unknown> | undefined;
  let finalization: PayrollFinalizationInfo | null = null;
  if (rawFin && typeof rawFin === "object") {
    finalization = {
      isFinalized: isFinalized || Boolean(rawFin.isFinalized || rawFin.is_finalized),
      isLocked: isLocked || Boolean(rawFin.isLocked || rawFin.is_locked),
      finalizedBy:
        (rawFin.finalizedBy ||
        rawFin.finalized_by ||
        rawObj.finalizedBy ||
        rawObj.finalized_by ||
        null) as string | null,
      finalizedByName:
        (rawFin.finalizedByName ||
        rawFin.finalized_by_name ||
        rawObj.finalizedByName ||
        rawObj.finalized_by_name ||
        null) as string | null,
      finalizedAt:
        (rawFin.finalizedAt ||
        rawFin.finalized_at ||
        rawObj.finalizedAt ||
        rawObj.finalized_at ||
        null) as string | null,
      finalizationNotes:
        (rawFin.finalizationNotes ||
        rawFin.finalization_notes ||
        rawFin.notes ||
        rawObj.finalizationNotes ||
        rawObj.finalization_notes ||
        null) as string | null,
      referenceNumber:
        (rawFin.referenceNumber ||
        rawFin.reference_number ||
        rawFin.ref ||
        rawObj.referenceNumber ||
        rawObj.reference_number ||
        null) as string | null,
      canFinalize: Boolean(rawFin.canFinalize ?? rawFin.can_finalize ?? true),
      blockingReasons: (rawFin.blockingReasons || rawFin.blocking_reasons || []) as string[],
      ...rawFin,
    };
  }

  const auditLog = (rawObj.auditLog || rawObj.audit_log || reviewFallback?.auditLog || null) as PayrollAuditRecord[] | null;

  return {
    runId,
    periodId,
    periodName,
    status: rawStatus,
    isLocked,
    isFinalized,
    validationStatus: validation?.status || null,
    approvalStatus: approval?.status || null,
    runDate: (rawObj.runDate || rawObj.run_date || reviewFallback?.runDate || null) as string | null,
    generatedAt: (rawObj.generatedAt || rawObj.generated_at || reviewFallback?.generatedAt || null) as string | null,
    lastUpdatedAt:
      (rawObj.lastUpdatedAt ||
      rawObj.last_updated_at ||
      reviewFallback?.lastUpdatedAt ||
      null) as string | null,
    summary,
    validation,
    approval,
    finalization,
    auditLog,
    ...rawObj,
  };
}

// ── Step 9: Normalize Payslip Data ────────────────────────────────────

export function normalizePayrollPayslipData(
  runId: string,
  employeeId: string,
  raw: unknown,
  empFallback?: PayrollPreviewEmployee | null,
  finalFallback?: PayrollFinalizationData | null,
): PayrollPayslipData {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const emp = (d.employee || empFallback || {}) as Record<string, unknown>;
  const att = (d.attendance || empFallback?.attendance || {}) as Record<string, unknown>;
  const earn = (d.earnings || empFallback?.earnings || {}) as Record<string, unknown>;
  const ded = (d.deductions || empFallback?.deductions || {}) as Record<string, unknown>;
  const stat = (d.statutory || empFallback?.statutory || {}) as Record<string, unknown>;
  const doc = (d.document || d.payslipDocument || {}) as Record<string, unknown>;

  const rawStatus = (d.status ||
    d.payslipStatus ||
    finalFallback?.status ||
    empFallback?.runStatus ||
    "Finalized") as string;

  const isFinalized = Boolean(
    d.isFinalized ||
    d.is_finalized ||
    finalFallback?.isFinalized ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed" ||
    String(rawStatus).toLowerCase() === "locked",
  );

  const isLocked = Boolean(
    d.isLocked ||
    d.is_locked ||
    finalFallback?.isLocked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized",
  );

  const statEmployee = stat && typeof stat === "object" ? (stat.employee as Record<string, unknown> | undefined) : undefined;
  const statEmployer = stat && typeof stat === "object" ? (stat.employer as Record<string, unknown> | undefined) : undefined;

  return {
    id: String(d.id || d.payslipId || d.payslip_id || `${runId}_${employeeId}`),
    runId: String(d.runId || d.run_id || runId),
    employeeId: String(d.employeeId || d.employee_id || employeeId),
    payslipNumber:
      (d.payslipNumber ||
      d.payslip_number ||
      d.referenceNumber ||
      d.reference_number ||
      d.slipNo ||
      null) as string | null,
    referenceNumber:
      (d.referenceNumber ||
      d.reference_number ||
      finalFallback?.finalization?.referenceNumber ||
      null) as string | null,
    periodName:
      (d.periodName ||
      d.period_name ||
      finalFallback?.periodName ||
      empFallback?.periodName ||
      null) as string | null,
    periodId:
      (d.periodId ||
      d.period_id ||
      finalFallback?.periodId ||
      empFallback?.periodId ||
      null) as string | null,
    financialYear:
      (d.financialYear ||
      d.financial_year ||
      empFallback?.financialYear ||
      null) as string | null,
    startDate: (d.startDate || d.start_date || d.periodStartDate || null) as string | null,
    endDate: (d.endDate || d.end_date || d.periodEndDate || null) as string | null,
    paymentDate: (d.paymentDate || d.payment_date || null) as string | null,
    finalizedAt:
      (d.finalizedAt ||
      d.finalized_at ||
      finalFallback?.finalization?.finalizedAt ||
      null) as string | null,
    finalizedByName:
      (d.finalizedByName ||
      d.finalized_by_name ||
      finalFallback?.finalization?.finalizedByName ||
      null) as string | null,
    status: rawStatus,
    isFinalized,
    isLocked,
    employee: {
      id: String(emp.id || emp.employeeId || employeeId),
      name: String(emp.name || emp.employeeName || emp.full_name || "—"),
      department: (emp.department || emp.dept || null) as string | null,
      designation: (emp.designation || emp.role || null) as string | null,
      location: (emp.location || emp.branch || null) as string | null,
      joiningDate: (emp.joiningDate || emp.joining_date || emp.doj || null) as string | null,
      employmentStatus: (emp.employmentStatus || emp.employment_status || null) as string | null,
      pan: (emp.pan || emp.panNumber || emp.pan_number || null) as string | null,
      uan: (emp.uan || emp.uanNumber || emp.uan_number || null) as string | null,
      pfNumber: (emp.pfNumber || emp.pf_number || null) as string | null,
      esiNumber: (emp.esiNumber || emp.esi_number || null) as string | null,
      bankInfo: (emp.bankInfo || emp.bank || null) as PayrollPayslipEmployeeInfo["bankInfo"],
    },
    attendance: {
      workingDays: (att.workingDays ?? att.working_days ?? att.totalDays ?? null) as number | null,
      paidDays: (att.paidDays ?? att.paid_days ?? null) as number | null,
      lopDays: (att.lopDays ?? att.lop_days ?? att.unpaidDays ?? null) as number | null,
      leaveDays: (att.leaveDays ?? att.leave_days ?? null) as number | null,
      presentDays: (att.presentDays ?? att.present_days ?? null) as number | null,
      holidays: (att.holidays ?? att.holiday_days ?? null) as number | null,
      weeklyOffs: (att.weeklyOffs ?? att.weekly_offs ?? null) as number | null,
      overtimeHours: (att.overtimeHours ?? att.overtime_hours ?? null) as number | null,
      ...att,
    },
    earnings: {
      basic: (earn.basic ?? earn.basic_salary ?? null) as number | null,
      hra: (earn.hra ?? earn.house_rent_allowance ?? null) as number | null,
      conveyance: (earn.conveyance ?? earn.conveyance_allowance ?? null) as number | null,
      specialAllowance: (earn.specialAllowance ?? earn.special_allowance ?? null) as number | null,
      medicalAllowance: (earn.medicalAllowance ?? earn.medical_allowance ?? null) as number | null,
      otherAllowances: (earn.otherAllowances ?? earn.other_allowances ?? earn.allowances ?? null) as number | null,
      overtime: (earn.overtime ?? earn.overtime_pay ?? null) as number | null,
      bonus: (earn.bonus ?? null) as number | null,
      incentives: (earn.incentives ?? earn.incentive ?? null) as number | null,
      arrears: (earn.arrears ?? null) as number | null,
      reimbursements: (earn.reimbursements ?? earn.reimbursement ?? null) as number | null,
      otherEarnings: (earn.otherEarnings ?? earn.other ?? null) as number | null,
      grossEarnings:
        (d.grossEarnings ??
        d.gross_earnings ??
        earn.grossEarnings ??
        earn.gross_earnings ??
        empFallback?.grossEarnings ??
        null) as number | null,
      components: Array.isArray(earn.components) ? earn.components : undefined,
    },
    deductions: {
      pf: (ded.pf ?? ded.epf ?? ded.provident_fund ?? null) as number | null,
      esi: (ded.esi ?? ded.esic ?? null) as number | null,
      pt: (ded.pt ?? ded.professional_tax ?? null) as number | null,
      tds: (ded.tds ?? ded.income_tax ?? ded.tax ?? null) as number | null,
      loan: (ded.loan ?? ded.loan_deduction ?? null) as number | null,
      advance: (ded.advance ?? ded.advance_salary ?? null) as number | null,
      otherDeductions: (ded.otherDeductions ?? ded.other_deductions ?? ded.other ?? null) as number | null,
      totalDeductions:
        (d.totalDeductions ??
        d.total_deductions ??
        ded.totalDeductions ??
        ded.total_deductions ??
        empFallback?.totalDeductions ??
        null) as number | null,
      components: Array.isArray(ded.components) ? ded.components : undefined,
    },
    statutory: stat && typeof stat === "object" ? {
      employeePf: (statEmployee?.epf ?? stat.employeePf ?? stat.employee_pf ?? ded.pf ?? null) as number | null,
      employerPf: (statEmployer?.epf ?? stat.employerPf ?? stat.employer_pf ?? null) as number | null,
      employeeEsi: (statEmployee?.esi ?? stat.employeeEsi ?? stat.employee_esi ?? ded.esi ?? null) as number | null,
      employerEsi: (statEmployer?.esi ?? stat.employerEsi ?? stat.employer_esi ?? null) as number | null,
      pt: (statEmployee?.pt ?? stat.pt ?? ded.pt ?? null) as number | null,
      tds: (statEmployee?.tds ?? stat.tds ?? ded.tds ?? null) as number | null,
      eps: (statEmployer?.eps ?? stat.eps ?? null) as number | null,
      edli: (statEmployer?.edli ?? stat.edli ?? null) as number | null,
      other: (stat.other || null) as number | null,
    } : null,
    employerContributions: (d.employerContributions || (statEmployer ? {
      pf: (statEmployer.epf ?? null) as number | null,
      esi: (statEmployer.esi ?? null) as number | null,
      eps: (statEmployer.eps ?? null) as number | null,
      edli: (statEmployer.edli ?? null) as number | null,
      total: (empFallback?.employerContribution ?? null) as number | null,
    } : null)) as PayrollPayslipData["employerContributions"],
    netPay:
      (d.netPay ??
      d.net_pay ??
      empFallback?.netPay ??
      null) as number | null,
    netPayInWords: (d.netPayInWords || d.net_pay_in_words || null) as string | null,
    salaryStructure: (d.salaryStructure || empFallback?.salaryStructure || null) as PayrollPayslipData["salaryStructure"],
    ytd: (d.ytd || empFallback?.ytd || null) as PayrollPayslipData["ytd"],
    document: {
      pdfUrl: (doc.pdfUrl || doc.pdf_url || d.pdfUrl || d.pdf_url || null) as string | null,
      downloadUrl: (doc.downloadUrl || doc.download_url || d.downloadUrl || d.download_url || null) as string | null,
      documentId: (doc.documentId || doc.document_id || d.documentId || null) as string | null,
      hasDocument: Boolean(doc.pdfUrl || doc.downloadUrl || doc.hasDocument || d.hasDocument),
      mimeType: String(doc.mimeType || doc.mime_type || "application/pdf"),
    },
    notes: (d.notes || finalFallback?.finalization?.finalizationNotes || null) as string | null,
  };
}

// ── Real API Service ─────────────────────────────────────────────────

export const payrollApi = {
  /**
   * Fetch paginated payroll periods/cycles with filters and server-side pagination.
   * Connects to /api/v2/payroll/cycles with fallback to /payroll/periods.
   */
  async getPeriodsList(params?: GetPeriodsParams): Promise<GetPeriodsResponse> {
    const queryParams: Record<string, unknown> = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status && params.status !== "all") queryParams.status = params.status;
    if (params?.year) queryParams.year = params.year;
    if (params?.month) queryParams.month = params.month;
    if (params?.search) queryParams.search = params.search;
    if (params?.company_id) queryParams.company_id = params.company_id;

    try {
      const res = await apiInstance.get("/api/v2/payroll/cycles", { params: queryParams });
      const body = res?.data !== undefined ? res.data : res;
      const data = extractData(body);

      let rawList: unknown[] = [];
      let total = 0;
      let page = params?.page || 1;
      let limit = params?.limit || 20;
      let totalPages = 1;

      if (Array.isArray(data)) {
        rawList = data;
        total = data.length;
      } else if (data && typeof data === "object") {
        const d = data as Record<string, unknown>;
        if (Array.isArray(d.items)) rawList = d.items;
        else if (Array.isArray(d.cycles)) rawList = d.cycles;
        else if (Array.isArray(d.periods)) rawList = d.periods;
        else if (Array.isArray(d.data)) rawList = d.data;

        total = Number(d.total ?? d.count ?? rawList.length) || rawList.length;
        page = Number(d.page ?? params?.page ?? 1) || 1;
        limit = Number(d.limit ?? params?.limit ?? 20) || 20;
        totalPages = Number(d.pages ?? d.total_pages ?? Math.ceil(total / limit)) || 1;
      }

      const items = rawList.map(normalizePayrollPeriod);
      return { items, total, page, limit, totalPages };
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Fallback to /payroll/periods
        const res = await apiInstance.get("/payroll/periods", { params: queryParams });
        const data = extractData(res);
        let rawList: unknown[] = [];
        if (Array.isArray(data)) rawList = data;
        else if (data && typeof data === "object") {
          const d = data as Record<string, unknown>;
          if (Array.isArray(d.periods)) rawList = d.periods;
          else if (Array.isArray(d.items)) rawList = d.items;
        }
        const items = rawList.map(normalizePayrollPeriod);
        return {
          items,
          total: items.length,
          page: 1,
          limit: items.length || 20,
          totalPages: 1,
        };
      }
      throw err;
    }
  },

  /**
   * Fetch all configured payroll periods from the backend (flat array).
   * Backwards compatible with dashboard period selectors.
   */
  async getPeriods(): Promise<PayrollPeriod[]> {
    try {
      const res = await this.getPeriodsList({ limit: 100 });
      return res.items;
    } catch (err) {
      // Direct fallback to legacy /payroll/periods
      try {
        const res = await apiInstance.get("/payroll/periods");
        const data = extractData<PayrollPeriod[] | { periods: PayrollPeriod[] }>(res);
        if (Array.isArray(data)) {
          return data.map(normalizePayrollPeriod);
        }
        if (
          data &&
          typeof data === "object" &&
          Array.isArray((data as { periods: PayrollPeriod[] }).periods)
        ) {
          return (data as { periods: PayrollPeriod[] }).periods.map(normalizePayrollPeriod);
        }
        return [];
      } catch {
        throw err;
      }
    }
  },

  /**
   * Fetch a single pay cycle / period by ID.
   */
  async getPeriod(id: string): Promise<PayrollPeriod | null> {
    try {
      const res = await apiInstance.get(`/api/v2/payroll/cycles/${id}`);
      const data = extractData(res);
      return data ? normalizePayrollPeriod(data) : null;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        const res = await apiInstance.get(`/payroll/periods/${id}`);
        const data = extractData(res);
        return data ? normalizePayrollPeriod(data) : null;
      }
      throw err;
    }
  },

  /**
   * Create a new payroll period / cycle.
   */
  async createPeriod(payload: CreatePeriodPayload): Promise<PayrollPeriod> {
    const body: Record<string, unknown> = {
      name: payload.name,
      start_date: payload.startDate,
      end_date: payload.endDate,
      pay_date: payload.payDate,
      startDate: payload.startDate,
      endDate: payload.endDate,
      payDate: payload.payDate,
      remarks: payload.remarks || undefined,
    };
    if (payload.periodMonth) body.period_month = payload.periodMonth;
    if (payload.periodYear) body.period_year = payload.periodYear;
    if (payload.companyId) body.company_id = payload.companyId;

    try {
      const res = await apiInstance.post("/api/v2/payroll/cycles", body);
      const data = extractData(res);
      return normalizePayrollPeriod(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        const res = await apiInstance.post("/payroll/periods", body);
        const data = extractData(res);
        return normalizePayrollPeriod(data);
      }
      throw err;
    }
  },

  /**
   * Lock pay cycle — freeze computed figures.
   */
  async lockPeriod(id: string, reason?: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/lock`, {
      reason: reason || null,
    });
    return extractData<{ success: boolean; message?: string }>(res) || { success: true };
  },

  /**
   * Reopen a locked pay cycle (Admin only).
   */
  async reopenPeriod(id: string, reason: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/reopen`, {
      reason,
    });
    return extractData<{ success: boolean; message?: string }>(res) || { success: true };
  },

  /**
   * Void / cancel a pay cycle.
   */
  async voidPeriod(id: string, reason?: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/void`, {
      reason: reason || null,
    });
    return extractData<{ success: boolean; message?: string }>(res) || { success: true };
  },

  /**
   * Fetch the comprehensive dashboard data for a given payroll period.
   * GET /api/v1/payroll/dashboard?periodId=...
   */
  async getDashboard(periodId?: string): Promise<PayrollDashboardData> {
    const res = await apiInstance.get("/payroll/dashboard", {
      params: periodId ? { periodId } : undefined,
    });
    return extractData<PayrollDashboardData>(res);
  },

  /**
   * Trigger provisional payroll calculation for the given period.
   * POST /api/v1/payroll/run
   * Note: Running payroll produces provisional results and does NOT finalize payroll or initiate payments.
   */
  async runPayroll(periodId: string): Promise<RunPayrollResponse> {
    const res = await apiInstance.post("/payroll/run", { periodId });
    return extractData<RunPayrollResponse>(res);
  },

  /**
   * Fetch live payroll run processing status.
   * Connects to GET /api/v2/payroll/runs/{runId}/generation-status with fallbacks.
   * ZERO MOCK DATA: returns authentic backend response or throws so UI can show real unavailable state.
   */
  async getPayrollRunStatus(runId: string, jobId?: string): Promise<PayrollRunStatus> {
    const params = jobId ? { job_id: jobId } : undefined;
    const requestConfig = {
      params,
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    };

    try {
      // Primary: /api/v2/payroll/runs/{runId}/generation-status
      const res = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/generation-status`,
        requestConfig,
      );
      const data = extractData(res);
      return normalizePayrollRunStatus(runId, data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Fallback 1: preview endpoint (/api/v2/payroll/runs/{runId}/preview)
        try {
          const previewRes = await apiInstance.get(
            `/api/v2/payroll/runs/${runId}/preview`,
            requestConfig,
          );
          const previewData = extractData(previewRes);
          if (previewData) {
            return normalizePayrollRunStatus(runId, previewData);
          }
        } catch {
          // Continue to fallback 2
        }

        // Fallback 2: /payroll/runs/{runId}
        try {
          const legRes = await apiInstance.get(`/payroll/runs/${runId}`, requestConfig);
          const legData = extractData(legRes);
          if (legData) {
            return normalizePayrollRunStatus(runId, legData);
          }
        } catch {
          // Continue to fallback 3
        }

        // Fallback 3: /payroll/runs/{runId}/status
        try {
          const statusRes = await apiInstance.get(`/payroll/runs/${runId}/status`, requestConfig);
          const statusData = extractData(statusRes);
          if (statusData) {
            return normalizePayrollRunStatus(runId, statusData);
          }
        } catch {
          // Fall through and throw original error
        }
      }
      throw err;
    }
  },

  /**
   * Cancel an active draft/queued payroll run.
   * DELETE /api/v2/payroll/runs/{runId} (from OpenAPI spec: "Cancel/delete a draft payroll run")
   */
  async cancelPayrollRun(runId: string): Promise<CancelRunResponse> {
    try {
      const res = await apiInstance.delete(`/api/v2/payroll/runs/${runId}`);
      return (
        extractData<CancelRunResponse>(res) || {
          success: true,
          message: "Payroll run cancelled successfully.",
        }
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Fallback POST /payroll/runs/{runId}/cancel
        try {
          const fallbackRes = await apiInstance.post(`/payroll/runs/${runId}/cancel`);
          return extractData<CancelRunResponse>(fallbackRes) || { success: true };
        } catch {
          throw err;
        }
      }
      throw err;
    }
  },

  /**
   * Retry a failed payroll calculation run.
   * POST /api/v2/payroll/runs/{runId}/process
   */
  async retryPayrollRun(runId: string): Promise<RetryRunResponse> {
    try {
      const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/process`);
      return (
        extractData<RetryRunResponse>(res) || {
          success: true,
          message: "Payroll calculation retried successfully.",
        }
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Fallback /revalidate or /payroll/runs/{runId}/retry
        try {
          const fbRes = await apiInstance.post(`/api/v2/payroll/runs/${runId}/revalidate`);
          return extractData<RetryRunResponse>(fbRes) || { success: true };
        } catch {
          const fbRes2 = await apiInstance.post(`/payroll/runs/${runId}/retry`);
          return extractData<RetryRunResponse>(fbRes2) || { success: true };
        }
      }
      throw err;
    }
  },

  /**
   * Get validation issues for a payroll run.
   * GET /api/v2/payroll/runs/{runId}/validation-issues
   */
  async getPayrollRunValidationIssues(runId: string): Promise<PayrollRunValidationIssue[]> {
    try {
      const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation-issues`, {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData(res);
      if (Array.isArray(data)) return data as PayrollRunValidationIssue[];
      if (data && typeof data === "object") {
        const d = data as Record<string, unknown>;
        if (Array.isArray(d.items)) return d.items as PayrollRunValidationIssue[];
        if (Array.isArray(d.issues)) return d.issues as PayrollRunValidationIssue[];
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Fetch comprehensive payroll preview for a completed/provision run.
   * GET /api/v2/payroll/runs/{runId}/preview
   * Zero mock data: raises error if backend is unavailable so UI renders proper state.
   */
  async getPayrollPreview(runId: string): Promise<PayrollPreviewData> {
    try {
      const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/preview`, {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData(res);
      return normalizePayrollPreviewData(runId, data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Fallback to /payroll/runs/{runId}/preview or /payroll/runs/{runId}
        try {
          const fallbackRes = await apiInstance.get(`/payroll/runs/${runId}/preview`, {
            headers: { "Cache-Control": "no-cache" },
            skipCache: true,
          });
          const fallbackData = extractData(fallbackRes);
          if (fallbackData) {
            return normalizePayrollPreviewData(runId, fallbackData);
          }
        } catch {
          // Fall through and throw original error
        }
      }
      throw err;
    }
  },

  /**
   * Fetch paginated employee payroll rows for a run.
   * GET /api/v2/payroll/runs/{runId}/employees
   */
  async getRunEmployees(
    runId: string,
    params?: GetRunEmployeesParams,
  ): Promise<GetRunEmployeesResponse> {
    const queryParams: Record<string, unknown> = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.department && params.department !== "all") {
      queryParams.department = params.department;
    }
    if (params?.validationStatus && params.validationStatus !== "all") {
      queryParams.validationStatus = params.validationStatus;
    }
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortDir) queryParams.sortDir = params.sortDir;

    try {
      const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/employees`, {
        params: queryParams,
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData(res);

      let rawList: unknown[] = [];
      let total = 0;
      let page = params?.page || 1;
      let limit = params?.limit || 10;
      let totalPages = 1;

      if (Array.isArray(data)) {
        rawList = data;
        total = data.length;
      } else if (data && typeof data === "object") {
        const d = data as Record<string, unknown>;
        if (Array.isArray(d.items)) rawList = d.items;
        else if (Array.isArray(d.employees)) rawList = d.employees;
        else if (Array.isArray(d.data)) rawList = d.data;

        total = Number(d.total ?? d.count ?? rawList.length) || rawList.length;
        page = Number(d.page ?? params?.page ?? 1) || 1;
        limit = Number(d.limit ?? params?.limit ?? 10) || 10;
        totalPages = Number(d.pages ?? d.total_pages ?? Math.ceil(total / limit)) || 1;
      }

      const items = rawList.map(normalizePayrollEmployee);
      return { items, total, page, limit, totalPages };
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Fallback /payroll/runs/{runId}/employees
        try {
          const fbRes = await apiInstance.get(`/payroll/runs/${runId}/employees`, {
            params: queryParams,
            skipCache: true,
          });
          const fbData = extractData(fbRes);
          let rawList: unknown[] = [];
          if (Array.isArray(fbData)) rawList = fbData;
          else if (fbData && typeof fbData === "object") {
            const d = fbData as Record<string, unknown>;
            if (Array.isArray(d.items)) rawList = d.items;
          }
          const items = rawList.map(normalizePayrollEmployee);
          return {
            items,
            total: items.length,
            page: 1,
            limit: items.length || 10,
            totalPages: 1,
          };
        } catch {
          // Re-throw
        }
      }
      throw err;
    }
  },

  /**
   * Fetch single employee detailed payroll calculation for a run.
   * GET /api/v2/payroll/runs/{runId}/employees/{employeeId}
   */
  async getRunEmployeeDetail(
    runId: string,
    employeeId: string,
  ): Promise<PayrollPreviewEmployee | null> {
    try {
      const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/employees/${employeeId}`, {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData(res);
      return data ? normalizePayrollEmployee(data) : null;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Fallback /payroll/runs/{runId}/employees/{employeeId}
        try {
          const fbRes = await apiInstance.get(`/payroll/runs/${runId}/employees/${employeeId}`, {
            skipCache: true,
          });
          const fbData = extractData(fbRes);
          return fbData ? normalizePayrollEmployee(fbData) : null;
        } catch {
          return null;
        }
      }
      throw err;
    }
  },

  /**
   * Trigger recalculation of a payroll run.
   * POST /api/v2/payroll/runs/{runId}/process
   */
  async recalculatePayroll(runId: string): Promise<{ success: boolean; message?: string }> {
    return this.retryPayrollRun(runId);
  },

  /**
   * Fetch validation summary and issues for a payroll run.
   * GET /api/v2/payroll/runs/{runId}/validation
   */
  async getPayrollValidation(runId: string): Promise<PayrollValidationSummary> {
    try {
      const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation`, {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData(res);
      return normalizePayrollValidationSummary(runId, data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Fallback 1: validation-issues endpoint
        try {
          const fbRes = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation-issues`, {
            headers: { "Cache-Control": "no-cache" },
            skipCache: true,
          });
          const fbData = extractData(fbRes);
          if (fbData) {
            return normalizePayrollValidationSummary(runId, fbData);
          }
        } catch {
          // Fall through
        }

        // Fallback 2: legacy /payroll/runs/{runId}/validation
        try {
          const fbRes2 = await apiInstance.get(`/payroll/runs/${runId}/validation`, {
            headers: { "Cache-Control": "no-cache" },
            skipCache: true,
          });
          const fbData2 = extractData(fbRes2);
          if (fbData2) {
            return normalizePayrollValidationSummary(runId, fbData2);
          }
        } catch {
          // Fall through
        }

        // Fallback 3: preview endpoint if validation is embedded
        try {
          const previewRes = await apiInstance.get(`/api/v2/payroll/runs/${runId}/preview`, {
            headers: { "Cache-Control": "no-cache" },
            skipCache: true,
          });
          const previewData = extractData<Record<string, unknown>>(previewRes);
          if (previewData && typeof previewData.validation === "object") {
            const v = previewData.validation as Record<string, unknown>;
            const errs = Array.isArray(v.errors) ? v.errors : [];
            const warns = Array.isArray(v.warnings) ? v.warnings : [];
            return normalizePayrollValidationSummary(runId, {
              ...previewData,
              issues: [
                ...errs.map((e: unknown) => ({
                  ...((e && typeof e === "object" ? e : {}) as Record<string, unknown>),
                  severity: "error",
                  blocking: true,
                })),
                ...warns.map((w: unknown) => ({
                  ...((w && typeof w === "object" ? w : {}) as Record<string, unknown>),
                  severity: "warning",
                  blocking: false,
                })),
              ],
            });
          }
        } catch {
          // Fall through
        }

        // Fallback 4: generation-status endpoint if validationIssues is embedded
        try {
          const statusRes = await apiInstance.get(
            `/api/v2/payroll/runs/${runId}/generation-status`,
            { headers: { "Cache-Control": "no-cache" }, skipCache: true },
          );
          const statusData = extractData<Record<string, unknown>>(statusRes);
          if (statusData?.validationIssues || statusData?.validation_issues) {
            return normalizePayrollValidationSummary(runId, {
              ...statusData,
              issues: statusData.validationIssues || statusData.validation_issues || [],
            });
          }
        } catch {
          // Fall through
        }
      }
      throw err;
    }
  },

  /**
   * Run or trigger fresh backend validation for a payroll run.
   * POST /api/v2/payroll/runs/{runId}/validate
   */
  async runPayrollValidation(
    runId: string,
  ): Promise<{ success: boolean; message?: string; status?: string }> {
    try {
      const res = await apiInstance.post(
        `/api/v2/payroll/runs/${runId}/validate`,
        {},
        { headers: { "Cache-Control": "no-cache" } },
      );
      const data = extractData<Record<string, unknown>>(res);
      return {
        success: Boolean(data?.success ?? true),
        message: (data?.message || "Payroll validation completed successfully.") as string,
        status: (data?.status || "Completed") as string,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Fallback to /revalidate
        try {
          const fbRes = await apiInstance.post(`/api/v2/payroll/runs/${runId}/revalidate`, {});
          const fbData = extractData<Record<string, unknown>>(fbRes);
          return {
            success: Boolean(fbData?.success ?? true),
            message: (fbData?.message || "Payroll validation completed.") as string,
            status: (fbData?.status || "Completed") as string,
          };
        } catch {
          // Re-throw
        }
      }
      throw err;
    }
  },

  /**
   * Fetch comprehensive payroll review & approval data for a completed/provision run.
   * GET /api/v2/payroll/runs/{runId}/approval or fallback to aggregating preview and validation.
   * ZERO MOCK DATA: throws if backend cannot be reached so UI displays authentic error state.
   */
  async getPayrollReview(runId: string): Promise<PayrollReviewData> {
    const requestConfig = {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    };

    // Primary: /api/v2/payroll/runs/{runId}/approval
    try {
      const res = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/approval`,
        requestConfig,
      );
      const data = extractData(res);
      if (data && typeof data === "object") {
        return normalizePayrollReviewData(runId, data);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status !== 404) {
        throw err;
      }
      // If 404, check alternative /review endpoint
      try {
        const reviewRes = await apiInstance.get(
          `/api/v2/payroll/runs/${runId}/review`,
          requestConfig,
        );
        const reviewData = extractData(reviewRes);
        if (reviewData && typeof reviewData === "object") {
          return normalizePayrollReviewData(runId, reviewData);
        }
      } catch (reviewErr: unknown) {
        if (axios.isAxiosError(reviewErr) && reviewErr.response?.status !== 404) {
          throw reviewErr;
        }
      }
    }

    // Fallback: Aggregate authentic backend data from preview, validation, and run status
    const [previewRes, validationRes, statusRes] = await Promise.allSettled([
      this.getPayrollPreview(runId),
      this.getPayrollValidation(runId),
      this.getPayrollRunStatus(runId),
    ]);

    const preview = previewRes.status === "fulfilled" ? previewRes.value : null;
    const validation = validationRes.status === "fulfilled" ? validationRes.value : null;
    const runStatus = statusRes.status === "fulfilled" ? statusRes.value : null;

    // If all three calls failed, backend is unreachable for this run: throw authentic error
    if (!preview && !validation && !runStatus) {
      const rejectedReason =
        (previewRes as PromiseRejectedResult).reason ||
        (validationRes as PromiseRejectedResult).reason ||
        (statusRes as PromiseRejectedResult).reason;
      throw rejectedReason || new Error(`Payroll run ${runId} not found on backend.`);
    }

    return normalizePayrollReviewData(runId, {}, preview, validation, runStatus);
  },

  /**
   * Approve a processed & validated payroll run through the real backend API.
   * POST /api/v2/payroll/runs/{runId}/approve
   * Approving transitions the run to 'Approved'. It does NOT finalize or disburse funds.
   */
  async approvePayroll(
    runId: string,
    payload?: ApprovePayrollPayload,
  ): Promise<ApprovePayrollResponse> {
    const body: Record<string, any> = {
      comments: payload?.comments || payload?.notes || undefined,
    };

    try {
      const res = await apiInstance.post(
        `/api/v2/payroll/runs/${runId}/approve`,
        body,
        { headers: { "Cache-Control": "no-cache" } },
      );
      const data = extractData<any>(res);
      return {
        success: Boolean(data?.success ?? true),
        message: data?.message || "Payroll run approved successfully.",
        status: data?.status || "Approved",
        approval: data?.approval || undefined,
        ...data,
      };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback POST /payroll/runs/{runId}/approve
        try {
          const fbRes = await apiInstance.post(
            `/payroll/runs/${runId}/approve`,
            body,
            { headers: { "Cache-Control": "no-cache" } },
          );
          const fbData = extractData<any>(fbRes);
          return {
            success: Boolean(fbData?.success ?? true),
            message: fbData?.message || "Payroll run approved successfully.",
            status: fbData?.status || "Approved",
            approval: fbData?.approval || undefined,
            ...fbData,
          };
        } catch {
          // Fall through and throw original
        }
      }
      throw err;
    }
  },

  /**
   * Reject / Send back a payroll run for correction through the real backend API.
   * POST /api/v2/payroll/runs/{runId}/reject
   */
  async rejectPayroll(
    runId: string,
    payload: RejectPayrollPayload,
  ): Promise<RejectPayrollResponse> {
    const body: Record<string, any> = {
      reason: payload.reason,
      comments: payload.comments || undefined,
    };

    try {
      const res = await apiInstance.post(
        `/api/v2/payroll/runs/${runId}/reject`,
        body,
        { headers: { "Cache-Control": "no-cache" } },
      );
      const data = extractData<any>(res);
      return {
        success: Boolean(data?.success ?? true),
        message: data?.message || "Payroll run returned for correction.",
        status: data?.status || "Rejected",
        ...data,
      };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback 1: POST /api/v2/payroll/runs/{runId}/send-back
        try {
          const fbRes = await apiInstance.post(
            `/api/v2/payroll/runs/${runId}/send-back`,
            body,
            { headers: { "Cache-Control": "no-cache" } },
          );
          const fbData = extractData<any>(fbRes);
          return {
            success: Boolean(fbData?.success ?? true),
            message: fbData?.message || "Payroll run returned for correction.",
            status: fbData?.status || "Rejected",
            ...fbData,
          };
        } catch {
          // Continue to fallback 2
        }

        // Fallback 2: POST /payroll/runs/{runId}/reject
        try {
          const fbRes2 = await apiInstance.post(
            `/payroll/runs/${runId}/reject`,
            body,
            { headers: { "Cache-Control": "no-cache" } },
          );
          const fbData2 = extractData<any>(fbRes2);
          return {
            success: Boolean(fbData2?.success ?? true),
            message: fbData2?.message || "Payroll run returned for correction.",
            status: fbData2?.status || "Rejected",
            ...fbData2,
          };
        } catch {
          // Fall through
        }
      }
      throw err;
    }
  },

  /**
   * Fetch comprehensive payroll finalization data for a run.
   * GET /api/v2/payroll/runs/{runId}/finalization with fallback to getPayrollReview.
   * ZERO MOCK DATA: throws if backend cannot be reached so UI displays authentic error state.
   */
  async getPayrollFinalization(runId: string): Promise<PayrollFinalizationData> {
    const requestConfig = {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    };

    // Primary: /api/v2/payroll/runs/{runId}/finalization
    try {
      const res = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/finalization`,
        requestConfig,
      );
      const data = extractData<any>(res);
      if (data && typeof data === "object") {
        return normalizePayrollFinalizationData(runId, data);
      }
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        throw err;
      }
    }

    // Fallback: Use getPayrollReview to get authoritative calculation, validation, and approval state
    const reviewData = await this.getPayrollReview(runId);
    return normalizePayrollFinalizationData(runId, {}, reviewData);
  },

  /**
   * Finalize and lock a payroll run through the real backend API.
   * POST /api/v2/payroll/runs/{runId}/finalize
   * Finalization freezes figures and locks the run. It does NOT execute payment.
   */
  async finalizePayroll(
    runId: string,
    payload?: FinalizePayrollPayload,
  ): Promise<FinalizePayrollResponse> {
    const body: Record<string, any> = {
      notes: payload?.notes || undefined,
      lock: payload?.lock ?? true,
    };

    try {
      const res = await apiInstance.post(
        `/api/v2/payroll/runs/${runId}/finalize`,
        body,
        { headers: { "Cache-Control": "no-cache" } },
      );
      const data = extractData<any>(res);
      return {
        success: Boolean(data?.success ?? true),
        message: data?.message || "Payroll run finalized and locked successfully.",
        status: data?.status || "Finalized",
        isFinalized: true,
        isLocked: true,
        finalizedAt: data?.finalizedAt || data?.finalized_at || undefined,
        finalizedBy: data?.finalizedBy || data?.finalized_by || undefined,
        ...data,
      };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback 1: POST /payroll/runs/{runId}/finalize
        try {
          const fbRes = await apiInstance.post(
            `/payroll/runs/${runId}/finalize`,
            body,
            { headers: { "Cache-Control": "no-cache" } },
          );
          const fbData = extractData<any>(fbRes);
          return {
            success: Boolean(fbData?.success ?? true),
            message: fbData?.message || "Payroll run finalized and locked successfully.",
            status: fbData?.status || "Finalized",
            isFinalized: true,
            isLocked: true,
            ...fbData,
          };
        } catch {
          // Continue to fallback 2
        }

        // Fallback 2: POST /api/v2/payroll/runs/{runId}/lock
        try {
          const fbRes2 = await apiInstance.post(
            `/api/v2/payroll/runs/${runId}/lock`,
            body,
            { headers: { "Cache-Control": "no-cache" } },
          );
          const fbData2 = extractData<any>(fbRes2);
          return {
            success: Boolean(fbData2?.success ?? true),
            message: fbData2?.message || "Payroll run locked and finalized.",
            status: fbData2?.status || "Finalized",
            isFinalized: true,
            isLocked: true,
            ...fbData2,
          };
        } catch {
          // Fall through
        }
      }
      throw err;
    }
  },

  /**
   * Fetch official final payslip data for a specific employee in a finalized run.
   * Primary: GET /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip
   * Fallback: Synthesizes authoritative calculation & finalization metadata.
   */
  async getPayslip(runId: string, employeeId: string): Promise<PayrollPayslipData> {
    const requestConfig = {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    };

    // Primary: GET /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip
    try {
      const res = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/employees/${employeeId}/payslip`,
        requestConfig,
      );
      const data = extractData<any>(res);
      if (data && typeof data === "object") {
        return normalizePayrollPayslipData(runId, employeeId, data);
      }
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        throw err;
      }
    }

    // Fallback 1: GET /api/v2/payroll/payslips/{runId}/{employeeId}
    try {
      const res1 = await apiInstance.get(
        `/api/v2/payroll/payslips/${runId}/${employeeId}`,
        requestConfig,
      );
      const data1 = extractData<any>(res1);
      if (data1 && typeof data1 === "object") {
        return normalizePayrollPayslipData(runId, employeeId, data1);
      }
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        throw err;
      }
    }

    // Fallback 2: Retrieve employee detail and run finalization status from backend
    const [empData, finalData] = await Promise.all([
      this.getRunEmployeeDetail(runId, employeeId),
      this.getPayrollFinalization(runId).catch(() => null),
    ]);

    if (!empData) {
      const notFoundErr: any = new Error("Payslip record not found for employee on backend.");
      notFoundErr.response = { status: 404 };
      throw notFoundErr;
    }

    return normalizePayrollPayslipData(runId, employeeId, {}, empData, finalData);
  },

  /**
   * Fetch payslip by unique payslip ID or reference.
   * GET /api/v2/payroll/payslips/{payslipId}
   */
  async getPayslipById(payslipId: string): Promise<PayrollPayslipData> {
    try {
      const res = await apiInstance.get(`/api/v2/payroll/payslips/${payslipId}`, {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData<any>(res);
      return normalizePayrollPayslipData(data?.runId || "", data?.employeeId || "", data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const fbRes = await apiInstance.get(`/payroll/payslips/${payslipId}`, {
            headers: { "Cache-Control": "no-cache" },
            skipCache: true,
          });
          const fbData = extractData<any>(fbRes);
          return normalizePayrollPayslipData(fbData?.runId || "", fbData?.employeeId || "", fbData);
        } catch {
          // Fall through
        }
      }
      throw err;
    }
  },

  /**
   * Download the official backend generated payslip document as a Blob.
   * GET /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip/download
   */
  async downloadPayslip(runId: string, employeeId: string): Promise<Blob> {
    try {
      const res = await apiInstance.get<Blob>(
        `/api/v2/payroll/runs/${runId}/employees/${employeeId}/payslip/download`,
        {
          responseType: "blob",
          headers: { "Cache-Control": "no-cache" },
        },
      );
      return res.data;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback 1: /payroll/runs/{runId}/employees/{employeeId}/payslip/download
        try {
          const fbRes = await apiInstance.get<Blob>(
            `/payroll/runs/${runId}/employees/${employeeId}/payslip/download`,
            { responseType: "blob" },
          );
          return fbRes.data;
        } catch {
          // Fall through
        }
      }
      throw err;
    }
  },

  /**
   * Generate payslips batch or single for a finalized run via backend.
   * POST /api/v2/payroll/runs/{runId}/payslips/generate
   */
  async generatePayslips(
    runId: string,
    payload?: GeneratePayslipsPayload,
  ): Promise<GeneratePayslipsResponse> {
    try {
      const res = await apiInstance.post(
        `/api/v2/payroll/runs/${runId}/payslips/generate`,
        payload ?? {},
        { headers: { "Cache-Control": "no-cache" } },
      );
      const data = extractData<any>(res);
      return {
        success: Boolean(data?.success ?? true),
        message: data?.message || "Final payslips generated successfully.",
        generatedCount: data?.generatedCount ?? data?.count ?? undefined,
        totalCount: data?.totalCount ?? undefined,
        ...data,
      };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const fbRes = await apiInstance.post(
            `/payroll/runs/${runId}/payslips/generate`,
            payload ?? {},
            { headers: { "Cache-Control": "no-cache" } },
          );
          const fbData = extractData<any>(fbRes);
          return {
            success: Boolean(fbData?.success ?? true),
            message: fbData?.message || "Final payslips generated successfully.",
            ...fbData,
          };
        } catch {
          // Fall through
        }
      }
      throw err;
    }
  },

  /**
   * Fetch employee payslip history.
   * GET /api/v2/payroll/employees/{employeeId}/payslips
   */
  async getEmployeePayslipHistory(
    employeeId: string,
    params?: { page?: number; limit?: number },
  ): Promise<{ items: PayslipHistoryItem[]; total: number }> {
    const p = new URLSearchParams();
    if (params?.page) p.set("page", String(params.page));
    if (params?.limit) p.set("limit", String(params.limit));
    const q = p.toString() ? `?${p.toString()}` : "";

    try {
      const res = await apiInstance.get(`/api/v2/payroll/employees/${employeeId}/payslips${q}`, {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData<any>(res);
      const rawItems = Array.isArray(data) ? data : data?.items || data?.records || [];
      return {
        items: rawItems.map((r: any) => ({
          id: r.id || r.payslipId || `${r.runId}_${employeeId}`,
          runId: r.runId || r.run_id || null,
          employeeId: r.employeeId || r.employee_id || employeeId,
          employeeName: r.employeeName || r.name || null,
          department: r.department || null,
          periodName: r.periodName || r.period_name || null,
          financialYear: r.financialYear || r.financial_year || null,
          payslipNumber: r.payslipNumber || r.payslip_number || null,
          netPay: r.netPay != null ? Number(r.netPay) : null,
          grossEarnings: r.grossEarnings != null ? Number(r.grossEarnings) : null,
          totalDeductions: r.totalDeductions != null ? Number(r.totalDeductions) : null,
          status: r.status || "Finalized",
          isFinalized: Boolean(r.isFinalized ?? true),
          finalizedAt: r.finalizedAt || r.finalized_at || null,
          paymentDate: r.paymentDate || r.payment_date || null,
          hasDocument: Boolean(r.hasDocument || r.pdfUrl || r.downloadUrl),
        })),
        total: data?.total ?? rawItems.length,
      };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const fbRes = await apiInstance.get(`/payroll/employees/${employeeId}/payslips${q}`, {
            headers: { "Cache-Control": "no-cache" },
            skipCache: true,
          });
          const fbData = extractData<any>(fbRes);
          const fbItems = Array.isArray(fbData) ? fbData : fbData?.items || [];
          return {
            items: fbItems.map((r: any) => ({
              id: r.id || `${r.runId}_${employeeId}`,
              runId: r.runId || null,
              employeeId,
              periodName: r.periodName || null,
              payslipNumber: r.payslipNumber || null,
              netPay: r.netPay != null ? Number(r.netPay) : null,
              status: r.status || "Finalized",
              isFinalized: true,
              finalizedAt: r.finalizedAt || null,
            })),
            total: fbData?.total ?? fbItems.length,
          };
        } catch {
          return { items: [], total: 0 };
        }
      }
      throw err;
    }
  },

  /**
   * Fetch current user's payslips for self-service portal.
   * GET /api/v2/payroll/my-payslips
   */
  async getMyPayslips(
    params?: { page?: number; limit?: number },
  ): Promise<{ items: PayslipHistoryItem[]; total: number }> {
    const p = new URLSearchParams();
    if (params?.page) p.set("page", String(params.page));
    if (params?.limit) p.set("limit", String(params.limit));
    const q = p.toString() ? `?${p.toString()}` : "";

    try {
      const res = await apiInstance.get(`/api/v2/payroll/my-payslips${q}`, {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData<any>(res);
      const rawItems = Array.isArray(data) ? data : data?.items || data?.records || [];
      return {
        items: rawItems.map((r: any) => ({
          id: r.id || r.payslipId || `${r.runId}_me`,
          runId: r.runId || r.run_id || null,
          employeeId: r.employeeId || r.employee_id || null,
          periodName: r.periodName || r.period_name || null,
          financialYear: r.financialYear || r.financial_year || null,
          payslipNumber: r.payslipNumber || r.payslip_number || null,
          netPay: r.netPay != null ? Number(r.netPay) : null,
          grossEarnings: r.grossEarnings != null ? Number(r.grossEarnings) : null,
          totalDeductions: r.totalDeductions != null ? Number(r.totalDeductions) : null,
          status: r.status || "Finalized",
          isFinalized: Boolean(r.isFinalized ?? true),
          finalizedAt: r.finalizedAt || r.finalized_at || null,
          paymentDate: r.paymentDate || r.payment_date || null,
          hasDocument: Boolean(r.hasDocument || r.pdfUrl || r.downloadUrl),
        })),
        total: data?.total ?? rawItems.length,
      };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const fbRes = await apiInstance.get(`/payroll/my-payslips${q}`, {
            headers: { "Cache-Control": "no-cache" },
            skipCache: true,
          });
          const fbData = extractData<any>(fbRes);
          const fbItems = Array.isArray(fbData) ? fbData : fbData?.items || [];
          return {
            items: fbItems.map((r: any) => ({
              id: r.id || `${r.runId}_me`,
              runId: r.runId || null,
              periodName: r.periodName || null,
              payslipNumber: r.payslipNumber || null,
              netPay: r.netPay != null ? Number(r.netPay) : null,
              status: r.status || "Finalized",
              isFinalized: true,
            })),
            total: fbData?.total ?? fbItems.length,
          };
        } catch {
          return { items: [], total: 0 };
        }
      }
      throw err;
    }
  },
};

export default payrollApi;
