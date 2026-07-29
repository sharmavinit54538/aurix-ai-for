import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/executive/cto")({
  component: () => <Outlet />,
});
