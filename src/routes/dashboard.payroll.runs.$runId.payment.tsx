import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PayrollRunPaymentPage = lazyFeaturePage(
  () => import("@/features/payroll/pages/PayrollRunPaymentPage"),
);

export const Route = createFileRoute(
  "/dashboard/payroll/runs/$runId/payment",
)({
  head: () => ({ meta: [{ title: "Payroll Payment & Disbursement — OFC360" }] }),
  component: PayrollRunPaymentPage,
});
