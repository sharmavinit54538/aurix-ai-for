import type {
  PayrollRunStatus,
  PayrollStatus,
  PayrollRunValidationIssue,
  PayrollRunStep,
} from "../types";

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