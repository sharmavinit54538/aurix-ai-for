import { createFileRoute } from "@tanstack/react-router";
import { Timer } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/timesheets")({
  head: () => ({ meta: [{ title: "Timesheets — Aurix" }] }),
  component: TimesheetsPage,
});

function TimesheetsPage() {
  return (
    <>
      <PageHeader title="Timesheets" description="Track billable hours, project time, and approvals." />
      <ComingSoon title="Timesheet tracking" description="Weekly timesheets with project allocation, approvals, and export to payroll." icon={Timer} />
    </>
  );
}
