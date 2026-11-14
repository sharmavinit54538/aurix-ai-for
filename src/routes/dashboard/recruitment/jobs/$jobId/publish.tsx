import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/JobPublishPage"));

export const Route = createFileRoute("/dashboard/recruitment/jobs/$jobId/publish")({
  head: () => ({ meta: [{ title: "Publish Job — OFC360" }] }),
  component: PageComponent,
});
