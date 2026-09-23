import apiInstance from "@/api/apiInstance";
import type {
  KpiAttainmentItem,
  PerformanceCoachCharts,
  PerformanceCoachDashboardData,
  PerformanceCoachKpiItem,
  PerformanceCoachSummary,
  PerformanceTrendItem,
} from "@/store/performanceCoach/performanceCoachTypes";

export function normalizePerformanceCoachData(
  data: any,
): PerformanceCoachDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      charts: undefined,
    };
  }

  let summary: PerformanceCoachSummary | undefined = undefined;
  if (data.summary && typeof data.summary === "object") {
    summary = {
      avgPerformance: Number(data.summary.avgPerformance ?? 0),
      topPerformers: Number(data.summary.topPerformers ?? 0),
      skillGaps: Number(data.summary.skillGaps ?? 0),
      promotionPicks: Number(data.summary.promotionPicks ?? 0),
      lastAnalysis: data.summary.lastAnalysis,
    };
  } else if (
    data.avgPerformance !== undefined ||
    data.topPerformers !== undefined ||
    data.skillGaps !== undefined ||
    data.promotionPicks !== undefined
  ) {
    summary = {
      avgPerformance: Number(data.avgPerformance ?? 0),
      topPerformers: Number(data.topPerformers ?? 0),
      skillGaps: Number(data.skillGaps ?? 0),
      promotionPicks: Number(data.promotionPicks ?? 0),
      lastAnalysis: data.lastAnalysis,
    };
  }

  const performanceTrend: PerformanceTrendItem[] = Array.isArray(data.charts?.performanceTrend)
    ? data.charts.performanceTrend
    : Array.isArray(data.performanceTrend)
    ? data.performanceTrend
    : [];

  const kpiAttainment: KpiAttainmentItem[] = Array.isArray(data.charts?.kpiAttainment)
    ? data.charts.kpiAttainment
    : Array.isArray(data.kpiAttainment)
    ? data.kpiAttainment
    : [];

  const charts: PerformanceCoachCharts = {
    performanceTrend,
    kpiAttainment,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) ? data.kpi : [],
    charts,
  };
}

export const performanceCoachApi = {
  async getDashboard(): Promise<PerformanceCoachDashboardData> {
    try {
      const response = await apiInstance.get("/performance-coach/dashboard");
      const data = response.data?.data ?? response.data;
      return normalizePerformanceCoachData(data);
    } catch {
      // Fallback to ai-hub endpoint
      const response = await apiInstance.get("/ai-hub/performance-coach");
      const data = response.data?.data ?? response.data;
      return normalizePerformanceCoachData(data);
    }
  },

  async getKpi(): Promise<PerformanceCoachKpiItem[]> {
    const response = await apiInstance.get("/performance-coach/kpi");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getTrend(): Promise<PerformanceTrendItem[]> {
    const response = await apiInstance.get("/performance-coach/trend");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getAttainment(): Promise<KpiAttainmentItem[]> {
    const response = await apiInstance.get("/performance-coach/attainment");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
};

export default performanceCoachApi;
