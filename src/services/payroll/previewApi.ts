import apiInstance from "@/api/apiInstance";
import { extractData } from "./utils";
import { normalizePayrollPreviewData, normalizePayrollEmployee } from "./normalizers";
import type {
  PayrollPreviewData,
  GetRunEmployeesParams,
  GetRunEmployeesResponse,
  PayrollPreviewEmployee,
} from "./types";

/**
 * Fetch comprehensive payroll preview for a completed/provision run.
 * GET /api/v2/payroll/runs/{runId}/preview
 * Zero mock data: raises error if backend is unavailable so UI renders proper state.
 */
export async function getPayrollPreview(runId: string): Promise<PayrollPreviewData> {
  const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/preview`, {
    headers: { "Cache-Control": "no-cache" },
    skipCache: true,
  });
  const data = extractData(res);
  return normalizePayrollPreviewData(runId, data);
}

/**
 * Fetch paginated employee payroll rows for a run.
 * GET /api/v2/payroll/runs/{runId}/employees
 */
export async function getRunEmployees(
  runId: string,
  params?: GetRunEmployeesParams,
): Promise<GetRunEmployeesResponse> {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.search) queryParams.search = params.search;
  if (params?.department && params.department !== "all") {
    queryParams.department = params.department;
  }
  if (params?.validationStatus && params.validationStatus !== "all") {
    queryParams.validationStatus = params.validationStatus;
  }
  if (params?.sortBy) queryParams.sortBy = params.sortBy;
  if (params?.sortDir) queryParams.sortDir = params.sortDir;

  const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/employees`, {
    params: queryParams,
    headers: { "Cache-Control": "no-cache" },
    skipCache: true,
  });
  const data = extractData(res);

  let rawList: unknown[] = [];
  let total = 0;
  let page = params?.page || 1;
  let limit = params?.limit || 10;
  let totalPages = 1;

  if (Array.isArray(data)) {
    rawList = data;
    total = data.length;
  } else if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.items)) rawList = d.items;
    else if (Array.isArray(d.employees)) rawList = d.employees;
    else if (Array.isArray(d.data)) rawList = d.data;

    total = Number(d.total ?? d.count ?? rawList.length) || rawList.length;
    page = Number(d.page ?? params?.page ?? 1) || 1;
    limit = Number(d.limit ?? params?.limit ?? 10) || 10;
    totalPages = Number(d.pages ?? d.total_pages ?? Math.ceil(total / limit)) || 1;
  }

  const items = rawList.map(normalizePayrollEmployee);
  return { items, total, page, limit, totalPages };
}

/**
 * Fetch single employee detailed payroll calculation for a run.
 * GET /api/v2/payroll/runs/{runId}/employees/{employeeId}
 */
export async function getRunEmployeeDetail(
  runId: string,
  employeeId: string,
): Promise<PayrollPreviewEmployee | null> {
  const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/employees/${employeeId}`, {
    headers: { "Cache-Control": "no-cache" },
    skipCache: true,
  });
  const data = extractData(res);
  return data ? normalizePayrollEmployee(data) : null;
}