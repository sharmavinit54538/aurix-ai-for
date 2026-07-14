import { MinusCircle } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollDeductionsPage() {
  return (
    <PayrollPlaceholderPage
      title="Deductions"
      description="Manage statutory and voluntary salary deductions."
      comingSoonTitle="Deductions"
      comingSoonDescription="Track PF, ESI, professional tax, and other recurring or one-off deductions."
      icon={MinusCircle}
    />
  );
}
