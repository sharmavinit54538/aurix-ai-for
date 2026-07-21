import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  LineChart as LineChartIcon, BarChart3, Brain, Briefcase, Banknote, Gauge, Sparkles, HeartPulse, UserMinus, Zap, CheckCircle2, RefreshCw, AlertCircle
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
  selectAIInsightsRecruitment,
  selectAIInsightsSummary,
} from "@/store/aiInsights/aiInsightsSelectors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai/analytics-center")({
  head: () => ({ meta: [{ title: "AI Analytics Center — Aurix" }] }),
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
};

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAIInsightsLoading);
  const error = useAppSelector(selectAIInsightsError);
  const backendKpis = useAppSelector(selectAIInsightsKPIs);
  const headcountForecast = useAppSelector(selectAIInsightsHeadcountForecast);
  const hiringDemand = useAppSelector(selectAIInsightsHiringDemand);
  const payrollTrend = useAppSelector(selectAIInsightsPayrollTrend);
  const skillGap = useAppSelector(selectAIInsightsSkillGap);
  const recruitment = useAppSelector(selectAIInsightsRecruitment);
  const summary = useAppSelector(selectAIInsightsSummary);

  useEffect(() => {
    dispatch(fetchAIInsightsDashboard());
  }, [dispatch]);

  const kpis: AIKpi[] = useMemo(() => {
    if (backendKpis && backendKpis.length > 0) {
      return backendKpis.map((k) => ({
        label: k.label,
        value: `${k.score}${k.label.includes("Risk") || k.label.includes("Score") || k.label.includes("Health") || k.label.includes("Satisfaction") || k.label.includes("Efficiency") ? "%" : ""}`,
        trend: k.trend,
        hint: k.hint,
        icon: (k.icon && ICON_MAP[k.icon]) ? ICON_MAP[k.icon] : Sparkles,
        invert: k.invert,
      }));
    }
    return [
      { label: "Insights generated", value: summary?.totalInsights ? `${summary.totalInsights}` : "18", trend: 14.0, icon: Sparkles },
      { label: "Predictive models", value: 18, trend: 6.0, icon: Brain },
      { label: "Open Requisitions", value: recruitment?.openPositions ? `${recruitment.openPositions}` : "12", icon: Briefcase },
      { label: "Avg Accuracy", value: "94%", trend: 1.2, icon: Gauge },
    ];
  }, [backendKpis, summary, recruitment]);

  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    if (headcountForecast && headcountForecast.length > 0) {
      list.push({
        type: "area",
        title: "Workforce Headcount Forecast",
        description: "AI projection based on current headcount & hiring velocity",
        xKey: "month",
        series: [
          { key: "current", label: "Actual Headcount", color: "oklch(0.7 0.16 200)" },
          { key: "forecast", label: "AI Forecasted", color: "oklch(0.68 0.2 290)" },
        ],
        data: headcountForecast as unknown as Record<string, string | number>[],
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
        data: hiringDemand as unknown as Record<string, string | number>[],
      });
    }

    if (payrollTrend && payrollTrend.length > 0) {
      list.push({
        type: "line",
        title: "Payroll Cost Projection",
        description: "Monthly payroll expenditure trends in ₹ Lakhs",
        xKey: "m",
        series: [{ key: "cost", label: "Payroll Cost (₹L)", color: "oklch(0.68 0.2 290)" }],
        data: payrollTrend as unknown as Record<string, string | number>[],
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
        data: skillGap as unknown as Record<string, string | number>[],
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
      icon={LineChartIcon}
      eyebrow="AI Analytics Center"
      title="The Executive Intelligence Dashboard"
      description="Live PostgreSQL-driven executive, predictive, hiring, payroll and performance intelligence — unified."
      lastAnalysis="Real-time DB Sync"
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
          <Button size="sm" variant="outline" onClick={() => dispatch(fetchAIInsightsDashboard())} className="gap-1.5">
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}
    </AIModulePage>
  );
}
