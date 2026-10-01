import apiInstance from "@/api/apiInstance";

export interface HeadcountMetric {
  m: string;
  n: number;
}

export interface DepartmentMetric {
  name: string;
  value: number;
}

export interface TenureMetric {
  range: string;
  n: number;
}

export interface TurnoverMetric {
  period?: string;
  m?: string;
  rate?: number;
  [key: string]: any;
}

export interface PayrollCostMetric {
  m?: string;
  department?: string;
  cost?: number;
  [key: string]: any;
}

export interface ComplianceMetric {
  category?: string;
  score?: number;
  status?: string;
  [key: string]: any;
}

export interface ReportsFilterParams {
  start_date?: string;
  end_date?: string;
  department?: string;
}

export const reportsAnalyticsApi = {
  async getHeadcount(params?: ReportsFilterParams): Promise<HeadcountMetric[]> {
    const res = await apiInstance.get("/api/v2/reports/analytics/headcount", { params });
    const data = res.data?.data ?? res.data;
    if (!Array.isArray(data)) return [];
    return data;
  },

  async getDepartment(params?: ReportsFilterParams): Promise<DepartmentMetric[]> {
    const res = await apiInstance.get("/api/v2/reports/analytics/department", { params });
    const data = res.data?.data ?? res.data;
    if (!Array.isArray(data)) return [];
    return data;
  },

  async getTenure(params?: ReportsFilterParams): Promise<TenureMetric[]> {
    const res = await apiInstance.get("/api/v2/reports/analytics/tenure", { params });
    const data = res.data?.data ?? res.data;
    if (!Array.isArray(data)) return [];
    return data;
  },

  async getTurnover(params?: ReportsFilterParams): Promise<TurnoverMetric[]> {
    const res = await apiInstance.get("/api/v2/reports/analytics/turnover", { params });
    const data = res.data?.data ?? res.data;
    if (!Array.isArray(data)) return [];
    return data;
  },

  async getPayrollCost(params?: ReportsFilterParams): Promise<PayrollCostMetric[]> {
    const res = await apiInstance.get("/api/v2/reports/analytics/payroll-cost", { params });
    const data = res.data?.data ?? res.data;
    if (!Array.isArray(data)) return [];
    return data;
  },

  async getCompliance(params?: ReportsFilterParams): Promise<ComplianceMetric[]> {
    const res = await apiInstance.get("/api/v2/reports/analytics/compliance", { params });
    const data = res.data?.data ?? res.data;
    if (!Array.isArray(data)) return [];
    return data;
  },

  async exportCsv(params?: ReportsFilterParams): Promise<Blob> {
    const res = await apiInstance.get("/api/v2/reports/analytics/export", {
      params: { ...params, format: "csv" },
      responseType: "blob",
    });
    return res.data;
  },
};

export default reportsAnalyticsApi;
