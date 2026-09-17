import apiInstance from "@/api/apiInstance";

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
    components?: Record<string, any>;
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
    components?: Record<string, any> | null;
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

function extractData<T>(res: unknown): T {
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

export function normalizePayrollPeriod(item: any): PayrollPeriod {
  if (!item || typeof item !== "object") {
    return {
      id: "",
      name: "",
      startDate: "",
      endDate: "",
    };
  }

  const id = String(item.id || item.cycle_id || item.period_id || item._id || "");
  const month = Number(item.period_month ?? item.month ?? 0) || undefined;
  const year = Number(item.period_year ?? item.year ?? 0) || undefined;

  let name = item.name || item.period_name || item.title || "";
  if (!name && month && year) {
    name = `${MONTH_NAMES[month] || `Month ${month}`} ${year}`;
  } else if (!name && (item.startDate || item.start_date)) {
    name = String(item.startDate || item.start_date);
  }

  const startDate = item.startDate || item.start_date || "";
  const endDate = item.endDate || item.end_date || "";
  const payDate = item.payDate || item.pay_date || "";
  const rawStatus = item.status || (item.is_locked ? "Locked" : "Open");
  const employeeCount = item.employeeCount ?? item.employee_count ?? item.total_employees ?? null;
  const isLocked = Boolean(
    item.is_locked ||
    item.isLocked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );
  const isCurrent = Boolean(item.isCurrent || item.is_current);
  const createdAt = item.createdAt || item.created_at || "";
  const updatedAt = item.updatedAt || item.updated_at || "";
  const remarks = item.remarks || item.notes || "";

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

export function normalizePayrollRunStatus(runId: string, raw: any): PayrollRunStatus {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Processing",
    };
  }

  const status =
    raw.status ||
    raw.run_status ||
    raw.state ||
    raw.job_status ||
    (raw.is_completed ? "Completed" : raw.is_failed ? "Failed" : "Processing");

  const periodId = raw.periodId || raw.period_id || raw.cycleId || raw.cycle_id || null;
  const periodName = raw.periodName || raw.period_name || raw.cycle_name || raw.name || null;
  const jobId = raw.jobId || raw.job_id || raw.id || null;

  // Real progress ONLY if provided as number
  let progress: number | null = null;
  if (typeof raw.progress === "number" && !isNaN(raw.progress)) {
    progress = Math.min(100, Math.max(0, raw.progress));
  } else if (typeof raw.percentage === "number" && !isNaN(raw.percentage)) {
    progress = Math.min(100, Math.max(0, raw.percentage));
  } else if (typeof raw.percent_complete === "number" && !isNaN(raw.percent_complete)) {
    progress = Math.min(100, Math.max(0, raw.percent_complete));
  }

  const currentStep = raw.currentStep || raw.current_step || raw.step || raw.operation || null;

  // Real employees count ONLY if provided
  let employees: PayrollRunStatus["employees"] = null;
  const rawEmp = raw.employees || raw.employee_counts || raw.stats;
  if (rawEmp && typeof rawEmp === "object") {
    employees = {
      total: rawEmp.total ?? rawEmp.total_employees ?? raw.totalEmployees ?? null,
      processed: rawEmp.processed ?? rawEmp.processed_count ?? raw.processedEmployees ?? null,
      failed: rawEmp.failed ?? rawEmp.failed_count ?? null,
    };
  } else if (
    raw.totalEmployees != null ||
    raw.processedEmployees != null ||
    raw.employee_count != null
  ) {
    employees = {
      total: raw.totalEmployees ?? raw.employee_count ?? raw.total_count ?? null,
      processed: raw.processedEmployees ?? raw.processed_count ?? null,
      failed: raw.failedEmployees ?? null,
    };
  }

  // Steps if provided by backend
  let steps: PayrollRunStep[] | null = null;
  const rawSteps = raw.steps || raw.pipeline_steps || raw.operations;
  if (Array.isArray(rawSteps)) {
    steps = rawSteps.map((s: any, idx: number) => ({
      id: String(s.id || s.step_id || `step-${idx}`),
      name: String(s.name || s.title || s.step_name || `Step ${idx + 1}`),
      status: String(s.status || s.state || "pending"),
      details: s.details || s.message || undefined,
      order: s.order ?? idx,
    }));
  }

  // Error details if provided by backend
  let error: PayrollRunStatus["error"] = null;
  if (raw.error) {
    if (typeof raw.error === "string") {
      error = { message: raw.error };
    } else if (typeof raw.error === "object") {
      error = {
        code: raw.error.code || raw.error.error_code,
        message: raw.error.message || raw.error.detail || String(raw.error),
      };
    }
  } else if (raw.errorMessage || raw.error_message) {
    error = { message: String(raw.errorMessage || raw.error_message) };
  }

  // Validation issues if provided by backend
  let validationIssues: PayrollRunValidationIssue[] | null = null;
  const rawIssues = raw.validationIssues || raw.validation_issues || raw.issues;
  if (Array.isArray(rawIssues)) {
    validationIssues = rawIssues.map((iss: any, idx: number) => ({
      id: String(iss.id || `issue-${idx}`),
      severity: String(iss.severity || iss.level || "warning"),
      category: iss.category || iss.type || "General",
      message: String(iss.message || iss.description || ""),
      employeeId: iss.employeeId || iss.employee_id,
      employeeName: iss.employeeName || iss.employee_name,
      resolved: Boolean(iss.resolved),
    }));
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
    startedAt: raw.startedAt || raw.started_at || null,
    completedAt: raw.completedAt || raw.completed_at || null,
    ...raw,
  };
}

