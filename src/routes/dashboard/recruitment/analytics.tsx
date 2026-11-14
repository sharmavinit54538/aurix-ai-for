import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentAnalyticsPage"));

export const Route = createFileRoute("/dashboard/recruitment/analytics")({
  head: () => ({ meta: [{ title: "Recruitment Analytics — OFC360" }] }),
  component: PageComponent,
});
