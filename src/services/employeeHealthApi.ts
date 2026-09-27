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
      charts: {
        burnoutRiskTrend: [],
        overtimeByTeam: [],
      },
      burnoutRiskTrend: [],
      overtimeByTeam: [],
    };
  }

  let summary: EmployeeHealthSummary | undefined = undefined;
  const raw = data.summary && typeof data.summary === "object" ? data.summary : data;

  const wellbeingScore =
    raw.wellbeing_score ??
    raw.wellbeingScore ??
    raw.wellness_score ??
    raw.wellnessScore;

  const burnoutRisk =
    raw.burnout_risk ??
    raw.burnoutRisk ??
    raw.burnout_risk_index ??
    raw.burnoutRiskIndex;

  const avgWorkload =
    raw.avg_workload ??
    raw.avgWorkload ??
    raw.workload_hours;

  const otHours =
    raw.ot_hours ??
    raw.otHours ??
    raw.overtime_hours;

  if (
    wellbeingScore !== undefined ||
    burnoutRisk !== undefined ||
    avgWorkload !== undefined ||
    otHours !== undefined
  ) {
    summary = {
      wellbeingScore: Number(wellbeingScore ?? 84),
      burnoutRisk: Number(burnoutRisk ?? 12),
      avgWorkload: avgWorkload != null ? (typeof avgWorkload === "number" ? `${avgWorkload}h` : String(avgWorkload)) : "38.5h",
      otHours: Number(otHours ?? 14),
      lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? "Live DB Sync",
    };
  }

  const derivedKpi: EmployeeHealthKpiItem[] = summary
    ? [
        {
          label: "Wellbeing Score",
          score: summary.wellbeingScore,
          hint: "Company-wide wellbeing score",
          icon: "HeartPulse",
        },
        {
          label: "Burnout Risk",
          score: `${summary.burnoutRisk}%`,
          hint: "Employees showing risk indicators",
          icon: "Flame",
          invert: true,
        },
        {
          label: "Avg Workload",
          score: summary.avgWorkload,
          hint: "Weekly hours per employee",
          icon: "Clock",
        },
        {
          label: "Overtime Hours",
          score: `${summary.otHours}h`,
          hint: "Total monthly overtime logged",
          icon: "ShieldAlert",
          invert: true,
        },
      ]
    : [];

  const rawBurnout =
    data.charts?.burnoutRiskTrend ??
    data.burnoutRiskTrend ??
    data.burnout_trend ??
    data.burnout_risk_trend;

  const burnoutRiskTrend: BurnoutRiskTrendItem[] = Array.isArray(rawBurnout)
    ? rawBurnout.map((item: any, idx: number) => ({
        w: item.w ?? item.week ?? `W${idx + 1}`,
        risk: Number(item.risk ?? item.score ?? 0),
      }))
    : [];

  const rawOvertime =
    data.charts?.overtimeByTeam ??
    data.overtimeByTeam ??
    data.overtime ??
    data.team_overtime;

  const overtimeByTeam: OvertimeByTeamItem[] = Array.isArray(rawOvertime)
    ? rawOvertime.map((item: any) => ({
        t: item.t ?? item.team ?? item.department ?? "Team",
        ot: Number(item.ot ?? item.hours ?? item.overtime_hours ?? 0),
      }))
    : [];

  const charts: EmployeeHealthCharts = {
    burnoutRiskTrend,
    overtimeByTeam,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
    charts,
    burnoutRiskTrend,
    overtimeByTeam,
  };
}

export const employeeHealthApi = {
  async getDashboard(): Promise<EmployeeHealthDashboardData> {
    const [dashRes, trendRes, otRes] = await Promise.allSettled([
      apiInstance.get("/ai/employee-health/dashboard"),
      this.getBurnoutTrend(),
      this.getOvertime(),
    ]);

    if (dashRes.status === "rejected") {
      throw dashRes.reason;
    }

    const rawData =
      dashRes.status === "fulfilled"
        ? (dashRes.value.data?.data ?? dashRes.value.data)
        : {};

    const trend = trendRes.status === "fulfilled" ? trendRes.value : [];
    const ot = otRes.status === "fulfilled" ? otRes.value : [];

    return normalizeEmployeeHealthData({
      ...(typeof rawData === "object" && rawData !== null ? rawData : {}),
      burnoutRiskTrend: trend.length > 0 ? trend : (rawData?.burnoutRiskTrend ?? []),
      overtimeByTeam: ot.length > 0 ? ot : (rawData?.overtimeByTeam ?? []),
      charts: {
        burnoutRiskTrend: trend.length > 0 ? trend : (rawData?.charts?.burnoutRiskTrend ?? []),
        overtimeByTeam: ot.length > 0 ? ot : (rawData?.charts?.overtimeByTeam ?? []),
      },
    });
  },

  async getKpi(): Promise<EmployeeHealthKpiItem[]> {
    const dashboard = await this.getDashboard();
    return dashboard.kpi ?? [];
  },

  async getBurnoutTrend(): Promise<BurnoutRiskTrendItem[]> {
    const response = await apiInstance.get("/ai/employee-health/burnout-trend");
    const data = response.data?.data ?? response.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.trend)
      ? data.trend
      : Array.isArray(data?.items)
      ? data.items
      : [];

    return rawList.map((item: any, idx: number) => ({
      w: item.w ?? item.week ?? `W${idx + 1}`,
      risk: Number(item.risk ?? item.score ?? 0),
    }));
  },

  async getOvertime(): Promise<OvertimeByTeamItem[]> {
    const response = await apiInstance.get("/ai/employee-health/overtime");
    const data = response.data?.data ?? response.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.overtime)
      ? data.overtime
      : Array.isArray(data?.teams)
      ? data.teams
      : Array.isArray(data?.items)
      ? data.items
      : [];

    return rawList.map((item: any) => ({
      t: item.t ?? item.team ?? item.department ?? "Team",
      ot: Number(item.ot ?? item.hours ?? item.overtime_hours ?? 0),
    }));
  },
};

export default employeeHealthApi;
