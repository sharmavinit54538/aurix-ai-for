import type {
  PayrollReviewData,
  PayrollPreviewData,
  PayrollValidationSummary,
  PayrollRunStatus,
} from "../types";
import {
  extractReviewMetadata,
  extractReviewSummary,
  extractReviewValidation,
  extractReviewApproval,
  extractReviewAuditLog,
} from "./reviewHelpers";

export function normalizePayrollReviewData(
  runId: string,
  raw: unknown,
  previewFallback?: PayrollPreviewData | null,
  validationFallback?: PayrollValidationSummary | null,
  statusFallback?: PayrollRunStatus | null,
): PayrollReviewData {
  const rawObj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const { periodId, periodName, rawStatus, runDate, generatedAt, lastUpdatedAt } =
    extractReviewMetadata(rawObj, previewFallback, statusFallback);

  const summary = extractReviewSummary(rawObj, previewFallback, statusFallback);
  const validation = extractReviewValidation(rawObj, validationFallback);
  const approval = extractReviewApproval(rawObj, rawStatus);
  const auditLog = extractReviewAuditLog(rawObj);

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