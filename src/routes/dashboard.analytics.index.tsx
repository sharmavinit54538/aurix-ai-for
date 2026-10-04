import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  BarChart3,
  Sparkles,
  Brain,
  UserCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";
import { useCurrentRole } from "@/lib/roles";
import { checkRouteAccess } from "@/lib/route-guards";

export const Route = createFileRoute("/dashboard/analytics/")({
  head: () => ({ meta: [{ title: "Analytics Hub — OFC360" }] }),
  component: AnalyticsHubPage,
});

const ALL_ANALYTICS_MODULES: ModuleItem[] = [
  {
    id: "reports",
    title: "HR Reports Builder",
    description:
      "Custom reporting engine for headcount, payroll costs, turnover rates, and compliance metrics.",
    icon: BarChart3,
    to: "/dashboard/analytics/reports",
    color: "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "ai-insights",
    title: "AI Predictive Insights",
    description:
      "Predictive attrition analytics, team sentiment monitoring, burnout risk alerts, and salary benchmarks.",
    icon: Sparkles,
    to: "/dashboard/analytics/ai-insights",
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "ai-analytics-center",
    title: "AI Analytics Center",
    description:
      "Unified executive intelligence dashboard with live database-driven workforce forecasting and predictive KPI metrics.",
    icon: Brain,
    to: "/ai/analytics-center",
    color: "from-violet-500/20 to-indigo-500/20 text-violet-400 border-violet-500/30",
    badge: "Intelligence",
  },
  {
    id: "recruitment-analytics",
    title: "Recruitment & Hiring Analytics",
    description:
      "Hiring velocity, candidate pipeline conversion, source effectiveness, and recruitment team metrics.",
    icon: UserCheck,
    to: "/dashboard/recruitment/analytics",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "cio-analytics",
    title: "Technology & IT Analytics",
    description:
      "Infrastructure uptime, device compliance, SaaS licensing, and security telemetry for executive leaders.",
    icon: ShieldCheck,
    to: "/dashboard/executive/cio/analytics",
    color: "from-sky-500/20 to-cyan-500/20 text-sky-400 border-sky-500/30",
  },
  {
    id: "cto-analytics",
    title: "Engineering & Tech Analytics",
    description:
      "Engineering velocity, deployment health, security vulnerability trends, and technical infrastructure ROI.",
    icon: Wrench,
    to: "/dashboard/executive/cto/analytics",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
];

function AnalyticsHubPage() {
  const currentRole = useCurrentRole();

  const visibleModules = useMemo(() => {
    return ALL_ANALYTICS_MODULES.filter((module) => {
      const access = checkRouteAccess(module.to, currentRole);
      return access.allowed;
    });
  }, [currentRole]);

  return <ModuleHubView modules={visibleModules} />;
}

export default AnalyticsHubPage;
