import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentDashboardPage"));

export const Route = createFileRoute("/dashboard/recruitment/")({
  head: () => ({ meta: [{ title: "Recruitment Hub — OFC360" }] }),
  component: PageComponent,
});
