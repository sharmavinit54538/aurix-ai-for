import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/settings")({
  head: () => ({ meta: [{ title: "Payroll Settings — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Payroll Settings" description="Configure pay cycles, components, and policies." />
      <ComingSoon title="Payroll settings" description="Set pay frequency, cut-off dates, rounding rules, and statutory configuration." icon={SettingsIcon} />
    </>
  ),
});
