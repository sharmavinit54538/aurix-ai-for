import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PayrollPreviewPage = lazyFeaturePage(
  () => import("@/pages/PayrollPreviewPage")
);

export const Route = createFileRoute(
  "/dashboard/payroll/runs/$runId/preview"
)({
  head: () => ({ meta: [{ title: "Payroll Preview — OFC360" }] }),
  component: PayrollPreviewPage,
});
