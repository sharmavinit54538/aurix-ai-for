import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/CostCenterWiseReport"));

export const Route = createFileRoute("/dashboard/payroll/reports/cost-center-wise")({
  head: () => ({ meta: [{ title: "Cost Center-wise Payroll — OFC360" }] }),
  component: PageComponent,
});
