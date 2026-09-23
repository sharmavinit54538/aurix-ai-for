import apiInstance from "@/api/apiInstance";
import type {
  BurnoutRiskTrendItem,
  EmployeeHealthCharts,
  EmployeeHealthDashboardData,
  EmployeeHealthKpiItem,
  EmployeeHealthSummary,
  OvertimeByTeamItem,
} from "@/store/employeeHealth/employeeHealthTypes";

export function normalizeEmployeeHealthData(
  data: any,
): EmployeeHealthDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      charts: undefined,
    };
  }

  let summary: EmployeeHealthSummary | undefined = undefined;
  if (data.summary && typeof data.summary === "object") {
    summary = {
      wellbeingScore: Number(data.summary.wellbeingScore ?? data.summary.wellnessScore ?? 0),
      burnoutRisk: Number(data.summary.burnoutRisk ?? data.summary.burnoutRiskIndex ?? 0),
      avgWorkload: data.summary.avgWorkload ?? "0h",
      otHours: Number(data.summary.otHours ?? 0),
      lastAnalysis: data.summary.lastAnalysis,
    };
  } else if (
    data.wellbeingScore !== undefined ||
    data.wellnessScore !== undefined ||
    data.burnoutRisk !== undefined ||
    data.burnoutRiskIndex !== undefined ||
    data.avgWorkload !== undefined ||
    data.otHours !== undefined
  ) {
    summary = {
      wellbeingScore: Number(data.wellbeingScore ?? data.wellnessScore ?? 0),
      burnoutRisk: Number(data.burnoutRisk ?? data.burnoutRiskIndex ?? 0),
      avgWorkload: data.avgWorkload ?? "0h",
      otHours: Number(data.otHours ?? 0),
      lastAnalysis: data.lastAnalysis,
    };
  }

  const burnoutRiskTrend: BurnoutRiskTrendItem[] = Array.isArray(data.charts?.burnoutRiskTrend)
    ? data.charts.burnoutRiskTrend
    : Array.isArray(data.burnoutRiskTrend)
    ? data.burnoutRiskTrend
    : [];

  const overtimeByTeam: OvertimeByTeamItem[] = Array.isArray(data.charts?.overtimeByTeam)
    ? data.charts.overtimeByTeam
    : Array.isArray(data.overtimeByTeam)
    ? data.overtimeByTeam
    : [];

  const charts: EmployeeHealthCharts = {
    burnoutRiskTrend,
    overtimeByTeam,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) ? data.kpi : [],
    charts,
  };
}

export const employeeHealthApi = {
  async getDashboard(): Promise<EmployeeHealthDashboardData> {
    try {
      const response = await apiInstance.get("/employee-health/dashboard");
      const data = response.data?.data ?? response.data;
      return normalizeEmployeeHealthData(data);
    } catch {
      // Fallback to ai-hub endpoint
      const response = await apiInstance.get("/ai-hub/employee-health");
      const data = response.data?.data ?? response.data;
      return normalizeEmployeeHealthData(data);
    }
  },

  async getKpi(): Promise<EmployeeHealthKpiItem[]> {
    const response = await apiInstance.get("/employee-health/kpi");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getBurnoutTrend(): Promise<BurnoutRiskTrendItem[]> {
    const response = await apiInstance.get("/employee-health/burnout-trend");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getOvertime(): Promise<OvertimeByTeamItem[]> {
    const response = await apiInstance.get("/employee-health/overtime");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
};

export default employeeHealthApi;
