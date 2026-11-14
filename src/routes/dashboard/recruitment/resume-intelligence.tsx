import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/ResumeIntelligencePage"));

export const Route = createFileRoute("/dashboard/recruitment/resume-intelligence")({
  head: () => ({ meta: [{ title: "Resume Intelligence — OFC360" }] }),
  component: PageComponent,
});
