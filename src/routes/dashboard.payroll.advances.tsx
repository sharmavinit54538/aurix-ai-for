import { createFileRoute } from "@tanstack/react-router";
import { HandCoins } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/advances")({
  head: () => ({ meta: [{ title: "Advances & Loans — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Advances & Loans" description="Issue salary advances and manage repayment schedules." />
      <ComingSoon title="Advances & loans" description="Track outstanding balances and auto-deduct EMIs from monthly payroll." icon={HandCoins} />
    </>
  ),
});
