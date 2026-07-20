import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Aurix" }] }),
  component: AnalyticsLayout,
});

function AnalyticsLayout() {
  return <Outlet />;
}
