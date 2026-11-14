import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentCompliancePage"));

export const Route = createFileRoute("/dashboard/recruitment/compliance")({
  head: () => ({ meta: [{ title: "Recruitment Compliance — OFC360" }] }),
  component: PageComponent,
});
