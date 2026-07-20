import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/hr-operations")({
  head: () => ({ meta: [{ title: "HR Operations — Aurix" }] }),
  component: HrOpsLayout,
});

function HrOpsLayout() {
  return <Outlet />;
}
