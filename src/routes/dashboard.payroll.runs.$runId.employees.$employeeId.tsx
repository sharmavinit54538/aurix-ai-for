import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/EmployeePayrollDetailPage"));

export const Route = createFileRoute("/dashboard/payroll/runs/$runId/employees/$employeeId")({
  head: () => ({ meta: [{ title: "Employee Payroll Breakdown — OFC360" }] }),
  component: PageComponent,
});
