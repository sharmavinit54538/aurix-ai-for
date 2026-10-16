import type {
  PayrollValidationSummary,
  PayrollValidationIssue,
} from "../types";

/**
 * Normalizes validation issues from various backend shapes:
 * - Legacy: {issues: [...]}
 * - Per-employee: [{employee_id, name, issues: ["msg1", "msg2"], ...}, ...]
 * - New canonical: [{id, employee_id, employee_name, department, severity, blocking, code, message}, ...]
 */
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

  // Handle per-employee array shape: [{employee_id, name, issues: ["..."]}, ...]
  if (Array.isArray(raw)) {
    // Check if it's per-employee shape (has employee_id/name and issues array)
    const first = raw[0] as Record<string, unknown> | undefined;
    if (first && (first.employee_id || first.employeeId || first.name) && Array.isArray(first.issues)) {
      // Flatten per-employee issues
      rawList = raw.flatMap((emp: unknown, empIdx: number) => {
        const e = emp as Record<string, unknown>;
        const employeeId = String(e.employee_id || e.employeeId || e.emp_id || "");
        const employeeName = String(e.name || e.employee_name || e.employeeName || "");
        const department = String(e.department || e.dept || e.department_name || "");
        const issues = Array.isArray(e.issues) ? e.issues : [];
        return issues.map((msg: unknown, idx: number) => ({
          id: `${employeeId}-${empIdx}-${idx}`,
          message: String(msg),
          employeeId,
          employeeName,
          department,
          severity: "warning",
          blocking: false,
          category: "Employee Validation",
        }));
      });
    } else {
      // Regular array of issue objects
      rawList = raw.filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
    }
  } else if (Array.isArray(rawObj.issues)) {
    // Check if issues array contains per-employee objects with nested issues
    const first = rawObj.issues[0] as Record<string, unknown> | undefined;
    if (first && (first.employee_id || first.employeeId || first.name) && Array.isArray(first.issues)) {
      // Flatten per-employee issues from issues array
      rawList = (rawObj.issues as unknown[]).flatMap((emp: unknown, empIdx: number) => {
        const e = emp as Record<string, unknown>;
        const employeeId = String(e.employee_id || e.employeeId || e.emp_id || "");
        const employeeName = String(e.name || e.employee_name || e.employeeName || "");
        const department = String(e.department || e.dept || e.department_name || "");
        const issues = Array.isArray(e.issues) ? e.issues : [];
        return issues.map((msg: unknown, idx: number) => ({
          id: `${employeeId}-${empIdx}-${idx}`,
          message: String(msg),
          employeeId,
          employeeName,
          department,
          severity: "warning",
          blocking: false,
          category: "Employee Validation",
        }));
      });
    } else {
      rawList = (rawObj.issues as unknown[]).filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
    }
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
    // If missing, default to "warning" as per spec
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

    // Support new canonical shape: {id, employee_id, employee_name, department, severity, blocking, code, message}
    // Also support: {employeeId, employeeName, department}
    const employeeId = (item.employeeId || item.employee_id || item.emp_id || undefined) as string | undefined;
    const employeeName = (item.employeeName || item.employee_name || item.name || undefined) as string | undefined;
    const department = (item.department || item.dept || item.department_name || undefined) as string | undefined;

    // Use real message from backend - never fall back to "Validation issue detected"
    const message = String(item.message || item.description || item.detail || item.error || "");

    return {
      id: String(item.id || item.issue_id || item.rule_id || item.ruleCode || `issue-${idx}`),
      severity: sev,
      category: (item.category || item.type || item.module || "General") as string,
      code: (item.code || item.error_code || item.rule_id || item.ruleCode || undefined) as string | undefined,
      message: message || "Validation issue",
      employeeId,
      employeeName,
      department,
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