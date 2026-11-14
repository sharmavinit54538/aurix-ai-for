import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/InterviewsPage"));

export const Route = createFileRoute("/dashboard/recruitment/interviews")({
  head: () => ({ meta: [{ title: "Interviews — OFC360" }] }),
  component: PageComponent,
});
