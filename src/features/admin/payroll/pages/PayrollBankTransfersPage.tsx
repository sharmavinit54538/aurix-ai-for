import { Banknote } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollBankTransfersPage() {
  return (
    <PayrollPlaceholderPage
      title="Bank Transfers"
      description="Generate bank advice files and track disbursements."
      comingSoonTitle="Bank transfers"
      comingSoonDescription="Create NEFT/ACH files, sync with bank gateways, and reconcile payouts."
      icon={Banknote}
    />
  );
}
