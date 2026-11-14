import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/PaymentBatchDetailPage"));

export const Route = createFileRoute("/dashboard/payroll/payments/$batchId")({
  head: () => ({ meta: [{ title: "Payment Batch Detail — OFC360" }] }),
  component: PageComponent,
});
