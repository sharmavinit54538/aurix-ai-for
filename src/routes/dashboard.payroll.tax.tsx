import { createFileRoute } from "@tanstack/react-router";
import { Percent } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/tax")({
  head: () => ({ meta: [{ title: "Tax Management — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Tax Management" description="Manage TDS, declarations, and tax filings." />
      <ComingSoon title="Tax management" description="Collect investment proofs, compute TDS, and generate Form 16." icon={Percent} />
    </>
  ),
});
