import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PayrollProcessingPage = lazyFeaturePage(
  () => import("@/pages/PayrollProcessingPage")
);

export const Route = createFileRoute(
  "/dashboard/payroll/runs/$runId/processing"
)({
  head: () => ({ meta: [{ title: "Payroll Processing — OFC360" }] }),
  component: PayrollProcessingPage,
});
