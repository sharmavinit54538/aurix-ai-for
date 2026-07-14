import { Percent } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollTaxPage() {
  return (
    <PayrollPlaceholderPage
      title="Tax Management"
      description="Manage TDS, declarations, and tax filings."
      comingSoonTitle="Tax management"
      comingSoonDescription="Collect investment proofs, compute TDS, and generate Form 16."
      icon={Percent}
    />
  );
}
