import apiInstance from "@/api/apiInstance";
import type {
  AIPerformanceDashboardData,
  CoachingSuggestionItem,
  CoachingSuggestionsData,
  EmployeePerformanceProfile,
  KpiAttainmentData,
  KpiAttainmentItem,
  PerformanceAnalyticsData,
  PerformanceChartPoint,
  PerformanceDashboardKpis,
  PerformanceTrendsData,
  PromotionRecommendationItem,
  PromotionRecommendationsData,
  SkillGapItem,
  SkillGapsData,
  TopPerformerItem,
  TopPerformersData,
} from "@/store/aiPerformance/aiPerformanceTypes";

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unwrap(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  if ("success" in payload && "data" in payload) return payload.data ?? payload;
  return payload;
}

function pick(obj: AnyRecord | null | undefined, ...keys: string[]): unknown {
  if (!obj) return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function asOptionalId(value: unknown): string | undefined {
  if (value == null) return undefined;
  const id = asString(value);
  return id || undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

const emptyTopPerformers = (): TopPerformersData => ({
  total: null,
  employees: [],
  teams: [],
  departments: [],
  managers: [],
});

const emptySkillGaps = (): SkillGapsData => ({ total: null, items: [] });
const emptyPromotions = (): PromotionRecommendationsData => ({ total: null, items: [] });
const emptyCoaching = (): CoachingSuggestionsData => ({ total: null, items: [] });

function normalizePeople(raw: unknown): TopPerformerItem[] {
  const items: TopPerformerItem[] = [];
  asArray(raw).forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      id: asOptionalId(pick(item, "id", "employee_id", "employeeId", "team_id", "department_id")),
      name: asString(
        pick(item, "name", "employee_name", "employeeName", "team", "department", "manager_name", "managerName"),
        `Item ${index + 1}`,
      ),
      department: asString(pick(item, "department", "dept", "team"), "") || undefined,
      role: asString(pick(item, "role", "title", "position", "designation"), "") || undefined,
      score:
        asNumber(
          pick(
            item,
            "score",
            "team_score",
            "teamScore",
            "performance_score",
            "performanceScore",
            "avg_score",
            "average_score",
            "value",
          ),
        ) ?? 0,
      growth: asString(pick(item, "growth", "delta", "trend", "change"), "") || undefined,
      attainmentPct: asNumber(pick(item, "attainment_pct", "attainmentPct", "attainment_percentage")) ?? undefined,
    });
  });
  return items;
}

export function normalizePerformanceDashboard(raw: unknown): PerformanceDashboardKpis | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;
  const kpis = isRecord(data.kpis) ? data.kpis : isRecord(data.dashboard) ? (data.dashboard as AnyRecord) : data;

  return {
    averageScore: asNumber(
      pick(
        kpis,
        "average_performance_score",
        "averagePerformanceScore",
        "average_score",
        "averageScore",
        "avg_performance",
        "avgPerformance",
        "avg_score",
        "performance_score",
        "score",
      ),
    ),
    topPerformers: asNumber(
      pick(kpis, "top_performers_count", "topPerformersCount", "top_performers", "topPerformers", "top_count"),
    ),
    skillGaps: asNumber(
      pick(
        kpis,
        "skill_gaps_count",
        "skillGapsCount",
        "skill_gaps",
        "skillGaps",
        "skill_gap_count",
        "skillGapCount",
        "gaps",
        "gaps_count",
        "total_missing_skills",
      ),
    ),
    promotionPicks: asNumber(
      pick(
        kpis,
        "promotion_picks_count",
        "promotionPicksCount",
        "promotion_picks",
        "promotionPicks",
        "total_picks",
        "promotion_recommendations",
        "promotionRecommendations",
        "promotions",
        "promotion_count",
      ),
    ),
    averageScoreTrend: asNumber(pick(kpis, "average_score_trend", "averageScoreTrend", "score_trend")),
    topPerformersTrend: asNumber(pick(kpis, "top_performers_trend", "topPerformersTrend")),
    skillGapsTrend: asNumber(pick(kpis, "skill_gaps_trend", "skillGapsTrend")),
    promotionPicksTrend: asNumber(pick(kpis, "promotion_picks_trend", "promotionPicksTrend")),
  };
}

