import apiInstance from "@/api/apiInstance";
import { extractData } from "./utils";
import type { PayrollDashboardData } from "./types";

/**
 * Fetch the comprehensive dashboard data for a given payroll period.
 * GET /api/v1/payroll/dashboard?month=...&year=...
 * The backend accepts month/year parameters instead of periodId.
 */
export async function getDashboard(
  month?: number,
  year?: number
): Promise<PayrollDashboardData> {
  const params: Record<string, number> = {};
  if (month) params.month = month;
  if (year) params.year = year;
  
  const res = await apiInstance.get("/payroll/dashboard", {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
  return extractData<PayrollDashboardData>(res);
}