import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/ceo/pages/CeoSalesPage"));

export const Route = createFileRoute("/dashboard/executive/ceo/sales")({
  head: () => ({ meta: [{ title: "CEO Sales — OFC360" }] }),
  component: PageComponent,
});
