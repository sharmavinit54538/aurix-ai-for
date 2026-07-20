import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Target, Sparkles } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/talent/")({
  head: () => ({ meta: [{ title: "Talent Management — Aurix" }] }),
  component: TalentHubPage,
});

const TALENT_MODULES: ModuleItem[] = [
  {
    id: "recruitment",
    title: "Recruitment (ATS)",
    description: "End-to-end applicant tracking, job requisitions, candidate screening, and interview scheduling.",
    icon: Briefcase,
    to: "/dashboard/talent/recruitment",
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "performance",
    title: "Performance & Goals",
    description: "360-degree feedback reviews, OKR goal setting, performance appraisals, and employee scorecards.",
    icon: Target,
    to: "/dashboard/talent/performance",
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
  },
];

function TalentHubPage() {
  return (
    <ModuleHubView
      eyebrow="Talent Workspace"
      title="Talent Management"
      description="Attract top candidates with automated recruitment workflows and foster employee growth with continuous performance reviews."
      headerIcon={Sparkles}
      modules={TALENT_MODULES}
    />
  );
}
