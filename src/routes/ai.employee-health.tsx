import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  HeartPulse,
  Flame,
  Activity,
  AlertTriangle,
  Timer,
  Smile,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AIModulePage, type AIChart, type AIKpi, type AIFeature } from "@/components/aurix/AIModule";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchEmployeeHealthDashboard } from "@/store/employeeHealth/employeeHealthThunk";
import {
  selectEmployeeHealthLoading,
  selectEmployeeHealthError,
  selectEmployeeHealthKPIs,
  selectEmployeeHealthSummary,
  selectEmployeeHealthBurnoutTrend,
  selectEmployeeHealthOvertimeByTeam,
  selectEmployeeHealthLastUpdated,
} from "@/store/employeeHealth/employeeHealthSelectors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai/employee-health")({
  head: () => ({ meta: [{ title: "AI Employee Health — OFC360" }] }),
  component: Page,
});

const ICON_MAP: Record<string, any> = {
  HeartPulse,
  Flame,
  Activity,
  AlertTriangle,
  Timer,
  Smile,
};

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectEmployeeHealthLoading);
  const error = useAppSelector(selectEmployeeHealthError);
  const backendKpis = useAppSelector(selectEmployeeHealthKPIs);
  const summary = useAppSelector(selectEmployeeHealthSummary);
  const burnoutRiskTrend = useAppSelector(selectEmployeeHealthBurnoutTrend);
  const overtimeByTeam = useAppSelector(selectEmployeeHealthOvertimeByTeam);
  const lastUpdated = useAppSelector(selectEmployeeHealthLastUpdated);

  useEffect(() => {
    dispatch(fetchEmployeeHealthDashboard());
  }, [dispatch]);

  const kpis: AIKpi[] = useMemo(() => {
    if (backendKpis && backendKpis.length > 0) {
      return backendKpis.map((k) => ({
        label: k.label,
        value: `${k.score}`,
        trend: k.trend,
        hint: k.hint,
        icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : HeartPulse,
        invert: k.invert,
      }));
    }

    if (summary) {
      return [
        {
          label: "Wellbeing Score",
          value: summary.wellbeingScore != null ? `${summary.wellbeingScore}` : "—",
          icon: Smile,
        },
        {
          label: "Burnout Risk",
          value: summary.burnoutRisk != null ? `${summary.burnoutRisk}` : "—",
          icon: Flame,
          invert: true,
        },
        {
          label: "Avg Workload",
          value:
            summary.avgWorkload != null
              ? typeof summary.avgWorkload === "number"
                ? `${summary.avgWorkload}h`
                : `${summary.avgWorkload}`
              : "—",
          icon: Activity,
          invert: true,
        },
        {
          label: "OT Hours",
          value: summary.otHours != null ? `${summary.otHours}` : "—",
          icon: Timer,
          invert: true,
        },
      ];
    }

    return [
      { label: "Wellbeing Score", value: "—", icon: Smile },
      { label: "Burnout Risk", value: "—", icon: Flame, invert: true },
      { label: "Avg Workload", value: "—", icon: Activity, invert: true },
      { label: "OT Hours", value: "—", icon: Timer, invert: true },
    ];
  }, [backendKpis, summary]);

  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    if (burnoutRiskTrend && burnoutRiskTrend.length > 0) {
      list.push({
        type: "area",
        title: "Burnout Risk Trend",
        xKey: "w",
        series: [{ key: "risk", label: "Risk index" }],
        data: burnoutRiskTrend as unknown as Record<string, string | number>[],
      });
    }

    if (overtimeByTeam && overtimeByTeam.length > 0) {
      list.push({
        type: "bar",
        title: "Overtime by Team (hrs)",
        xKey: "t",
        series: [{ key: "ot", label: "OT hrs" }],
        data: overtimeByTeam as unknown as Record<string, string | number>[],
      });
    }

    return list;
  }, [burnoutRiskTrend, overtimeByTeam]);

  const features: AIFeature[] = useMemo(
    () => [
      {
        title: "Burnout Detection",
        description: "Composite model of overtime, leave gaps and pulse signals.",
        icon: Flame,
        metric: summary?.burnoutRisk != null ? `${summary.burnoutRisk}` : undefined,
        tone: "warn",
      },
      {
        title: "Workload Analysis",
        description: "Per-employee weekly load with anomaly bands.",
        icon: Activity,
        tone: "info",
      },
      {
        title: "Stress Indicators",
        description: "Aggregated signals from surveys and behavior.",
        icon: AlertTriangle,
        tone: "warn",
      },
      {
        title: "Overtime Monitoring",
        description: "Trends, top contributors and budget impact.",
        icon: Timer,
        tone: "info",
      },
      {
        title: "Wellbeing Score",
        description: "Single org score with team breakdowns.",
        icon: Smile,
        metric: summary?.wellbeingScore != null ? `${summary.wellbeingScore}` : undefined,
        progress: summary?.wellbeingScore != null ? Number(summary.wellbeingScore) : undefined,
        tone: "ok",
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
      icon={HeartPulse}
      eyebrow="AI Employee Health"
      title="Spot burnout before it spreads"
      description="Detect burnout, analyze workload, monitor overtime and surface wellbeing risks."
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
            onClick={() => dispatch(fetchEmployeeHealthDashboard())}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}
    </AIModulePage>
  );
}
