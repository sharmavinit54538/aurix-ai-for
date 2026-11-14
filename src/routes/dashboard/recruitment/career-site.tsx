import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/CareerSitePage"));

export const Route = createFileRoute("/dashboard/recruitment/career-site")({
  head: () => ({ meta: [{ title: "Career Site — OFC360" }] }),
  component: PageComponent,
});
