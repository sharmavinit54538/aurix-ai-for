import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics — OFC360" }] }),
  component: AnalyticsLayout,
});

function AnalyticsLayout() {
  return <Outlet />;
}
