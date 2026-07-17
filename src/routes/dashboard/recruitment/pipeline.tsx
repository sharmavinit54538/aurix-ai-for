import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/PipelinePage"),
  "PipelinePage",
);

export const Route = createFileRoute("/dashboard/recruitment/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — Recruitment" }] }),
  component: Page,
});
