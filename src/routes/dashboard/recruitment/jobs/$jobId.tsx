import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/JobDetailPage"));

export const Route = createFileRoute("/dashboard/recruitment/jobs/$jobId")({
  head: () => ({ meta: [{ title: "Job Details — OFC360" }] }),
  component: PageComponent,
});
