import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import { normalizePayrollPeriod } from "../normalizers";
import type { PayrollPeriod, CreatePeriodPayload } from "../types";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { requestWithFallback } from "../utils";

/**
 * Create a new payroll period / cycle.
 * Canonical in OpenAPI: POST /api/v1/payroll/cycles
 */
export async function createPeriod(payload: CreatePeriodPayload): Promise<PayrollPeriod> {
  const body: Record<string, unknown> = {
    name: payload.name,
    start_date: payload.startDate,
    end_date: payload.endDate,
    pay_date: payload.payDate,
    startDate: payload.startDate,
    endDate: payload.endDate,
    payDate: payload.payDate,
    remarks: payload.remarks || undefined,
  };
  if (payload.periodMonth) body.period_month = payload.periodMonth;
  if (payload.periodYear) body.period_year = payload.periodYear;
  if (payload.companyId) body.company_id = payload.companyId;

  const headers = {
    "Idempotency-Key": generateIdempotencyKey(),
    "Cache-Control": "no-cache",
  };

  return requestWithFallback(
    async () => {
      const res = await apiInstance.post("/api/v1/payroll/cycles", body, { headers });
      const data = extractData(res);
      return normalizePayrollPeriod(data);
    },
    async () => {
      const res = await apiInstance.post("/payroll/periods", body, { headers });
      const data = extractData(res);
      return normalizePayrollPeriod(data);
    }
  );
}