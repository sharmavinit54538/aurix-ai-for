import apiInstance from "@/api/apiInstance";
import axios from "axios";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { extractData, requestWithFallback } from "./utils";
import { normalizePayrollRunStatus } from "./normalizers";
import type {
  RunPayrollResponse,
  PayrollRunStatus,
  PayrollRunValidationIssue,
  CancelRunResponse,
  RetryRunResponse,
} from "./types";

/**
 * Trigger provisional payroll calculation for the given period.
 * POST /api/v1/payroll/run
 * Note: Running payroll produces provisional results and does NOT finalize payroll or initiate payments.
 */
export async function runPayroll(periodId: string): Promise<RunPayrollResponse> {
  const res = await apiInstance.post(
    "/payroll/run",
    { periodId },
    {
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        "Cache-Control": "no-cache",
      },
    }
  );
  return extractData<RunPayrollResponse>(res);
}

/**
 * Fetch live payroll run processing status.
 * Connects to GET /api/v2/payroll/runs/{runId}/generation-status with fallbacks.
 * ZERO MOCK DATA: returns authentic backend response or throws so UI can show real unavailable state.
 */
export async function getPayrollRunStatus(runId: string, jobId?: string): Promise<PayrollRunStatus> {
  const params = jobId ? { job_id: jobId } : undefined;
  const requestConfig = {
    params,
    headers: { "Cache-Control": "no-cache" },
    skipCache: true,
  };

  try {
    // Primary: /api/v2/payroll/runs/{runId}/generation-status
    const res = await apiInstance.get(
      `/api/v2/payroll/runs/${runId}/generation-status`,
      requestConfig,
    );
    const data = extractData(res);
    return normalizePayrollRunStatus(runId, data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // Fallback 1: preview endpoint (/api/v2/payroll/runs/{runId}/preview)
      try {
        const previewRes = await apiInstance.get(
          `/api/v2/payroll/runs/${runId}/preview`,
          requestConfig,
        );
        const previewData = extractData(previewRes);
        if (previewData) {
          return normalizePayrollRunStatus(runId, previewData);
        }
      } catch {
        // Continue to fallback 2
      }

      // Fallback 2: /payroll/runs/{runId}
      try {
        const legRes = await apiInstance.get(`/payroll/runs/${runId}`, requestConfig);
        const legData = extractData(legRes);
        if (legData) {
          return normalizePayrollRunStatus(runId, legData);
        }
      } catch {
        // Continue to fallback 3
      }

      // Fallback 3: /payroll/runs/{runId}/status
      try {
        const statusRes = await apiInstance.get(`/payroll/runs/${runId}/status`, requestConfig);
        const statusData = extractData(statusRes);
        if (statusData) {
          return normalizePayrollRunStatus(runId, statusData);
        }
      } catch {
        // All status fallbacks exhausted
      }
    }
    throw err;
  }
}

/**
 * Cancel an active draft/queued payroll run.
 * DELETE /api/v2/payroll/runs/{runId} (from OpenAPI spec: "Cancel/delete a draft payroll run")
 */
export async function cancelPayrollRun(runId: string): Promise<CancelRunResponse> {
  try {
    const res = await apiInstance.delete(`/api/v2/payroll/runs/${runId}`);
    const data = extractData<CancelRunResponse>(res);
    return {
      ...data,
      success: Boolean(data?.success),
      message: data?.message || "Payroll run cancelled successfully.",
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // Fallback POST /payroll/runs/{runId}/cancel
      const fallbackRes = await apiInstance.post(`/payroll/runs/${runId}/cancel`);
      const fallbackData = extractData<CancelRunResponse>(fallbackRes);
      return {
        ...fallbackData,
        success: Boolean(fallbackData?.success),
        message: fallbackData?.message || "Payroll run cancelled.",
      };
    }
    throw err;
  }
}

/**
 * Retry a failed payroll calculation run.
 * POST /api/v2/payroll/runs/{runId}/process
 */
export async function retryPayrollRun(runId: string): Promise<RetryRunResponse> {
  const headers = {
    "Idempotency-Key": generateIdempotencyKey(),
    "Cache-Control": "no-cache",
  };
  return requestWithFallback(
    async () => {
      const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/process`, {}, { headers });
      const data = extractData<RetryRunResponse>(res);
      return {
        ...data,
        success: Boolean(data?.success),
        message: data?.message || "Payroll calculation retried successfully.",
      };
    },
    async () => {
      const fbRes = await apiInstance.post(`/api/v1/payroll/runs/${runId}/retry`, {}, { headers });
      const fbData = extractData<RetryRunResponse>(fbRes);
      return {
        ...fbData,
        success: Boolean(fbData?.success),
        message: fbData?.message || "Payroll calculation retried.",
      };
    }
  );
}

/**
 * Get validation issues for a payroll run.
 * GET /api/v2/payroll/runs/{runId}/validation-issues
 */
export async function getPayrollRunValidationIssues(runId: string): Promise<PayrollRunValidationIssue[]> {
  const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation-issues`, {
    headers: { "Cache-Control": "no-cache" },
    skipCache: true,
  });
  const data = extractData(res);
  if (Array.isArray(data)) return data as PayrollRunValidationIssue[];
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.items)) return d.items as PayrollRunValidationIssue[];
    if (Array.isArray(d.issues)) return d.issues as PayrollRunValidationIssue[];
  }
  return [];
}

/**
 * Trigger recalculation of a payroll run.
 * POST /api/v2/payroll/runs/{runId}/process
 */
export async function recalculatePayroll(runId: string): Promise<{ success: boolean; message?: string }> {
  return retryPayrollRun(runId);
}