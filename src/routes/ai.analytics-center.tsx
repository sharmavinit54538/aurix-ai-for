import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart as LineChartIcon, BarChart3, Brain, Briefcase, Banknote, Gauge, Sparkles,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/analytics-center")({
  head: () => ({ meta: [{ title: "AI Analytics Center — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={LineChartIcon}
      eyebrow="AI Analytics Center"
      title="The executive intelligence dashboard"
      description="Executive, predictive, hiring, payroll and performance intelligence — unified."
      lastAnalysis="Today"
      kpis={[
        { label: "Insights generated", value: "4.8k", trend: 14.0, icon: Sparkles },
        { label: "Predictive models", value: 18, trend: 6.0, icon: Brain },
        { label: "Dashboards", value: 26, icon: BarChart3 },
        { label: "Avg accuracy", value: "93%", trend: 1.2, icon: Gauge },
      ]}
      charts={[
        {
          type: "area", title: "Workforce Intelligence Index", xKey: "m",
          series: [{ key: "idx", label: "Index" }],
          data: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"].map((m,i)=>({m, idx: 70+i*2+((i*3)%5)})),
        },
        {
          type: "bar", title: "Module Usage", xKey: "mod",
          series: [{ key: "u", label: "Usage" }],
          data: [{mod:"Workforce",u:88},{mod:"Recruiter",u:74},{mod:"Payroll",u:69},{mod:"Performance",u:62},{mod:"Compliance",u:54}],
        },
      ]}
      features={[
        { title: "Executive Dashboard", description: "Board-ready KPIs across the org.", icon: BarChart3, tone: "info" },
        { title: "Predictive Analytics", description: "Forecasts for attrition, hiring and payroll.", icon: Brain, tone: "info" },
        { title: "Workforce Intelligence", description: "Cross-cuts health, productivity, risk.", icon: LineChartIcon, tone: "info" },
        { title: "Hiring Intelligence", description: "Funnel quality, source ROI, time-to-fill.", icon: Briefcase, tone: "info" },
        { title: "Payroll Intelligence", description: "Cost trends, anomalies and forecasts.", icon: Banknote, tone: "info" },
        { title: "Performance Intelligence", description: "Calibration, ranking and trajectory.", icon: Gauge, tone: "info" },
      ]}
    />
  );
}
