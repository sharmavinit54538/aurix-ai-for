import type {
  PayrollFinalizationData,
  PayrollReviewData,
  PayrollPreviewSummary,
  PayrollApprovalInfo,
  PayrollAuditRecord,
  PayrollFinalizationInfo,
  PayrollStatus,
} from "../types";

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
      canFinalize: Boolean(rawFin.canFinalize ?? rawFin.can_finalize ?? false),
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