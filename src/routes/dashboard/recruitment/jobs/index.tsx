import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/JobsPage"));

export const Route = createFileRoute("/dashboard/recruitment/jobs/")({
  head: () => ({ meta: [{ title: "Job Openings — OFC360" }] }),
  component: PageComponent,
});
