import apiInstance from "@/api/apiInstance";
import axios from "axios";
import { extractData } from "./utils";
import { normalizePayrollValidationSummary } from "./normalizers";
import type { PayrollValidationSummary } from "./types";

/**
 * Fetch validation summary and issues for a payroll run.
 * GET /api/v2/payroll/runs/{runId}/validation
 */
export async function getPayrollValidation(runId: string): Promise<PayrollValidationSummary> {
  try {
    const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation`, {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });
    const data = extractData(res);
    return normalizePayrollValidationSummary(runId, data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // Fallback 1: validation-issues endpoint
      try {
        const fbRes = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation-issues`, {
          headers: { "Cache-Control": "no-cache" },
          skipCache: true,
        });
        const fbData = extractData(fbRes);
        if (fbData) {
          return normalizePayrollValidationSummary(runId, fbData);
        }
      } catch {
        // Fall through
      }

      // Fallback 2: legacy /payroll/runs/{runId}/validation
      try {
        const fbRes2 = await apiInstance.get(`/payroll/runs/${runId}/validation`, {
          headers: { "Cache-Control": "no-cache" },
          skipCache: true,
        });
        const fbData2 = extractData(fbRes2);
        if (fbData2) {
          return normalizePayrollValidationSummary(runId, fbData2);
        }
      } catch {
        // Fall through
      }

      // Fallback 3: preview endpoint if validation is embedded
      try {
        const previewRes = await apiInstance.get(`/api/v2/payroll/runs/${runId}/preview`, {
          headers: { "Cache-Control": "no-cache" },
          skipCache: true,
        });
        const previewData = extractData<Record<string, unknown>>(previewRes);
        if (previewData && typeof previewData.validation === "object") {
          const v = previewData.validation as Record<string, unknown>;
          const errs = Array.isArray(v.errors) ? v.errors : [];
          const warns = Array.isArray(v.warnings) ? v.warnings : [];
          return normalizePayrollValidationSummary(runId, {
            ...previewData,
            issues: [
              ...errs.map((e: unknown) => ({
                ...((e && typeof e === "object" ? e : {}) as Record<string, unknown>),
                severity: "error",
                blocking: true,
              })),
              ...warns.map((w: unknown) => ({
                ...((w && typeof w === "object" ? w : {}) as Record<string, unknown>),
                severity: "warning",
                blocking: false,
              })),
            ],
          });
        }
      } catch {
        // Fall through
      }

      // Fallback 4: generation-status endpoint if validationIssues is embedded
      try {
        const statusRes = await apiInstance.get(
          `/api/v2/payroll/runs/${runId}/generation-status`,
          { headers: { "Cache-Control": "no-cache" }, skipCache: true },
        );
        const statusData = extractData<Record<string, unknown>>(statusRes);
        if (statusData?.validationIssues || statusData?.validation_issues) {
          return normalizePayrollValidationSummary(runId, {
            ...statusData,
            issues: statusData.validationIssues || statusData.validation_issues || [],
          });
        }
      } catch {
        // Fall through
      }
    }
    throw err;
  }
}

/**
 * Run or trigger fresh backend validation for a payroll run.
 * POST /api/v2/payroll/runs/{runId}/validate
 */
export async function runPayrollValidation(
  runId: string,
): Promise<{ success: boolean; message?: string; status?: string }> {
  try {
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
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // Fallback to /revalidate
      try {
        const fbRes = await apiInstance.post(`/api/v2/payroll/runs/${runId}/revalidate`, {});
        const fbData = extractData<Record<string, unknown>>(fbRes);
        return {
          success: Boolean(fbData?.success ?? false),
          message: (fbData?.message || "Payroll validation completed.") as string,
          status: (typeof fbData?.status === "string" ? fbData.status : (fbData?.success ? "Completed" : "—")) as string,
        };
      } catch {
        // Re-throw
      }
    }
    throw err;
  }
}