import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/super-admin/security")({
  head: () => ({ meta: [{ title: "Platform Security — OFC360" }] }),
  component: () => <Outlet />,
});
