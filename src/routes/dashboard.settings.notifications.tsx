import { createFileRoute } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";

export const Route = createFileRoute("/dashboard/settings/notifications")({
  head: () => ({ meta: [{ title: "Notification Settings — OFC360" }] }),
  component: () => <SettingsLayout initialSection="notifications" />,
});
