import { createFileRoute } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/bonuses")({
  head: () => ({ meta: [{ title: "Bonuses & Incentives — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Bonuses & Incentives" description="Reward performance with bonuses and incentive payouts." />
      <ComingSoon title="Bonuses & incentives" description="Configure performance bonuses, spot incentives, and recurring payouts." icon={Gift} />
    </>
  ),
});
