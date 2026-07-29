import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoFinancePage = lazyFeaturePage(
  () => import("@/features/ceo/pages/CeoFinancePage"),
  "CeoFinancePage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/finance")({
  head: () => ({ meta: [{ title: "Corporate Finance — CEO Portal" }] }),
  component: CeoFinancePage,
});
