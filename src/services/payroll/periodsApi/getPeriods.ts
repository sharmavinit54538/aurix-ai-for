import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import { normalizePayrollPeriod } from "../normalizers";
import type { PayrollPeriod } from "../types";
import { getPeriodsList } from "./getPeriodsList";

/**
 * Fetch all configured payroll periods from the backend (flat array).
 * Backwards compatible with dashboard period selectors.
 */
export async function getPeriods(): Promise<PayrollPeriod[]> {
  try {
    const res = await getPeriodsList({ limit: 100 });
    return res.items;
  } catch (err) {
    // Direct fallback to legacy /payroll/periods
    try {
      const res = await apiInstance.get("/payroll/periods");
      const data = extractData<PayrollPeriod[] | { periods: PayrollPeriod[] }>(res);
      if (Array.isArray(data)) {
        return data.map(normalizePayrollPeriod);
      }
      if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as { periods: PayrollPeriod[] }).periods)
      ) {
        return (data as { periods: PayrollPeriod[] }).periods.map(normalizePayrollPeriod);
      }
      return [];
    } catch {
      throw err;
    }
  }
}