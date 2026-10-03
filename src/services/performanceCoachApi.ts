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
      charts: {
        performanceTrend: [],
        kpiAttainment: [],
      },
      performanceTrend: [],
      kpiAttainment: [],
    };
  }

  let summary: PerformanceCoachSummary | undefined = undefined;
  const raw = data.summary && typeof data.summary === "object" ? data.summary : data;

  const avgPerformance =
    raw.average_performance_score ??
    raw.avgPerformance ??
    raw.avg_performance;

  const topPerformers =
    raw.top_performers_count ??
    raw.topPerformers ??
    raw.top_performers;

  const skillGaps =
    raw.skill_gaps_count ??
    raw.skillGaps ??
    raw.skill_gaps;

  const promotionPicks =
    raw.promotion_picks_count ??
    raw.promotionPicks ??
    raw.promotion_picks;

  if (
    avgPerformance !== undefined ||
    topPerformers !== undefined ||
    skillGaps !== undefined ||
    promotionPicks !== undefined
  ) {
    summary = {
      avgPerformance: avgPerformance != null ? Number(avgPerformance) : null,
      topPerformers: topPerformers != null ? Number(topPerformers) : null,
      skillGaps: skillGaps != null ? Number(skillGaps) : null,
      promotionPicks: promotionPicks != null ? Number(promotionPicks) : null,
      lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? null,
    };
  }

  const derivedKpi: PerformanceCoachKpiItem[] = summary
    ? [
        {
          label: "Avg Performance",
          score: typeof summary.avgPerformance === "number" ? summary.avgPerformance.toFixed(1) : summary.avgPerformance,
          hint: "Company average score",
          icon: "Star",
        },
        {
          label: "Top Performers",
          score: summary.topPerformers,
          hint: "Scoring >= 4.5 this cycle",
          icon: "Trophy",
        },
        {
          label: "Skill Gaps",
          score: summary.skillGaps,
          hint: "Identified gap areas",
          icon: "Target",
          invert: true,
        },
        {
          label: "Promotion Picks",
          score: summary.promotionPicks,
          hint: "Ready for advancement",
          icon: "Award",
        },
      ]
    : [];

  const rawTrend =
    data.charts?.performanceTrend ??
    data.performanceTrend ??
    data.trends;

  const performanceTrend: PerformanceTrendItem[] = Array.isArray(rawTrend)
    ? rawTrend.map((t: any, idx: number) => ({
        q: t.q ?? t.label ?? t.period ?? `Q${idx + 1}`,
        team: Number(t.team ?? t.score ?? 0),
        top: Number(t.top ?? (t.score ? Number(t.score) + 0.6 : 0)),
      }))
    : [];

  const rawAttainment =
    data.charts?.kpiAttainment ??
    data.kpiAttainment ??
    data.kpi_attainment ??
    (Array.isArray(data.functions) ? data.functions : undefined);

  const kpiAttainment: KpiAttainmentItem[] = Array.isArray(rawAttainment)
    ? rawAttainment.map((item: any) => ({
        f: item.f ?? item.function ?? item.name ?? "Function",
        att: Number(item.att ?? item.attainment ?? item.kpi_attainment_pct ?? 0),
      }))
    : [];

  const charts: PerformanceCoachCharts = {
    performanceTrend,
    kpiAttainment,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
    charts,
    performanceTrend,
    kpiAttainment,
  };
}

export const performanceCoachApi = {
  async getDashboard(): Promise<PerformanceCoachDashboardData> {
    const [dashRes, trendRes, attRes] = await Promise.allSettled([
      apiInstance.get("/ai/performance/dashboard"),
      this.getTrend(),
      this.getAttainment(),
    ]);

    if (dashRes.status === "rejected") {
      throw dashRes.reason;
    }

    const rawData =
      dashRes.status === "fulfilled"
        ? (dashRes.value.data?.data ?? dashRes.value.data)
        : {};

    const trend = trendRes.status === "fulfilled" ? trendRes.value : [];
    const att = attRes.status === "fulfilled" ? attRes.value : [];

    return normalizePerformanceCoachData({
      ...(typeof rawData === "object" && rawData !== null ? rawData : {}),
      performanceTrend: trend.length > 0 ? trend : (rawData?.performanceTrend ?? []),
      kpiAttainment: att.length > 0 ? att : (rawData?.kpiAttainment ?? []),
      charts: {
        performanceTrend: trend.length > 0 ? trend : (rawData?.charts?.performanceTrend ?? []),
        kpiAttainment: att.length > 0 ? att : (rawData?.charts?.kpiAttainment ?? []),
      },
    });
  },

  async getKpi(): Promise<PerformanceCoachKpiItem[]> {
    const dashboard = await this.getDashboard();
    return dashboard.kpi ?? [];
  },

  async getTrend(): Promise<PerformanceTrendItem[]> {
    const response = await apiInstance.get("/ai/performance/trends");
    const data = response.data?.data ?? response.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.trends)
      ? data.trends
      : Array.isArray(data?.items)
      ? data.items
      : [];

    return rawList.map((t: any, idx: number) => ({
      q: t.q ?? t.label ?? t.period ?? `Q${idx + 1}`,
      team: Number(t.team ?? t.score ?? 0),
      top: Number(t.top ?? (t.score ? Number(t.score) + 0.6 : 0)),
    }));
  },

  async getAttainment(): Promise<KpiAttainmentItem[]> {
    const response = await apiInstance.get("/ai/performance/kpi-attainment");
    const data = response.data?.data ?? response.data;
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.functions)
      ? data.functions
      : Array.isArray(data?.attainment)
      ? data.attainment
      : Array.isArray(data?.items)
      ? data.items
      : [];

    return rawList.map((item: any) => ({
      f: item.f ?? item.function ?? item.name ?? "Function",
      att: Number(item.att ?? item.attainment ?? item.kpi_attainment_pct ?? 0),
    }));
  },
};

export default performanceCoachApi;
