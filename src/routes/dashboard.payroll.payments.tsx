import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/PaymentBatchListPage"));

export const Route = createFileRoute("/dashboard/payroll/payments")({
  head: () => ({ meta: [{ title: "Payroll Payments — OFC360" }] }),
  component: PageComponent,
});
