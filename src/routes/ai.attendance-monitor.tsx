import { createFileRoute } from "@tanstack/react-router";
import {
  Clock, AlertTriangle, UserX, Timer, ShieldAlert, CheckCircle2, CalendarX,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/attendance-monitor")({
  head: () => ({ meta: [{ title: "AI Attendance Monitor — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={Clock}
      eyebrow="AI Attendance Monitor"
      title="Anomalies detected before they become problems"
      description="Spot attendance anomalies, late arrivals and absence patterns automatically."
      lastAnalysis="5 min ago"
      kpis={[
        { label: "Attendance Health", value: 94, trend: 1.6, icon: CheckCircle2 },
        { label: "Anomalies", value: 12, trend: -8.2, icon: AlertTriangle, invert: true },
        { label: "Late Arrivals", value: 18, trend: -4.0, icon: Clock, invert: true },
        { label: "OT Hours", value: 312, trend: 6.3, icon: Timer },
      ]}
      charts={[
        {
          type: "area", title: "Attendance Trend", xKey: "d",
          series: [{ key: "present", label: "Present %" }],
          data: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>({d, present: 92+((i*5)%6)})),
        },
        {
          type: "bar", title: "Late Arrivals by Day", xKey: "d",
          series: [{ key: "late", label: "Late" }],
          data: ["Mon","Tue","Wed","Thu","Fri"].map((d,i)=>({d, late: 4+((i*7)%8)})),
        },
      ]}
      features={[
        { title: "Attendance Anomalies", description: "Detect unusual punches, missed swipes and outliers.", icon: AlertTriangle, metric: "12", tone: "warn" },
        { title: "Late Arrival Detection", description: "Spot recurring late arrivals by employee and team.", icon: Clock, tone: "warn" },
        { title: "Absence Pattern Analysis", description: "Find suspicious Friday/Monday absence patterns.", icon: CalendarX, tone: "info" },
        { title: "Overtime Tracking", description: "Monitor OT trends and budget impact.", icon: Timer, metric: "+12%", tone: "info" },
        { title: "Shift Violations", description: "Detect missed shifts and policy breaches.", icon: ShieldAlert, tone: "crit" },
        { title: "Attendance Health Score", description: "Composite score across punctuality and presence.", icon: CheckCircle2, metric: "94", progress: 94, tone: "ok" },
        { title: "Absentee Watchlist", description: "Employees trending toward chronic absence.", icon: UserX, metric: "3", tone: "warn" },
      ]}
    />
  );
}
