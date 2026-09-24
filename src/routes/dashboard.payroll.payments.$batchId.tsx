import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PaymentBatchDetailPage = lazyFeaturePage(
  () => import("@/features/payroll/pages/PaymentBatchDetailPage"),
);

export const Route = createFileRoute(
  "/dashboard/payroll/payments/$batchId",
)({
  head: () => ({ meta: [{ title: "Payment Batch Details & Reconciliation — OFC360" }] }),
  component: PaymentBatchDetailPage,
});
