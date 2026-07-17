import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/ResumeIntelligencePage"),
  "ResumeIntelligencePage",
);

export const Route = createFileRoute("/dashboard/recruitment/resume-intelligence")({
  head: () => ({ meta: [{ title: "Resume Intelligence — Recruitment" }] }),
  component: Page,
});
