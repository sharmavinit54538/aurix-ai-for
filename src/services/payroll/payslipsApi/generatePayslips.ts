import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import type {
  GeneratePayslipsPayload,
  GeneratePayslipsResponse,
} from "../types";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { requestWithFallback } from "../utils";

/**
 * Generate payslips batch or single for a finalized run via backend.
 * POST /api/v2/payroll/runs/{runId}/payslips/generate
 */
export async function generatePayslips(
  runId: string,
  payload?: GeneratePayslipsPayload,
): Promise<GeneratePayslipsResponse> {
  const headers = {
    "Idempotency-Key": generateIdempotencyKey(),
    "Cache-Control": "no-cache",
  };

  return requestWithFallback(
    async () => {
      const res = await apiInstance.post(
        `/api/v2/payroll/runs/${runId}/payslips/generate`,
        payload ?? {},
        { headers },
      );
      const data = extractData<Record<string, unknown>>(res);
      return {
        success: Boolean(data?.success ?? false),
        message: typeof data?.message === "string" ? data.message : "Final payslips generated successfully.",
        generatedCount:
          typeof data?.generatedCount === "number"
            ? data.generatedCount
            : typeof data?.count === "number"
              ? data.count
              : undefined,
        totalCount: typeof data?.totalCount === "number" ? data.totalCount : undefined,
        ...data,
      };
    },
    async () => {
      const fbRes = await apiInstance.post(
        `/payroll/runs/${runId}/payslips/generate`,
        payload ?? {},
        { headers },
      );
      const fbData = extractData<Record<string, unknown>>(fbRes);
      return {
        success: Boolean(fbData?.success ?? false),
        message: typeof fbData?.message === "string" ? fbData.message : "Final payslips generated successfully.",
        ...fbData,
      };
    }
  );
}