export function normalizeTrends(raw: unknown): PerformanceTrendsData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "data", "items", "points", "series", "trends") : data);
  const points: PerformanceChartPoint[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) {
      const value = asNumber(item);
      if (value != null) points.push({ label: `P${index + 1}`, value });
      return;
    }

    points.push({
      label: asString(pick(item, "label", "q", "quarter", "month", "period", "name", "date"), `P${index + 1}`),
      value:
        asNumber(
          pick(item, "score", "team", "team_avg", "teamAvg", "average", "avg", "value", "performance"),
        ) ?? 0,
      secondary:
        asNumber(
          pick(
            item,
            "kpi_attainment_pct",
            "kpiAttainmentPct",
            "top",
            "top_quartile",
            "topQuartile",
            "top_avg",
            "secondary",
          ),
        ) ?? undefined,
    });
  });

  if (!points.length && !root) return null;

  return {
    period: root ? asString(pick(root, "period", "range"), "") || undefined : undefined,
    points,
  };
}

export function normalizeKpiAttainment(raw: unknown): KpiAttainmentData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  const list = asArray(
    root ? pick(root, "functions", "items", "data", "departments", "kpis", "attainment") : data,
  );
  const items: KpiAttainmentItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      label: asString(
        pick(item, "function_name", "functionName", "label", "f", "function", "department", "dept", "name", "kpi", "team"),
        `KPI ${index + 1}`,
      ),
      attainment:
        asNumber(
          pick(
            item,
            "attainment_percentage",
            "attainmentPercentage",
            "att",
            "attainment",
            "attainment_pct",
            "attainmentPct",
            "percentage",
            "value",
            "score",
          ),
        ) ?? 0,
      target: asNumber(pick(item, "target_kpi", "targetKpi", "target", "goal")) ?? undefined,
      achieved: asNumber(pick(item, "achieved_kpi", "achievedKpi", "achieved")) ?? undefined,
      trend: asString(pick(item, "trend", "delta", "change"), "") || undefined,
    });
  });

  if (!items.length && !root) return null;

  const overallFromItems =
    items.length > 0
      ? items.reduce((sum, item) => sum + item.attainment, 0) / items.length
      : null;

  return {
    period: root ? asString(pick(root, "period", "range"), "") || undefined : undefined,
    overall: root
      ? asNumber(pick(root, "overall", "overall_attainment", "overallAttainment", "average", "avg")) ??
        overallFromItems
      : overallFromItems,
    items,
  };
}

export function normalizeTopPerformers(raw: unknown): TopPerformersData {
  const data = unwrap(raw);
  if (!data) return emptyTopPerformers();

  if (Array.isArray(data)) {
    const employees = normalizePeople(data);
    return { total: employees.length, employees, teams: [], departments: [], managers: [] };
  }

  if (!isRecord(data)) return emptyTopPerformers();

  const employees = normalizePeople(
    pick(data, "top_employees", "topEmployees", "employees", "items", "top_performers", "topPerformers", "data", "results"),
  );
  const teams = normalizePeople(pick(data, "teams", "top_teams", "topTeams"));
  const departments = normalizePeople(
    pick(data, "top_departments", "topDepartments", "departments"),
  );
  const managers = normalizePeople(pick(data, "top_managers", "topManagers", "managers"));

  return {
    total:
      asNumber(pick(data, "total", "count", "total_top_performers", "top_performers_count")) ??
      (employees.length || departments.length + managers.length + teams.length || null),
    employees,
    teams,
    departments,
    managers,
  };
}

