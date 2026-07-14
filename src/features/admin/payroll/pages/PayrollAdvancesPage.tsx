import { HandCoins } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollAdvancesPage() {
  return (
    <PayrollPlaceholderPage
      title="Advances & Loans"
      description="Issue salary advances and manage repayment schedules."
      comingSoonTitle="Advances & loans"
      comingSoonDescription="Track outstanding balances and auto-deduct EMIs from monthly payroll."
      icon={HandCoins}
    />
  );
}
