import { createFileRoute } from "@tanstack/react-router";
import {
  Brain, HeartPulse, Users, UserMinus, Zap, TrendingUp, Building2, Activity, Sparkles,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/workforce-insights")({
  head: () => ({ meta: [{ title: "AI Workforce Insights — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={Brain}
      eyebrow="AI Workforce Insights"
      title="Workforce intelligence, predicted in real time"
      description="Track workforce health, predict attrition and forecast headcount across every department."
      lastAnalysis="2 min ago"
      kpis={[
        { label: "Workforce Health", value: 87, trend: 4.2, icon: HeartPulse, hint: "Strong engagement overall" },
        { label: "Attrition Risk", value: "14%", trend: -3.4, icon: UserMinus, invert: true, hint: "5 employees flagged" },
        { label: "Productivity Score", value: 91, trend: 5.8, icon: Zap, hint: "Engineering leading" },
        { label: "Headcount", value: 482, trend: 2.1, icon: Users, hint: "+10 this month" },
      ]}
      charts={[
        {
          type: "area", title: "Headcount Trends", description: "Monthly active employees",
          xKey: "m", series: [{ key: "hc", label: "Headcount" }],
          data: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=>({m, hc: 410+i*7+((i*13)%9)})),
        },
        {
          type: "bar", title: "Department Comparison", description: "Productivity vs. attrition risk by team",
          xKey: "d", series: [{ key: "prod", label: "Productivity" }, { key: "risk", label: "Risk" }],
          data: [
            { d: "Eng", prod: 92, risk: 12 }, { d: "Sales", prod: 88, risk: 18 },
            { d: "Design", prod: 84, risk: 14 }, { d: "Ops", prod: 79, risk: 9 },
            { d: "Support", prod: 76, risk: 22 }, { d: "HR", prod: 81, risk: 7 },
          ],
        },
      ]}
      features={[
        { title: "Workforce Health Score", description: "Composite signal across engagement, attendance and performance.", icon: HeartPulse, metric: "87", progress: 87, tone: "ok" },
        { title: "Attrition Prediction", description: "Model flags employees likely to leave in the next 90 days.", icon: UserMinus, metric: "5 at risk", tone: "warn" },
        { title: "Team Productivity Analysis", description: "Identify high-output squads and bottlenecks.", icon: Zap, metric: "+8% MoM", tone: "ok" },
        { title: "Employee Risk Detection", description: "Surface burnout, disengagement and salary-band risks.", icon: Activity, metric: "12 signals", tone: "info" },
        { title: "Headcount Trends", description: "Visualize hiring vs. exits over time, segmented by team.", icon: TrendingUp, metric: "+22 YTD", tone: "ok" },
        { title: "Department Comparison", description: "Benchmark performance across business units.", icon: Building2, metric: "6 depts", tone: "info" },
        { title: "Workforce Forecasting", description: "Project headcount and skills mix 12 months out.", icon: Sparkles, metric: "12-mo", tone: "info" },
      ]}
    />
  );
}
