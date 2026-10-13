import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  LineChart as LineChartIcon, BarChart3, Brain, Briefcase, Banknote, Gauge, Sparkles, HeartPulse, UserMinus, Zap, CheckCircle2, RefreshCw, AlertCircle, Users, Target, TrendingUp
} from "lucide-react";
import { AIModulePage, type AIKpi, type AIChart, type AIFeature } from "@/components/aurix/AIModule";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAIInsightsDashboard } from "@/store/aiInsights/aiInsightsThunk";
import {
  selectAIInsightsKPIs,
  selectAIInsightsLoading,
  selectAIInsightsError,
  selectAIInsightsHeadcountForecast,
  selectAIInsightsHiringDemand,
  selectAIInsightsPayrollTrend,
  selectAIInsightsSkillGap,
  selectAIInsightsAlerts,
  selectAIInsightsRecommendations,
  selectAIInsightsLastUpdated,
} from "@/store/aiInsights/aiInsightsSelectors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/ai/analytics-center")({
  head: () => ({ meta: [{ title: "AI Analytics Center — OFC360" }] }),
  component: Page,
});

const ICON_MAP: Record<string, any> = {
  HeartPulse,
  Sparkles,
  UserMinus,
  Zap,
  CheckCircle2,
  Briefcase,
  Brain,
  BarChart3,
  Gauge,
  Banknote,
  Users,
  Target,
  TrendingUp,
};

const KPI_UNIT: Record<string, "percent" | "currency" | "count"> = {
  "Workforce Health": "percent",
  "Hiring Pipeline": "percent",
  "Payroll Base": "currency",
  "Total Employees": "count",
  "Departments": "count",
  "Open Positions": "count",
};

function formatKpiValue(score: number, unit: "percent" | "currency" | "count"): string {
  if (unit === "percent") return `${score}%`;
  if (unit === "currency") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
      notation: score >= 100000 ? "compact" : "standard",
    }).format(score);
  }
  return new Intl.NumberFormat("en-IN").format(score);
}

