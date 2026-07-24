import { useEffect, useMemo } from "react";
import { AlertCircle, FileText, RefreshCw, Sparkles } from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  detectAILeaveConflicts,
  fetchAILeaveDashboard,
  generateAILeaveForecast,
  generateAILeaveSuggestions,
} from "@/store/aiLeave/aiLeaveThunk";
import {
  selectAILeaveActionError,
  selectAILeaveActionLoading,
  selectAILeaveApprovalSuggestions,
  selectAILeaveConflicts,
  selectAILeaveDashboard,
  selectAILeaveDistribution,
  selectAILeaveError,
  selectAILeaveForecast,
  selectAILeaveLastUpdated,
  selectAILeaveLoading,
  selectAILeaveTeamAvailability,
  selectAILeaveTrends,
} from "@/store/aiLeave/aiLeaveSelectors";
import {
  buildLeaveCharts,
  buildLeaveFeatures,
  buildLeaveKpis,
  formatLastAnalysis,
} from "../utils/leaveMappers";

export function AILeaveAssistantPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAILeaveLoading);
  const error = useAppSelector(selectAILeaveError);
  const actionLoading = useAppSelector(selectAILeaveActionLoading);
  const actionError = useAppSelector(selectAILeaveActionError);
  const dashboard = useAppSelector(selectAILeaveDashboard);
  const forecast = useAppSelector(selectAILeaveForecast);
  const distribution = useAppSelector(selectAILeaveDistribution);
  const approvalSuggestions = useAppSelector(selectAILeaveApprovalSuggestions);
  const conflicts = useAppSelector(selectAILeaveConflicts);
  const teamAvailability = useAppSelector(selectAILeaveTeamAvailability);
  const trends = useAppSelector(selectAILeaveTrends);
  const lastUpdated = useAppSelector(selectAILeaveLastUpdated);

  useEffect(() => {
    dispatch(fetchAILeaveDashboard());
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchAILeaveDashboard());
  };

  const runAIAnalysis = () => {
    void Promise.all([
      dispatch(generateAILeaveForecast()),
      dispatch(generateAILeaveSuggestions()),
      dispatch(detectAILeaveConflicts()),
    ]).then(() => {
      dispatch(fetchAILeaveDashboard());
    });
  };

  const hasData = Boolean(
    dashboard ||
      forecast ||
      distribution ||
      approvalSuggestions.items.length > 0 ||
      approvalSuggestions.total != null ||
      conflicts.items.length > 0 ||
      conflicts.total != null ||
      teamAvailability ||
      trends,
  );

  const kpis = useMemo(
    () => buildLeaveKpis(dashboard, approvalSuggestions, conflicts, teamAvailability),
    [dashboard, approvalSuggestions, conflicts, teamAvailability],
  );
  const charts = useMemo(
    () => buildLeaveCharts(forecast, distribution, trends),
    [forecast, distribution, trends],
  );
  const features = useMemo(
    () =>
      buildLeaveFeatures(approvalSuggestions, conflicts, teamAvailability, forecast, trends, dashboard),
    [approvalSuggestions, conflicts, teamAvailability, forecast, trends, dashboard],
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
      icon={FileText}
      eyebrow="AI Leave Assistant"
      title="Approve smarter, forecast availability"
      description="Suggest approvals, flag conflicts and forecast team availability before crunch time."
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
          No leave intelligence data available yet. Run AI analysis or sync leave requests to populate this view.
        </div>
      ) : null}
    </AIModulePage>
  );
}

export default AILeaveAssistantPage;
