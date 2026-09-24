import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PaymentBatchListPage = lazyFeaturePage(
  () => import("@/features/payroll/pages/PaymentBatchListPage"),
);

export const Route = createFileRoute("/dashboard/payroll/payments")({
  head: () => ({ meta: [{ title: "Salary Payments & Disbursements — OFC360" }] }),
  component: PaymentBatchListPage,
});
