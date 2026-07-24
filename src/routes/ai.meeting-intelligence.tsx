import { createFileRoute } from "@tanstack/react-router";
import {
  Video, ListChecks, Users, Sparkles, MessageSquare, ClipboardList,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/meeting-intelligence")({
  head: () => ({ meta: [{ title: "AI Meeting Intelligence — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={Video}
      eyebrow="AI Meeting Intelligence"
      title="Every meeting, summarized and actioned"
      description="Auto-generate summaries, action items and follow-ups from your team meetings."
      lastAnalysis="1 hr ago"
      kpis={[
        { label: "Meetings analyzed", value: 142, trend: 18.0, icon: Video },
        { label: "Action items", value: 312, trend: 22.0, icon: ListChecks },
        { label: "Follow-ups", value: 88, trend: -5.0, icon: ClipboardList, invert: true },
        { label: "Avg duration", value: "38m", trend: -8.0, icon: Sparkles, invert: true },
      ]}
      charts={[
        {
          type: "bar", title: "Action Items by Week", xKey: "w",
          series: [{ key: "items", label: "Items" }],
          data: Array.from({length:6},(_,i)=>({ w:`W${i+1}`, items: 32+((i*9)%18) })),
        },
        {
          type: "line", title: "Meeting Volume", xKey: "d",
          series: [{ key: "n", label: "Meetings" }],
          data: ["Mon","Tue","Wed","Thu","Fri"].map((d,i)=>({d, n: 18+((i*5)%12)})),
        },
      ]}
      features={[
        { title: "Meeting Summaries", description: "Concise recap with key decisions & owners.", icon: Sparkles, tone: "info" },
        { title: "Action Items", description: "Extracted, assigned and tracked automatically.", icon: ListChecks, metric: "312", tone: "ok" },
        { title: "Follow-up Tracking", description: "Open items with status across cycles.", icon: ClipboardList, tone: "info" },
        { title: "Team Insights", description: "Who talks most, who is silent, sentiment trend.", icon: Users, tone: "info" },
        { title: "Discussion Analytics", description: "Topics, time spent, recurring themes.", icon: MessageSquare, tone: "info" },
      ]}
    />
  );
}
