import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/executive/cio")({
  head: () => ({ meta: [{ title: "CIO Portal — OFC360" }] }),
  component: LayoutComponent,
});

function LayoutComponent() {
  return <Outlet />;
}
