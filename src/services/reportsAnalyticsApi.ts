import apiInstance from "@/api/apiInstance";

export interface HeadcountMetric {
  month: string;
  headcount: number;
  hires?: number;
  exits?: number;
}

export interface DepartmentMetric {
  department: string;
  headcount: number;
  budget?: number;
  utilization?: number;
}

export interface TenureMetric {
  range: string;
  count: number;
}

export interface TurnoverMetric {
  month: string;
  rate: number;
  voluntary?: number;
  involuntary?: number;
}

export interface PayrollCostMetric {
  month: string;
  gross: number;
  net: number;
  tax?: number;
}

export interface ComplianceMetric {
  category: string;
  score: number;
  status: string;
}

export interface ReportsFilterParams {
  start_date?: string;
  end_date?: string;
  department?: string;
  location?: string;
}

export const reportsAnalyticsApi = {
  getSummary: async (params?: ReportsFilterParams) => {
    const res = await apiInstance.get("/reports/summary", { params });
    const d = res.data?.data ?? res.data ?? {};
    return {
      headcount: Number(d.headcount ?? 0),
      attrition_rate: Number(d.attrition_rate ?? 0),
      avg_tenure_years: Number(d.avg_tenure_years ?? 0),
      payroll_cost: Number(d.payroll_cost ?? 0),
      departments: (Array.isArray(d.departments)
        ? d.departments
        : []) as DepartmentMetric[],
      headcount_trend: (Array.isArray(d.headcount_trend)
        ? d.headcount_trend
        : []) as HeadcountMetric[],
      tenure_distribution: (Array.isArray(d.tenure_distribution)
        ? d.tenure_distribution
        : []) as TenureMetric[],
      turnover_trend: (Array.isArray(d.turnover_trend)
        ? d.turnover_trend
        : []) as TurnoverMetric[],
      payroll_costs: (Array.isArray(d.payroll_costs)
        ? d.payroll_costs
        : []) as PayrollCostMetric[],
      compliance_metrics: (Array.isArray(d.compliance_metrics)
        ? d.compliance_metrics
        : []) as ComplianceMetric[],
    };
  },
  exportReport: async (type: string, params?: ReportsFilterParams) => {
    const res = await apiInstance.get("/reports/export", {
      params: { type, ...params },
    });
    return res.data?.data ?? res.data ?? { success: true };
  },
};

export default reportsAnalyticsApi;
