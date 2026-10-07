import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import type { PayrollPeriod } from "../types";

/**
 * Reopen a locked pay cycle (Admin only).
 */
export async function reopenPeriod(id: string, reason: string): Promise<{ success: boolean; message?: string }> {
  const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/reopen`, {
    reason,
  });
  return extractData<{ success: boolean; message?: string }>(res) || { success: true };
}