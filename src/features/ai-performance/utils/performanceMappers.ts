import type { AIChart, AIFeature, AIKpi } from "@/components/aurix/AIModule";
import type {
  CoachingSuggestionsData,
  KpiAttainmentData,
  PerformanceDashboardKpis,
  PerformanceTrendsData,
  PromotionRecommendationsData,
  SkillGapsData,
  TopPerformersData,
} from "@/store/aiPerformance/aiPerformanceTypes";
import {
  Award,
  Gauge,
  GraduationCap,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";

function displayValue(value: number | null | undefined, fallback: string | number = "—"): string | number {
  return value == null ? fallback : value;
}

function roundMetric(value: number): number {
  return Number.isInteger(value) ? value : Math.round(value * 10) / 10;
}

/** Scores may be 0–5 or 0–100. Progress bars always expect 0–100. */
function toProgress(score: number | null | undefined): number | undefined {
  if (score == null) return undefined;
  if (score <= 5) return Math.min(100, Math.round((score / 5) * 100));
  return Math.min(100, Math.round(score));
}

export function buildPerformanceKpis(
  dashboard: PerformanceDashboardKpis | null,
  topPerformers: TopPerformersData,
  skillGaps: SkillGapsData,
  promotions: PromotionRecommendationsData,
): AIKpi[] {
  const avg = dashboard?.averageScore;
  const top =
    dashboard?.topPerformers ??
    topPerformers.total ??
    (topPerformers.employees.length ||
      topPerformers.managers.length ||
      topPerformers.departments.length ||
      null);
  const gaps = dashboard?.skillGaps ?? skillGaps.total ?? skillGaps.items.length;
  const picks = dashboard?.promotionPicks ?? promotions.total ?? promotions.items.length;

  if (avg == null && top == null && gaps == null && picks == null) return [];

  return [
    {
      label: "Avg Performance",
      value: displayValue(avg != null ? roundMetric(avg) : null),
      trend: dashboard?.averageScoreTrend ?? undefined,
      icon: Gauge,
    },
    {
      label: "Top Performers",
      value: displayValue(top),
      trend: dashboard?.topPerformersTrend ?? undefined,
      icon: Award,
    },
    {
      label: "Skill Gaps",
      value: displayValue(gaps),
      trend: dashboard?.skillGapsTrend ?? undefined,
      icon: GraduationCap,
      invert: true,
    },
    {
      label: "Promotion Picks",
      value: displayValue(picks),
      trend: dashboard?.promotionPicksTrend ?? undefined,
      icon: TrendingUp,
    },
  ];
}

export function buildPerformanceCharts(
  trends: PerformanceTrendsData | null,
  kpiAttainment: KpiAttainmentData | null,
): AIChart[] {
  const charts: AIChart[] = [];

  if (trends?.points?.length) {
    const hasSecondary = trends.points.some((point) => point.secondary != null);
    charts.push({
      type: "line",
      title: "Performance Trend",
      description: trends.period || "Multi-period performance trajectory",
      xKey: "label",
      series: hasSecondary
        ? [
            { key: "value", label: "Avg score", color: "oklch(0.7 0.16 200)" },
            { key: "secondary", label: "KPI attainment %", color: "oklch(0.68 0.2 290)" },
          ]
        : [{ key: "value", label: "Score", color: "oklch(0.7 0.16 200)" }],
      data: trends.points.map((point) => ({
        label: point.label,
        value: point.value,
        ...(point.secondary != null ? { secondary: point.secondary } : {}),
      })),
    });
  }

  if (kpiAttainment?.items?.length) {
    charts.push({
      type: "bar",
      title: "KPI Attainment by Function",
      description:
        kpiAttainment.overall != null
          ? `Overall attainment ${roundMetric(kpiAttainment.overall)}%`
          : kpiAttainment.period || "Attainment vs targets",
      xKey: "label",
      series: [{ key: "attainment", label: "Attainment %", color: "oklch(0.78 0.18 70)" }],
      data: kpiAttainment.items.map((item) => ({
        label: item.label.replace(" & ", "/").replace("Product & Design", "Product"),
        attainment: item.attainment,
      })),
    });
  }

  return charts;
}

export function buildPerformanceFeatures(
  dashboard: PerformanceDashboardKpis | null,
  topPerformers: TopPerformersData,
  skillGaps: SkillGapsData,
  promotions: PromotionRecommendationsData,
  coaching: CoachingSuggestionsData,
  trends: PerformanceTrendsData | null,
  kpiAttainment: KpiAttainmentData | null,
): AIFeature[] {
  const avg = dashboard?.averageScore;
  const gaps = skillGaps.total ?? skillGaps.items.length;
  const picks = promotions.total ?? promotions.items.length;
  const coachingCount = coaching.total ?? coaching.items.length;
  const topManager = topPerformers.managers[0];
  const topDept = topPerformers.departments[0];

  return [
    {
      title: "Employee Performance Score",
      description:
        topManager
          ? `Top manager: ${topManager.name} (${roundMetric(topManager.score)}).`
          : "Composite quarterly score per employee.",
      icon: Gauge,
      metric: avg != null ? String(roundMetric(avg)) : undefined,
      progress: toProgress(avg),
      tone: (avg ?? 0) >= 4 || (avg ?? 0) >= 80 ? "ok" : (avg ?? 0) >= 3 || (avg ?? 0) >= 60 ? "info" : "warn",
    },
    {
      title: "KPI Analysis",
      description:
        kpiAttainment?.overall != null
          ? `Overall attainment ${roundMetric(kpiAttainment.overall)}%.`
          : "Drill into attainment vs. targets by team.",
      icon: Target,
      metric: kpiAttainment?.items?.length ? `${kpiAttainment.items.length} funcs` : undefined,
      tone: "info",
    },
    {
      title: "Promotion Recommendations",
      description: promotions.items[0]?.reason || "AI surfaces ready-for-promotion candidates.",
      icon: Award,
      metric: String(picks),
      tone: picks > 0 ? "ok" : "info",
    },
    {
      title: "Skill Gap Analysis",
      description:
        skillGaps.items[0]
          ? `${skillGaps.items[0].skill}${skillGaps.items[0].recommendation ? ` — ${skillGaps.items[0].recommendation}` : ""}`
          : "Identify org-wide and individual skill gaps.",
      icon: GraduationCap,
      metric: String(gaps),
      tone: gaps > 0 ? "warn" : "ok",
    },
    {
      title: "Performance Trends",
      description: trends?.period
        ? `${trends.period}${topDept ? ` · Top dept: ${topDept.name}` : ""}`
        : "Multi-quarter performance trajectory.",
      icon: TrendingUp,
      metric: trends?.points?.length ? `${trends.points.length} qtrs` : undefined,
      tone: "info",
    },
    {
      title: "Coaching Suggestions",
      description:
        coaching.items[0]?.suggestion ||
        (coaching.items[0]?.employeeName
          ? `Next coaching focus: ${coaching.items[0].employeeName}`
          : "Personalized nudges for managers and ICs."),
      icon: Lightbulb,
      metric: coachingCount > 0 ? String(coachingCount) : undefined,
      tone: "info",
    },
  ];
}

export function formatLastAnalysis(isoDate: string | null): string | undefined {
  if (!isoDate) return undefined;

  const updatedAt = new Date(isoDate);
  if (Number.isNaN(updatedAt.getTime())) return undefined;

  const diffMinutes = Math.max(0, Math.round((Date.now() - updatedAt.getTime()) / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  return updatedAt.toLocaleDateString();
}
