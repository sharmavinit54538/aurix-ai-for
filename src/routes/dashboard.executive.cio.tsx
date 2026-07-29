import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/executive/cio")({
  component: () => <Outlet />,
});
