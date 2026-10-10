import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/announcements")({
  component: AnnouncementsLayout,
});

function AnnouncementsLayout() {
  return <Outlet />;
}
