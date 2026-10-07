import apiInstance from "@/api/apiInstance";
import axios from "axios";
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
  try {
    const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/preview`, {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });
    const data = extractData(res);
    return normalizePayrollPreviewData(runId, data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // Fallback to /payroll/runs/{runId}/preview or /payroll/runs/{runId}
      try {
        const fallbackRes = await apiInstance.get(`/payroll/runs/${runId}/preview`, {
          headers: { "Cache-Control": "no-cache" },
          skipCache: true,
        });
        const fallbackData = extractData(fallbackRes);
        if (fallbackData) {
          return normalizePayrollPreviewData(runId, fallbackData);
        }
      } catch {
        // Fall through and throw original error
      }
    }
    throw err;
  }
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

  try {
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
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // Fallback /payroll/runs/{runId}/employees
      try {
        const fbRes = await apiInstance.get(`/payroll/runs/${runId}/employees`, {
          params: queryParams,
          skipCache: true,
        });
        const fbData = extractData(fbRes);
        let rawList: unknown[] = [];
        if (Array.isArray(fbData)) rawList = fbData;
        else if (fbData && typeof fbData === "object") {
          const d = fbData as Record<string, unknown>;
          if (Array.isArray(d.items)) rawList = d.items;
        }
        const items = rawList.map(normalizePayrollEmployee);
        return {
          items,
          total: items.length,
          page: 1,
          limit: items.length || 10,
          totalPages: 1,
        };
      } catch {
        // Re-throw
      }
    }
    throw err;
  }
}

/**
 * Fetch single employee detailed payroll calculation for a run.
 * GET /api/v2/payroll/runs/{runId}/employees/{employeeId}
 */
export async function getRunEmployeeDetail(
  runId: string,
  employeeId: string,
): Promise<PayrollPreviewEmployee | null> {
  try {
    const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/employees/${employeeId}`, {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });
    const data = extractData(res);
    return data ? normalizePayrollEmployee(data) : null;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // Fallback /payroll/runs/{runId}/employees/{employeeId}
      try {
        const fbRes = await apiInstance.get(`/payroll/runs/${runId}/employees/${employeeId}`, {
          skipCache: true,
        });
        const fbData = extractData(fbRes);
        return fbData ? normalizePayrollEmployee(fbData) : null;
      } catch {
        return null;
      }
    }
    throw err;
  }
}