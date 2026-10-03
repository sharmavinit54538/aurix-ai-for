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
      charts: {
        headcountTrends: [],
        departmentComparison: [],
      },
      headcountTrends: [],
      departmentComparison: [],
    };
  }

  let summary: WorkforceInsightsSummary | undefined = undefined;
  const raw = data.summary && typeof data.summary === "object" ? data.summary : data;

  const workforceHealth =
    raw.workforce_health ??
    raw.workforceHealth ??
    (raw.capacity_utilization_pct != null ? Math.round(raw.capacity_utilization_pct) : undefined);

  const attritionRisk =
    raw.attrition_risk ??
    raw.attritionRisk ??
    (raw.vacancy_rate != null ? `${Math.round(raw.vacancy_rate)}%` : undefined);

  const productivityScore =
    raw.productivity_score ??
    raw.productivityScore ??
    (raw.capacity_utilization_pct != null ? Math.round(raw.capacity_utilization_pct) : undefined);

  const headcount =
    raw.headcount ??
    raw.workforce_size ??
    raw.active_employees;

  if (
    workforceHealth !== undefined ||
    attritionRisk !== undefined ||
    productivityScore !== undefined ||
    headcount !== undefined
  ) {
    summary = {
      workforceHealth: workforceHealth != null ? Number(workforceHealth) : null,
      attritionRisk: attritionRisk != null ? (typeof attritionRisk === "number" ? `${attritionRisk}%` : String(attritionRisk)) : null,
      productivityScore: productivityScore != null ? Number(productivityScore) : null,
      headcount: headcount != null ? Number(headcount) : null,
      riskSignalsCount: raw.risk_signals_count ?? raw.riskSignalsCount ?? null,
      lastAnalysis: raw.last_analysis ?? raw.lastAnalysis ?? null,
    };
  }

  const derivedKpi: WorkforceInsightsKpiItem[] = summary
    ? [
        {
          label: "Workforce Health",
          score: summary.workforceHealth,
          hint: "Workforce health index",
          icon: "HeartPulse",
        },
        {
          label: "Attrition Risk",
          score: summary.attritionRisk,
          hint: "Employees flagged at risk",
          icon: "UserMinus",
          invert: true,
        },
        {
          label: "Productivity Score",
          score: summary.productivityScore,
          hint: "Composite team productivity",
          icon: "Zap",
        },
        {
          label: "Headcount",
          score: summary.headcount,
          hint: "Active workforce count",
          icon: "Users",
        },
      ]
    : [];

  const rawTrends =
    data.charts?.headcountTrends ??
    data.headcountTrends ??
    data.headcount_trends;

  const headcountTrends: HeadcountTrendItem[] = Array.isArray(rawTrends) && rawTrends.length > 0
    ? rawTrends.map((t: any, idx: number) => ({
        m: t.m ?? t.month ?? t.period ?? `M${idx + 1}`,
        hc: Number(t.hc ?? t.headcount ?? t.count ?? 0),
      }))
    : [];

  const rawDepts =
    data.charts?.departmentComparison ??
    data.departmentComparison ??
    data.department_comparison;

  const departmentComparison: DepartmentComparisonItem[] = Array.isArray(rawDepts) && rawDepts.length > 0
    ? rawDepts.map((d: any) => ({
        d: d.d ?? d.department ?? d.name ?? "Team",
        prod: d.prod != null ? Number(d.prod) : d.productivity != null ? Number(d.productivity) : 0,
        risk: d.risk != null ? Number(d.risk) : d.attrition_risk != null ? Number(d.attrition_risk) : 0,
      }))
    : [];

  const charts: WorkforceInsightsCharts = {
    headcountTrends,
    departmentComparison,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
    charts,
    headcountTrends,
    departmentComparison,
  };
}

export const workforceInsightsApi = {
  async getDashboard(): Promise<WorkforceInsightsDashboardData> {
    const response = await apiInstance.get("/ai-brain/workforce-insights");
    const data = response.data?.data ?? response.data;
    return normalizeWorkforceInsightsData(data);
  },

  async getKpi(): Promise<WorkforceInsightsKpiItem[]> {
    const dashboard = await this.getDashboard();
    return dashboard.kpi ?? [];
  },

  async getHeadcountTrends(): Promise<HeadcountTrendItem[]> {
    const dashboard = await this.getDashboard();
    return dashboard.charts?.headcountTrends ?? [];
  },

  async getDepartmentComparison(): Promise<DepartmentComparisonItem[]> {
    const dashboard = await this.getDashboard();
    return dashboard.charts?.departmentComparison ?? [];
  },
};

export default workforceInsightsApi;
