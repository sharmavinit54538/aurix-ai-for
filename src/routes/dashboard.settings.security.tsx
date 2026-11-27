import { createFileRoute } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";

export const Route = createFileRoute("/dashboard/settings/security")({
  head: () => ({ meta: [{ title: "Security & MFA Settings — OFC360" }] }),
  component: () => <SettingsLayout initialSection="security" />,
});
