import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoSalesPage = lazyFeaturePage(
  () => import("@/features/ceo/pages/CeoSalesPage"),
  "CeoSalesPage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/sales")({
  head: () => ({ meta: [{ title: "Sales & Revenue Engine — CEO Portal" }] }),
  component: CeoSalesPage,
});
