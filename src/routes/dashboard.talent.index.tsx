import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Target } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/talent/")({
  head: () => ({ meta: [{ title: "Talent Management Hub — OFC360" }] }),
  component: TalentHubPage,
});

const TALENT_MODULES: ModuleItem[] = [
  {
    id: "recruitment",
    title: "Recruitment & ATS",
    description: "End-to-end applicant tracking, job requisitions, candidate pipelines, and interviews.",
    icon: Briefcase,
    to: "/dashboard/recruitment",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "performance",
    title: "Performance Appraisals & OKRs",
    description: "360-degree feedback, goal tracking, KPI evaluations, and appraisal cycles.",
    icon: Target,
    to: "/dashboard/performance",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
];

function TalentHubPage() {
  return <ModuleHubView modules={TALENT_MODULES} />;
}
