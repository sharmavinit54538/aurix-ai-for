import { createFileRoute } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/salary-processing")({
  head: () => ({ meta: [{ title: "Salary Processing — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Salary Processing" description="Run, review, and finalize salary cycles." />
      <ComingSoon title="Salary processing" description="Generate salary runs, validate inputs, and lock cycles for payout." icon={PlayCircle} />
    </>
  ),
});