export function normalizePayrollEmployee(item: any): PayrollPreviewEmployee {
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

  const id = String(item.id || item._id || item.employee_id || item.employeeId || "");
  const employeeId = String(
    item.employeeId || item.employee_id || item.emp_id || item.employee_code || item.code || id,
  );
  const name =
    item.name ||
    item.employee_name ||
    item.employeeName ||
    (item.first_name ? `${item.first_name} ${item.last_name || ""}`.trim() : "") ||
    "Unnamed Employee";
  const email = item.email || item.work_email || undefined;
  const designation = item.designation || item.job_title || item.role || undefined;
  const department = item.department || item.dept || item.department_name || undefined;
  const location = item.location || item.branch || item.city || undefined;

  const grossEarnings =
    item.grossEarnings ??
    item.gross_earnings ??
    item.grossSalary ??
    item.gross_salary ??
    item.gross ??
    null;
  const totalDeductions =
    item.totalDeductions ??
    item.total_deductions ??
    item.deductions_total ??
    item.deductions ??
    null;
  const netPay =
    item.netPay ?? item.net_pay ?? item.netSalary ?? item.net_salary ?? item.net ?? null;
  const employerContribution =
    item.employerContribution ?? item.employer_contribution ?? item.employer_cost ?? null;

  const status = item.status || item.payroll_status || "Processed";
  const validationStatus =
    item.validationStatus || item.validation_status || (item.has_issues ? "warning" : "valid");

  // Earnings breakdown if present
  const rawEarnings = item.earnings || item.salary_breakdown?.earnings || item.components?.earnings;
  const earnings: PayrollEmployeeEarnings | undefined = rawEarnings
    ? {
        basic: rawEarnings.basic ?? rawEarnings.basic_monthly ?? null,
        hra: rawEarnings.hra ?? rawEarnings.hra_monthly ?? null,
        allowances: rawEarnings.allowances ?? rawEarnings.other_allowances ?? null,
        specialAllowance: rawEarnings.specialAllowance ?? rawEarnings.special_allowance ?? null,
        conveyance: rawEarnings.conveyance ?? rawEarnings.conveyance_monthly ?? null,
        overtime: rawEarnings.overtime ?? rawEarnings.overtime_amount ?? null,
        bonus: rawEarnings.bonus ?? rawEarnings.bonus_amount ?? null,
        incentives: rawEarnings.incentives ?? null,
        other: rawEarnings.other ?? null,
        ...rawEarnings,
      }
    : undefined;

  // Deductions breakdown if present
  const rawDeductions =
    item.deductions || item.salary_breakdown?.deductions || item.components?.deductions;
  const deductions: PayrollEmployeeDeductions | undefined = rawDeductions
    ? {
        pf: rawDeductions.pf ?? rawDeductions.epf ?? rawDeductions.provident_fund ?? null,
        esi: rawDeductions.esi ?? rawDeductions.esic ?? null,
        pt: rawDeductions.pt ?? rawDeductions.professional_tax ?? null,
        tds: rawDeductions.tds ?? rawDeductions.tax ?? rawDeductions.income_tax ?? null,
        incomeTax: rawDeductions.incomeTax ?? rawDeductions.income_tax ?? null,
        loan: rawDeductions.loan ?? rawDeductions.loan_deduction ?? null,
        advance: rawDeductions.advance ?? rawDeductions.advance_salary ?? null,
        other: rawDeductions.other ?? null,
        ...rawDeductions,
      }
    : undefined;

  // Attendance metrics if present
  const rawAtt = item.attendance || item.attendance_metrics;
  const attendance: PayrollEmployeeAttendance | undefined = rawAtt
    ? {
        workingDays: rawAtt.workingDays ?? rawAtt.working_days ?? rawAtt.total_days ?? null,
        paidDays: rawAtt.paidDays ?? rawAtt.paid_days ?? null,
        unpaidDays: rawAtt.unpaidDays ?? rawAtt.unpaid_days ?? rawAtt.loss_of_pay_days ?? null,
        leaveDays: rawAtt.leaveDays ?? rawAtt.leave_days ?? null,
        overtimeHours: rawAtt.overtimeHours ?? rawAtt.overtime_hours ?? null,
        lopDays: rawAtt.lopDays ?? rawAtt.lop_days ?? null,
        ...rawAtt,
      }
    : undefined;

  // Issues if present
  const rawIssues = item.issues || item.validation_issues || [];
  const issues = Array.isArray(rawIssues)
    ? rawIssues.map((iss: any) => ({
        id: iss.id,
        severity: iss.severity || "warning",
        message: iss.message || String(iss),
      }))
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
    issuesCount: issues ? issues.length : (item.issues_count ?? 0),
    issues,
    earnings,
    deductions,
    attendance,
    joiningDate: item.joiningDate || item.joining_date || item.doj || item.date_of_joining || null,
    employmentStatus:
      item.employmentStatus ||
      item.employment_status ||
      item.employee_type ||
      item.employment_type ||
      null,
    financialYear: item.financialYear || item.financial_year || item.fy || null,
    periodName: item.periodName || item.period_name || item.cycle_name || null,
    periodId: item.periodId || item.period_id || item.cycle_id || null,
    runStatus: item.runStatus || item.run_status || item.payroll_status || null,
    calculationStatus: item.calculationStatus || item.calculation_status || null,
    statutory: item.statutory || item.statutory_contributions || null,
    salaryStructure: item.salaryStructure || item.salary_structure || null,
    ytd: item.ytd || item.year_to_date || null,
    previousComparison:
      item.previousComparison || item.previous_comparison || item.comparison || null,
    audit: item.audit || item.calculation_metadata || null,
    bankInfo: item.bankInfo || item.bank_details || item.bank || null,
    ...item,
  };
}

