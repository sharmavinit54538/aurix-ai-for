import apiInstance from "@/api/apiInstance";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { extractData, requestWithFallback } from "./utils";
import { normalizePayrollPeriod } from "./normalizers";
import type {
  PayrollPeriod,
  GetPeriodsParams,
  GetPeriodsResponse,
  CreatePeriodPayload,
} from "./types";

/**
 * Fetch paginated payroll periods/cycles with filters and server-side pagination.
 * Connects to /api/v2/payroll/cycles with fallback to /payroll/periods.
 */
export async function getPeriodsList(params?: GetPeriodsParams): Promise<GetPeriodsResponse> {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.status && params.status !== "all") queryParams.status = params.status;
  if (params?.year) queryParams.year = params.year;
  if (params?.month) queryParams.month = params.month;
  if (params?.search) queryParams.search = params.search;
  if (params?.company_id) queryParams.company_id = params.company_id;

  try {
    const res = await apiInstance.get("/api/v2/payroll/cycles", { params: queryParams });
    const body = res?.data !== undefined ? res.data : res;
    const data = extractData(body);

    let rawList: unknown[] = [];
    let total = 0;
    let page = params?.page || 1;
    let limit = params?.limit || 20;
    let totalPages = 1;

    if (Array.isArray(data)) {
      rawList = data;
      total = data.length;
    } else if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (Array.isArray(d.items)) rawList = d.items;
      else if (Array.isArray(d.cycles)) rawList = d.cycles;
      else if (Array.isArray(d.periods)) rawList = d.periods;
      else if (Array.isArray(d.data)) rawList = d.data;

      total = Number(d.total ?? d.count ?? rawList.length) || rawList.length;
      page = Number(d.page ?? params?.page ?? 1) || 1;
      limit = Number(d.limit ?? params?.limit ?? 20) || 20;
      totalPages = Number(d.pages ?? d.total_pages ?? Math.ceil(total / limit)) || 1;
    }

    const items = rawList.map(normalizePayrollPeriod);
    return { items, total, page, limit, totalPages };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 404) {
        // Fallback to /payroll/periods
        const res = await apiInstance.get("/payroll/periods", { params: queryParams });
        const data = extractData(res);
        let rawList: unknown[] = [];
        if (Array.isArray(data)) rawList = data;
        else if (data && typeof data === "object") {
          const d = data as Record<string, unknown>;
          if (Array.isArray(d.periods)) rawList = d.periods;
          else if (Array.isArray(d.items)) rawList = d.items;
        }
        const items = rawList.map(normalizePayrollPeriod);
        return {
          items,
          total: items.length,
          page: 1,
          limit: items.length || 20,
          totalPages: 1,
        };
      }
    }
    throw err;
  }
}

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

/**
 * Reopen a locked pay cycle (Admin only).
 */
export async function reopenPeriod(id: string, reason: string): Promise<{ success: boolean; message?: string }> {
  const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/reopen`, {
    reason,
  });
  return extractData<{ success: boolean; message?: string }>(res) || { success: true };
}

/**
 * Void / cancel a pay cycle.
 */
export async function voidPeriod(id: string, reason?: string): Promise<{ success: boolean; message?: string }> {
  const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/void`, {
    reason: reason || null,
  });
  return extractData<{ success: boolean; message?: string }>(res) || { success: true };
}