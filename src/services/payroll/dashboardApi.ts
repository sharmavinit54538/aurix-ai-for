import apiInstance from "@/api/apiInstance";
import { extractData } from "./utils";
import type { PayrollDashboardData } from "./types";

/**
 * Fetch the comprehensive dashboard data for a given payroll period.
 * GET /api/v1/payroll/dashboard?periodId=...
 */
export async function getDashboard(periodId?: string): Promise<PayrollDashboardData> {
  const res = await apiInstance.get("/payroll/dashboard", {
    params: periodId ? { periodId } : undefined,
  });
  return extractData<PayrollDashboardData>(res);
}