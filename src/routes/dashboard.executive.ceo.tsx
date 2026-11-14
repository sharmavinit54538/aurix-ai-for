import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/executive/ceo")({
  head: () => ({ meta: [{ title: "CEO Portal — OFC360" }] }),
  component: LayoutComponent,
});

function LayoutComponent() {
  return <Outlet />;
}
