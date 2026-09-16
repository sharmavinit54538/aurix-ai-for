import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/AIInterviewSimulatorPage"),
  "AIInterviewSimulatorPage",
);

export const Route = createFileRoute("/dashboard/recruitment/ai-interview")({
  head: () => ({ meta: [{ title: "AI Interview & Integrity — Recruitment" }] }),
  component: Page,
});
