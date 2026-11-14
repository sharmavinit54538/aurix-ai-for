import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentReportsPage"));

export const Route = createFileRoute("/dashboard/recruitment/reports")({
  head: () => ({ meta: [{ title: "Recruitment Reports — OFC360" }] }),
  component: PageComponent,
});
