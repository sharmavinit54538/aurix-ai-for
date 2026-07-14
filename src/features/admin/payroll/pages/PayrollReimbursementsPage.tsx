import { Receipt } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollReimbursementsPage() {
  return (
    <PayrollPlaceholderPage
      title="Reimbursements"
      description="Manage employee expense claims and reimbursements."
      comingSoonTitle="Reimbursements"
      comingSoonDescription="Submit, approve, and pay out reimbursement claims with full audit trail."
      icon={Receipt}
    />
  );
}
