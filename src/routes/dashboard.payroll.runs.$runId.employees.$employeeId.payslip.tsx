import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PayrollPayslipPage = lazyFeaturePage(
  () => import("@/pages/PayrollPayslipPage")
);

export const Route = createFileRoute(
  "/dashboard/payroll/runs/$runId/employees/$employeeId/payslip"
)({
  head: () => ({ meta: [{ title: "Final Payslip — OFC360" }] }),
  component: PayrollPayslipPage,
});
