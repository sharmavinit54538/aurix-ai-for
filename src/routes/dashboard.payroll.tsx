import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/payroll")({
  component: PayrollLayout,
});

function PayrollLayout() {
  return <Outlet />;
}

