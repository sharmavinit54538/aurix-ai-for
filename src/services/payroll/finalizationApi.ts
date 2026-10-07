import apiInstance from "@/api/apiInstance";
import axios from "axios";
import { extractData } from "./utils";
import { normalizePayrollFinalizationData } from "./normalizers";
import type {
  PayrollFinalizationData,
  FinalizePayrollPayload,
  FinalizePayrollResponse,
  PayrollStatus,
} from "./types";
import { getPayrollReview } from "./reviewApi";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { requestWithFallback } from "./utils";

/**
 * Fetch comprehensive payroll finalization data for a run.
 * GET /api/v2/payroll/runs/{runId}/finalization with fallback to getPayrollReview.
 * ZERO MOCK DATA: throws if backend cannot be reached so UI displays authentic error state.
 */
export async function getPayrollFinalization(runId: string): Promise<PayrollFinalizationData> {
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
    const data = extractData(res);
    if (data && typeof data === "object") {
      return normalizePayrollFinalizationData(runId, data);
    }
  } catch (err: unknown) {
    if (!axios.isAxiosError(err) || err.response?.status !== 404) {
      throw err;
    }
  }

  // Fallback: Use getPayrollReview to get authoritative calculation, validation, and approval state
  const reviewData = await getPayrollReview(runId);
  return normalizePayrollFinalizationData(runId, {}, reviewData);
}

/**
 * Finalize and lock a payroll run through the real backend API.
 * POST /api/v2/payroll/runs/{runId}/finalize
 * Finalization freezes figures and locks the run. It does NOT execute payment.
 */
export async function finalizePayroll(
  runId: string,
  payload?: FinalizePayrollPayload,
): Promise<FinalizePayrollResponse> {
  const body: Record<string, unknown> = {
    notes: payload?.notes || undefined,
    lock: payload?.lock ?? true,
  };
  const headers = {
    "Idempotency-Key": generateIdempotencyKey(),
    "Cache-Control": "no-cache",
  };

  return requestWithFallback(
    async () => {
      const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/finalize`, body, { headers });
      const data = extractData<Record<string, unknown>>(res);
      return {
        success: Boolean(data?.success ?? false),
        message: typeof data?.message === "string" ? data.message : "Payroll run finalized and locked successfully.",
        status: (typeof data?.status === "string" ? data.status : (data?.success ? "Finalized" : "—")) as PayrollStatus,
        isFinalized: Boolean(data?.isFinalized ?? data?.success ?? false),
        isLocked: Boolean(data?.isLocked ?? data?.success ?? false),
        finalizedAt: (data?.finalizedAt || data?.finalized_at || undefined) as string | undefined,
        finalizedBy: (data?.finalizedBy || data?.finalized_by || undefined) as string | undefined,
        ...data,
      };
    },
    async () => {
      const fbRes = await apiInstance.post(`/payroll/runs/${runId}/finalize`, body, { headers });
      const fbData = extractData<Record<string, unknown>>(fbRes);
      return {
        success: Boolean(fbData?.success ?? false),
        message: typeof fbData?.message === "string" ? fbData.message : "Payroll run finalized and locked successfully.",
        status: (typeof fbData?.status === "string" ? fbData.status : (fbData?.success ? "Finalized" : "—")) as PayrollStatus,
        isFinalized: Boolean(fbData?.isFinalized ?? fbData?.success ?? false),
        isLocked: Boolean(fbData?.isLocked ?? fbData?.success ?? false),
        ...fbData,
      };
    }
  );
}