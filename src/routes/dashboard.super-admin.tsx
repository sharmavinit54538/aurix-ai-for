import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/super-admin")({
  head: () => ({ meta: [{ title: "Super Admin Platform — OFC360" }] }),
  component: () => <Outlet />,
});
