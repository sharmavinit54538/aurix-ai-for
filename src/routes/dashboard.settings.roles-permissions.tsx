import { createFileRoute } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";

export const Route = createFileRoute("/dashboard/settings/roles-permissions")({
  head: () => ({ meta: [{ title: "Roles & Permissions — OFC360" }] }),
  component: () => <SettingsLayout initialSection="employees" />,
});
