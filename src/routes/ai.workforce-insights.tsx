import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  Brain,
  HeartPulse,
  Users,
  UserMinus,
  Zap,
  TrendingUp,
  Building2,
  Activity,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AIModulePage, type AIChart, type AIKpi, type AIFeature } from "@/components/aurix/AIModule";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchWorkforceInsightsDashboard } from "@/store/workforceInsights/workforceInsightsThunk";
import {
  selectWorkforceInsightsLoading,
  selectWorkforceInsightsError,
  selectWorkforceInsightsKPIs,
  selectWorkforceInsightsSummary,
  selectWorkforceInsightsHeadcountTrends,
  selectWorkforceInsightsDepartmentComparison,
  selectWorkforceInsightsLastUpdated,
} from "@/store/workforceInsights/workforceInsightsSelectors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai/workforce-insights")({
  head: () => ({ meta: [{ title: "AI Workforce Insights — OFC360" }] }),
  component: Page,
});

const ICON_MAP: Record<string, any> = {
  Brain,
  HeartPulse,
  Users,
  UserMinus,
  Zap,
  TrendingUp,
  Building2,
  Activity,
  Sparkles,
};

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectWorkforceInsightsLoading);
  const error = useAppSelector(selectWorkforceInsightsError);
  const backendKpis = useAppSelector(selectWorkforceInsightsKPIs);
  const summary = useAppSelector(selectWorkforceInsightsSummary);
  const headcountTrends = useAppSelector(selectWorkforceInsightsHeadcountTrends);
  const departmentComparison = useAppSelector(selectWorkforceInsightsDepartmentComparison);
  const lastUpdated = useAppSelector(selectWorkforceInsightsLastUpdated);

  useEffect(() => {
    dispatch(fetchWorkforceInsightsDashboard());
  }, [dispatch]);

  const kpis: AIKpi[] = useMemo(() => {
    if (backendKpis && backendKpis.length > 0) {
      return backendKpis.map((k) => ({
        label: k.label,
        value: `${k.score}`,
        trend: k.trend,
        hint: k.hint,
        icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : Brain,
        invert: k.invert,
      }));
    }

    if (summary) {
      return [
        {
          label: "Workforce Health",
          value: summary.workforceHealth != null ? `${summary.workforceHealth}` : "—",
          icon: HeartPulse,
          hint: "Workforce health index",
        },
        {
          label: "Attrition Risk",
          value:
            summary.attritionRisk != null
              ? typeof summary.attritionRisk === "number"
                ? `${summary.attritionRisk}%`
                : `${summary.attritionRisk}`
              : "—",
          icon: UserMinus,
          invert: true,
          hint: "Employees flagged at risk",
        },
        {
          label: "Productivity Score",
          value: summary.productivityScore != null ? `${summary.productivityScore}` : "—",
          icon: Zap,
          hint: "Composite team productivity",
        },
        {
          label: "Headcount",
          value:
            summary.headcount != null
              ? typeof summary.headcount === "number"
                ? summary.headcount.toLocaleString()
                : `${summary.headcount}`
              : "—",
          icon: Users,
          hint: "Active workforce count",
        },
      ];
    }

    return [
      { label: "Workforce Health", value: "—", icon: HeartPulse },
      { label: "Attrition Risk", value: "—", icon: UserMinus, invert: true },
      { label: "Productivity Score", value: "—", icon: Zap },
      { label: "Headcount", value: "—", icon: Users },
    ];
  }, [backendKpis, summary]);

  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    if (headcountTrends && headcountTrends.length > 0) {
      list.push({
        type: "area",
        title: "Headcount Trends",
        description: "Monthly active employees",
        xKey: "m",
        series: [{ key: "hc", label: "Headcount" }],
        data: headcountTrends as unknown as Record<string, string | number>[],
      });
    }

    if (departmentComparison && departmentComparison.length > 0) {
      list.push({
        type: "bar",
        title: "Department Comparison",
        description: "Productivity vs. attrition risk by team",
        xKey: "d",
        series: [
          { key: "prod", label: "Productivity" },
          { key: "risk", label: "Risk" },
        ],
        data: departmentComparison as unknown as Record<string, string | number>[],
      });
    }

    return list;
  }, [headcountTrends, departmentComparison]);

  const features: AIFeature[] = useMemo(
    () => [
      {
        title: "Workforce Health Score",
        description: "Composite signal across engagement, attendance and performance.",
        icon: HeartPulse,
        metric: summary?.workforceHealth != null ? `${summary.workforceHealth}` : undefined,
        progress: summary?.workforceHealth != null ? Number(summary.workforceHealth) : undefined,
        tone: "ok",
      },
      {
        title: "Attrition Prediction",
        description: "Model flags employees likely to leave in the next 90 days.",
        icon: UserMinus,
        metric:
          summary?.attritionRisk != null
            ? typeof summary.attritionRisk === "number"
              ? `${summary.attritionRisk}%`
              : `${summary.attritionRisk}`
            : undefined,
        tone: "warn",
      },
      {
        title: "Team Productivity Analysis",
        description: "Identify high-output squads and bottlenecks.",
        icon: Zap,
        metric: summary?.productivityScore != null ? `${summary.productivityScore}` : undefined,
        tone: "ok",
      },
      {
        title: "Employee Risk Detection",
        description: "Surface burnout, disengagement and salary-band risks.",
        icon: Activity,
        metric: summary?.riskSignalsCount != null ? `${summary.riskSignalsCount} signals` : undefined,
        tone: "info",
      },
      {
        title: "Headcount Trends",
        description: "Visualize hiring vs. exits over time, segmented by team.",
        icon: TrendingUp,
        metric: summary?.headcount != null ? `${summary.headcount}` : undefined,
        tone: "ok",
      },
      {
        title: "Department Comparison",
        description: "Benchmark performance across business units.",
        icon: Building2,
        tone: "info",
      },
      {
        title: "Workforce Forecasting",
        description: "Project headcount and skills mix 12 months out.",
        icon: Sparkles,
        metric: "12-mo",
        tone: "info",
      },
    ],
    [summary],
  );

  if (loading && (!backendKpis || backendKpis.length === 0) && !summary) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <AIModulePage
      icon={Brain}
      eyebrow="AI Workforce Insights"
      title="Workforce intelligence, predicted in real time"
      description="Track workforce health, predict attrition and forecast headcount across every department."
      lastAnalysis={
        summary?.lastAnalysis ?? (lastUpdated ? "Live DB Sync" : "Live DB Sync")
      }
      kpis={kpis}
      charts={charts}
      features={features}
    >
      {error ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(fetchWorkforceInsightsDashboard())}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}
    </AIModulePage>
  );
}
