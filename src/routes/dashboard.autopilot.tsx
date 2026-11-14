import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/autopilot")({
  head: () => ({ meta: [{ title: "OneHR Autopilot — OFC360" }] }),
  component: LayoutComponent,
});

function LayoutComponent() {
  return <Outlet />;
}
