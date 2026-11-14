import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/PayrollRunPaymentPage"));

export const Route = createFileRoute("/dashboard/payroll/runs/$runId/payment")({
  head: () => ({ meta: [{ title: "Payroll Run Payment — OFC360" }] }),
  component: PageComponent,
});
