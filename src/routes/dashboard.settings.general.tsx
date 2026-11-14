import { createFileRoute } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";

export const Route = createFileRoute("/dashboard/settings/general")({
  head: () => ({ meta: [{ title: "General Settings — OFC360" }] }),
  component: () => <SettingsLayout initialSection="company" />,
});