export function normalizePayrollPreviewData(runId: string, raw: any): PayrollPreviewData {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Provision Generated",
      summary: null,
    };
  }

  const periodId = raw.periodId || raw.period_id || raw.cycleId || raw.cycle_id || null;
  const periodName = raw.periodName || raw.period_name || raw.cycle_name || raw.name || null;
  const status = raw.status || raw.run_status || "Provision Generated";
  const runDate = raw.runDate || raw.run_date || raw.createdAt || raw.created_at || null;
  const generatedAt =
    raw.generatedAt || raw.generated_at || raw.updatedAt || raw.updated_at || null;

  // Raw summary
  const s = raw.summary || raw.totals || raw.stats || raw;
  const summary: PayrollPreviewSummary = {
    employeeCount:
      s.employeeCount ?? s.employee_count ?? s.totalEmployees ?? s.total_employees ?? null,
    grossPayroll: s.grossPayroll ?? s.gross_payroll ?? s.totalGross ?? s.total_gross ?? null,
    totalEarnings: s.totalEarnings ?? s.total_earnings ?? s.grossPayroll ?? s.gross_payroll ?? null,
    totalDeductions: s.totalDeductions ?? s.total_deductions ?? s.deductions ?? null,
    netPayroll: s.netPayroll ?? s.net_payroll ?? s.totalNet ?? s.total_net ?? null,
    employerCost: s.employerCost ?? s.employer_cost ?? s.totalCost ?? s.total_cost ?? null,
    employerContribution: s.employerContribution ?? s.employer_contribution ?? null,
  };

  // Raw validation
  let validation: PayrollPreviewData["validation"] = null;
  const v = raw.validation || raw.validation_results;
  if (v && typeof v === "object") {
    validation = {
      errors: Array.isArray(v.errors) ? v.errors : [],
      warnings: Array.isArray(v.warnings) ? v.warnings : [],
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
  raw: any,
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

  let rawList: any[] = [];
  if (Array.isArray(raw)) {
    rawList = raw;
  } else if (Array.isArray(raw.issues)) {
    rawList = raw.issues;
  } else if (Array.isArray(raw.items)) {
    rawList = raw.items;
  } else if (Array.isArray(raw.validation_issues)) {
    rawList = raw.validation_issues;
  } else if (Array.isArray(raw.validationIssues)) {
    rawList = raw.validationIssues;
  } else if (raw.validation && typeof raw.validation === "object") {
    const errs = Array.isArray(raw.validation.errors)
      ? raw.validation.errors.map((e: any) => ({ ...e, severity: "error", blocking: true }))
      : [];
    const warns = Array.isArray(raw.validation.warnings)
      ? raw.validation.warnings.map((w: any) => ({ ...w, severity: "warning", blocking: false }))
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
      category: item.category || item.type || item.module || "General",
      code: item.code || item.error_code || item.rule_id || item.ruleCode || undefined,
      message: item.message || item.description || item.detail || "Validation issue detected",
      employeeId: item.employeeId || item.employee_id || item.emp_id || undefined,
      employeeName: item.employeeName || item.employee_name || item.name || undefined,
      department: item.department || item.dept || item.department_name || undefined,
      component: item.component || item.field || item.salary_component || undefined,
      blocking,
      status: item.status || (item.resolved ? "resolved" : "open"),
      detectedAt:
        item.detectedAt || item.detected_at || item.created_at || item.createdAt || undefined,
      resolved: item.resolved !== undefined ? Boolean(item.resolved) : undefined,
      resolution: item.resolution || item.resolution_notes || item.notes || undefined,
      resolvedAt: item.resolvedAt || item.resolved_at || undefined,
      resolvedBy: item.resolvedBy || item.resolved_by || undefined,
      source: item.source || item.reference || item.rule || undefined,
      ...item,
    };
  });

  const errorsCount = Number(
    raw.errorsCount ??
      raw.errors_count ??
      raw.errors?.length ??
      issues.filter(
        (i) => i.severity === "error" || i.severity === "critical" || i.severity === "fatal",
      ).length,
  );
  const warningsCount = Number(
    raw.warningsCount ??
      raw.warnings_count ??
      raw.warnings?.length ??
      issues.filter(
        (i) => i.severity === "warning" || i.severity === "advisory" || i.severity === "info",
      ).length,
  );
  const totalIssues = Number(raw.totalIssues ?? raw.total_issues ?? raw.total ?? issues.length);

  // Derive blocking count ONLY if backend provides blocking flags or counts
  const hasBlockingInfo =
    raw.blockingCount != null ||
    raw.blocking_count != null ||
    raw.blockingIssuesCount != null ||
    issues.some((i) => i.blocking !== undefined);

  const blockingCount: number | null = hasBlockingInfo
    ? Number(
        raw.blockingCount ??
          raw.blocking_count ??
          raw.blockingIssuesCount ??
          issues.filter((i) => i.blocking === true).length,
      )
    : null;

  const affectedEmps = new Set<string>();
  issues.forEach((i) => {
    if (i.employeeId) affectedEmps.add(i.employeeId);
  });
  const affectedEmployeesCount = Number(
    raw.affectedEmployeesCount ??
      raw.affected_employees ??
      raw.affectedEmployees ??
      (affectedEmps.size || 0),
  );

  let status = raw.status || raw.validation_status || raw.state;
  if (!status) {
    if (errorsCount > 0) status = "Failed";
    else if (warningsCount > 0) status = "Warning";
    else if (issues.length === 0) status = "Passed";
    else status = "Completed";
  }

  return {
    runId,
    status,
    periodName: raw.periodName || raw.period_name || null,
    periodId: raw.periodId || raw.period_id || null,
    runStatus: raw.runStatus || raw.run_status || null,
    totalIssues,
    errorsCount,
    warningsCount,
    affectedEmployeesCount,
    blockingCount,
    lastValidatedAt:
      raw.lastValidatedAt || raw.last_validated_at || raw.validatedAt || raw.validated_at || null,
    issues,
    ...raw,
  };
}

