import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/approvals")({
  head: () => ({ meta: [{ title: "Payroll Approvals — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Payroll Approvals" description="Review and approve payroll runs before disbursement." />
      <ComingSoon title="Payroll approvals" description="Multi-level approval workflows with comments and version history." icon={CheckCircle2} />
    </>
  ),
});
