import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentAIInterviewPage"));

export const Route = createFileRoute("/dashboard/recruitment/ai-interview")({
  head: () => ({ meta: [{ title: "AI Video Interviews — OFC360" }] }),
  component: PageComponent,
});