export function normalizePayrollReviewData(
  runId: string,
  raw: any,
  previewFallback?: PayrollPreviewData | null,
  validationFallback?: PayrollValidationSummary | null,
  statusFallback?: PayrollRunStatus | null,
): PayrollReviewData {
  const periodId =
    raw?.periodId ||
    raw?.period_id ||
    raw?.cycleId ||
    raw?.cycle_id ||
    previewFallback?.periodId ||
    statusFallback?.periodId ||
    null;

  const periodName =
    raw?.periodName ||
    raw?.period_name ||
    raw?.cycleName ||
    raw?.cycle_name ||
    previewFallback?.periodName ||
    statusFallback?.periodName ||
    null;

  const rawStatus =
    raw?.status ||
    raw?.run_status ||
    raw?.state ||
    previewFallback?.status ||
    statusFallback?.status ||
    "Under Review";

  const runDate =
    raw?.runDate ||
    raw?.run_date ||
    raw?.createdAt ||
    raw?.created_at ||
    previewFallback?.runDate ||
    null;

  const generatedAt =
    raw?.generatedAt ||
    raw?.generated_at ||
    raw?.calculatedAt ||
    raw?.calculated_at ||
    previewFallback?.generatedAt ||
    null;

  const lastUpdatedAt =
    raw?.lastUpdatedAt ||
    raw?.last_updated_at ||
    raw?.updatedAt ||
    raw?.updated_at ||
    raw?.approvedAt ||
    raw?.approved_at ||
    null;

  // Summary extraction
  let summary: PayrollPreviewSummary | null = null;
  const rawSummary = raw?.summary || raw?.totals || raw?.stats || previewFallback?.summary;
  if (rawSummary && typeof rawSummary === "object") {
    summary = {
      employeeCount:
        rawSummary.employeeCount ??
        rawSummary.employee_count ??
        rawSummary.totalEmployees ??
        rawSummary.total_employees ??
        previewFallback?.summary?.employeeCount ??
        statusFallback?.employees?.total ??
        null,
      grossPayroll:
        rawSummary.grossPayroll ??
        rawSummary.gross_payroll ??
        rawSummary.totalGross ??
        rawSummary.total_gross ??
        previewFallback?.summary?.grossPayroll ??
        null,
      totalEarnings:
        rawSummary.totalEarnings ??
        rawSummary.total_earnings ??
        rawSummary.grossPayroll ??
        rawSummary.gross_payroll ??
        previewFallback?.summary?.totalEarnings ??
        null,
      totalDeductions:
        rawSummary.totalDeductions ??
        rawSummary.total_deductions ??
        rawSummary.deductions ??
        previewFallback?.summary?.totalDeductions ??
        null,
      netPayroll:
        rawSummary.netPayroll ??
        rawSummary.net_payroll ??
        rawSummary.totalNet ??
        rawSummary.total_net ??
        previewFallback?.summary?.netPayroll ??
        null,
      employerCost:
        rawSummary.employerCost ??
        rawSummary.employer_cost ??
        rawSummary.totalCost ??
        rawSummary.total_cost ??
        previewFallback?.summary?.employerCost ??
        null,
      employerContribution:
        rawSummary.employerContribution ??
        rawSummary.employer_contribution ??
        previewFallback?.summary?.employerContribution ??
        null,
    };
  }

  // Validation details extraction
  let validation: PayrollReviewData["validation"] = null;
  const rawVal = raw?.validation || raw?.validation_summary || validationFallback;
  if (rawVal && typeof rawVal === "object") {
    validation = {
      status: rawVal.status || rawVal.validation_status || validationFallback?.status || null,
      totalIssues: Number(
        rawVal.totalIssues ??
          rawVal.total_issues ??
          validationFallback?.totalIssues ??
          (rawVal.issues?.length || 0),
      ),
      errorsCount: Number(
        rawVal.errorsCount ??
          rawVal.errors_count ??
          validationFallback?.errorsCount ??
          (rawVal.errors?.length || 0),
      ),
      warningsCount: Number(
        rawVal.warningsCount ??
          rawVal.warnings_count ??
          validationFallback?.warningsCount ??
          (rawVal.warnings?.length || 0),
      ),
      affectedEmployeesCount: Number(
        rawVal.affectedEmployeesCount ??
          rawVal.affected_employees ??
          validationFallback?.affectedEmployeesCount ??
          0,
      ),
      blockingCount:
        rawVal.blockingCount != null
          ? Number(rawVal.blockingCount)
          : rawVal.blocking_count != null
            ? Number(rawVal.blocking_count)
            : validationFallback?.blockingCount != null
              ? Number(validationFallback.blockingCount)
              : null,
      issues: Array.isArray(rawVal.issues)
        ? rawVal.issues
        : Array.isArray(validationFallback?.issues)
          ? validationFallback.issues
          : undefined,
    };
  }

  // Approval details extraction
  const rawApp = raw?.approval || raw?.approval_status || raw;
  let approval: PayrollApprovalInfo | null = null;
  if (rawApp && typeof rawApp === "object") {
    const appStatus =
      rawApp.status ||
      rawApp.approval_status ||
      (String(rawStatus).toLowerCase() === "approved"
        ? "approved"
        : String(rawStatus).toLowerCase() === "rejected"
          ? "rejected"
          : "pending");

    approval = {
      status: appStatus,
      approvedBy:
        rawApp.approvedBy ||
        rawApp.approved_by ||
        rawApp.approver_id ||
        raw?.approvedBy ||
        raw?.approved_by ||
        null,
      approvedByName:
        rawApp.approvedByName ||
        rawApp.approved_by_name ||
        rawApp.approver_name ||
        raw?.approvedByName ||
        raw?.approved_by_name ||
        null,
      approvedAt:
        rawApp.approvedAt ||
        rawApp.approved_at ||
        raw?.approvedAt ||
        raw?.approved_at ||
        null,
      rejectedBy:
        rawApp.rejectedBy ||
        rawApp.rejected_by ||
        raw?.rejectedBy ||
        raw?.rejected_by ||
        null,
      rejectedByName:
        rawApp.rejectedByName ||
        rawApp.rejected_by_name ||
        raw?.rejectedByName ||
        raw?.rejected_by_name ||
        null,
      rejectedAt:
        rawApp.rejectedAt ||
        rawApp.rejected_at ||
        raw?.rejectedAt ||
        raw?.rejected_at ||
        null,
      rejectionReason:
        rawApp.rejectionReason ||
        rawApp.rejection_reason ||
        raw?.rejectionReason ||
        raw?.rejection_reason ||
        null,
      comments:
        rawApp.comments ||
        rawApp.comment ||
        rawApp.notes ||
        raw?.approvalComments ||
        raw?.approval_comments ||
        null,
      canApprove: rawApp.canApprove ?? rawApp.can_approve ?? true,
      canReject: rawApp.canReject ?? rawApp.can_reject ?? true,
      blockingReasons: rawApp.blockingReasons || rawApp.blocking_reasons || [],
      ...rawApp,
    };
  }

  // Audit log extraction
  let auditLog: PayrollAuditRecord[] | null = null;
  const rawAudit = raw?.auditLog || raw?.audit_log || raw?.history || raw?.timeline;
  if (Array.isArray(rawAudit)) {
    auditLog = rawAudit.map((item: any) => ({
      action: String(item.action || item.event || "Update"),
      user: item.user || item.user_id || null,
      userName: item.userName || item.user_name || item.name || null,
      timestamp: item.timestamp || item.created_at || item.createdAt || null,
      comment: item.comment || item.message || item.notes || null,
      previousStatus: item.previousStatus || item.previous_status || null,
      newStatus: item.newStatus || item.new_status || null,
      ...item,
    }));
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
    ...raw,
  };
}

