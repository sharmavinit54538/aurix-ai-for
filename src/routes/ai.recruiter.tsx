import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  Briefcase,
  FileSearch,
  Trophy,
  GitCompareArrows,
  MessageSquare,
  ThumbsUp,
  Star,
  BarChart3,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AIModulePage, type AIChart, type AIKpi, type AIFeature } from "@/components/aurix/AIModule";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchRecruiterDashboard } from "@/store/recruiter/recruiterThunk";
import {
  selectRecruiterLoading,
  selectRecruiterError,
  selectRecruiterKPIs,
  selectRecruiterSummary,
  selectRecruiterCandidateFunnel,
  selectRecruiterJdMatchDistribution,
  selectRecruiterLastUpdated,
} from "@/store/recruiter/recruiterSelectors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai/recruiter")({
  head: () => ({ meta: [{ title: "AI Recruiter — OFC360" }] }),
  component: Page,
});

const ICON_MAP: Record<string, any> = {
  Briefcase,
  FileSearch,
  Trophy,
  BarChart3,
  GitCompareArrows,
  MessageSquare,
  ThumbsUp,
  Star,
};

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectRecruiterLoading);
  const error = useAppSelector(selectRecruiterError);
  const backendKpis = useAppSelector(selectRecruiterKPIs);
  const summary = useAppSelector(selectRecruiterSummary);
  const candidateFunnel = useAppSelector(selectRecruiterCandidateFunnel);
  const jdMatchDistribution = useAppSelector(selectRecruiterJdMatchDistribution);
  const lastUpdated = useAppSelector(selectRecruiterLastUpdated);

  useEffect(() => {
    dispatch(fetchRecruiterDashboard());
  }, [dispatch]);

  const kpis: AIKpi[] = useMemo(() => {
    if (backendKpis && backendKpis.length > 0) {
      return backendKpis.map((k: any) => ({
        label: k.label,
        value: `${k.score}`,
        trend: k.trend,
        hint: k.hint,
        icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : Briefcase,
        invert: k.invert,
      }));
    }

    if (summary) {
      return [
        {
          label: "Open Roles",
          value: summary.openRoles != null ? `${summary.openRoles}` : "—",
          icon: Briefcase,
        },
        {
          label: "Candidates Screened",
          value:
            summary.candidatesScreened != null
              ? typeof summary.candidatesScreened === "number"
                ? summary.candidatesScreened.toLocaleString()
                : `${summary.candidatesScreened}`
              : "—",
          icon: FileSearch,
        },
        {
          label: "Top Matches",
          value: summary.topMatches != null ? `${summary.topMatches}` : "—",
          icon: Trophy,
        },
        {
          label: "Time to Hire",
          value:
            summary.timeToHire != null
              ? typeof summary.timeToHire === "number"
                ? `${summary.timeToHire}d`
                : `${summary.timeToHire}`
              : "—",
          icon: BarChart3,
          invert: true,
        },
      ];
    }

    return [
      { label: "Open Roles", value: "—", icon: Briefcase },
      { label: "Candidates Screened", value: "—", icon: FileSearch },
      { label: "Top Matches", value: "—", icon: Trophy },
      { label: "Time to Hire", value: "—", icon: BarChart3, invert: true },
    ];
  }, [backendKpis, summary]);

  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    if (candidateFunnel && candidateFunnel.length > 0) {
      list.push({
        type: "line",
        title: "Candidate Funnel",
        description: "Last 8 weeks",
        xKey: "w",
        series: [
          { key: "applied", label: "Applied" },
          { key: "shortlist", label: "Shortlist" },
          { key: "offers", label: "Offers" },
        ],
        data: candidateFunnel as unknown as Record<string, string | number>[],
      });
    }

    if (jdMatchDistribution && jdMatchDistribution.length > 0) {
      list.push({
        type: "bar",
        title: "JD Match Distribution",
        xKey: "band",
        series: [{ key: "n", label: "Candidates" }],
        data: jdMatchDistribution as unknown as Record<string, string | number>[],
      });
    }

    return list;
  }, [candidateFunnel, jdMatchDistribution]);

  const features: AIFeature[] = useMemo(
    () => [
      {
        title: "Resume Screening",
        description: "Parse and score thousands of resumes in minutes.",
        icon: FileSearch,
        metric:
          summary?.candidatesScreened != null
            ? typeof summary.candidatesScreened === "number"
              ? `${summary.candidatesScreened}`
              : `${summary.candidatesScreened}`
            : undefined,
        tone: "info",
      },
      {
        title: "Candidate Ranking",
        description: "Rank candidates by JD fit, experience and signals.",
        icon: Trophy,
        metric: summary?.topMatches != null ? `${summary.topMatches}` : undefined,
        tone: "ok",
      },
      {
        title: "JD Matching",
        description: "Semantic match between job descriptions and profiles.",
        icon: GitCompareArrows,
        metric: summary?.jdMatchAvg ?? "0.92 avg",
        tone: "ok",
      },
      {
        title: "AI Interview Questions",
        description: "Auto-generate tailored questions per role and seniority.",
        icon: MessageSquare,
        tone: "info",
      },
      {
        title: "Hiring Recommendations",
        description: "Hire / hold / pass suggestions with reasoning.",
        icon: ThumbsUp,
        tone: "info",
      },
      {
        title: "Candidate Scoring",
        description: "Holistic score across skill, culture and growth signals.",
        icon: Star,
        metric: "0–100",
        tone: "ok",
      },
      {
        title: "Recruitment Analytics",
        description: "Funnel, source-of-hire, time-to-fill dashboards.",
        icon: BarChart3,
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
      icon={Briefcase}
      eyebrow="AI Recruiter"
      title="Hire smarter, faster, with AI ranking & matching"
      description="Auto-screen resumes, rank candidates, match to JDs and generate tailored interview questions."
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
            onClick={() => dispatch(fetchRecruiterDashboard())}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}
    </AIModulePage>
  );
}
