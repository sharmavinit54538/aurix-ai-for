import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/PipelinePage"));

export const Route = createFileRoute("/dashboard/recruitment/pipeline")({
  head: () => ({ meta: [{ title: "Hiring Pipeline — OFC360" }] }),
  component: PageComponent,
});
