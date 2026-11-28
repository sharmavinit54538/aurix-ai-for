import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/payroll/reports")({
  head: () => ({ meta: [{ title: "Payroll Reports — OFC360" }] }),
  component: PayrollReportsLayout,
});

function PayrollReportsLayout() {
  return <Outlet />;
}
