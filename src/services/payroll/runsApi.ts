import apiInstance from "@/api/apiInstance";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { extractData } from "./utils";
import { normalizePayrollRunStatus } from "./normalizers";
import type {
  RunPayrollResponse,
  RunPayrollResult,
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
export async function runPayroll(periodId: string): Promise<RunPayrollResult> {
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
  
  // extractData unwraps the response, so we get the data directly
  const data = extractData<Record<string, unknown>>(res);
  
  // Read runId from various possible field names in the unwrapped data
  const runId = String(data?.runId ?? data?.run_id ?? data?.id ?? data?.cycleId ?? data?.cycle_id ?? "");
  const jobId = data?.jobId ?? data?.job_id ?? data?.id ?? null;
  const status = String(data?.status ?? data?.run_status ?? data?.state ?? "Processing");
  const message = String(data?.message ?? "Provisional payroll processing initiated successfully.");
  
  // HTTP 2xx = success (axios throws on non-2xx, so if we're here, it's success)
  return {
    runId,
    jobId,
    status,
    success: true,
    message,
  };
}

/**
 * Fetch live payroll run processing status.
 * Connects to GET /api/v2/payroll/runs/{runId}/generation-status (v1 fallback removed).
 * ZERO MOCK DATA: returns authentic backend response or throws so UI can show real unavailable state.
 */
export async function getPayrollRunStatus(runId: string, jobId?: string): Promise<PayrollRunStatus> {
  const params = jobId ? { job_id: jobId } : undefined;
  const requestConfig = {
    params,
    headers: { "Cache-Control": "no-cache" },
    skipCache: true,
  };

  // Primary: /api/v2/payroll/runs/{runId}/generation-status
  const res = await apiInstance.get(
    `/api/v2/payroll/runs/${runId}/generation-status`,
    requestConfig,
  );
  const data = extractData(res);
  return normalizePayrollRunStatus(runId, data);
}

/**
 * Cancel an active draft/queued payroll run.
 * POST /api/v2/payroll/runs/{runId}/cancel
 */
export async function cancelPayrollRun(runId: string): Promise<CancelRunResponse> {
  const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/cancel`);
  const data = extractData<CancelRunResponse>(res);
  return {
    ...data,
    success: Boolean(data?.success),
    message: data?.message || "Payroll run cancelled successfully.",
  };
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
  const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/process`, {}, { headers });
  const data = extractData<RetryRunResponse>(res);
  return {
    ...data,
    success: Boolean(data?.success),
    message: data?.message || "Payroll calculation retried successfully.",
  };
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