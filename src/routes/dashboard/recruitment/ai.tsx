import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentAIPage"));

export const Route = createFileRoute("/dashboard/recruitment/ai")({
  head: () => ({ meta: [{ title: "Recruitment AI — OFC360" }] }),
  component: PageComponent,
});
