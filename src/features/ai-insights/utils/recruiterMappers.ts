import type { CandidateMatchItem, HiringDemandItem, RecruitmentData } from "@/store/aiInsights/aiInsightsTypes";
import type { AIChart, AIFeature, AIKpi } from "@/components/aurix/AIModule";
import {
  BarChart3,
  Briefcase,
  FileSearch,
  GitCompareArrows,
  MessageSquare,
  Star,
  ThumbsUp,
  Trophy,
} from "lucide-react";

const MATCH_BANDS = [
  { band: "90–100", min: 90, max: 100 },
  { band: "80–89", min: 80, max: 89 },
  { band: "70–79", min: 70, max: 79 },
  { band: "60–69", min: 60, max: 69 },
  { band: "<60", min: 0, max: 59 },
] as const;

export function buildMatchDistribution(candidates: CandidateMatchItem[]) {
  return MATCH_BANDS.map(({ band, min, max }) => ({
    band,
    n: candidates.filter((candidate) => candidate.match >= min && candidate.match <= max).length,
  }));
}

export function buildRecruiterKpis(
  recruitment: RecruitmentData | null,
  candidates: CandidateMatchItem[],
): AIKpi[] {
  if (!recruitment && candidates.length === 0) return [];

  const topMatches = candidates.filter((candidate) => candidate.match >= 80).length;
  const screened = recruitment?.recommendedCandidatesCount ?? candidates.length;

  return [
    {
      label: "Open Roles",
      value: recruitment?.openPositions ?? 0,
      icon: Briefcase,
    },
    {
      label: "Candidates Screened",
      value: screened,
      icon: FileSearch,
    },
    {
      label: "Top Matches",
      value: topMatches,
      icon: Trophy,
    },
    {
      label: "Pipeline Health",
      value: recruitment?.pipelineHealth ?? "—",
      icon: BarChart3,
    },
  ];
}

export function buildRecruiterCharts(
  candidates: CandidateMatchItem[],
  hiringDemand: HiringDemandItem[],
): AIChart[] {
  const charts: AIChart[] = [];

  if (hiringDemand.length > 0) {
    charts.push({
      type: "bar",
      title: "Hiring Demand by Department",
      description: "Open roles vs AI projected demand",
      xKey: "dept",
      series: [
        { key: "open", label: "Open Positions", color: "oklch(0.78 0.18 70)" },
        { key: "demand", label: "AI Demand", color: "oklch(0.68 0.2 290)" },
      ],
      data: hiringDemand as unknown as Record<string, string | number>[],
    });
  }

  if (candidates.length > 0) {
    charts.push({
      type: "bar",
      title: "JD Match Distribution",
      description: "Candidate count by resume match score band",
      xKey: "band",
      series: [{ key: "n", label: "Candidates", color: "oklch(0.7 0.16 200)" }],
      data: buildMatchDistribution(candidates),
    });
  }

  return charts;
}

export function buildRecruiterFeatures(
  recruitment: RecruitmentData | null,
  candidates: CandidateMatchItem[],
): AIFeature[] {
  const avgMatch =
    candidates.length > 0
      ? (candidates.reduce((sum, candidate) => sum + candidate.match, 0) / candidates.length).toFixed(2)
      : null;

  return [
    {
      title: "Resume Screening",
      description: "Parse and score incoming resumes against active job specs.",
      icon: FileSearch,
      metric: recruitment?.recommendedCandidatesCount != null ? String(recruitment.recommendedCandidatesCount) : undefined,
      tone: "info",
    },
    {
      title: "Candidate Ranking",
      description: "Rank candidates by JD fit, experience, and hiring signals.",
      icon: Trophy,
      metric: candidates.length > 0 ? `${candidates.length} ranked` : undefined,
      tone: "ok",
    },
    {
      title: "JD Matching",
      description: "Semantic match between job descriptions and candidate profiles.",
      icon: GitCompareArrows,
      metric: avgMatch ? `${avgMatch} avg` : undefined,
      tone: "ok",
    },
    {
      title: "AI Interview Questions",
      description: "Generate tailored questions per role and seniority level.",
      icon: MessageSquare,
      tone: "info",
    },
    {
      title: "Hiring Recommendations",
      description: "Hire, hold, or pass suggestions with AI reasoning.",
      icon: ThumbsUp,
      metric: recruitment?.pipelineHealth || undefined,
      tone: "info",
    },
    {
      title: "Candidate Scoring",
      description: "Holistic score across skill, culture, and growth signals.",
      icon: Star,
      metric: candidates.length > 0 ? "0–100" : undefined,
      tone: "ok",
    },
    {
      title: "Recruitment Analytics",
      description: "Funnel quality, source-of-hire, and time-to-fill dashboards.",
      icon: BarChart3,
      metric: recruitment?.openPositions != null ? `${recruitment.openPositions} open` : undefined,
      tone: "info",
    },
  ];
}

export function formatLastAnalysis(isoDate: string | null): string | undefined {
  if (!isoDate) return undefined;

  const updatedAt = new Date(isoDate);
  if (Number.isNaN(updatedAt.getTime())) return undefined;

  const diffMinutes = Math.max(0, Math.round((Date.now() - updatedAt.getTime()) / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  return updatedAt.toLocaleDateString();
}
