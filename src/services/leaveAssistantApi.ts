import apiInstance from "@/api/apiInstance";
import type {
  LeaveAssistantCharts,
  LeaveAssistantDashboardData,
  LeaveAssistantKpiItem,
  LeaveAssistantSummary,
  LeaveForecastItem,
  LeaveTypeDistributionItem,
} from "@/store/leaveAssistant/leaveAssistantTypes";

export function normalizeLeaveAssistantData(
  data: any,
): LeaveAssistantDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      charts: undefined,
    };
  }

  let summary: LeaveAssistantSummary | undefined = undefined;
  if (data.summary && typeof data.summary === "object") {
    summary = {
      pendingRequests: Number(data.summary.pendingRequests ?? data.summary.pendingApprovals ?? 0),
      approvalSuggestions: Number(data.summary.approvalSuggestions ?? 0),
      conflictsDetected: Number(data.summary.conflictsDetected ?? 0),
      teamAvailability: data.summary.teamAvailability ?? "100%",
      lastAnalysis: data.summary.lastAnalysis,
    };
  } else if (
    data.pendingRequests !== undefined ||
    data.pendingApprovals !== undefined ||
    data.approvalSuggestions !== undefined ||
    data.conflictsDetected !== undefined ||
    data.teamAvailability !== undefined
  ) {
    summary = {
      pendingRequests: Number(data.pendingRequests ?? data.pendingApprovals ?? 0),
      approvalSuggestions: Number(data.approvalSuggestions ?? 0),
      conflictsDetected: Number(data.conflictsDetected ?? 0),
      teamAvailability: data.teamAvailability ?? "100%",
      lastAnalysis: data.lastAnalysis,
    };
  }

  const leaveForecast: LeaveForecastItem[] = Array.isArray(data.charts?.leaveForecast)
    ? data.charts.leaveForecast
    : Array.isArray(data.leaveForecast)
    ? data.leaveForecast
    : [];

  const leaveTypeDistribution: LeaveTypeDistributionItem[] = Array.isArray(
    data.charts?.leaveTypeDistribution,
  )
    ? data.charts.leaveTypeDistribution
    : Array.isArray(data.leaveTypeDistribution)
    ? data.leaveTypeDistribution
    : [];

  const charts: LeaveAssistantCharts = {
    leaveForecast,
    leaveTypeDistribution,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) ? data.kpi : [],
    charts,
  };
}

export const leaveAssistantApi = {
  async getDashboard(): Promise<LeaveAssistantDashboardData> {
    try {
      const response = await apiInstance.get("/leave-assistant/dashboard");
      const data = response.data?.data ?? response.data;
      return normalizeLeaveAssistantData(data);
    } catch {
      // Fallback to ai-hub endpoint
      const response = await apiInstance.get("/ai-hub/leave-assistant");
      const data = response.data?.data ?? response.data;
      return normalizeLeaveAssistantData(data);
    }
  },

  async getKpi(): Promise<LeaveAssistantKpiItem[]> {
    const response = await apiInstance.get("/leave-assistant/kpi");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getForecast(): Promise<LeaveForecastItem[]> {
    const response = await apiInstance.get("/leave-assistant/forecast");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getDistribution(): Promise<LeaveTypeDistributionItem[]> {
    const response = await apiInstance.get("/leave-assistant/distribution");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
};

export default leaveAssistantApi;
