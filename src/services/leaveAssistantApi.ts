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
      charts: {
        leaveForecast: [],
        leaveTypeDistribution: [],
      },
      leaveForecast: [],
      leaveTypeDistribution: [],
    };
  }

  let summary: LeaveAssistantSummary | undefined = undefined;
  const raw = data.summary && typeof data.summary === "object" ? data.summary : data;

  const pendingRequests =
    raw.pending_leave_requests ??
    raw.pendingRequests ??
    raw.pendingApprovals;

  const approvalSuggestions =
    raw.approval_suggestions_count ??
    raw.approvalSuggestions;

  const conflictsDetected =
    raw.leave_conflicts_count ??
    raw.conflictsDetected;

  const teamAvail =
    raw.team_availability_percentage ??
    raw.teamAvailability;

  if (
    pendingRequests !== undefined ||
    approvalSuggestions !== undefined ||
    conflictsDetected !== undefined ||
    teamAvail !== undefined
  ) {
    summary = {
      pendingRequests: pendingRequests != null ? Number(pendingRequests) : null,
      approvalSuggestions: approvalSuggestions != null ? Number(approvalSuggestions) : null,
      conflictsDetected: conflictsDetected != null ? Number(conflictsDetected) : null,
      teamAvailability: teamAvail != null ? (typeof teamAvail === "number" ? `${Math.round(teamAvail)}%` : String(teamAvail)) : null,
      lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? null,
    };
  }

  const derivedKpi: LeaveAssistantKpiItem[] = summary
    ? [
        {
          label: "Pending Requests",
          score: summary.pendingRequests,
          hint: "Applications awaiting review",
          icon: "CalendarCheck",
        },
        {
          label: "Approval Suggestions",
          score: summary.approvalSuggestions,
          hint: "AI recommendations ready",
          icon: "CheckCircle",
        },
        {
          label: "Conflicts Detected",
          score: summary.conflictsDetected,
          hint: "Overlapping team leaves flagged",
          icon: "AlertTriangle",
          invert: true,
        },
        {
          label: "Team Availability",
          score: summary.teamAvailability,
          hint: "Staff capacity this week",
          icon: "Users",
        },
      ]
    : [];

  const rawForecast =
    data.charts?.leaveForecast ??
    data.leaveForecast ??
    data.forecast;

  const leaveForecast: LeaveForecastItem[] = Array.isArray(rawForecast)
    ? rawForecast.map((item: any, idx: number) => ({
        w: item.w ?? item.week ?? item.period ?? `W${idx + 1}`,
        leaves: Number(item.leaves ?? item.req ?? item.requests ?? item.count ?? 0),
        req: Number(item.req ?? item.requests ?? item.count ?? 0),
        conf: Number(item.conf ?? item.conflicts ?? 0),
      }))
    : [];

  const rawDist =
    data.charts?.leaveTypeDistribution ??
    data.leaveTypeDistribution ??
    data.distribution;

  const leaveTypeDistribution: LeaveTypeDistributionItem[] = Array.isArray(rawDist)
    ? rawDist.map((item: any) => ({
        t: item.t ?? item.type ?? item.leave_type ?? item.label ?? "General",
        days: Number(item.days ?? item.pct ?? item.percentage ?? item.share ?? 0),
        type: item.type ?? item.leave_type ?? item.label ?? "General",
        pct: Number(item.pct ?? item.percentage ?? item.share ?? 0),
      }))
    : [];

  const charts: LeaveAssistantCharts = {
    leaveForecast,
    leaveTypeDistribution,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
    charts,
    leaveForecast,
    leaveTypeDistribution,
  };
}

export const leaveAssistantApi = {
  async getDashboard(): Promise<LeaveAssistantDashboardData> {
    const [dashRes, forecastRes, distRes] = await Promise.allSettled([
      apiInstance.get("/ai/leave/dashboard"),
      this.getForecast(),
      this.getDistribution(),
    ]);

    if (dashRes.status === "rejected") {
      throw dashRes.reason;
    }

    const rawData =
      dashRes.status === "fulfilled"
        ? (dashRes.value.data?.data ?? dashRes.value.data)
        : {};

    const forecast = forecastRes.status === "fulfilled" ? forecastRes.value : [];
    const dist = distRes.status === "fulfilled" ? distRes.value : [];

    return normalizeLeaveAssistantData({
      ...(typeof rawData === "object" && rawData !== null ? rawData : {}),
      leaveForecast: forecast.length > 0 ? forecast : (rawData?.leaveForecast ?? []),
      leaveTypeDistribution: dist.length > 0 ? dist : (rawData?.leaveTypeDistribution ?? []),
      charts: {
        leaveForecast: forecast.length > 0 ? forecast : (rawData?.charts?.leaveForecast ?? []),
        leaveTypeDistribution: dist.length > 0 ? dist : (rawData?.charts?.leaveTypeDistribution ?? []),
      },
    });
  },

  async getKpi(): Promise<LeaveAssistantKpiItem[]> {
    const dashboard = await this.getDashboard();
    return dashboard.kpi ?? [];
  },

  async getForecast(): Promise<LeaveForecastItem[]> {
    const response = await apiInstance.get("/ai/leave/forecast");
    const data = response.data?.data ?? response.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.forecast)
      ? data.forecast
      : Array.isArray(data?.items)
      ? data.items
      : [];

    return rawList.map((item: any, idx: number) => ({
      w: item.w ?? item.week ?? item.period ?? `W${idx + 1}`,
      req: Number(item.req ?? item.requests ?? item.count ?? 0),
      conf: Number(item.conf ?? item.conflicts ?? 0),
    }));
  },

  async getDistribution(): Promise<LeaveTypeDistributionItem[]> {
    const response = await apiInstance.get("/ai/leave/distribution");
    const data = response.data?.data ?? response.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.distribution)
      ? data.distribution
      : Array.isArray(data?.items)
      ? data.items
      : [];

    return rawList.map((item: any) => ({
      type: item.type ?? item.leave_type ?? item.label ?? "General",
      pct: Number(item.pct ?? item.percentage ?? item.share ?? 0),
    }));
  },
};

export default leaveAssistantApi;
