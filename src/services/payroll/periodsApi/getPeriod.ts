import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import { normalizePayrollPeriod } from "../normalizers";
import type { PayrollPeriod } from "../types";
import { requestWithFallback } from "../utils";

/**
 * Fetch a single pay cycle / period by ID.
 */
export async function getPeriod(id: string): Promise<PayrollPeriod | null> {
  return requestWithFallback(
    async () => {
      const res = await apiInstance.get(`/api/v2/payroll/cycles/${id}`);
      const data = extractData(res);
      return data ? normalizePayrollPeriod(data) : null;
    },
    async () => {
      const res = await apiInstance.get(`/payroll/periods/${id}`);
      const data = extractData(res);
      return data ? normalizePayrollPeriod(data) : null;
    }
  );
}