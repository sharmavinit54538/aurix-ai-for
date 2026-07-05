import { createFileRoute } from "@tanstack/react-router";
import {
  Banknote, TrendingUp, Scale, AlertTriangle, ShieldAlert, HeartPulse, Calculator,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/payroll-insights")({
  head: () => ({ meta: [{ title: "AI Payroll Insights — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={Banknote}
      eyebrow="AI Payroll Insights"
      title="Payroll intelligence, anomalies & forecasts"
      description="Forecast payroll, benchmark salaries, and detect anomalies or fraud automatically."
      lastAnalysis="Today"
      kpis={[
        { label: "Monthly Payroll", value: "$1.84M", trend: 3.1, icon: Banknote },
        { label: "Forecast Next Mo.", value: "$1.89M", trend: 2.7, icon: TrendingUp },
        { label: "Anomalies", value: 6, trend: -33.0, icon: AlertTriangle, invert: true },
        { label: "Payroll Health", value: 92, trend: 1.2, icon: HeartPulse },
      ]}
      charts={[
        {
          type: "area", title: "Payroll Forecast", xKey: "m",
          series: [{ key: "actual", label: "Actual" }, { key: "forecast", label: "Forecast" }],
          data: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"].map((m,i)=>({ m, actual: 170+i*4, forecast: 175+i*4 })),
        },
        {
          type: "bar", title: "Cost by Department (k$)", xKey: "d",
          series: [{ key: "cost", label: "Cost" }],
          data: [{d:"Eng",cost:620},{d:"Sales",cost:410},{d:"Design",cost:180},{d:"Ops",cost:240},{d:"Support",cost:160},{d:"HR",cost:120}],
        },
      ]}
      features={[
        { title: "Payroll Forecasting", description: "Predict payroll cost up to 12 months ahead.", icon: TrendingUp, tone: "info" },
        { title: "Salary Benchmarking", description: "Compare bands to market & internal equity.", icon: Scale, tone: "info" },
        { title: "Payroll Anomaly Detection", description: "Flag unusual variances per cycle.", icon: AlertTriangle, metric: "6", tone: "warn" },
        { title: "Cost Analysis", description: "Drill into cost drivers by team and role.", icon: Calculator, tone: "info" },
        { title: "Fraud Detection", description: "Ghost employees, duplicate accounts and outliers.", icon: ShieldAlert, metric: "0", tone: "ok" },
        { title: "Payroll Health Score", description: "Composite reliability + accuracy + on-time.", icon: HeartPulse, metric: "92", progress: 92, tone: "ok" },
      ]}
    />
  );
}
