import apiInstance from "@/api/apiInstance";
import type {
  ActionItemsByWeekItem,
  MeetingActionItemSummary,
  MeetingIntelligenceCharts,
  MeetingIntelligenceDashboardData,
  MeetingIntelligenceKpiItem,
  MeetingIntelligenceSummary,
  MeetingVolumeItem,
} from "@/store/meetingIntelligence/meetingIntelligenceTypes";

export function normalizeMeetingDashboardData(
  data: Partial<MeetingIntelligenceDashboardData & MeetingIntelligenceSummary> | null | undefined,
): MeetingIntelligenceDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      actionItems: [],
      charts: undefined,
    };
  }

  // Handle summary either as nested data.summary or top-level properties
  let summary: MeetingIntelligenceSummary | undefined = undefined;
  if (data.summary && typeof data.summary === "object") {
    summary = {
      meetingsAnalyzed: Number(data.summary.meetingsAnalyzed ?? 0),
      actionItems: Number(data.summary.actionItems ?? 0),
      followUps: Number(data.summary.followUps ?? 0),
      avgDuration: data.summary.avgDuration ?? "0m",
      lastAnalysis: data.summary.lastAnalysis,
    };
  } else if (
    data.meetingsAnalyzed !== undefined ||
    data.actionItems !== undefined ||
    data.followUps !== undefined ||
    data.avgDuration !== undefined
  ) {
    summary = {
      meetingsAnalyzed: Number(data.meetingsAnalyzed ?? 0),
      actionItems: typeof data.actionItems === "number" ? data.actionItems : 0,
      followUps: Number(data.followUps ?? 0),
      avgDuration: data.avgDuration ?? "0m",
      lastAnalysis: data.lastAnalysis,
    };
  }

  const actionItemsByWeek: ActionItemsByWeekItem[] = Array.isArray(data.charts?.actionItemsByWeek)
    ? data.charts!.actionItemsByWeek
    : Array.isArray(data.actionItemsByWeek)
    ? data.actionItemsByWeek
    : [];

  const meetingVolume: MeetingVolumeItem[] = Array.isArray(data.charts?.meetingVolume)
    ? data.charts!.meetingVolume
    : Array.isArray(data.meetingVolume)
    ? data.meetingVolume
    : [];

  const charts: MeetingIntelligenceCharts = {
    actionItemsByWeek,
    meetingVolume,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) ? data.kpi : [],
    actionItems: Array.isArray(data.actionItems) ? data.actionItems : [],
    charts,
  };
}

export const meetingIntelligenceApi = {
  async getDashboard(): Promise<MeetingIntelligenceDashboardData> {
    const response = await apiInstance.get("/meeting-intelligence/dashboard");
    const data = response.data?.data ?? response.data;
    return normalizeMeetingDashboardData(data);
  },

  async getKpi(): Promise<MeetingIntelligenceKpiItem[]> {
    const response = await apiInstance.get("/meeting-intelligence/kpi");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getActionItems(): Promise<ActionItemsByWeekItem[] | MeetingActionItemSummary[]> {
    const response = await apiInstance.get("/meeting-intelligence/action-items");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getVolume(): Promise<MeetingVolumeItem[]> {
    const response = await apiInstance.get("/meeting-intelligence/volume");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
};

export default meetingIntelligenceApi;