export function normalizeSkillGaps(raw: unknown): SkillGapsData {
  const data = unwrap(raw);
  if (!data) return emptySkillGaps();

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "items", "skill_gaps", "skillGaps", "data", "gaps", "results") : data);
  const items: SkillGapItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;

    const missingSkills = asArray(pick(item, "missing_skills", "missingSkills", "skills"));
    const skillFromList =
      missingSkills.length > 0
        ? missingSkills.map((skill) => asString(skill)).filter(Boolean).join(", ")
        : "";

    const role = asString(pick(item, "role", "title", "position"), "") || undefined;
    const department = asString(pick(item, "department", "dept"), "") || undefined;
    const skill =
      asString(pick(item, "skill", "skill_name", "skillName", "name", "label", "competency"), "") ||
      skillFromList ||
      (role && department ? `${role} · ${department}` : role || department || `Skill ${index + 1}`);

    const have = asNumber(pick(item, "have", "current", "current_level", "currentLevel", "score")) ?? 0;
    const need = asNumber(pick(item, "need", "target", "required", "required_level", "requiredLevel")) ?? 0;

    items.push({
      skill,
      have,
      need: need || (missingSkills.length > 0 ? missingSkills.length : 0),
      gap:
        asNumber(pick(item, "gap", "delta", "missing_count", "missingCount")) ??
        (need > 0 ? Math.max(0, need - have) : missingSkills.length || 1),
      recommendation:
        asString(
          pick(item, "recommendation", "training", "suggestion", "action", "training_recommendation"),
          "",
        ) || undefined,
      department,
      role,
      employeeName: asString(pick(item, "employee_name", "employeeName", "name"), "") || undefined,
    });
  });

  return {
    total:
      (root
        ? asNumber(
            pick(root, "total_missing_skills", "totalMissingSkills", "total", "count", "skill_gap_count", "gaps_count"),
          )
        : null) ?? items.length,
    items,
  };
}

export function normalizePromotions(raw: unknown): PromotionRecommendationsData {
  const data = unwrap(raw);
  if (!data) return emptyPromotions();

  const root = isRecord(data) ? data : null;
  const list = asArray(
    root ? pick(root, "items", "recommendations", "promotions", "data", "results") : data,
  );
  const items: PromotionRecommendationItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      id: asOptionalId(pick(item, "id", "employee_id", "employeeId")),
      name: asString(pick(item, "name", "employee_name", "employeeName"), `Candidate ${index + 1}`),
      department: asString(pick(item, "department", "dept"), "") || undefined,
      currentRole: asString(pick(item, "current_role", "currentRole", "role", "title"), "") || undefined,
      recommendedRole:
        asString(pick(item, "recommended_role", "recommendedRole", "next_role", "nextRole"), "") || undefined,
      readiness: asNumber(pick(item, "readiness", "readiness_score", "readinessScore", "score", "confidence")),
      reason: asString(pick(item, "reason", "rationale", "details", "note"), "") || undefined,
    });
  });

  return {
    total:
      (root
        ? asNumber(
            pick(root, "total_picks", "totalPicks", "total", "count", "promotion_count", "promotion_picks", "promotionPicks"),
          )
        : null) ?? items.length,
    items,
  };
}

export function normalizeCoaching(raw: unknown): CoachingSuggestionsData {
  const data = unwrap(raw);
  if (!data) return emptyCoaching();

  const root = isRecord(data) ? data : null;
  const list = asArray(
    root ? pick(root, "items", "suggestions", "coaching", "data", "results", "nudges") : data,
  );
  const items: CoachingSuggestionItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    const employeeName = asString(pick(item, "employee_name", "employeeName", "name"), "") || undefined;
    const suggestion = asString(
      pick(
        item,
        "suggestion",
        "coaching_suggestion",
        "coachingSuggestion",
        "recommendation",
        "coaching",
        "message",
        "details",
        "nudge",
        "coaching_plan",
        "coachingPlan",
        "action_plan",
        "actionPlan",
      ),
      "",
    );

    items.push({
      id: asOptionalId(pick(item, "id", "employee_id", "employeeId")),
      employeeName,
      department: asString(pick(item, "department", "dept"), "") || undefined,
      title: asString(
        pick(item, "title", "focus", "topic", "area", "focus_area", "focusArea"),
        employeeName || `Suggestion ${index + 1}`,
      ),
      suggestion,
      focusArea: asString(pick(item, "focus_area", "focusArea", "skill", "category"), "") || undefined,
      priority: asString(pick(item, "priority", "severity", "level"), "") || undefined,
    });
  });

  return {
    total:
      (root
        ? asNumber(pick(root, "total_suggestions", "totalSuggestions", "total", "count", "suggestions_count"))
        : null) ?? items.length,
    items,
  };
}

