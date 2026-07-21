import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const RecruitmentDashboardPage = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentDashboardPage") as any,
  "RecruitmentDashboardPage"
);

export const Route = createFileRoute("/dashboard/talent/recruitment")({
  head: () => ({ meta: [{ title: "Recruitment — Aurix" }] }),
  component: RecruitmentDashboardPage,
});
