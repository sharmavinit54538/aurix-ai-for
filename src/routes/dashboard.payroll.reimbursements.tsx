import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/reimbursements")({
  head: () => ({ meta: [{ title: "Reimbursements — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Reimbursements" description="Manage employee expense claims and reimbursements." />
      <ComingSoon title="Reimbursements" description="Submit, approve, and pay out reimbursement claims with full audit trail." icon={Receipt} />
    </>
  ),
});
