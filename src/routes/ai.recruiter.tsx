import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AIRecruiterPage = lazyFeaturePage(() => import("@/features/ai-insights/pages/AIRecruiterPage"));

export const Route = createFileRoute("/ai/recruiter")({
  head: () => ({ meta: [{ title: "AI Recruiter — Aurix" }] }),
  component: AIRecruiterPage,
});
