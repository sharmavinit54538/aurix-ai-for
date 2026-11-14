import { createFileRoute } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";

export const Route = createFileRoute("/dashboard/settings/billing")({
  head: () => ({ meta: [{ title: "Billing Settings — OFC360" }] }),
  component: () => <SettingsLayout initialSection="company" />,
});
