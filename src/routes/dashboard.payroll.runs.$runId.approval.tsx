import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PayrollApprovalPage = lazyFeaturePage(
  () => import("@/pages/PayrollApprovalPage"),
);

export const Route = createFileRoute(
  "/dashboard/payroll/runs/$runId/approval",
)({
  head: () => ({ meta: [{ title: "Payroll Review & Approval — OFC360" }] }),
  component: PayrollApprovalPage,
});
