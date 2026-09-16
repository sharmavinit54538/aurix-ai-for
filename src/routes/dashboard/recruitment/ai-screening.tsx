import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/AIScreeningPage"),
  "AIScreeningPage",
);

export const Route = createFileRoute("/dashboard/recruitment/ai-screening")({
  head: () => ({ meta: [{ title: "AI Resume Screening — Recruitment" }] }),
  component: Page,
});