export function normalizeAnalytics(raw: unknown): PerformanceAnalyticsData | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  const departmentBreakdown = asArray(pick(data, "department_breakdown", "departmentBreakdown")).flatMap(
    (item) => {
      if (!isRecord(item)) return [];
      const headcount = asNumber(pick(item, "headcount", "count"));
      return [
        {
          department: asString(pick(item, "department", "dept", "name"), "Unknown"),
          avgScore: asNumber(pick(item, "avg_score", "avgScore", "score")) ?? 0,
          ...(headcount != null ? { headcount } : {}),
        },
      ];
    },
  );

  const quarterlyTrend = asArray(pick(data, "quarterly_trend", "quarterlyTrend")).flatMap((item) => {
    if (!isRecord(item)) return [];
    const label = asString(pick(item, "quarter", "label", "period"), "");
    if (!label) return [];
    return [{ label, score: asNumber(pick(item, "score", "value")) ?? 0 }];
  });

  return {
    summary: asString(pick(data, "summary", "insight", "message", "note"), "") || undefined,
    avgScore: asNumber(
      pick(data, "overall_average", "overallAverage", "avg_score", "average_score", "averageScore", "score"),
    ),
    kpiCompletionRate: asNumber(
      pick(data, "kpi_completion_rate", "kpiCompletionRate", "completion_rate"),
    ),
    reviewedCount: asNumber(pick(data, "reviewed_count", "reviewedCount", "reviews", "total_reviews")),
    departmentBreakdown: departmentBreakdown.length ? departmentBreakdown : undefined,
    quarterlyTrend: quarterlyTrend.length ? quarterlyTrend : undefined,
  };
}

export function normalizeEmployeeProfile(raw: unknown): EmployeePerformanceProfile | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  const id = asOptionalId(pick(data, "id", "employee_id", "employeeId"));
  if (!id) return null;

  const breakdown = asArray(pick(data, "breakdown", "score_breakdown", "scoreBreakdown", "components"))
    .map((item) => {
      if (!isRecord(item)) return null;
      return {
        label: asString(pick(item, "label", "name", "metric"), "Metric"),
        score: asNumber(pick(item, "score", "value")) ?? 0,
      };
    })
    .filter((item): item is { label: string; score: number } => Boolean(item));

  return {
    ...data,
    id,
    name: asString(pick(data, "name", "employee_name", "employeeName"), "") || undefined,
    department: asString(pick(data, "department", "dept"), "") || undefined,
    score: asNumber(pick(data, "score", "performance_score", "performanceScore", "average_score")),
    breakdown,
  };
}

export function normalizePerformanceDashboardBundle(raw: unknown): AIPerformanceDashboardData {
  const data = unwrap(raw);
  if (!isRecord(data)) {
    return {
      dashboard: null,
      trends: null,
      kpiAttainment: null,
      topPerformers: emptyTopPerformers(),
      skillGaps: emptySkillGaps(),
      promotions: emptyPromotions(),
      coaching: emptyCoaching(),
      analytics: null,
    };
  }

  return {
    dashboard: normalizePerformanceDashboard(pick(data, "dashboard", "kpis", "kpi") ?? data),
    trends: normalizeTrends(pick(data, "trends", "performance_trends")),
    kpiAttainment: normalizeKpiAttainment(pick(data, "kpi_attainment", "kpiAttainment", "attainment")),
    topPerformers: normalizeTopPerformers(pick(data, "top_performers", "topPerformers")),
    skillGaps: normalizeSkillGaps(pick(data, "skill_gaps", "skillGaps")),
    promotions: normalizePromotions(
      pick(data, "promotion_recommendations", "promotionRecommendations", "promotions"),
    ),
    coaching: normalizeCoaching(pick(data, "coaching_suggestions", "coachingSuggestions", "coaching")),
    analytics: normalizeAnalytics(pick(data, "analytics", "performance_analytics")),
  };
}

