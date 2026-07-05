import { createFileRoute } from "@tanstack/react-router";
import {
  Target, UserPlus, Building2, Activity, TrendingUp, Sparkles,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/workforce-planning")({
  head: () => ({ meta: [{ title: "AI Workforce Planning — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={Target}
      eyebrow="AI Workforce Planning"
      title="Plan capacity, hiring and utilization with AI"
      description="Model hiring forecasts, department capacity and resource utilization for the next 12 months."
      lastAnalysis="Yesterday"
      kpis={[
        { label: "Planned Hires", value: 38, trend: 11.5, icon: UserPlus },
        { label: "Capacity Util.", value: "78%", trend: 2.4, icon: Activity },
        { label: "Departments", value: 12, icon: Building2 },
        { label: "Forecast Horizon", value: "12 mo", icon: TrendingUp },
      ]}
      charts={[
        {
          type: "line", title: "Hiring Forecast", xKey: "m",
          series: [{ key: "needed", label: "Needed" }, { key: "planned", label: "Planned" }],
          data: ["Jan","Feb","Mar","Apr","May","Jun"].map((m,i)=>({m, needed: 8+i, planned: 6+i})),
        },
        {
          type: "bar", title: "Capacity vs. Demand", xKey: "d",
          series: [{ key: "cap", label: "Capacity" }, { key: "dem", label: "Demand" }],
          data: [{d:"Eng",cap:120,dem:138},{d:"Sales",cap:80,dem:72},{d:"Design",cap:32,dem:40},{d:"Ops",cap:48,dem:44},{d:"Support",cap:60,dem:68}],
        },
      ]}
      features={[
        { title: "Hiring Forecasts", description: "Roles, timing and budget needed quarter by quarter.", icon: UserPlus, tone: "info" },
        { title: "Department Capacity Planning", description: "Visualize current vs. needed headcount.", icon: Building2, tone: "info" },
        { title: "Resource Utilization", description: "Identify under- and over-utilized teams.", icon: Activity, metric: "78%", progress: 78, tone: "ok" },
        { title: "Future Workforce Needs", description: "Skills & roles likely in demand 6–12 months out.", icon: TrendingUp, tone: "info" },
        { title: "Workforce Optimization", description: "AI suggests redeployments and re-skilling moves.", icon: Sparkles, tone: "info" },
      ]}
    />
  );
}
