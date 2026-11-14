import { createFileRoute } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";

export const Route = createFileRoute("/dashboard/settings/profile")({
  head: () => ({ meta: [{ title: "My Profile — OFC360" }] }),
  component: () => <SettingsLayout initialSection="profile" />,
});
