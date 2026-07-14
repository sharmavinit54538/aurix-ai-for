import { Timer } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollOvertimePage() {
  return (
    <PayrollPlaceholderPage
      title="Overtime Payments"
      description="Calculate and pay overtime based on attendance."
      comingSoonTitle="Overtime payments"
      comingSoonDescription="Auto-compute OT hours, apply rates, and push to the next payroll run."
      icon={Timer}
    />
  );
}
