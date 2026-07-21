import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentReportsPage"),
  "RecruitmentReportsPage",
);

export const Route = createFileRoute("/dashboard/recruitment/reports")({
  head: () => ({ meta: [{ title: "Reports — Recruitment" }] }),
  component: Page,
});
