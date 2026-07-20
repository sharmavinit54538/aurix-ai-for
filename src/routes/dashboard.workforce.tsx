import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/workforce")({
  head: () => ({ meta: [{ title: "Workforce — Aurix" }] }),
  component: WorkforceLayout,
});

function WorkforceLayout() {
  return <Outlet />;
}
