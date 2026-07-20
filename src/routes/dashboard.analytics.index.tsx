import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Sparkles, LineChart } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/analytics/")({
  head: () => ({ meta: [{ title: "Analytics Hub — Aurix" }] }),
  component: AnalyticsHubPage,
});

const ANALYTICS_MODULES: ModuleItem[] = [
  {
    id: "reports",
    title: "HR Reports Builder",
    description: "Custom reporting engine for headcount, payroll costs, turnover rates, and compliance metrics.",
    icon: BarChart3,
    to: "/dashboard/analytics/reports",
    color: "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "ai-insights",
    title: "AI Predictive Insights",
    description: "Predictive attrition analytics, team sentiment monitoring, burnout risk alerts, and salary benchmarks.",
    icon: Sparkles,
    to: "/dashboard/analytics/ai-insights",
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
  },
];

function AnalyticsHubPage() {
  return (
    <ModuleHubView
      eyebrow="Intelligence Center"
      title="Analytics & AI Insights"
      description="Executive analytics dashboards, custom HR report builders, and predictive AI insights for workforce planning."
      headerIcon={LineChart}
      modules={ANALYTICS_MODULES}
    />
  );
}