function getUnitForLabel(label: string): "percent" | "currency" | "count" {
  if (KPI_UNIT[label]) return KPI_UNIT[label];
  const lower = label.toLowerCase();
  if (lower.includes("risk") || lower.includes("score") || lower.includes("health") || lower.includes("satisfaction") || lower.includes("efficiency")) {
    return "percent";
  }
  return "count";
}

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAIInsightsLoading);
  const error = useAppSelector(selectAIInsightsError);
  const backendKpis = useAppSelector(selectAIInsightsKPIs);
  const headcountForecast = useAppSelector(selectAIInsightsHeadcountForecast);
  const hiringDemand = useAppSelector(selectAIInsightsHiringDemand);
  const payrollTrend = useAppSelector(selectAIInsightsPayrollTrend);
  const skillGap = useAppSelector(selectAIInsightsSkillGap);
  const alerts = useAppSelector(selectAIInsightsAlerts);
  const recommendations = useAppSelector(selectAIInsightsRecommendations);
  const lastUpdated = useAppSelector(selectAIInsightsLastUpdated);

  useEffect(() => {
    const now = Date.now();
    const last = lastUpdated ? new Date(lastUpdated).getTime() : 0;
    const fiveMinutes = 5 * 60 * 1000;
    if (!last || now - last > fiveMinutes) {
      dispatch(fetchAIInsightsDashboard());
    }
  }, [dispatch, lastUpdated]);

  const kpis: AIKpi[] = useMemo(() => {
    if (backendKpis && backendKpis.length > 0) {
      return backendKpis.map((k) => {
        const unit = getUnitForLabel(k.label);
        return {
          label: k.label,
          value: formatKpiValue(k.score, unit),
          trend: k.trend,
          hint: k.hint,
          icon: (k.icon && ICON_MAP[k.icon]) ? ICON_MAP[k.icon] : Sparkles,
          invert: k.invert,
        };
      });
    }
    return [];
  }, [backendKpis]);

  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    if (headcountForecast && headcountForecast.length > 0) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      list.push({
        type: "area",
        title: "Workforce Headcount Forecast",
        description: "AI projection based on current headcount & hiring velocity",
        xKey: "month",
        series: [
          { key: "current", label: "Actual Headcount", color: "oklch(0.7 0.16 200)" },
          { key: "forecast", label: "AI Forecasted", color: "oklch(0.68 0.2 290)" },
        ],
        data: headcountForecast.map(({ month, current, forecast }) => {
          const isFuture = month > currentMonth;
          return {
            month,
            current: isFuture && current === 0 && forecast > 0 ? null : current,
            forecast,
          };
        }),
      });
    }

    if (hiringDemand && hiringDemand.length > 0) {
      list.push({
        type: "bar",
        title: "Department Hiring Demand",
        description: "Open positions vs target hiring demand per department",
        xKey: "dept",
        series: [
          { key: "open", label: "Open Positions", color: "oklch(0.78 0.18 70)" },
          { key: "demand", label: "Target Demand", color: "oklch(0.72 0.18 320)" },
        ],
        data: hiringDemand.map(({ dept, open, demand }) => ({ dept, open, demand })),
      });
    }

    if (payrollTrend && payrollTrend.length > 0) {
      list.push({
        type: "line",
        title: "Payroll Cost Projection",
        description: "Monthly payroll expenditure trends in ₹ Lakhs",
        xKey: "m",
        series: [{ key: "cost", label: "Payroll Cost (₹L)", color: "oklch(0.68 0.2 290)" }],
        data: payrollTrend.map(({ m, cost }) => ({ m, cost: Math.round((cost / 100000) * 100) / 100 })),
      });
    }

    if (skillGap && skillGap.length > 0) {
      list.push({
        type: "bar",
        title: "Org Skill Gap Index",
        description: "Current proficiency vs benchmark requirements",
        xKey: "skill",
        series: [
          { key: "have", label: "Current Level", color: "oklch(0.7 0.16 200)" },
          { key: "need", label: "Target Level", color: "oklch(0.72 0.18 320)" },
        ],
        data: skillGap.map(({ skill, have, need }) => ({ skill, have, need })),
      });
    }

    return list;
  }, [headcountForecast, hiringDemand, payrollTrend, skillGap]);

  const features: AIFeature[] = [
    { title: "Executive Dashboard", description: "Board-ready workforce metrics & real-time DB analytics.", icon: BarChart3, tone: "info" },
    { title: "Predictive Analytics", description: "Forecasts for attrition, headcount growth, and budget impact.", icon: Brain, tone: "info" },
    { title: "Workforce Intelligence", description: "Multi-tenant insights across health, productivity, & retention.", icon: LineChartIcon, tone: "info" },
    { title: "Hiring Intelligence", description: "Funnel quality, candidate matching, and time-to-fill ROI.", icon: Briefcase, tone: "info" },
    { title: "Payroll Intelligence", description: "Cost distribution, overtime anomalies, and savings opportunities.", icon: Banknote, tone: "info" },
    { title: "Performance Intelligence", description: "Skill gap index, top performers calibration, & career trajectory.", icon: Gauge, tone: "info" },
  ];

  if (loading && (!backendKpis || backendKpis.length === 0)) {
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
      kpis={kpis}
      charts={charts}
      features={features}
    >
      {(alerts && alerts.length > 0) && (
        <div className="mt-6 rounded-2xl border border-border/80 bg-card/40 p-4">
          <h3 className="font-display text-sm font-semibold tracking-tight mb-3">Active Alerts</h3>
          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.id ?? a.title} className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-card p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{a.title}</span>
                  <span className="text-xs text-muted-foreground">{a.note}</span>
                </div>
                <Badge variant={
                  a.severity === "Critical" ? "destructive" :
                  a.severity === "Medium" ? "secondary" : "outline"
                } className="text-xs">
                  {a.severity}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {(recommendations && recommendations.length > 0) && (
        <div className="mt-4 rounded-2xl border border-border/80 bg-card/40 p-4">
          <h3 className="font-display text-sm font-semibold tracking-tight mb-3">AI Recommendations</h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {recommendations.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 text-primary">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => dispatch(fetchAIInsightsDashboard())} className="gap-1.5">
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}

      {!loading && !error && kpis.length === 0 && charts.length === 0 && (!alerts || alerts.length === 0) && (!recommendations || recommendations.length === 0) ? (
        <div className="my-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center text-muted-foreground">
          <Brain className="mb-3 h-10 w-10 stroke-1 text-muted-foreground/60" />
          <h3 className="font-display text-base font-semibold text-foreground">No insights available yet</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Workforce intelligence and predictive analytics will appear once the system collects enough operational metrics.
          </p>
        </div>
      ) : null}
    </AIModulePage>
  );
}
