import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  Gauge,
  Target,
  Award,
  GraduationCap,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AIModulePage, type AIChart, type AIKpi, type AIFeature } from "@/components/aurix/AIModule";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchPerformanceCoachDashboard } from "@/store/performanceCoach/performanceCoachThunk";
import {
  selectPerformanceCoachLoading,
  selectPerformanceCoachError,
  selectPerformanceCoachKPIs,
  selectPerformanceCoachSummary,
  selectPerformanceCoachTrend,
  selectPerformanceCoachAttainment,
  selectPerformanceCoachLastUpdated,
} from "@/store/performanceCoach/performanceCoachSelectors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai/performance-coach")({
  head: () => ({ meta: [{ title: "AI Performance Coach — OFC360" }] }),
  component: Page,
});

const ICON_MAP: Record<string, any> = {
  Gauge,
  Target,
  Award,
  GraduationCap,
  TrendingUp,
  Lightbulb,
};

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectPerformanceCoachLoading);
  const error = useAppSelector(selectPerformanceCoachError);
  const backendKpis = useAppSelector(selectPerformanceCoachKPIs);
  const summary = useAppSelector(selectPerformanceCoachSummary);
  const performanceTrend = useAppSelector(selectPerformanceCoachTrend);
  const kpiAttainment = useAppSelector(selectPerformanceCoachAttainment);
  const lastUpdated = useAppSelector(selectPerformanceCoachLastUpdated);

  useEffect(() => {
    dispatch(fetchPerformanceCoachDashboard());
  }, [dispatch]);

  const kpis: AIKpi[] = useMemo(() => {
    if (backendKpis && backendKpis.length > 0) {
      return backendKpis.map((k) => ({
        label: k.label,
        value: `${k.score}`,
        trend: k.trend,
        hint: k.hint,
        icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : Gauge,
        invert: k.invert,
      }));
    }

    if (summary) {
      return [
        {
          label: "Avg Performance",
          value: summary.avgPerformance != null ? `${summary.avgPerformance}` : "—",
          icon: Gauge,
        },
        {
          label: "Top Performers",
          value: summary.topPerformers != null ? `${summary.topPerformers}` : "—",
          icon: Award,
        },
        {
          label: "Skill Gaps",
          value: summary.skillGaps != null ? `${summary.skillGaps}` : "—",
          icon: GraduationCap,
          invert: true,
        },
        {
          label: "Promotion Picks",
          value: summary.promotionPicks != null ? `${summary.promotionPicks}` : "—",
          icon: TrendingUp,
        },
      ];
    }

    return [
      { label: "Avg Performance", value: "—", icon: Gauge },
      { label: "Top Performers", value: "—", icon: Award },
      { label: "Skill Gaps", value: "—", icon: GraduationCap, invert: true },
      { label: "Promotion Picks", value: "—", icon: TrendingUp },
    ];
  }, [backendKpis, summary]);

  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    if (performanceTrend && performanceTrend.length > 0) {
      list.push({
        type: "line",
        title: "Performance Trend",
        xKey: "q",
        series: [
          { key: "team", label: "Team avg" },
          { key: "top", label: "Top quartile" },
        ],
        data: performanceTrend as unknown as Record<string, string | number>[],
      });
    }

    if (kpiAttainment && kpiAttainment.length > 0) {
      list.push({
        type: "bar",
        title: "KPI Attainment by Function",
        xKey: "f",
        series: [{ key: "att", label: "Attainment %" }],
        data: kpiAttainment as unknown as Record<string, string | number>[],
      });
    }

    return list;
  }, [performanceTrend, kpiAttainment]);

  const features: AIFeature[] = useMemo(
    () => [
      {
        title: "Employee Performance Score",
        description: "Composite quarterly score per employee.",
        icon: Gauge,
        metric: summary?.avgPerformance != null ? `${summary.avgPerformance}` : undefined,
        progress: summary?.avgPerformance != null ? Number(summary.avgPerformance) : undefined,
        tone: "ok",
      },
      {
        title: "KPI Analysis",
        description: "Drill into attainment vs. targets by team.",
        icon: Target,
        tone: "info",
      },
      {
        title: "Promotion Recommendations",
        description: "AI surfaces ready-for-promotion candidates.",
        icon: Award,
        metric: summary?.promotionPicks != null ? `${summary.promotionPicks}` : undefined,
        tone: "ok",
      },
      {
        title: "Skill Gap Analysis",
        description: "Identify org-wide and individual skill gaps.",
        icon: GraduationCap,
        metric: summary?.skillGaps != null ? `${summary.skillGaps}` : undefined,
        tone: "warn",
      },
      {
        title: "Performance Trends",
        description: "Multi-quarter performance trajectory.",
        icon: TrendingUp,
        tone: "info",
      },
      {
        title: "Coaching Suggestions",
        description: "Personalized nudges for managers and ICs.",
        icon: Lightbulb,
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
      icon={Gauge}
      eyebrow="AI Performance Coach"
      title="Personal coaching at organizational scale"
      description="Track KPIs, spot skill gaps, recommend promotions and generate coaching nudges."
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
            onClick={() => dispatch(fetchPerformanceCoachDashboard())}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}
    </AIModulePage>
  );
}
