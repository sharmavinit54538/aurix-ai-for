import apiInstance from "@/api/apiInstance";
import type {
  AIInsightsCharts,
  AIInsightsDashboardData,
  AttendanceInsightItem,
  AttritionItem,
  BurnoutItem,
  KpiItem,
  PerformanceData,
  RecruitmentData,
} from "@/store/aiInsights/aiInsightsTypes";

export function normalizeDashboardData(data: Partial<AIInsightsDashboardData> | null | undefined): AIInsightsDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      attrition: [],
      burnout: [],
      attendance: [],
      recruitment: undefined,
      performance: undefined,
      payroll: undefined,
      charts: undefined,
      alerts: [],
      recommendations: [],
      documents: [],
    };
  }

  return {
    summary: data.summary ?? undefined,
    kpi: Array.isArray(data.kpi) ? data.kpi : [],
    attrition: Array.isArray(data.attrition) ? data.attrition : [],
    burnout: Array.isArray(data.burnout) ? data.burnout : [],
    attendance: Array.isArray(data.attendance) ? data.attendance : [],
    recruitment: data.recruitment
      ? {
          openPositions: data.recruitment.openPositions ?? 0,
          recommendedCandidatesCount: data.recruitment.recommendedCandidatesCount ?? 0,
          pipelineHealth: data.recruitment.pipelineHealth ?? "",
          candidates: Array.isArray(data.recruitment.candidates) ? data.recruitment.candidates : [],
        }
      : undefined,
    performance: data.performance
      ? {
          topPerformers: Array.isArray(data.performance.topPerformers) ? data.performance.topPerformers : [],
          supportPerformers: Array.isArray(data.performance.supportPerformers) ? data.performance.supportPerformers : [],
          skillGap: Array.isArray(data.performance.skillGap) ? data.performance.skillGap : [],
        }
      : undefined,
    payroll: data.payroll
      ? {
          payrollHealth: data.payroll.payrollHealth ?? 0,
          savingsOpportunities: data.payroll.savingsOpportunities ?? "",
          anomaliesDetected: data.payroll.anomaliesDetected ?? 0,
          alerts: Array.isArray(data.payroll.alerts) ? data.payroll.alerts : [],
          trend: Array.isArray(data.payroll.trend) ? data.payroll.trend : [],
        }
      : undefined,
    charts: data.charts
      ? {
          skillGap: Array.isArray(data.charts.skillGap) ? data.charts.skillGap : [],
          payrollTrend: Array.isArray(data.charts.payrollTrend) ? data.charts.payrollTrend : [],
          headcountForecast: Array.isArray(data.charts.headcountForecast) ? data.charts.headcountForecast : [],
          hiringDemand: Array.isArray(data.charts.hiringDemand) ? data.charts.hiringDemand : [],
          satisfactionTrend: Array.isArray(data.charts.satisfactionTrend) ? data.charts.satisfactionTrend : [],
        }
      : undefined,
    alerts: Array.isArray(data.alerts) ? data.alerts : [],
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    documents: Array.isArray(data.documents) ? data.documents : [],
  };
}

export const aiInsightsApi = {
  async getDashboard(): Promise<AIInsightsDashboardData> {
    const response = await apiInstance.get("/ai-insights/dashboard");
    const data = response.data?.data ?? response.data;
    return normalizeDashboardData(data);
  },

  async getKpi(): Promise<KpiItem[]> {
    const response = await apiInstance.get("/ai-insights/kpi");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getAttrition(): Promise<AttritionItem[]> {
    const response = await apiInstance.get("/ai-insights/attrition");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getBurnout(): Promise<BurnoutItem[]> {
    const response = await apiInstance.get("/ai-insights/burnout");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getAttendance(): Promise<AttendanceInsightItem[]> {
    const response = await apiInstance.get("/ai-insights/attendance");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getPerformance(): Promise<PerformanceData> {
    const response = await apiInstance.get("/ai-insights/performance");
    const data = response.data?.data ?? response.data ?? {};
    return {
      topPerformers: Array.isArray(data.topPerformers) ? data.topPerformers : [],
      supportPerformers: Array.isArray(data.supportPerformers) ? data.supportPerformers : [],
      skillGap: Array.isArray(data.skillGap) ? data.skillGap : [],
    };
  },

  async getRecruitment(): Promise<RecruitmentData> {
    const response = await apiInstance.get("/ai-insights/recruitment");
    const data = response.data?.data ?? response.data ?? {};
    return {
      openPositions: data.openPositions ?? 0,
      recommendedCandidatesCount: data.recommendedCandidatesCount ?? 0,
      pipelineHealth: data.pipelineHealth ?? "",
      candidates: Array.isArray(data.candidates) ? data.candidates : [],
    };
  },

  async getCharts(): Promise<AIInsightsCharts> {
    const response = await apiInstance.get("/ai-insights/charts");
    const data = response.data?.data ?? response.data ?? {};
    return {
      skillGap: Array.isArray(data.skillGap) ? data.skillGap : [],
      payrollTrend: Array.isArray(data.payrollTrend) ? data.payrollTrend : [],
      headcountForecast: Array.isArray(data.headcountForecast) ? data.headcountForecast : [],
      hiringDemand: Array.isArray(data.hiringDemand) ? data.hiringDemand : [],
      satisfactionTrend: Array.isArray(data.satisfactionTrend) ? data.satisfactionTrend : [],
    };
  },

  async getRecommendations(): Promise<string[]> {
    const response = await apiInstance.get("/ai-insights/recommendations");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
};

export default aiInsightsApi;
