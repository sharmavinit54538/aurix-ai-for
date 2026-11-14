import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/PayrollApprovalPage"));

export const Route = createFileRoute("/dashboard/payroll/runs/$runId/approval")({
  head: () => ({ meta: [{ title: "Payroll Approval — OFC360" }] }),
  component: PageComponent,
});
