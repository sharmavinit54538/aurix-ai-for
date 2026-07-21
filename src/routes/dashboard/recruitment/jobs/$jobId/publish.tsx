import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/JobPublishPage"),
  "JobPublishPage",
);

export const Route = createFileRoute("/dashboard/recruitment/jobs/$jobId/publish")({
  head: () => ({ meta: [{ title: "Publish Job — Recruitment" }] }),
  component: Page,
});
