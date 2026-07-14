import { Gift } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollBonusesPage() {
  return (
    <PayrollPlaceholderPage
      title="Bonuses & Incentives"
      description="Reward performance with bonuses and incentive payouts."
      comingSoonTitle="Bonuses & incentives"
      comingSoonDescription="Configure performance bonuses, spot incentives, and recurring payouts."
      icon={Gift}
    />
  );
}
