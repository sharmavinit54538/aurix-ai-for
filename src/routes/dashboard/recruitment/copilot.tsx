import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentCopilotPage"),
  "RecruitmentCopilotPage",
);

export const Route = createFileRoute("/dashboard/recruitment/copilot")({
  head: () => ({ meta: [{ title: "Copilot — Recruitment" }] }),
  component: Page,
});
