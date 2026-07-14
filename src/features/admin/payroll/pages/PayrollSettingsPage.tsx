import { Settings as SettingsIcon } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollSettingsPage() {
  return (
    <PayrollPlaceholderPage
      title="Payroll Settings"
      description="Configure pay cycles, components, and policies."
      comingSoonTitle="Payroll settings"
      comingSoonDescription="Set pay frequency, cut-off dates, rounding rules, and statutory configuration."
      icon={SettingsIcon}
    />
  );
}
