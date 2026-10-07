import type {
  PayrollReviewData,
  PayrollPreviewData,
  PayrollValidationSummary,
  PayrollRunStatus,
  PayrollPreviewSummary,
  PayrollApprovalInfo,
  PayrollAuditRecord,
  PayrollStatus,
} from "../types";

function extractReviewMetadata(
  rawObj: Record<string, unknown>,
  previewFallback?: PayrollPreviewData | null,
  statusFallback?: PayrollRunStatus | null,
): {
  periodId: string | null;
  periodName: string | null;
  rawStatus: string;
  runDate: string | null;
  generatedAt: string | null;
  lastUpdatedAt: string | null;
} {
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

  return { periodId, periodName, rawStatus, runDate, generatedAt, lastUpdatedAt };
}

function extractReviewSummary(
  rawObj: Record<string, unknown>,
  previewFallback?: PayrollPreviewData | null,
  statusFallback?: PayrollRunStatus | null,
): PayrollPreviewSummary | null {
  const rawSummary = (rawObj.summary || rawObj.totals || rawObj.stats || previewFallback?.summary) as Record<string, unknown> | undefined;
  if (!rawSummary || typeof rawSummary !== "object") return null;

  return {
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

function extractReviewValidation(
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

function extractReviewApproval(
  rawObj: Record<string, unknown>,
  rawStatus: string,
): PayrollApprovalInfo | null {
  const rawApp = (rawObj.approval || rawObj.approval_status || rawObj) as Record<string, unknown> | undefined;
  if (!rawApp || typeof rawApp !== "object") return null;

  const appStatus =
    (rawApp.status ||
    rawApp.approval_status ||
    (String(rawStatus).toLowerCase() === "approved"
      ? "approved"
      : String(rawStatus).toLowerCase() === "rejected"
        ? "rejected"
        : "pending")) as PayrollApprovalInfo["status"];

  return {
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
    canApprove: Boolean(rawApp.canApprove ?? rawApp.can_approve ?? false),
    canReject: Boolean(rawApp.canReject ?? rawApp.can_reject ?? false),
    blockingReasons: (rawApp.blockingReasons || rawApp.blocking_reasons || []) as string[],
    ...rawApp,
  };
}

function extractReviewAuditLog(rawObj: Record<string, unknown>): PayrollAuditRecord[] | null {
  const rawAudit = rawObj.auditLog || rawObj.audit_log || rawObj.history || rawObj.timeline;
  if (!Array.isArray(rawAudit)) return null;

  return (rawAudit as unknown[]).map((item: unknown) => {
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

export {
  extractReviewMetadata,
  extractReviewSummary,
  extractReviewValidation,
  extractReviewApproval,
  extractReviewAuditLog,
};