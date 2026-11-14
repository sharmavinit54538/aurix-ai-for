import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/OffersPage"));

export const Route = createFileRoute("/dashboard/recruitment/offers")({
  head: () => ({ meta: [{ title: "Job Offers — OFC360" }] }),
  component: PageComponent,
});
