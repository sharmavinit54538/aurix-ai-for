import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/connect")({
  head: () => ({ meta: [{ title: "Connect — OFC360" }] }),
  component: ConnectLayout,
});

function ConnectLayout() {
  return <Outlet />;
}
