import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/super-admin")({
  head: () => ({ meta: [{ title: "Super Admin — OFC360" }] }),
  component: LayoutComponent,
});

function LayoutComponent() {
  return <Outlet />;
}
