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
      charts: {
        actionItemsByWeek: [],
        meetingVolume: [],
      },
      actionItemsByWeek: [],
      meetingVolume: [],
    };
  }

  // Handle summary either as nested data.summary or top-level properties
  let summary: MeetingIntelligenceSummary | undefined = undefined;
  const raw = data.summary && typeof data.summary === "object" ? data.summary : (data as any);

  const meetingsAnalyzed =
    raw.meetings_analyzed ??
    raw.meetingsAnalyzed;

  const actionItems =
    raw.action_items_count ??
    (typeof raw.actionItems === "number"
      ? raw.actionItems
      : Array.isArray(raw.actionItems)
      ? raw.actionItems.length
      : undefined);

  const followUps =
    raw.follow_ups_count ??
    raw.followUps;

  const avgDuration =
    raw.avg_duration ??
    raw.avgDuration;

  if (
    meetingsAnalyzed !== undefined ||
    actionItems !== undefined ||
    followUps !== undefined ||
    avgDuration !== undefined
  ) {
    summary = {
      meetingsAnalyzed: meetingsAnalyzed != null ? Number(meetingsAnalyzed) : null,
      actionItems: actionItems != null ? Number(actionItems) : null,
      followUps: followUps != null ? Number(followUps) : null,
      avgDuration: avgDuration != null ? (typeof avgDuration === "number" ? `${avgDuration}m` : String(avgDuration)) : null,
      lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? null,
    };
  }

  const derivedKpi: MeetingIntelligenceKpiItem[] = summary
    ? [
        {
          label: "Meetings Analyzed",
          score: summary.meetingsAnalyzed,
          hint: "Total recorded sessions",
          icon: "Video",
        },
        {
          label: "Action Items",
          score: summary.actionItems,
          hint: "Extracted tasks pending",
          icon: "CheckSquare",
        },
        {
          label: "Follow-ups",
          score: summary.followUps,
          hint: "Open follow-up items",
          icon: "Clock",
        },
        {
          label: "Avg Duration",
          score: summary.avgDuration,
          hint: "Average session length",
          icon: "BarChart3",
        },
      ]
    : [];

  const rawActionItems =
    data.charts?.actionItemsByWeek ??
    data.actionItemsByWeek ??
    (data as any).action_items_by_week;

  const actionItemsByWeek: ActionItemsByWeekItem[] = Array.isArray(rawActionItems)
    ? rawActionItems.map((item: any, idx: number) => ({
        w: item.w ?? item.week ?? `W${idx + 1}`,
        items: Number(item.items ?? item.count ?? item.action_items ?? 0),
      }))
    : [];

  const rawVolume =
    data.charts?.meetingVolume ??
    data.meetingVolume ??
    (data as any).meeting_volume;

  const meetingVolume: MeetingVolumeItem[] = Array.isArray(rawVolume)
    ? rawVolume.map((item: any, idx: number) => ({
        d: item.d ?? item.w ?? item.week ?? `W${idx + 1}`,
        n: Number(item.n ?? item.count ?? item.meetings ?? item.volume ?? 0),
        w: item.w ?? item.week ?? `W${idx + 1}`,
        count: Number(item.count ?? item.meetings ?? item.volume ?? 0),
      }))
    : [];

  const charts: MeetingIntelligenceCharts = {
    actionItemsByWeek,
    meetingVolume,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
    actionItems: Array.isArray(data.actionItems) ? data.actionItems : [],
    charts,
    actionItemsByWeek,
    meetingVolume,
  };
}

export const meetingIntelligenceApi = {
  async getDashboard(): Promise<MeetingIntelligenceDashboardData> {
    const [dashRes, actionRes, volRes] = await Promise.allSettled([
      apiInstance.get("/ai/meeting/dashboard"),
      this.getActionItems(),
      this.getVolume(),
    ]);

    if (dashRes.status === "rejected") {
      throw dashRes.reason;
    }

    const rawData =
      dashRes.status === "fulfilled"
        ? (dashRes.value.data?.data ?? dashRes.value.data)
        : {};

    const actionItems = actionRes.status === "fulfilled" ? actionRes.value : [];
    const volume = volRes.status === "fulfilled" ? volRes.value : [];

    const actionItemsByWeek = Array.isArray(actionItems) && actionItems.length > 0 && "items" in (actionItems[0] || {})
      ? (actionItems as ActionItemsByWeekItem[])
      : (rawData?.actionItemsByWeek ?? []);

    return normalizeMeetingDashboardData({
      ...(typeof rawData === "object" && rawData !== null ? rawData : {}),
      actionItemsByWeek: actionItemsByWeek.length > 0 ? actionItemsByWeek : (rawData?.actionItemsByWeek ?? []),
      meetingVolume: volume.length > 0 ? volume : (rawData?.meetingVolume ?? []),
      charts: {
        actionItemsByWeek: actionItemsByWeek.length > 0 ? actionItemsByWeek : (rawData?.charts?.actionItemsByWeek ?? []),
        meetingVolume: volume.length > 0 ? volume : (rawData?.charts?.meetingVolume ?? []),
      },
    });
  },

  async getKpi(): Promise<MeetingIntelligenceKpiItem[]> {
    try {
      const response = await apiInstance.get("/ai/meeting/kpi");
      const data = response.data?.data ?? response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.kpi)) return data.kpi;
      return [];
    } catch {
      return [];
    }
  },

  async getActionItems(): Promise<ActionItemsByWeekItem[] | MeetingActionItemSummary[]> {
    const response = await apiInstance.get("/ai/meeting/action-items");
    const data = response.data?.data ?? response.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.action_items)
      ? data.action_items
      : Array.isArray(data?.items)
      ? data.items
      : [];

    return rawList;
  },

  async getVolume(): Promise<MeetingVolumeItem[]> {
    const response = await apiInstance.get("/ai/meeting/volume");
    const data = response.data?.data ?? response.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.volume)
      ? data.volume
      : Array.isArray(data?.items)
      ? data.items
      : [];

    return rawList.map((item: any, idx: number) => ({
      w: item.w ?? item.week ?? `W${idx + 1}`,
      count: Number(item.count ?? item.meetings ?? item.volume ?? 0),
    }));
  },
};

export default meetingIntelligenceApi;
