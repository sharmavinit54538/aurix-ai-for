import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import { normalizePayrollPeriod } from "../normalizers";
import type {
  PayrollPeriod,
  GetPeriodsParams,
  GetPeriodsResponse,
} from "../types";

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