export function normalizePayrollFinalizationData(
  runId: string,
  raw: any,
  reviewFallback?: PayrollReviewData | null,
): PayrollFinalizationData {
  const periodId =
    raw?.periodId ||
    raw?.period_id ||
    raw?.cycleId ||
    raw?.cycle_id ||
    reviewFallback?.periodId ||
    null;

  const periodName =
    raw?.periodName ||
    raw?.period_name ||
    raw?.cycleName ||
    raw?.cycle_name ||
    reviewFallback?.periodName ||
    null;

  const rawStatus =
    raw?.status ||
    raw?.run_status ||
    raw?.state ||
    reviewFallback?.status ||
    "Approved";

  const isLocked = Boolean(
    raw?.isLocked ||
    raw?.is_locked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );

  const isFinalized = Boolean(
    raw?.isFinalized ||
    raw?.is_finalized ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );

  const summary = raw?.summary || reviewFallback?.summary || null;
  const validation = raw?.validation || reviewFallback?.validation || null;
  const approval = raw?.approval || reviewFallback?.approval || null;

  const rawFin = raw?.finalization || raw?.finalized || raw;
  let finalization: PayrollFinalizationInfo | null = null;
  if (rawFin && typeof rawFin === "object") {
    finalization = {
      isFinalized: isFinalized || Boolean(rawFin.isFinalized || rawFin.is_finalized),
      isLocked: isLocked || Boolean(rawFin.isLocked || rawFin.is_locked),
      finalizedBy:
        rawFin.finalizedBy ||
        rawFin.finalized_by ||
        raw?.finalizedBy ||
        raw?.finalized_by ||
        null,
      finalizedByName:
        rawFin.finalizedByName ||
        rawFin.finalized_by_name ||
        raw?.finalizedByName ||
        raw?.finalized_by_name ||
        null,
      finalizedAt:
        rawFin.finalizedAt ||
        rawFin.finalized_at ||
        raw?.finalizedAt ||
        raw?.finalized_at ||
        null,
      finalizationNotes:
        rawFin.finalizationNotes ||
        rawFin.finalization_notes ||
        rawFin.notes ||
        raw?.finalizationNotes ||
        raw?.finalization_notes ||
        null,
      referenceNumber:
        rawFin.referenceNumber ||
        rawFin.reference_number ||
        rawFin.ref ||
        raw?.referenceNumber ||
        raw?.reference_number ||
        null,
      canFinalize: rawFin.canFinalize ?? rawFin.can_finalize ?? true,
      blockingReasons: rawFin.blockingReasons || rawFin.blocking_reasons || [],
      ...rawFin,
    };
  }

  const auditLog = raw?.auditLog || raw?.audit_log || reviewFallback?.auditLog || null;

  return {
    runId,
    periodId,
    periodName,
    status: rawStatus,
    isLocked,
    isFinalized,
    validationStatus: validation?.status || null,
    approvalStatus: approval?.status || null,
    runDate: raw?.runDate || raw?.run_date || reviewFallback?.runDate || null,
    generatedAt: raw?.generatedAt || raw?.generated_at || reviewFallback?.generatedAt || null,
    lastUpdatedAt:
      raw?.lastUpdatedAt ||
      raw?.last_updated_at ||
      reviewFallback?.lastUpdatedAt ||
      null,
    summary,
    validation,
    approval,
    finalization,
    auditLog,
    ...raw,
  };
}

