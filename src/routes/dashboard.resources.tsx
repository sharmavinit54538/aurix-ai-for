import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/resources")({
  head: () => ({ meta: [{ title: "Resources — Aurix" }] }),
  component: ResourcesLayout,
});

function ResourcesLayout() {
  return <Outlet />;
}
