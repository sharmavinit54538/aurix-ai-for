import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/payroll/runs/$runId/employee/$employeeId/payslip")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/payroll" as any });
  },
});
