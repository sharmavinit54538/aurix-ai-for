import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/payroll")({
  head: () => ({ meta: [{ title: "Payroll — OFC360" }] }),
  component: () => <Outlet />,
});
