import apiInstance from "@/api/apiInstance";
import { extractData } from "./utils";
import { normalizePayrollValidationSummary } from "./normalizers";
import type { PayrollValidationSummary } from "./types";

/**
 * Fetch validation summary and issues for a payroll run.
 * GET /api/v2/payroll/runs/{runId}/validation (v1 fallbacks removed)
 */
export async function getPayrollValidation(runId: string): Promise<PayrollValidationSummary> {
  const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation`, {
    headers: { "Cache-Control": "no-cache" },
    skipCache: true,
  });
  const data = extractData(res);
  return normalizePayrollValidationSummary(runId, data);
}

/**
 * Run or trigger fresh backend validation for a payroll run.
 * POST /api/v2/payroll/runs/{runId}/validate
 */
export async function runPayrollValidation(
  runId: string,
): Promise<{ success: boolean; message?: string; status?: string }> {
  const res = await apiInstance.post(
    `/api/v2/payroll/runs/${runId}/validate`,
    {},
    { headers: { "Cache-Control": "no-cache" } },
  );
  const data = extractData<Record<string, unknown>>(res);
  return {
    success: Boolean(data?.success ?? false),
    message: (data?.message || "Payroll validation completed.") as string,
    status: (typeof data?.status === "string" ? data.status : (data?.success ? "Completed" : "—")) as string,
  };
}