// ── Step 9: Normalize Payslip Data ────────────────────────────────────

export function normalizePayrollPayslipData(
  runId: string,
  employeeId: string,
  raw: any,
  empFallback?: PayrollPreviewEmployee | null,
  finalFallback?: PayrollFinalizationData | null,
): PayrollPayslipData {
  const d = raw || {};
  const emp = d.employee || empFallback || {};
  const att = d.attendance || empFallback?.attendance || {};
  const earn = d.earnings || empFallback?.earnings || {};
  const ded = d.deductions || empFallback?.deductions || {};
  const stat = d.statutory || empFallback?.statutory || {};
  const doc = d.document || d.payslipDocument || {};

  const rawStatus =
    d.status ||
    d.payslipStatus ||
    finalFallback?.status ||
    empFallback?.runStatus ||
    "Finalized";

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

  return {
    id: d.id || d.payslipId || d.payslip_id || `${runId}_${employeeId}`,
    runId: d.runId || d.run_id || runId,
    employeeId: d.employeeId || d.employee_id || employeeId,
    payslipNumber:
      d.payslipNumber ||
      d.payslip_number ||
      d.referenceNumber ||
      d.reference_number ||
      d.slipNo ||
      null,
    referenceNumber:
      d.referenceNumber ||
      d.reference_number ||
      finalFallback?.finalization?.referenceNumber ||
      null,
    periodName:
      d.periodName ||
      d.period_name ||
      finalFallback?.periodName ||
      empFallback?.periodName ||
      null,
    periodId:
      d.periodId ||
      d.period_id ||
      finalFallback?.periodId ||
      empFallback?.periodId ||
      null,
    financialYear:
      d.financialYear ||
      d.financial_year ||
      empFallback?.financialYear ||
      null,
    startDate: d.startDate || d.start_date || d.periodStartDate || null,
    endDate: d.endDate || d.end_date || d.periodEndDate || null,
    paymentDate: d.paymentDate || d.payment_date || null,
    finalizedAt:
      d.finalizedAt ||
      d.finalized_at ||
      finalFallback?.finalization?.finalizedAt ||
      null,
    finalizedByName:
      d.finalizedByName ||
      d.finalized_by_name ||
      finalFallback?.finalization?.finalizedByName ||
      null,
    status: rawStatus,
    isFinalized,
    isLocked,
    employee: {
      id: emp.id || emp.employeeId || employeeId,
      name: emp.name || emp.employeeName || emp.full_name || "—",
      department: emp.department || emp.dept || null,
      designation: emp.designation || emp.role || null,
      location: emp.location || emp.branch || null,
      joiningDate: emp.joiningDate || emp.joining_date || emp.doj || null,
      employmentStatus: emp.employmentStatus || emp.employment_status || null,
      pan: emp.pan || emp.panNumber || emp.pan_number || null,
      uan: emp.uan || emp.uanNumber || emp.uan_number || null,
      pfNumber: emp.pfNumber || emp.pf_number || null,
      esiNumber: emp.esiNumber || emp.esi_number || null,
      bankInfo: emp.bankInfo || emp.bank || null,
    },
    attendance: {
      workingDays: att.workingDays ?? att.working_days ?? att.totalDays ?? null,
      paidDays: att.paidDays ?? att.paid_days ?? null,
      lopDays: att.lopDays ?? att.lop_days ?? att.unpaidDays ?? null,
      leaveDays: att.leaveDays ?? att.leave_days ?? null,
      presentDays: att.presentDays ?? att.present_days ?? null,
      holidays: att.holidays ?? att.holiday_days ?? null,
      weeklyOffs: att.weeklyOffs ?? att.weekly_offs ?? null,
      overtimeHours: att.overtimeHours ?? att.overtime_hours ?? null,
      ...att,
    },
    earnings: {
      basic: earn.basic ?? earn.basic_salary ?? null,
      hra: earn.hra ?? earn.house_rent_allowance ?? null,
      conveyance: earn.conveyance ?? earn.conveyance_allowance ?? null,
      specialAllowance: earn.specialAllowance ?? earn.special_allowance ?? null,
      medicalAllowance: earn.medicalAllowance ?? earn.medical_allowance ?? null,
      otherAllowances: earn.otherAllowances ?? earn.other_allowances ?? earn.allowances ?? null,
      overtime: earn.overtime ?? earn.overtime_pay ?? null,
      bonus: earn.bonus ?? null,
      incentives: earn.incentives ?? earn.incentive ?? null,
      arrears: earn.arrears ?? null,
      reimbursements: earn.reimbursements ?? earn.reimbursement ?? null,
      otherEarnings: earn.otherEarnings ?? earn.other ?? null,
      grossEarnings:
        d.grossEarnings ??
        d.gross_earnings ??
        earn.grossEarnings ??
        earn.gross_earnings ??
        empFallback?.grossEarnings ??
        null,
      components: Array.isArray(earn.components) ? earn.components : undefined,
    },
    deductions: {
      pf: ded.pf ?? ded.epf ?? ded.provident_fund ?? null,
      esi: ded.esi ?? ded.esic ?? null,
      pt: ded.pt ?? ded.professional_tax ?? null,
      tds: ded.tds ?? ded.income_tax ?? ded.tax ?? null,
      loan: ded.loan ?? ded.loan_deduction ?? null,
      advance: ded.advance ?? ded.advance_salary ?? null,
      otherDeductions: ded.otherDeductions ?? ded.other_deductions ?? ded.other ?? null,
      totalDeductions:
        d.totalDeductions ??
        d.total_deductions ??
        ded.totalDeductions ??
        ded.total_deductions ??
        empFallback?.totalDeductions ??
        null,
      components: Array.isArray(ded.components) ? ded.components : undefined,
    },
    statutory: stat && typeof stat === "object" ? {
      employeePf: stat.employee?.epf ?? stat.employeePf ?? stat.employee_pf ?? ded.pf ?? null,
      employerPf: stat.employer?.epf ?? stat.employerPf ?? stat.employer_pf ?? null,
      employeeEsi: stat.employee?.esi ?? stat.employeeEsi ?? stat.employee_esi ?? ded.esi ?? null,
      employerEsi: stat.employer?.esi ?? stat.employerEsi ?? stat.employer_esi ?? null,
      pt: stat.employee?.pt ?? stat.pt ?? ded.pt ?? null,
      tds: stat.employee?.tds ?? stat.tds ?? ded.tds ?? null,
      eps: stat.employer?.eps ?? stat.eps ?? null,
      edli: stat.employer?.edli ?? stat.edli ?? null,
      other: stat.other || null,
    } : null,
    employerContributions: d.employerContributions || (stat?.employer ? {
      pf: stat.employer?.epf ?? null,
      esi: stat.employer?.esi ?? null,
      eps: stat.employer?.eps ?? null,
      edli: stat.employer?.edli ?? null,
      total: empFallback?.employerContribution ?? null,
    } : null),
    netPay:
      d.netPay ??
      d.net_pay ??
      empFallback?.netPay ??
      null,
    netPayInWords: d.netPayInWords || d.net_pay_in_words || null,
    salaryStructure: d.salaryStructure || empFallback?.salaryStructure || null,
    ytd: d.ytd || empFallback?.ytd || null,
    document: {
      pdfUrl: doc.pdfUrl || doc.pdf_url || d.pdfUrl || d.pdf_url || null,
      downloadUrl: doc.downloadUrl || doc.download_url || d.downloadUrl || d.download_url || null,
      documentId: doc.documentId || doc.document_id || d.documentId || null,
      hasDocument: Boolean(doc.pdfUrl || doc.downloadUrl || doc.hasDocument || d.hasDocument),
      mimeType: doc.mimeType || doc.mime_type || "application/pdf",
    },
    notes: d.notes || finalFallback?.finalization?.finalizationNotes || null,
  };
}

