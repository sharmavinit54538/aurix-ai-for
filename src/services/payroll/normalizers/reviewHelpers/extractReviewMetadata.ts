import type {
  PayrollPreviewData,
  PayrollRunStatus,
} from "../../types";

export function extractReviewMetadata(
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