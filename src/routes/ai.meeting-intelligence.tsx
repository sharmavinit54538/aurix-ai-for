import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  Video,
  ListChecks,
  Users,
  Sparkles,
  MessageSquare,
  ClipboardList,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AIModulePage, type AIChart, type AIKpi, type AIFeature } from "@/components/aurix/AIModule";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchMeetingIntelligenceDashboard } from "@/store/meetingIntelligence/meetingIntelligenceThunk";
import {
  selectMeetingIntelligenceLoading,
  selectMeetingIntelligenceError,
  selectMeetingIntelligenceKPIs,
  selectMeetingIntelligenceSummary,
  selectMeetingIntelligenceActionItemsByWeek,
  selectMeetingIntelligenceVolume,
  selectMeetingIntelligenceLastUpdated,
} from "@/store/meetingIntelligence/meetingIntelligenceSelectors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai/meeting-intelligence")({
  head: () => ({ meta: [{ title: "AI Meeting Intelligence — OFC360" }] }),
  component: Page,
});

const ICON_MAP: Record<string, any> = {
  Video,
  ListChecks,
  Users,
  Sparkles,
  MessageSquare,
  ClipboardList,
};

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectMeetingIntelligenceLoading);
  const error = useAppSelector(selectMeetingIntelligenceError);
  const backendKpis = useAppSelector(selectMeetingIntelligenceKPIs);
  const summary = useAppSelector(selectMeetingIntelligenceSummary);
  const actionItemsByWeek = useAppSelector(selectMeetingIntelligenceActionItemsByWeek);
  const meetingVolume = useAppSelector(selectMeetingIntelligenceVolume);
  const lastUpdated = useAppSelector(selectMeetingIntelligenceLastUpdated);

  useEffect(() => {
    dispatch(fetchMeetingIntelligenceDashboard());
  }, [dispatch]);

  const kpis: AIKpi[] = useMemo(() => {
    if (backendKpis && backendKpis.length > 0) {
      return backendKpis.map((k) => ({
        label: k.label,
        value: `${k.score}`,
        trend: k.trend,
        hint: k.hint,
        icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : Video,
        invert: k.invert,
      }));
    }

    if (summary) {
      return [
        {
          label: "Meetings analyzed",
          value: summary.meetingsAnalyzed != null ? `${summary.meetingsAnalyzed}` : "—",
          icon: Video,
        },
        {
          label: "Action items",
          value: summary.actionItems != null ? `${summary.actionItems}` : "—",
          icon: ListChecks,
        },
        {
          label: "Follow-ups",
          value: summary.followUps != null ? `${summary.followUps}` : "—",
          icon: ClipboardList,
          invert: true,
        },
        {
          label: "Avg duration",
          value:
            summary.avgDuration != null
              ? typeof summary.avgDuration === "number"
                ? `${summary.avgDuration}m`
                : `${summary.avgDuration}`
              : "—",
          icon: Sparkles,
          invert: true,
        },
      ];
    }

    return [
      { label: "Meetings analyzed", value: "—", icon: Video },
      { label: "Action items", value: "—", icon: ListChecks },
      { label: "Follow-ups", value: "—", icon: ClipboardList, invert: true },
      { label: "Avg duration", value: "—", icon: Sparkles, invert: true },
    ];
  }, [backendKpis, summary]);

  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    if (actionItemsByWeek && actionItemsByWeek.length > 0) {
      list.push({
        type: "bar",
        title: "Action Items by Week",
        xKey: "w",
        series: [{ key: "items", label: "Items" }],
        data: actionItemsByWeek as unknown as Record<string, string | number>[],
      });
    }

    if (meetingVolume && meetingVolume.length > 0) {
      list.push({
        type: "line",
        title: "Meeting Volume",
        xKey: "d",
        series: [{ key: "n", label: "Meetings" }],
        data: meetingVolume as unknown as Record<string, string | number>[],
      });
    }

    return list;
  }, [actionItemsByWeek, meetingVolume]);

  const features: AIFeature[] = useMemo(
    () => [
      {
        title: "Meeting Summaries",
        description: "Concise recap with key decisions & owners.",
        icon: Sparkles,
        tone: "info",
      },
      {
        title: "Action Items",
        description: "Extracted, assigned and tracked automatically.",
        icon: ListChecks,
        metric: summary?.actionItems != null ? `${summary.actionItems}` : undefined,
        tone: "ok",
      },
      {
        title: "Follow-up Tracking",
        description: "Open items with status across cycles.",
        icon: ClipboardList,
        metric: summary?.followUps != null ? `${summary.followUps}` : undefined,
        tone: "info",
      },
      {
        title: "Team Insights",
        description: "Who talks most, who is silent, sentiment trend.",
        icon: Users,
        tone: "info",
      },
      {
        title: "Discussion Analytics",
        description: "Topics, time spent, recurring themes.",
        icon: MessageSquare,
        tone: "info",
      },
    ],
    [summary],
  );

  if (loading && (!backendKpis || backendKpis.length === 0) && !summary) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <AIModulePage
      icon={Video}
      eyebrow="AI Meeting Intelligence"
      title="Every meeting, summarized and actioned"
      description="Auto-generate summaries, action items and follow-ups from your team meetings."
      lastAnalysis={
        summary?.lastAnalysis ?? (lastUpdated ? "Live DB Sync" : "Live DB Sync")
      }
      kpis={kpis}
      charts={charts}
      features={features}
    >
      {error ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(fetchMeetingIntelligenceDashboard())}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}
    </AIModulePage>
  );
}
