import apiInstance from "@/api/apiInstance";
import axios from "axios";
import { extractData } from "../utils";
import { normalizePayrollPeriod } from "../normalizers";
import type { PayrollPeriod, CreatePeriodPayload } from "../types";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { requestWithFallback } from "../utils";

export interface CreatePeriodError {
  field: string;
  message: string;
}

/**
 * Create a new payroll period / cycle.
 * Canonical in OpenAPI: POST /api/v1/payroll/cycles
 * Backend requires: processing_date and payment_date
 * Sends: start_date, end_date, pay_date, processing_date, payment_date
 * Derives: period_month, period_year from startDate when not supplied
 */
export async function createPeriod(payload: CreatePeriodPayload): Promise<PayrollPeriod> {
  // Derive period_month and period_year from startDate if not provided
  let periodMonth = payload.periodMonth;
  let periodYear = payload.periodYear;
  if (!periodMonth || !periodYear) {
    const startDate = new Date(payload.startDate);
    if (!isNaN(startDate.getTime())) {
      periodMonth = periodMonth ?? startDate.getMonth() + 1; // 1-12
      periodYear = periodYear ?? startDate.getFullYear();
    }
  }

  // processing_date = endDate or payDate (fallback)
  const processingDate = payload.endDate || payload.payDate;
  // payment_date = payDate
  const paymentDate = payload.payDate;

  const body: Record<string, unknown> = {
    name: payload.name,
    start_date: payload.startDate,
    end_date: payload.endDate,
    pay_date: payload.payDate,
    processing_date: processingDate,
    payment_date: paymentDate,
    startDate: payload.startDate,
    endDate: payload.endDate,
    payDate: payload.payDate,
    remarks: payload.remarks || undefined,
  };
  if (periodMonth) body.period_month = periodMonth;
  if (periodYear) body.period_year = periodYear;
  if (payload.companyId) body.company_id = payload.companyId;

  const headers = {
    "Idempotency-Key": generateIdempotencyKey(),
    "Cache-Control": "no-cache",
  };

  try {
    return await requestWithFallback(
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
  } catch (err: unknown) {
    // Surface 422 field errors from FastAPI detail array
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      const detail = err.response.data?.detail;
      if (Array.isArray(detail)) {
        const fieldErrors: CreatePeriodError[] = detail.map((d: unknown) => {
          const errObj = d as Record<string, unknown>;
          const loc = Array.isArray(errObj.loc) ? errObj.loc.join(".") : "unknown";
          return {
            field: loc,
            message: String(errObj.msg || "Validation error"),
          };
        });
        // Throw a structured error that the UI can parse
        const error = new Error("Validation failed") as Error & { fieldErrors?: CreatePeriodError[] };
        error.fieldErrors = fieldErrors;
        throw error;
      }
    }
    throw err;
  }
}