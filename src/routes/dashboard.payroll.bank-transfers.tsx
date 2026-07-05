import { createFileRoute } from "@tanstack/react-router";
import { Banknote } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/bank-transfers")({
  head: () => ({ meta: [{ title: "Bank Transfers — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Bank Transfers" description="Generate bank advice files and track disbursements." />
      <ComingSoon title="Bank transfers" description="Create NEFT/ACH files, sync with bank gateways, and reconcile payouts." icon={Banknote} />
    </>
  ),
});
