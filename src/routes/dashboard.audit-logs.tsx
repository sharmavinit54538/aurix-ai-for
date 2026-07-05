import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — Aurix" }] }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  return (
    <>
      <PageHeader title="Audit Logs" description="Every change, by every user — fully traceable." />
      <ComingSoon title="Audit trail" description="Searchable, filterable logs of all admin and user actions across the workspace." icon={ScrollText} />
    </>
  );
}