// ── Real API Service ─────────────────────────────────────────────────

export const payrollApi = {
  /**
   * Fetch paginated payroll periods/cycles with filters and server-side pagination.
   * Connects to /api/v2/payroll/cycles with fallback to /payroll/periods.
   */
  async getPeriodsList(params?: GetPeriodsParams): Promise<GetPeriodsResponse> {
    const queryParams: Record<string, any> = {};
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
      const data = extractData<any>(body);

      let rawList: any[] = [];
      let total = 0;
      let page = params?.page || 1;
      let limit = params?.limit || 20;
      let totalPages = 1;

      if (Array.isArray(data)) {
        rawList = data;
        total = data.length;
      } else if (data && typeof data === "object") {
        if (Array.isArray(data.items)) rawList = data.items;
        else if (Array.isArray(data.cycles)) rawList = data.cycles;
        else if (Array.isArray(data.periods)) rawList = data.periods;
        else if (Array.isArray(data.data)) rawList = data.data;

        total = Number(data.total ?? data.count ?? rawList.length) || rawList.length;
        page = Number(data.page ?? params?.page ?? 1) || 1;
        limit = Number(data.limit ?? params?.limit ?? 20) || 20;
        totalPages = Number(data.pages ?? data.total_pages ?? Math.ceil(total / limit)) || 1;
      }

      const items = rawList.map(normalizePayrollPeriod);
      return { items, total, page, limit, totalPages };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback to /payroll/periods
        const res = await apiInstance.get("/payroll/periods", { params: queryParams });
        const data = extractData<any>(res);
        let rawList: any[] = [];
        if (Array.isArray(data)) rawList = data;
        else if (data?.periods && Array.isArray(data.periods)) rawList = data.periods;
        else if (data?.items && Array.isArray(data.items)) rawList = data.items;
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
      const data = extractData<any>(res);
      return data ? normalizePayrollPeriod(data) : null;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        const res = await apiInstance.get(`/payroll/periods/${id}`);
        const data = extractData<any>(res);
        return data ? normalizePayrollPeriod(data) : null;
      }
      throw err;
    }
  },

  /**
   * Create a new payroll period / cycle.
   */
  async createPeriod(payload: CreatePeriodPayload): Promise<PayrollPeriod> {
    const body: Record<string, any> = {
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
      const data = extractData<any>(res);
      return normalizePayrollPeriod(data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        const res = await apiInstance.post("/payroll/periods", body);
        const data = extractData<any>(res);
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
      const data = extractData<any>(res);
      return normalizePayrollRunStatus(runId, data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback 1: preview endpoint (/api/v2/payroll/runs/{runId}/preview)
        try {
          const previewRes = await apiInstance.get(
            `/api/v2/payroll/runs/${runId}/preview`,
            requestConfig,
          );
          const previewData = extractData<any>(previewRes);
          if (previewData) {
            return normalizePayrollRunStatus(runId, previewData);
          }
        } catch {
          // Continue to fallback 2
        }

        // Fallback 2: /payroll/runs/{runId}
        try {
          const legRes = await apiInstance.get(`/payroll/runs/${runId}`, requestConfig);
          const legData = extractData<any>(legRes);
          if (legData) {
            return normalizePayrollRunStatus(runId, legData);
          }
        } catch {
          // Continue to fallback 3
        }

        // Fallback 3: /payroll/runs/{runId}/status
        try {
          const statusRes = await apiInstance.get(`/payroll/runs/${runId}/status`, requestConfig);
          const statusData = extractData<any>(statusRes);
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
    } catch (err: any) {
      if (err?.response?.status === 404) {
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
    } catch (err: any) {
      if (err?.response?.status === 404) {
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
      const data = extractData<any>(res);
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.items)) return data.items;
      if (data && Array.isArray(data.issues)) return data.issues;
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
      const data = extractData<any>(res);
      return normalizePayrollPreviewData(runId, data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback to /payroll/runs/{runId}/preview or /payroll/runs/{runId}
        try {
          const fallbackRes = await apiInstance.get(`/payroll/runs/${runId}/preview`, {
            headers: { "Cache-Control": "no-cache" },
            skipCache: true,
          });
          const fallbackData = extractData<any>(fallbackRes);
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
    const queryParams: Record<string, any> = {};
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
      const data = extractData<any>(res);

      let rawList: any[] = [];
      let total = 0;
      let page = params?.page || 1;
      let limit = params?.limit || 10;
      let totalPages = 1;

      if (Array.isArray(data)) {
        rawList = data;
        total = data.length;
      } else if (data && typeof data === "object") {
        if (Array.isArray(data.items)) rawList = data.items;
        else if (Array.isArray(data.employees)) rawList = data.employees;
        else if (Array.isArray(data.data)) rawList = data.data;

        total = Number(data.total ?? data.count ?? rawList.length) || rawList.length;
        page = Number(data.page ?? params?.page ?? 1) || 1;
        limit = Number(data.limit ?? params?.limit ?? 10) || 10;
        totalPages = Number(data.pages ?? data.total_pages ?? Math.ceil(total / limit)) || 1;
      }

      const items = rawList.map(normalizePayrollEmployee);
      return { items, total, page, limit, totalPages };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback /payroll/runs/{runId}/employees
        try {
          const fbRes = await apiInstance.get(`/payroll/runs/${runId}/employees`, {
            params: queryParams,
            skipCache: true,
          });
          const fbData = extractData<any>(fbRes);
          let rawList: any[] = [];
          if (Array.isArray(fbData)) rawList = fbData;
          else if (fbData?.items && Array.isArray(fbData.items)) rawList = fbData.items;
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
      const data = extractData<any>(res);
      return data ? normalizePayrollEmployee(data) : null;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback /payroll/runs/{runId}/employees/{employeeId}
        try {
          const fbRes = await apiInstance.get(`/payroll/runs/${runId}/employees/${employeeId}`, {
            skipCache: true,
          });
          const fbData = extractData<any>(fbRes);
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
      const data = extractData<any>(res);
      return normalizePayrollValidationSummary(runId, data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback 1: validation-issues endpoint
        try {
          const fbRes = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation-issues`, {
            headers: { "Cache-Control": "no-cache" },
            skipCache: true,
          });
          const fbData = extractData<any>(fbRes);
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
          const fbData2 = extractData<any>(fbRes2);
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
          const previewData = extractData<any>(previewRes);
          if (previewData?.validation) {
            return normalizePayrollValidationSummary(runId, {
              ...previewData,
              issues: [
                ...(previewData.validation.errors || []).map((e: any) => ({
                  ...e,
                  severity: "error",
                  blocking: true,
                })),
                ...(previewData.validation.warnings || []).map((w: any) => ({
                  ...w,
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
          const statusData = extractData<any>(statusRes);
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
      const data = extractData<any>(res);
      return {
        success: Boolean(data?.success ?? true),
        message: data?.message || "Payroll validation completed successfully.",
        status: data?.status || "Completed",
      };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback to /revalidate
        try {
          const fbRes = await apiInstance.post(`/api/v2/payroll/runs/${runId}/revalidate`, {});
          const fbData = extractData<any>(fbRes);
          return {
            success: Boolean(fbData?.success ?? true),
            message: fbData?.message || "Payroll validation completed.",
            status: fbData?.status || "Completed",
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
      const data = extractData<any>(res);
      if (data && typeof data === "object") {
        return normalizePayrollReviewData(runId, data);
      }
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        throw err;
      }
      // If 404, check alternative /review endpoint
      try {
        const reviewRes = await apiInstance.get(
          `/api/v2/payroll/runs/${runId}/review`,
          requestConfig,
        );
        const reviewData = extractData<any>(reviewRes);
        if (reviewData && typeof reviewData === "object") {
          return normalizePayrollReviewData(runId, reviewData);
        }
      } catch (reviewErr: any) {
        if (reviewErr?.response?.status !== 404) {
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
