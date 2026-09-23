import apiInstance from "@/api/apiInstance";
import type {
  DepartmentComparisonItem,
  HeadcountTrendItem,
  WorkforceInsightsCharts,
  WorkforceInsightsDashboardData,
  WorkforceInsightsKpiItem,
  WorkforceInsightsSummary,
} from "@/store/workforceInsights/workforceInsightsTypes";

export function normalizeWorkforceInsightsData(
  data: any,
): WorkforceInsightsDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      charts: undefined,
    };
  }

  let summary: WorkforceInsightsSummary | undefined = undefined;
  if (data.summary && typeof data.summary === "object") {
    summary = {
      workforceHealth: Number(data.summary.workforceHealth ?? 0),
      attritionRisk: data.summary.attritionRisk ?? "0%",
      productivityScore: Number(data.summary.productivityScore ?? 0),
      headcount: Number(data.summary.headcount ?? 0),
      riskSignalsCount: data.summary.riskSignalsCount,
      lastAnalysis: data.summary.lastAnalysis,
    };
  } else if (
    data.workforceHealth !== undefined ||
    data.attritionRisk !== undefined ||
    data.productivityScore !== undefined ||
    data.headcount !== undefined
  ) {
    summary = {
      workforceHealth: Number(data.workforceHealth ?? 0),
      attritionRisk: data.attritionRisk ?? "0%",
      productivityScore: Number(data.productivityScore ?? 0),
      headcount: Number(data.headcount ?? 0),
      riskSignalsCount: data.riskSignalsCount,
      lastAnalysis: data.lastAnalysis,
    };
  }

  const headcountTrends: HeadcountTrendItem[] = Array.isArray(data.charts?.headcountTrends)
    ? data.charts.headcountTrends
    : Array.isArray(data.headcountTrends)
    ? data.headcountTrends
    : [];

  const departmentComparison: DepartmentComparisonItem[] = Array.isArray(
    data.charts?.departmentComparison,
  )
    ? data.charts.departmentComparison
    : Array.isArray(data.departmentComparison)
    ? data.departmentComparison
    : [];

  const charts: WorkforceInsightsCharts = {
    headcountTrends,
    departmentComparison,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) ? data.kpi : [],
    charts,
  };
}

export const workforceInsightsApi = {
  async getDashboard(): Promise<WorkforceInsightsDashboardData> {
    try {
      const response = await apiInstance.get("/workforce-insights/dashboard");
      const data = response.data?.data ?? response.data;
      return normalizeWorkforceInsightsData(data);
    } catch {
      // Fallback to ai-hub workforce-insights endpoint
      const response = await apiInstance.get("/ai-hub/workforce-insights");
      const data = response.data?.data ?? response.data;
      return normalizeWorkforceInsightsData(data);
    }
  },

  async getKpi(): Promise<WorkforceInsightsKpiItem[]> {
    const response = await apiInstance.get("/workforce-insights/kpi");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getHeadcountTrends(): Promise<HeadcountTrendItem[]> {
    const response = await apiInstance.get("/workforce-insights/headcount-trends");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getDepartmentComparison(): Promise<DepartmentComparisonItem[]> {
    const response = await apiInstance.get("/workforce-insights/department-comparison");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
};

export default workforceInsightsApi;
