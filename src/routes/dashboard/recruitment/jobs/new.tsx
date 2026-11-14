import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/NewJobPage"));

export const Route = createFileRoute("/dashboard/recruitment/jobs/new")({
  head: () => ({ meta: [{ title: "Create New Job — OFC360" }] }),
  component: PageComponent,
});
