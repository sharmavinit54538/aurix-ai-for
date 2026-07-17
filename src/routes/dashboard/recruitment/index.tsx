import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentDashboardPage"),
  "RecruitmentDashboardPage",
);

export const Route = createFileRoute("/dashboard/recruitment/")({
  head: () => ({ meta: [{ title: "Recruitment Workspace — Aurix" }] }),
  component: Page,
});
