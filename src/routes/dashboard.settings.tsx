import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — OFC360" }] }),
  component: LayoutComponent,
});

function LayoutComponent() {
  return <Outlet />;
}
