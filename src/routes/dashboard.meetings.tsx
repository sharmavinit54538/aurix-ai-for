import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/meetings")({
  head: () => ({ meta: [{ title: "Meetings — OFC360" }] }),
  component: MeetingsLayout,
});

function MeetingsLayout() {
  return <Outlet />;
}
