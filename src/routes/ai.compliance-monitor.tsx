import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck, Scale, FileWarning, AlertTriangle, ClipboardCheck,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/compliance-monitor")({
  head: () => ({ meta: [{ title: "AI Compliance Monitor — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={ShieldCheck}
      eyebrow="AI Compliance Monitor"
      title="Stay audit-ready, automatically"
      description="Monitor labor law compliance, missing documents, risk and audit readiness."
      lastAnalysis="4 hr ago"
      kpis={[
        { label: "Compliance Score", value: 96, trend: 1.2, icon: ShieldCheck },
        { label: "Open Risks", value: 4, trend: -33.0, icon: AlertTriangle, invert: true },
        { label: "Missing Docs", value: 11, trend: -20.0, icon: FileWarning, invert: true },
        { label: "Audit Readiness", value: "92%", trend: 3.4, icon: ClipboardCheck },
      ]}
      charts={[
        {
          type: "area", title: "Compliance Trend", xKey: "m",
          series: [{ key: "score", label: "Score" }],
          data: ["Jan","Feb","Mar","Apr","May","Jun"].map((m,i)=>({m, score: 88+i+((i*3)%4)})),
        },
        {
          type: "bar", title: "Risks by Category", xKey: "c",
          series: [{ key: "n", label: "Open risks" }],
          data: [{c:"Labor",n:2},{c:"Tax",n:1},{c:"Safety",n:1},{c:"Data",n:0},{c:"Hiring",n:0}],
        },
      ]}
      features={[
        { title: "Compliance Checks", description: "Continuous checks across HR and payroll workflows.", icon: ShieldCheck, metric: "96", progress: 96, tone: "ok" },
        { title: "Labor Law Monitoring", description: "Stay aligned with applicable jurisdiction rules.", icon: Scale, tone: "info" },
        { title: "Missing Documents", description: "Detect missing or expired employee docs.", icon: FileWarning, metric: "11", tone: "warn" },
        { title: "Risk Detection", description: "Predictive risk scores across compliance domains.", icon: AlertTriangle, metric: "4", tone: "warn" },
        { title: "Audit Readiness", description: "One-click prep with full evidence trail.", icon: ClipboardCheck, metric: "92%", progress: 92, tone: "ok" },
      ]}
    />
  );
}
