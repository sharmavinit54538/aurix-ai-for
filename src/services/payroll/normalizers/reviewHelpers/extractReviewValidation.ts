import type {
  PayrollValidationSummary,
  PayrollReviewData,
} from "../../types";

export function extractReviewValidation(
  rawObj: Record<string, unknown>,
  validationFallback?: PayrollValidationSummary | null,
): PayrollReviewData["validation"] {
  const rawVal = (rawObj.validation || rawObj.validation_summary || validationFallback) as Record<string, unknown> | PayrollValidationSummary | undefined;
  if (!rawVal || typeof rawVal !== "object") return null;

  const valObj = rawVal as Record<string, unknown>;
  const rawValIssues = Array.isArray(valObj.issues) ? valObj.issues : undefined;

  return {
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
      ? (valObj.issues as PayrollValidationSummary["issues"])
      : Array.isArray(validationFallback?.issues)
        ? validationFallback.issues
        : undefined,
  };
}