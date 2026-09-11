import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";

export const Route = createFileRoute("/dashboard/payroll/approvals")({
  head: () => ({ meta: [{ title: "Payroll Approvals — OFC360" }] }),
  component: PayrollApprovalsPage,
});

function PayrollApprovalsPage() {
  return (
    <div className="space-y-6">
      <PayrollBackButton />
      <PageHeader title="Payroll Approvals" description="Review and approve payroll runs before disbursement." />
      <ComingSoon title="Payroll approvals" description="Multi-level approval workflows with comments and version history." icon={CheckCircle2} />
    </div>
  );
}
