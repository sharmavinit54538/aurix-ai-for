import { useEffect, useMemo } from "react";
import { AlertCircle, Gauge, RefreshCw, Sparkles } from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  analyzeAISkillGaps,
  fetchAIPerformanceDashboard,
  generateAICoaching,
  generateAIPromotion,
} from "@/store/aiPerformance/aiPerformanceThunk";
import {
  selectAIPerformanceActionError,
  selectAIPerformanceActionLoading,
  selectAIPerformanceCoaching,
  selectAIPerformanceDashboard,
  selectAIPerformanceError,
  selectAIPerformanceKpiAttainment,
  selectAIPerformanceLastUpdated,
  selectAIPerformanceLoading,
  selectAIPerformancePromotions,
  selectAIPerformanceSkillGaps,
  selectAIPerformanceTopPerformers,
  selectAIPerformanceTrends,
} from "@/store/aiPerformance/aiPerformanceSelectors";
import {
  buildPerformanceCharts,
  buildPerformanceFeatures,
  buildPerformanceKpis,
  formatLastAnalysis,
} from "../utils/performanceMappers";

export function AIPerformanceCoachPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAIPerformanceLoading);
  const error = useAppSelector(selectAIPerformanceError);
  const actionLoading = useAppSelector(selectAIPerformanceActionLoading);
  const actionError = useAppSelector(selectAIPerformanceActionError);
  const dashboard = useAppSelector(selectAIPerformanceDashboard);
  const trends = useAppSelector(selectAIPerformanceTrends);
  const kpiAttainment = useAppSelector(selectAIPerformanceKpiAttainment);
  const topPerformers = useAppSelector(selectAIPerformanceTopPerformers);
  const skillGaps = useAppSelector(selectAIPerformanceSkillGaps);
  const promotions = useAppSelector(selectAIPerformancePromotions);
  const coaching = useAppSelector(selectAIPerformanceCoaching);
  const lastUpdated = useAppSelector(selectAIPerformanceLastUpdated);

  useEffect(() => {
    dispatch(fetchAIPerformanceDashboard());
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchAIPerformanceDashboard());
  };

  const runAIAnalysis = () => {
    void Promise.all([
      dispatch(generateAICoaching()),
      dispatch(generateAIPromotion()),
      dispatch(analyzeAISkillGaps()),
    ]).then(() => {
      dispatch(fetchAIPerformanceDashboard());
    });
  };

  const hasData = Boolean(
    dashboard ||
      trends ||
      kpiAttainment ||
      topPerformers.employees.length > 0 ||
      topPerformers.total != null ||
      skillGaps.items.length > 0 ||
      skillGaps.total != null ||
      promotions.items.length > 0 ||
      promotions.total != null ||
      coaching.items.length > 0 ||
      coaching.total != null,
  );

  const kpis = useMemo(
    () => buildPerformanceKpis(dashboard, topPerformers, skillGaps, promotions),
    [dashboard, topPerformers, skillGaps, promotions],
  );
  const charts = useMemo(
    () => buildPerformanceCharts(trends, kpiAttainment),
    [trends, kpiAttainment],
  );
  const features = useMemo(
    () =>
      buildPerformanceFeatures(
        dashboard,
        topPerformers,
        skillGaps,
        promotions,
        coaching,
        trends,
        kpiAttainment,
      ),
    [dashboard, topPerformers, skillGaps, promotions, coaching, trends, kpiAttainment],
  );
  const lastAnalysis = formatLastAnalysis(lastUpdated);

  if (loading && !hasData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
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
      lastAnalysis={lastAnalysis}
      kpis={kpis}
      charts={charts}
      features={features}
    >
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={refresh} className="gap-1.5" disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          size="sm"
          onClick={runAIAnalysis}
          className="gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90"
          disabled={actionLoading}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {actionLoading ? "Running AI…" : "Run AI Analysis"}
        </Button>
      </div>

      {error || actionError ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error || actionError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={refresh} className="gap-1.5">
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}

      {!loading && !error && !hasData ? (
        <div className="mt-4 rounded-xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
          No performance intelligence data available yet. Run AI analysis or sync reviews to populate this view.
        </div>
      ) : null}
    </AIModulePage>
  );
}

export default AIPerformanceCoachPage;
