import { useEffect, useMemo } from "react";
import { AlertCircle, Banknote, RefreshCw, Sparkles } from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  analyzeAIPayroll,
  detectAIPayrollAnomalies,
  detectAIPayrollFraud,
  fetchAIPayrollDashboard,
  generateAIPayrollForecast,
} from "@/store/aiPayroll/aiPayrollThunk";
import {
  selectAIPayrollActionError,
  selectAIPayrollActionLoading,
  selectAIPayrollAnomalies,
  selectAIPayrollBenchmarking,
  selectAIPayrollCostAnalysis,
  selectAIPayrollCostByDepartment,
  selectAIPayrollDashboard,
  selectAIPayrollError,
  selectAIPayrollForecast,
  selectAIPayrollFraud,
  selectAIPayrollHealthScore,
  selectAIPayrollLastUpdated,
  selectAIPayrollLoading,
} from "@/store/aiPayroll/aiPayrollSelectors";
import {
  buildPayrollCharts,
  buildPayrollFeatures,
  buildPayrollKpis,
  formatLastAnalysis,
} from "../utils/payrollMappers";

export function AIPayrollInsightsPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAIPayrollLoading);
  const error = useAppSelector(selectAIPayrollError);
  const actionLoading = useAppSelector(selectAIPayrollActionLoading);
  const actionError = useAppSelector(selectAIPayrollActionError);
  const dashboard = useAppSelector(selectAIPayrollDashboard);
  const forecast = useAppSelector(selectAIPayrollForecast);
  const costAnalysis = useAppSelector(selectAIPayrollCostAnalysis);
  const costByDepartment = useAppSelector(selectAIPayrollCostByDepartment);
  const benchmarking = useAppSelector(selectAIPayrollBenchmarking);
  const anomalies = useAppSelector(selectAIPayrollAnomalies);
  const fraud = useAppSelector(selectAIPayrollFraud);
  const healthScore = useAppSelector(selectAIPayrollHealthScore);
  const lastUpdated = useAppSelector(selectAIPayrollLastUpdated);

  useEffect(() => {
    dispatch(fetchAIPayrollDashboard());
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchAIPayrollDashboard());
  };

  const runAIAnalysis = () => {
    void Promise.all([
      dispatch(generateAIPayrollForecast()),
      dispatch(analyzeAIPayroll()),
      dispatch(detectAIPayrollAnomalies()),
      dispatch(detectAIPayrollFraud()),
    ]).then(() => {
      dispatch(fetchAIPayrollDashboard());
    });
  };

  const hasData = Boolean(
    dashboard ||
      forecast ||
      costAnalysis ||
      costByDepartment ||
      benchmarking.items.length > 0 ||
      benchmarking.total != null ||
      anomalies.items.length > 0 ||
      anomalies.total != null ||
      fraud.items.length > 0 ||
      fraud.total != null ||
      healthScore,
  );

  const kpis = useMemo(
    () => buildPayrollKpis(dashboard, forecast, healthScore, anomalies),
    [dashboard, forecast, healthScore, anomalies],
  );
  const charts = useMemo(
    () => buildPayrollCharts(forecast, costByDepartment, costAnalysis),
    [forecast, costByDepartment, costAnalysis],
  );
  const features = useMemo(
    () =>
      buildPayrollFeatures(
        forecast,
        benchmarking,
        anomalies,
        costAnalysis,
        fraud,
        healthScore,
        dashboard,
      ),
    [forecast, benchmarking, anomalies, costAnalysis, fraud, healthScore, dashboard],
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
      icon={Banknote}
      eyebrow="AI Payroll Insights"
      title="Payroll intelligence, anomalies & forecasts"
      description="Forecast payroll, benchmark salaries, and detect anomalies or fraud automatically."
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
          No payroll intelligence data available yet. Run AI analysis or sync payroll cycles to populate this view.
        </div>
      ) : null}
    </AIModulePage>
  );
}

export default AIPayrollInsightsPage;
