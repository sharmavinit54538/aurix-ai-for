import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/resources")({
  head: () => ({ meta: [{ title: "Resources — OFC360" }] }),
  component: ResourcesLayout,
});

function ResourcesLayout() {
  return <Outlet />;
}
