import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/PayrollValidationPage"));

export const Route = createFileRoute("/dashboard/payroll/runs/$runId/validation")({
  head: () => ({ meta: [{ title: "Payroll Validation — OFC360" }] }),
  component: PageComponent,
});
