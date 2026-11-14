import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentAutomationPage"));

export const Route = createFileRoute("/dashboard/recruitment/automation")({
  head: () => ({ meta: [{ title: "Recruitment Automation — OFC360" }] }),
  component: PageComponent,
});
