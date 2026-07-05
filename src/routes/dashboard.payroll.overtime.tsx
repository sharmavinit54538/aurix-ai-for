import { createFileRoute } from "@tanstack/react-router";
import { Timer } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/overtime")({
  head: () => ({ meta: [{ title: "Overtime Payments — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Overtime Payments" description="Calculate and pay overtime based on attendance." />
      <ComingSoon title="Overtime payments" description="Auto-compute OT hours, apply rates, and push to the next payroll run." icon={Timer} />
    </>
  ),
});
