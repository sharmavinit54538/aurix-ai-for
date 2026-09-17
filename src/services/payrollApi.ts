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
  blockingCount: number;
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

// ── Helper to extract API data safely ─────────────────────────────────

function extractData<T>(res: unknown): T {
  const r = res as { data?: unknown; status?: number; headers?: unknown } | undefined;
  const body =
    r?.data !== undefined && (r?.status !== undefined || r?.headers !== undefined)
      ? r.data
      : res;

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
  const employeeCount =
    item.employeeCount ?? item.employee_count ?? item.total_employees ?? null;
  const isLocked = Boolean(
    item.is_locked ||
      item.isLocked ||
      String(rawStatus).toLowerCase() === "locked" ||
      String(rawStatus).toLowerCase() === "finalized" ||
      String(rawStatus).toLowerCase() === "closed"
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

  const periodId =
    raw.periodId || raw.period_id || raw.cycleId || raw.cycle_id || null;
  const periodName =
    raw.periodName || raw.period_name || raw.cycle_name || raw.name || null;
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

  const currentStep =
    raw.currentStep || raw.current_step || raw.step || raw.operation || null;

  // Real employees count ONLY if provided
  let employees: PayrollRunStatus["employees"] = null;
  const rawEmp = raw.employees || raw.employee_counts || raw.stats;
  if (rawEmp && typeof rawEmp === "object") {
    employees = {
      total:
        rawEmp.total ?? rawEmp.total_employees ?? raw.totalEmployees ?? null,
      processed:
        rawEmp.processed ?? rawEmp.processed_count ?? raw.processedEmployees ?? null,
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

  const id = String(
    item.id || item._id || item.employee_id || item.employeeId || ""
  );
  const employeeId = String(
    item.employeeId ||
      item.employee_id ||
      item.emp_id ||
      item.employee_code ||
      item.code ||
      id
  );
  const name =
    item.name ||
    item.employee_name ||
    item.employeeName ||
    (item.first_name ? `${item.first_name} ${item.last_name || ""}`.trim() : "") ||
    "Unnamed Employee";
  const email = item.email || item.work_email || undefined;
  const designation =
    item.designation || item.job_title || item.role || undefined;
  const department =
    item.department || item.dept || item.department_name || undefined;
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
    item.netPay ??
    item.net_pay ??
    item.netSalary ??
    item.net_salary ??
    item.net ??
    null;
  const employerContribution =
    item.employerContribution ??
    item.employer_contribution ??
    item.employer_cost ??
    null;

  const status = item.status || item.payroll_status || "Processed";
  const validationStatus =
    item.validationStatus ||
    item.validation_status ||
    (item.has_issues ? "warning" : "valid");

  // Earnings breakdown if present
  const rawEarnings =
    item.earnings ||
    item.salary_breakdown?.earnings ||
    item.components?.earnings;
  const earnings: PayrollEmployeeEarnings | undefined = rawEarnings
    ? {
        basic: rawEarnings.basic ?? rawEarnings.basic_monthly ?? null,
        hra: rawEarnings.hra ?? rawEarnings.hra_monthly ?? null,
        allowances:
          rawEarnings.allowances ?? rawEarnings.other_allowances ?? null,
        specialAllowance:
          rawEarnings.specialAllowance ??
          rawEarnings.special_allowance ??
          null,
        conveyance:
          rawEarnings.conveyance ?? rawEarnings.conveyance_monthly ?? null,
        overtime:
          rawEarnings.overtime ?? rawEarnings.overtime_amount ?? null,
        bonus: rawEarnings.bonus ?? rawEarnings.bonus_amount ?? null,
        incentives: rawEarnings.incentives ?? null,
        other: rawEarnings.other ?? null,
        ...rawEarnings,
      }
    : undefined;

  // Deductions breakdown if present
  const rawDeductions =
    item.deductions ||
    item.salary_breakdown?.deductions ||
    item.components?.deductions;
  const deductions: PayrollEmployeeDeductions | undefined = rawDeductions
    ? {
        pf:
          rawDeductions.pf ??
          rawDeductions.epf ??
          rawDeductions.provident_fund ??
          null,
        esi: rawDeductions.esi ?? rawDeductions.esic ?? null,
        pt: rawDeductions.pt ?? rawDeductions.professional_tax ?? null,
        tds:
          rawDeductions.tds ??
          rawDeductions.tax ??
          rawDeductions.income_tax ??
          null,
        incomeTax:
          rawDeductions.incomeTax ?? rawDeductions.income_tax ?? null,
        loan: rawDeductions.loan ?? rawDeductions.loan_deduction ?? null,
        advance:
          rawDeductions.advance ?? rawDeductions.advance_salary ?? null,
        other: rawDeductions.other ?? null,
        ...rawDeductions,
      }
    : undefined;

  // Attendance metrics if present
  const rawAtt = item.attendance || item.attendance_metrics;
  const attendance: PayrollEmployeeAttendance | undefined = rawAtt
    ? {
        workingDays:
          rawAtt.workingDays ??
          rawAtt.working_days ??
          rawAtt.total_days ??
          null,
        paidDays: rawAtt.paidDays ?? rawAtt.paid_days ?? null,
        unpaidDays:
          rawAtt.unpaidDays ??
          rawAtt.unpaid_days ??
          rawAtt.loss_of_pay_days ??
          null,
        leaveDays: rawAtt.leaveDays ?? rawAtt.leave_days ?? null,
        overtimeHours:
          rawAtt.overtimeHours ?? rawAtt.overtime_hours ?? null,
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
    employerContribution:
      employerContribution != null ? Number(employerContribution) : null,
    status,
    validationStatus,
    issuesCount: issues ? issues.length : item.issues_count ?? 0,
    issues,
    earnings,
    deductions,
    attendance,
    joiningDate:
      item.joiningDate || item.joining_date || item.doj || item.date_of_joining || null,
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
    calculationStatus:
      item.calculationStatus || item.calculation_status || null,
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

export function normalizePayrollPreviewData(
  runId: string,
  raw: any
): PayrollPreviewData {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Provision Generated",
      summary: null,
    };
  }

  const periodId =
    raw.periodId || raw.period_id || raw.cycleId || raw.cycle_id || null;
  const periodName =
    raw.periodName || raw.period_name || raw.cycle_name || raw.name || null;
  const status = raw.status || raw.run_status || "Provision Generated";
  const runDate =
    raw.runDate || raw.run_date || raw.createdAt || raw.created_at || null;
  const generatedAt =
    raw.generatedAt ||
    raw.generated_at ||
    raw.updatedAt ||
    raw.updated_at ||
    null;

  // Raw summary
  const s = raw.summary || raw.totals || raw.stats || raw;
  const summary: PayrollPreviewSummary = {
    employeeCount:
      s.employeeCount ??
      s.employee_count ??
      s.totalEmployees ??
      s.total_employees ??
      null,
    grossPayroll:
      s.grossPayroll ??
      s.gross_payroll ??
      s.totalGross ??
      s.total_gross ??
      null,
    totalEarnings:
      s.totalEarnings ??
      s.total_earnings ??
      s.grossPayroll ??
      s.gross_payroll ??
      null,
    totalDeductions:
      s.totalDeductions ?? s.total_deductions ?? s.deductions ?? null,
    netPayroll:
      s.netPayroll ?? s.net_payroll ?? s.totalNet ?? s.total_net ?? null,
    employerCost:
      s.employerCost ?? s.employer_cost ?? s.totalCost ?? s.total_cost ?? null,
    employerContribution:
      s.employerContribution ?? s.employer_contribution ?? null,
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
  raw: any
): PayrollValidationSummary {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Not Started",
      totalIssues: 0,
      errorsCount: 0,
      warningsCount: 0,
      affectedEmployeesCount: 0,
      blockingCount: 0,
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
    const sev = (item.severity || item.level || "warning").toLowerCase();
    const isError =
      sev === "error" || sev === "critical" || sev === "fatal" || Boolean(item.blocking);
    return {
      id: String(item.id || item.issue_id || `issue-${idx}`),
      severity: isError ? "error" : "warning",
      category: item.category || item.type || item.module || "General",
      code: item.code || item.error_code || item.rule_id || undefined,
      message:
        item.message || item.description || item.detail || "Validation issue detected",
      employeeId: item.employeeId || item.employee_id || item.emp_id || undefined,
      employeeName:
        item.employeeName || item.employee_name || item.name || undefined,
      department: item.department || item.dept || undefined,
      component:
        item.component || item.field || item.salary_component || undefined,
      blocking: item.blocking !== undefined ? Boolean(item.blocking) : isError,
      status: item.status || (item.resolved ? "resolved" : "open"),
      detectedAt:
        item.detectedAt ||
        item.detected_at ||
        item.created_at ||
        item.createdAt ||
        undefined,
      resolved: Boolean(item.resolved),
      ...item,
    };
  });

  const errorsCount = Number(
    raw.errorsCount ??
      raw.errors_count ??
      raw.errors?.length ??
      issues.filter((i) => i.severity === "error").length
  );
  const warningsCount = Number(
    raw.warningsCount ??
      raw.warnings_count ??
      raw.warnings?.length ??
      issues.filter((i) => i.severity === "warning").length
  );
  const totalIssues = Number(
    raw.totalIssues ?? raw.total_issues ?? raw.total ?? issues.length
  );
  const blockingCount = Number(
    raw.blockingCount ??
      raw.blocking_count ??
      issues.filter((i) => i.blocking).length
  );

  const affectedEmps = new Set<string>();
  issues.forEach((i) => {
    if (i.employeeId) affectedEmps.add(i.employeeId);
  });
  const affectedEmployeesCount = Number(
    raw.affectedEmployeesCount ??
      raw.affected_employees ??
      raw.affectedEmployees ??
      (affectedEmps.size || 0)
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
      raw.lastValidatedAt ||
      raw.last_validated_at ||
      raw.validatedAt ||
      raw.validated_at ||
      null,
    issues,
    ...raw,
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
        totalPages =
          Number(data.pages ?? data.total_pages ?? Math.ceil(total / limit)) || 1;
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
          return (data as { periods: PayrollPeriod[] }).periods.map(
            normalizePayrollPeriod
          );
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
  async lockPeriod(
    id: string,
    reason?: string
  ): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/lock`, {
      reason: reason || null,
    });
    return (
      extractData<{ success: boolean; message?: string }>(res) || { success: true }
    );
  },

  /**
   * Reopen a locked pay cycle (Admin only).
   */
  async reopenPeriod(
    id: string,
    reason: string
  ): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/reopen`, {
      reason,
    });
    return (
      extractData<{ success: boolean; message?: string }>(res) || { success: true }
    );
  },

  /**
   * Void / cancel a pay cycle.
   */
  async voidPeriod(
    id: string,
    reason?: string
  ): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/void`, {
      reason: reason || null,
    });
    return (
      extractData<{ success: boolean; message?: string }>(res) || { success: true }
    );
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
  async getPayrollRunStatus(
    runId: string,
    jobId?: string
  ): Promise<PayrollRunStatus> {
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
        requestConfig
      );
      const data = extractData<any>(res);
      return normalizePayrollRunStatus(runId, data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback 1: preview endpoint (/api/v2/payroll/runs/{runId}/preview)
        try {
          const previewRes = await apiInstance.get(
            `/api/v2/payroll/runs/${runId}/preview`,
            requestConfig
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
          const legRes = await apiInstance.get(
            `/payroll/runs/${runId}`,
            requestConfig
          );
          const legData = extractData<any>(legRes);
          if (legData) {
            return normalizePayrollRunStatus(runId, legData);
          }
        } catch {
          // Continue to fallback 3
        }

        // Fallback 3: /payroll/runs/{runId}/status
        try {
          const statusRes = await apiInstance.get(
            `/payroll/runs/${runId}/status`,
            requestConfig
          );
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
          const fallbackRes = await apiInstance.post(
            `/payroll/runs/${runId}/cancel`
          );
          return (
            extractData<CancelRunResponse>(fallbackRes) || { success: true }
          );
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
          const fbRes = await apiInstance.post(
            `/api/v2/payroll/runs/${runId}/revalidate`
          );
          return extractData<RetryRunResponse>(fbRes) || { success: true };
        } catch {
          const fbRes2 = await apiInstance.post(
            `/payroll/runs/${runId}/retry`
          );
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
  async getPayrollRunValidationIssues(
    runId: string
  ): Promise<PayrollRunValidationIssue[]> {
    try {
      const res = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/validation-issues`,
        { headers: { "Cache-Control": "no-cache" }, skipCache: true }
      );
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
      const res = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/preview`,
        { headers: { "Cache-Control": "no-cache" }, skipCache: true }
      );
      const data = extractData<any>(res);
      return normalizePayrollPreviewData(runId, data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback to /payroll/runs/{runId}/preview or /payroll/runs/{runId}
        try {
          const fallbackRes = await apiInstance.get(
            `/payroll/runs/${runId}/preview`,
            { headers: { "Cache-Control": "no-cache" }, skipCache: true }
          );
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
    params?: GetRunEmployeesParams
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
      const res = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/employees`,
        {
          params: queryParams,
          headers: { "Cache-Control": "no-cache" },
          skipCache: true,
        }
      );
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

        total =
          Number(data.total ?? data.count ?? rawList.length) || rawList.length;
        page = Number(data.page ?? params?.page ?? 1) || 1;
        limit = Number(data.limit ?? params?.limit ?? 10) || 10;
        totalPages =
          Number(data.pages ?? data.total_pages ?? Math.ceil(total / limit)) || 1;
      }

      const items = rawList.map(normalizePayrollEmployee);
      return { items, total, page, limit, totalPages };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback /payroll/runs/{runId}/employees
        try {
          const fbRes = await apiInstance.get(
            `/payroll/runs/${runId}/employees`,
            { params: queryParams, skipCache: true }
          );
          const fbData = extractData<any>(fbRes);
          let rawList: any[] = [];
          if (Array.isArray(fbData)) rawList = fbData;
          else if (fbData?.items && Array.isArray(fbData.items))
            rawList = fbData.items;
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
    employeeId: string
  ): Promise<PayrollPreviewEmployee | null> {
    try {
      const res = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/employees/${employeeId}`,
        { headers: { "Cache-Control": "no-cache" }, skipCache: true }
      );
      const data = extractData<any>(res);
      return data ? normalizePayrollEmployee(data) : null;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback /payroll/runs/{runId}/employees/{employeeId}
        try {
          const fbRes = await apiInstance.get(
            `/payroll/runs/${runId}/employees/${employeeId}`,
            { skipCache: true }
          );
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
  async recalculatePayroll(
    runId: string
  ): Promise<{ success: boolean; message?: string }> {
    return this.retryPayrollRun(runId);
  },

  /**
   * Fetch validation summary and issues for a payroll run.
   * GET /api/v2/payroll/runs/{runId}/validation
   */
  async getPayrollValidation(
    runId: string
  ): Promise<PayrollValidationSummary> {
    try {
      const res = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/validation`,
        { headers: { "Cache-Control": "no-cache" }, skipCache: true }
      );
      const data = extractData<any>(res);
      return normalizePayrollValidationSummary(runId, data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Try fallback to validation-issues endpoint
        try {
          const fbRes = await apiInstance.get(
            `/api/v2/payroll/runs/${runId}/validation-issues`,
            { headers: { "Cache-Control": "no-cache" }, skipCache: true }
          );
          const fbData = extractData<any>(fbRes);
          if (fbData) {
            return normalizePayrollValidationSummary(runId, fbData);
          }
        } catch {
          // Fall through
        }

        // Try preview endpoint fallback if validation is embedded
        try {
          const previewRes = await apiInstance.get(
            `/api/v2/payroll/runs/${runId}/preview`,
            { headers: { "Cache-Control": "no-cache" }, skipCache: true }
          );
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
      }
      throw err;
    }
  },

  /**
   * Run or trigger fresh backend validation for a payroll run.
   * POST /api/v2/payroll/runs/{runId}/validate
   */
  async runPayrollValidation(
    runId: string
  ): Promise<{ success: boolean; message?: string; status?: string }> {
    try {
      const res = await apiInstance.post(
        `/api/v2/payroll/runs/${runId}/validate`,
        {},
        { headers: { "Cache-Control": "no-cache" } }
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
          const fbRes = await apiInstance.post(
            `/api/v2/payroll/runs/${runId}/revalidate`,
            {}
          );
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
};

export default payrollApi;
