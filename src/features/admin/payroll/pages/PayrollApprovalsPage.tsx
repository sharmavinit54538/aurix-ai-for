import { CheckCircle2 } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollApprovalsPage() {
  return (
    <PayrollPlaceholderPage
      title="Payroll Approvals"
      description="Review and approve payroll runs before disbursement."
      comingSoonTitle="Payroll approvals"
      comingSoonDescription="Multi-level approval workflows with comments and version history."
      icon={CheckCircle2}
    />
  );
}