async function getEndpoint<T>(path: string, normalize: (raw: unknown) => T): Promise<T> {
  const response = await apiInstance.get(path);
  return normalize(response.data ?? response);
}

async function postEndpoint<T>(path: string, body: unknown, normalize: (raw: unknown) => T): Promise<T> {
  const response = await apiInstance.post(path, body ?? {});
  return normalize(response.data ?? response);
}

export const aiPerformanceApi = {
  async getDashboard(): Promise<AIPerformanceDashboardData> {
    return getEndpoint("/ai/performance/dashboard", (raw) => {
      const combined = normalizePerformanceDashboardBundle(raw);
      if (
        combined.trends ||
        combined.kpiAttainment ||
        combined.topPerformers.employees.length > 0 ||
        combined.topPerformers.total != null ||
        combined.skillGaps.items.length > 0 ||
        combined.skillGaps.total != null ||
        combined.promotions.items.length > 0 ||
        combined.promotions.total != null ||
        combined.coaching.items.length > 0 ||
        combined.coaching.total != null ||
        combined.analytics
      ) {
        return combined;
      }

      return {
        ...combined,
        dashboard: normalizePerformanceDashboard(raw) ?? combined.dashboard,
      };
    });
  },

  async getDashboardKpis(): Promise<PerformanceDashboardKpis | null> {
    return getEndpoint("/ai/performance/dashboard", normalizePerformanceDashboard);
  },

  async getTrends(): Promise<PerformanceTrendsData | null> {
    return getEndpoint("/ai/performance/trends", normalizeTrends);
  },

  async getKpiAttainment(): Promise<KpiAttainmentData | null> {
    return getEndpoint("/ai/performance/kpi-attainment", normalizeKpiAttainment);
  },

  async getTopPerformers(): Promise<TopPerformersData> {
    return getEndpoint("/ai/performance/top-performers", normalizeTopPerformers);
  },

  async getEmployeeProfile(employeeId: string): Promise<EmployeePerformanceProfile | null> {
    return getEndpoint(`/ai/performance/employee/${employeeId}`, normalizeEmployeeProfile);
  },

  async getSkillGaps(): Promise<SkillGapsData> {
    return getEndpoint("/ai/performance/skill-gaps", normalizeSkillGaps);
  },

  async getPromotionRecommendations(): Promise<PromotionRecommendationsData> {
    return getEndpoint("/ai/performance/promotion-recommendations", normalizePromotions);
  },

  async getCoachingSuggestions(): Promise<CoachingSuggestionsData> {
    return getEndpoint("/ai/performance/coaching-suggestions", normalizeCoaching);
  },

  async getAnalytics(): Promise<PerformanceAnalyticsData | null> {
    return getEndpoint("/ai/performance/analytics", normalizeAnalytics);
  },

  async evaluate(payload: Record<string, unknown> = {}): Promise<unknown> {
    return postEndpoint("/ai/performance/evaluate", payload, unwrap);
  },

  async generateCoaching(payload: Record<string, unknown> = {}): Promise<CoachingSuggestionsData> {
    return postEndpoint("/ai/performance/generate-coaching", payload, normalizeCoaching);
  },

  async generatePromotion(payload: Record<string, unknown> = {}): Promise<PromotionRecommendationsData> {
    return postEndpoint("/ai/performance/generate-promotion", payload, normalizePromotions);
  },

  async analyzeSkillGaps(payload: Record<string, unknown> = {}): Promise<SkillGapsData> {
    return postEndpoint("/ai/performance/skill-gap-analysis", payload, normalizeSkillGaps);
  },
};

export default aiPerformanceApi;
