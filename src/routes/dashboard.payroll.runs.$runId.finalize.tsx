import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/PayrollFinalizationPage"));

export const Route = createFileRoute("/dashboard/payroll/runs/$runId/finalize")({
  head: () => ({ meta: [{ title: "Payroll Finalization — OFC360" }] }),
  component: PageComponent,
});
