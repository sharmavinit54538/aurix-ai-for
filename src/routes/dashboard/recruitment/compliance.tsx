import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentCompliancePage"),
  "RecruitmentCompliancePage",
);

export const Route = createFileRoute("/dashboard/recruitment/compliance")({
  head: () => ({ meta: [{ title: "Compliance — Recruitment" }] }),
  component: Page,
});
