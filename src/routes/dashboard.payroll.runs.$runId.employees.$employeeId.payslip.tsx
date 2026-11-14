import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/PayrollPayslipPage"));

export const Route = createFileRoute("/dashboard/payroll/runs/$runId/employees/$employeeId/payslip")({
  head: () => ({ meta: [{ title: "Employee Payslip — OFC360" }] }),
  component: PageComponent,
});
