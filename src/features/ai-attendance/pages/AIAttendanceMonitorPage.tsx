import { useEffect, useMemo } from "react";
import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAIAttendanceDashboard } from "@/store/aiAttendance/aiAttendanceThunk";
import {
  selectAIAttendanceAbsencePattern,
  selectAIAttendanceAnomalies,
  selectAIAttendanceDashboard,
  selectAIAttendanceError,
  selectAIAttendanceHealthScore,
  selectAIAttendanceLastUpdated,
  selectAIAttendanceLateArrivals,
  selectAIAttendanceLoading,
  selectAIAttendanceOvertime,
  selectAIAttendanceShiftViolations,
  selectAIAttendanceTrend,
  selectAIAttendanceWatchlist,
} from "@/store/aiAttendance/aiAttendanceSelectors";
import {
  buildAttendanceCharts,
  buildAttendanceFeatures,
  buildAttendanceKpis,
  formatLastAnalysis,
} from "../utils/attendanceMappers";

export function AIAttendanceMonitorPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAIAttendanceLoading);
  const error = useAppSelector(selectAIAttendanceError);
  const dashboard = useAppSelector(selectAIAttendanceDashboard);
  const trend = useAppSelector(selectAIAttendanceTrend);
  const lateArrivals = useAppSelector(selectAIAttendanceLateArrivals);
  const anomalies = useAppSelector(selectAIAttendanceAnomalies);
  const absencePattern = useAppSelector(selectAIAttendanceAbsencePattern);
  const overtime = useAppSelector(selectAIAttendanceOvertime);
  const shiftViolations = useAppSelector(selectAIAttendanceShiftViolations);
  const healthScore = useAppSelector(selectAIAttendanceHealthScore);
  const watchlist = useAppSelector(selectAIAttendanceWatchlist);
  const lastUpdated = useAppSelector(selectAIAttendanceLastUpdated);

  useEffect(() => {
    dispatch(fetchAIAttendanceDashboard());
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchAIAttendanceDashboard());
  };

  const hasData = Boolean(
    dashboard ||
      trend ||
      lateArrivals ||
      anomalies.items.length > 0 ||
      anomalies.total != null ||
      absencePattern ||
      overtime ||
      shiftViolations ||
      healthScore ||
      watchlist,
  );

  const kpis = useMemo(
    () => buildAttendanceKpis(dashboard, healthScore, lateArrivals, overtime, anomalies),
    [dashboard, healthScore, lateArrivals, overtime, anomalies],
  );
  const charts = useMemo(
    () => buildAttendanceCharts(trend, lateArrivals, overtime),
    [trend, lateArrivals, overtime],
  );
  const features = useMemo(
    () =>
      buildAttendanceFeatures(
        anomalies,
        absencePattern,
        overtime,
        shiftViolations,
        healthScore,
        watchlist,
        lateArrivals,
      ),
    [anomalies, absencePattern, overtime, shiftViolations, healthScore, watchlist, lateArrivals],
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
      icon={Clock}
      eyebrow="AI Attendance Monitor"
      title="Anomalies detected before they become problems"
      description="Spot attendance anomalies, late arrivals and absence patterns automatically."
      lastAnalysis={lastAnalysis}
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
          <Button size="sm" variant="outline" onClick={refresh} className="gap-1.5">
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}

      {!loading && !error && !hasData ? (
        <div className="mt-4 rounded-xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
          No attendance intelligence data available yet. Run AI analysis or sync attendance punches to populate this
          view.
        </div>
      ) : null}
    </AIModulePage>
  );
}

export default AIAttendanceMonitorPage;
