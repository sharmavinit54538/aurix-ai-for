import { createFileRoute } from "@tanstack/react-router";
import {
  FileText, CheckCircle2, AlertTriangle, Users, TrendingUp, CalendarRange,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/leave-assistant")({
  head: () => ({ meta: [{ title: "AI Leave Assistant — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={FileText}
      eyebrow="AI Leave Assistant"
      title="Approve smarter, forecast availability"
      description="Suggest approvals, flag conflicts and forecast team availability before crunch time."
      lastAnalysis="1 hr ago"
      kpis={[
        { label: "Pending Requests", value: 19, trend: -8.0, icon: FileText, invert: true },
        { label: "Approval Suggestions", value: 14, trend: 4.0, icon: CheckCircle2 },
        { label: "Conflicts Detected", value: 3, trend: -25.0, icon: AlertTriangle, invert: true },
        { label: "Team Availability", value: "82%", trend: 2.3, icon: Users },
      ]}
      charts={[
        {
          type: "area", title: "Leave Forecast (next 12 weeks)", xKey: "w",
          series: [{ key: "leaves", label: "Forecasted leaves" }],
          data: Array.from({length:12},(_,i)=>({w:`W${i+1}`, leaves: 8+((i*11)%14)})),
        },
        {
          type: "bar", title: "Leave Type Distribution", xKey: "t",
          series: [{ key: "days", label: "Days" }],
          data: [{t:"Casual",days:62},{t:"Sick",days:41},{t:"Earned",days:118},{t:"WFH",days:88},{t:"Comp",days:24}],
        },
      ]}
      features={[
        { title: "Leave Approval Suggestions", description: "AI recommends approve / discuss / decline with rationale.", icon: CheckCircle2, tone: "ok" },
        { title: "Leave Conflict Detection", description: "Flag overlaps in critical roles and small teams.", icon: AlertTriangle, metric: "3", tone: "warn" },
        { title: "Team Availability Analysis", description: "See real-time team capacity by week.", icon: Users, tone: "info" },
        { title: "Leave Forecasting", description: "Predict leave volume across quarters.", icon: TrendingUp, tone: "info" },
        { title: "Leave Trends", description: "Historic patterns by team, season and type.", icon: CalendarRange, tone: "info" },
      ]}
    />
  );
}
