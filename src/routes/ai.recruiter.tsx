import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase, FileSearch, Trophy, GitCompareArrows, MessageSquare, ThumbsUp, Star, BarChart3,
} from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";

export const Route = createFileRoute("/ai/recruiter")({
  head: () => ({ meta: [{ title: "AI Recruiter — Aurix" }] }),
  component: Page,
});

function Page() {
  return (
    <AIModulePage
      icon={Briefcase}
      eyebrow="AI Recruiter"
      title="Hire smarter, faster, with AI ranking & matching"
      description="Auto-screen resumes, rank candidates, match to JDs and generate tailored interview questions."
      lastAnalysis="14 min ago"
      kpis={[
        { label: "Open Roles", value: 24, trend: 9.0, icon: Briefcase },
        { label: "Candidates Screened", value: "1,284", trend: 18.3, icon: FileSearch },
        { label: "Top Matches", value: 47, trend: 6.5, icon: Trophy },
        { label: "Time to Hire", value: "18d", trend: -12.4, icon: BarChart3, invert: true },
      ]}
      charts={[
        {
          type: "line", title: "Candidate Funnel", description: "Last 8 weeks",
          xKey: "w", series: [{ key: "applied", label: "Applied" }, { key: "shortlist", label: "Shortlist" }, { key: "offers", label: "Offers" }],
          data: Array.from({length:8}, (_,i)=>({ w:`W${i+1}`, applied: 140+i*12, shortlist: 28+i*2, offers: 4+(i%3) })),
        },
        {
          type: "bar", title: "JD Match Distribution", xKey: "band",
          series: [{ key: "n", label: "Candidates" }],
          data: [{band:"90–100",n:18},{band:"80–89",n:42},{band:"70–79",n:96},{band:"60–69",n:140},{band:"<60",n:312}],
        },
      ]}
      features={[
        { title: "Resume Screening", description: "Parse and score thousands of resumes in minutes.", icon: FileSearch, metric: "1.2k", tone: "info" },
        { title: "Candidate Ranking", description: "Rank candidates by JD fit, experience and signals.", icon: Trophy, metric: "Top 5%", tone: "ok" },
        { title: "JD Matching", description: "Semantic match between job descriptions and profiles.", icon: GitCompareArrows, metric: "0.92 avg", tone: "ok" },
        { title: "AI Interview Questions", description: "Auto-generate tailored questions per role and seniority.", icon: MessageSquare, tone: "info" },
        { title: "Hiring Recommendations", description: "Hire / hold / pass suggestions with reasoning.", icon: ThumbsUp, tone: "info" },
        { title: "Candidate Scoring", description: "Holistic score across skill, culture and growth signals.", icon: Star, metric: "0–100", tone: "ok" },
        { title: "Recruitment Analytics", description: "Funnel, source-of-hire, time-to-fill dashboards.", icon: BarChart3, tone: "info" },
      ]}
    />
  );
}
