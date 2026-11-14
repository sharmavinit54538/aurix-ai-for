import { createFileRoute } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";

export const Route = createFileRoute("/dashboard/settings/company")({
  head: () => ({ meta: [{ title: "Company Settings — OFC360" }] }),
  component: () => <SettingsLayout initialSection="company" />,
});
