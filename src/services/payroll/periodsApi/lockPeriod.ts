import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import type { PayrollPeriod } from "../types";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { requestWithFallback } from "../utils";

/**
 * Lock pay cycle — freeze computed figures.
 * Canonical in OpenAPI: POST /api/v1/payroll/cycles/{id}/lock
 */
export async function lockPeriod(id: string, reason?: string): Promise<{ success: boolean; message?: string }> {
  const body = { reason: reason || null };
  const headers = {
    "Idempotency-Key": generateIdempotencyKey(),
    "Cache-Control": "no-cache",
  };
  return requestWithFallback(
    async () => {
      const res = await apiInstance.post(`/api/v1/payroll/cycles/${id}/lock`, body, { headers });
      return extractData<{ success: boolean; message?: string }>(res) || { success: true };
    },
    async () => {
      const res = await apiInstance.post(`/payroll/cycles/${id}/lock`, body, { headers });
      return extractData<{ success: boolean; message?: string }>(res) || { success: true };
    }
  );
}