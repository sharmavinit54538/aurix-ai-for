import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import type { PayrollPeriod } from "../types";

/**
 * Void / cancel a pay cycle.
 */
export async function voidPeriod(id: string, reason?: string): Promise<{ success: boolean; message?: string }> {
  const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/void`, {
    reason: reason || null,
  });
  return extractData<{ success: boolean; message?: string }>(res) || { success: true };
}