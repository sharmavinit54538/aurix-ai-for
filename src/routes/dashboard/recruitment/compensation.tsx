import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/CompensationOfferBuilderPage"));

export const Route = createFileRoute("/dashboard/recruitment/compensation")({
  head: () => ({ meta: [{ title: "Offer & Compensation Builder — OFC360" }] }),
  component: PageComponent,
});
