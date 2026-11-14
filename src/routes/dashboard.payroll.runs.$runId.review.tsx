import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/PayrollPreviewPage"));

export const Route = createFileRoute("/dashboard/payroll/runs/$runId/review")({
  head: () => ({ meta: [{ title: "Payroll Review — OFC360" }] }),
  component: PageComponent,
});
