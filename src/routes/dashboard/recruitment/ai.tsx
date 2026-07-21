import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentAIPage"),
  "RecruitmentAIPage",
);

export const Route = createFileRoute("/dashboard/recruitment/ai")({
  head: () => ({ meta: [{ title: "AI — Recruitment" }] }),
  component: Page,
});
