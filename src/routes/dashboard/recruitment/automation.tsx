import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentAutomationPage"),
  "RecruitmentAutomationPage",
);

export const Route = createFileRoute("/dashboard/recruitment/automation")({
  head: () => ({ meta: [{ title: "Automation — Recruitment" }] }),
  component: Page,
});
