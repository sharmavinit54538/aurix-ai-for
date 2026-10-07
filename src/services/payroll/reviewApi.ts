import apiInstance from "@/api/apiInstance";
import axios from "axios";
import { extractData } from "./utils";
import { normalizePayrollReviewData } from "./normalizers";
import type {
  PayrollReviewData,
  PayrollPreviewData,
  PayrollValidationSummary,
  PayrollRunStatus,
  ApprovePayrollPayload,
  ApprovePayrollResponse,
  RejectPayrollPayload,
  RejectPayrollResponse,
  PayrollStatus,
} from "./types";
import { getPayrollPreview } from "./previewApi";
import { getPayrollValidation } from "./validationApi";
import { getPayrollRunStatus } from "./runsApi";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { requestWithFallback } from "./utils";

/**
 * Fetch comprehensive payroll review & approval data for a completed/provision run.
 * GET /api/v2/payroll/runs/{runId}/approval or fallback to aggregating preview and validation.
 * ZERO MOCK DATA: throws if backend cannot be reached so UI displays authentic error state.
 */
export async function getPayrollReview(runId: string): Promise<PayrollReviewData> {
  const requestConfig = {
    headers: { "Cache-Control": "no-cache" },
    skipCache: true,
  };

  // Primary: /api/v2/payroll/runs/{runId}/approval
  try {
    const res = await apiInstance.get(
      `/api/v2/payroll/runs/${runId}/approval`,
      requestConfig,
    );
    const data = extractData(res);
    if (data && typeof data === "object") {
      return normalizePayrollReviewData(runId, data);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status !== 404) {
      throw err;
    }
    // If 404, check alternative /review endpoint
    try {
      const reviewRes = await apiInstance.get(
        `/api/v2/payroll/runs/${runId}/review`,
        requestConfig,
      );
      const reviewData = extractData(reviewRes);
      if (reviewData && typeof reviewData === "object") {
        return normalizePayrollReviewData(runId, reviewData);
      }
    } catch (reviewErr: unknown) {
      if (axios.isAxiosError(reviewErr) && reviewErr.response?.status !== 404) {
        throw reviewErr;
      }
    }
  }

  // Fallback: Aggregate authentic backend data from preview, validation, and run status
  const [previewRes, validationRes, statusRes] = await Promise.allSettled([
    getPayrollPreview(runId),
    getPayrollValidation(runId),
    getPayrollRunStatus(runId),
  ]);

  const preview = previewRes.status === "fulfilled" ? previewRes.value : null;
  const validation = validationRes.status === "fulfilled" ? validationRes.value : null;
  const runStatus = statusRes.status === "fulfilled" ? statusRes.value : null;

  // If all three calls failed, backend is unreachable for this run: throw authentic error
  if (!preview && !validation && !runStatus) {
    const rejectedReason =
      (previewRes as PromiseRejectedResult).reason ||
      (validationRes as PromiseRejectedResult).reason ||
      (statusRes as PromiseRejectedResult).reason;
    throw rejectedReason || new Error(`Payroll run ${runId} not found on backend.`);
  }

  return normalizePayrollReviewData(runId, {}, preview, validation, runStatus);
}

/**
 * Approve a processed & validated payroll run through the real backend API.
 * POST /api/v2/payroll/runs/{runId}/approve
 * Approving transitions the run to 'Approved'. It does NOT finalize or disburse funds.
 */
export async function approvePayroll(
  runId: string,
  payload?: ApprovePayrollPayload,
): Promise<ApprovePayrollResponse> {
  const body: Record<string, unknown> = {
    comments: payload?.comments || payload?.notes || undefined,
  };
  const headers = {
    "Idempotency-Key": generateIdempotencyKey(),
    "Cache-Control": "no-cache",
  };

  return requestWithFallback(
    async () => {
      const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/approve`, body, { headers });
      const data = extractData<Record<string, unknown>>(res);
      return {
        success: Boolean(data?.success ?? false),
        message: typeof data?.message === "string" ? data.message : "Payroll run approved successfully.",
        status: (typeof data?.status === "string" ? data.status : (data?.success ? "Approved" : "—")) as PayrollStatus,
        approval: (data?.approval as PayrollReviewData["approval"]) || undefined,
        ...data,
      };
    },
    async () => {
      const fbRes = await apiInstance.post(`/payroll/runs/${runId}/approve`, body, { headers });
      const fbData = extractData<Record<string, unknown>>(fbRes);
      return {
        success: Boolean(fbData?.success ?? false),
        message: typeof fbData?.message === "string" ? fbData.message : "Payroll run approved successfully.",
        status: (typeof fbData?.status === "string" ? fbData.status : (fbData?.success ? "Approved" : "—")) as PayrollStatus,
        approval: (fbData?.approval as PayrollReviewData["approval"]) || undefined,
        ...fbData,
      };
    }
  );
}

/**
 * Reject / Send back a payroll run for correction through the real backend API.
 * POST /api/v2/payroll/runs/{runId}/reject
 */
export async function rejectPayroll(
  runId: string,
  payload: RejectPayrollPayload,
): Promise<RejectPayrollResponse> {
  const body: Record<string, unknown> = {
    reason: payload.reason,
    comments: payload.comments || undefined,
  };
  const headers = {
    "Idempotency-Key": generateIdempotencyKey(),
    "Cache-Control": "no-cache",
  };

  return requestWithFallback(
    async () => {
      const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/reject`, body, { headers });
      const data = extractData<Record<string, unknown>>(res);
      return {
        success: Boolean(data?.success ?? false),
        message: typeof data?.message === "string" ? data.message : "Payroll run returned for correction.",
        status: (typeof data?.status === "string" ? data.status : (data?.success ? "Rejected" : "—")) as PayrollStatus,
        ...data,
      };
    },
    async () => {
      try {
        const fbRes = await apiInstance.post(`/api/v2/payroll/runs/${runId}/send-back`, body, { headers });
        const fbData = extractData<Record<string, unknown>>(fbRes);
        return {
          success: Boolean(fbData?.success ?? false),
          message: typeof fbData?.message === "string" ? fbData.message : "Payroll run returned for correction.",
          status: (typeof fbData?.status === "string" ? fbData.status : (fbData?.success ? "Rejected" : "—")) as PayrollStatus,
          ...fbData,
        };
      } catch {
        const fbRes2 = await apiInstance.post(`/payroll/runs/${runId}/reject`, body, { headers });
        const fbData2 = extractData<Record<string, unknown>>(fbRes2);
        return {
          success: Boolean(fbData2?.success ?? false),
          message: typeof fbData2?.message === "string" ? fbData2.message : "Payroll run returned for correction.",
          status: (typeof fbData2?.status === "string" ? fbData2.status : (fbData2?.success ? "Rejected" : "—")) as PayrollStatus,
          ...fbData2,
        };
      }
    }
  );
}