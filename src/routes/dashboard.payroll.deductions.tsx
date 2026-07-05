import { createFileRoute } from "@tanstack/react-router";
import { MinusCircle } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/payroll/deductions")({
  head: () => ({ meta: [{ title: "Deductions — Aurix" }] }),
  component: () => (
    <>
      <PageHeader title="Deductions" description="Manage statutory and voluntary salary deductions." />
      <ComingSoon title="Deductions" description="Track PF, ESI, professional tax, and other recurring or one-off deductions." icon={MinusCircle} />
    </>
  ),
});
