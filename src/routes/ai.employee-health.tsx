import { createFileRoute } from "@tanstack/react-router";
import {
  HeartPulse, Flame, Activity, AlertTriangle, Timer, Smile,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/employee-health")({
  head: () => ({ meta: [{ title: "AI Employee Health — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={HeartPulse}
      eyebrow="AI Employee Health"
      title="Spot burnout before it spreads"
      description="Detect burnout, analyze workload, monitor overtime and surface wellbeing risks."
      lastAnalysis="Today"
      kpis={[
        { label: "Wellbeing Score", value: 81, trend: 1.4, icon: Smile },
        { label: "Burnout Risk", value: 7, trend: -22.0, icon: Flame, invert: true },
        { label: "Avg Workload", value: "38h", trend: -3.0, icon: Activity, invert: true },
        { label: "OT Hours", value: 218, trend: -6.0, icon: Timer, invert: true },
      ]}
      charts={[
        {
          type: "area", title: "Burnout Risk Trend", xKey: "w",
          series: [{ key: "risk", label: "Risk index" }],
          data: Array.from({length:8},(_,i)=>({w:`W${i+1}`, risk: 22-(i%4)+((i*3)%5)})),
        },
        {
          type: "bar", title: "Overtime by Team (hrs)", xKey: "t",
          series: [{ key: "ot", label: "OT hrs" }],
          data: [{t:"Eng",ot:88},{t:"Support",ot:54},{t:"Ops",ot:42},{t:"Sales",ot:26}],
        },
      ]}
      features={[
        { title: "Burnout Detection", description: "Composite model of overtime, leave gaps and pulse signals.", icon: Flame, metric: "7", tone: "warn" },
        { title: "Workload Analysis", description: "Per-employee weekly load with anomaly bands.", icon: Activity, tone: "info" },
        { title: "Stress Indicators", description: "Aggregated signals from surveys and behavior.", icon: AlertTriangle, tone: "warn" },
        { title: "Overtime Monitoring", description: "Trends, top contributors and budget impact.", icon: Timer, tone: "info" },
        { title: "Wellbeing Score", description: "Single org score with team breakdowns.", icon: Smile, metric: "81", progress: 81, tone: "ok" },
      ]}
    />
  );
}
