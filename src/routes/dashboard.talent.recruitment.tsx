import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentDashboardPage"), "RecruitmentDashboardPage");

export const Route = createFileRoute("/dashboard/talent/recruitment")({
  head: () => ({ meta: [{ title: "Recruitment — OFC360" }] }),
  component: PageComponent,
});
