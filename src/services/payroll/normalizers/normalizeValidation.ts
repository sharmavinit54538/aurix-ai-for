import type {
  PayrollValidationSummary,
  PayrollValidationIssue,
} from "../types";

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