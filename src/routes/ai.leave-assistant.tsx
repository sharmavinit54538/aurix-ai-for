import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Users,
  TrendingUp,
  CalendarRange,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AIModulePage, type AIChart, type AIKpi, type AIFeature } from "@/components/aurix/AIModule";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchLeaveAssistantDashboard } from "@/store/leaveAssistant/leaveAssistantThunk";
import {
  selectLeaveAssistantLoading,
  selectLeaveAssistantError,
  selectLeaveAssistantKPIs,
  selectLeaveAssistantSummary,
  selectLeaveAssistantForecast,
  selectLeaveAssistantDistribution,
  selectLeaveAssistantLastUpdated,
} from "@/store/leaveAssistant/leaveAssistantSelectors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai/leave-assistant")({
  head: () => ({ meta: [{ title: "AI Leave Assistant — OFC360" }] }),
  component: Page,
});

const ICON_MAP: Record<string, any> = {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Users,
  TrendingUp,
  CalendarRange,
};

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLeaveAssistantLoading);
  const error = useAppSelector(selectLeaveAssistantError);
  const backendKpis = useAppSelector(selectLeaveAssistantKPIs);
  const summary = useAppSelector(selectLeaveAssistantSummary);
  const leaveForecast = useAppSelector(selectLeaveAssistantForecast);
  const leaveDistribution = useAppSelector(selectLeaveAssistantDistribution);
  const lastUpdated = useAppSelector(selectLeaveAssistantLastUpdated);

  useEffect(() => {
    dispatch(fetchLeaveAssistantDashboard());
  }, [dispatch]);

  const kpis: AIKpi[] = useMemo(() => {
    if (backendKpis && backendKpis.length > 0) {
      return backendKpis.map((k) => ({
        label: k.label,
        value: `${k.score}`,
        trend: k.trend,
        hint: k.hint,
        icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : FileText,
        invert: k.invert,
      }));
    }

    if (summary) {
      return [
        {
          label: "Pending Requests",
          value: summary.pendingRequests != null ? `${summary.pendingRequests}` : "—",
          icon: FileText,
          invert: true,
        },
        {
          label: "Approval Suggestions",
          value: summary.approvalSuggestions != null ? `${summary.approvalSuggestions}` : "—",
          icon: CheckCircle2,
        },
        {
          label: "Conflicts Detected",
          value: summary.conflictsDetected != null ? `${summary.conflictsDetected}` : "—",
          icon: AlertTriangle,
          invert: true,
        },
        {
          label: "Team Availability",
          value:
            summary.teamAvailability != null
              ? typeof summary.teamAvailability === "number"
                ? `${summary.teamAvailability}%`
                : `${summary.teamAvailability}`
              : "—",
          icon: Users,
        },
      ];
    }

    return [
      { label: "Pending Requests", value: "—", icon: FileText, invert: true },
      { label: "Approval Suggestions", value: "—", icon: CheckCircle2 },
      { label: "Conflicts Detected", value: "—", icon: AlertTriangle, invert: true },
      { label: "Team Availability", value: "—", icon: Users },
    ];
  }, [backendKpis, summary]);

  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    if (leaveForecast && leaveForecast.length > 0) {
      list.push({
        type: "area",
        title: "Leave Forecast (next 12 weeks)",
        xKey: "w",
        series: [{ key: "leaves", label: "Forecasted leaves" }],
        data: leaveForecast as unknown as Record<string, string | number>[],
      });
    }

    if (leaveDistribution && leaveDistribution.length > 0) {
      list.push({
        type: "bar",
        title: "Leave Type Distribution",
        xKey: "t",
        series: [{ key: "days", label: "Days" }],
        data: leaveDistribution as unknown as Record<string, string | number>[],
      });
    }

    return list;
  }, [leaveForecast, leaveDistribution]);

  const features: AIFeature[] = useMemo(
    () => [
      {
        title: "Leave Approval Suggestions",
        description: "AI recommends approve / discuss / decline with rationale.",
        icon: CheckCircle2,
        tone: "ok",
      },
      {
        title: "Leave Conflict Detection",
        description: "Flag overlaps in critical roles and small teams.",
        icon: AlertTriangle,
        metric: summary?.conflictsDetected != null ? `${summary.conflictsDetected}` : undefined,
        tone: "warn",
      },
      {
        title: "Team Availability Analysis",
        description: "See real-time team capacity by week.",
        icon: Users,
        tone: "info",
      },
      {
        title: "Leave Forecasting",
        description: "Predict leave volume across quarters.",
        icon: TrendingUp,
        tone: "info",
      },
      {
        title: "Leave Trends",
        description: "Historic patterns by team, season and type.",
        icon: CalendarRange,
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
      icon={FileText}
      eyebrow="AI Leave Assistant"
      title="Approve smarter, forecast availability"
      description="Suggest approvals, flag conflicts and forecast team availability before crunch time."
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
            onClick={() => dispatch(fetchLeaveAssistantDashboard())}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}
    </AIModulePage>
  );
}
