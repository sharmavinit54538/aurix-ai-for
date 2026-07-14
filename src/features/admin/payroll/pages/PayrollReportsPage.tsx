import { BarChart3 } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollReportsPage() {
  return (
    <PayrollPlaceholderPage
      title="Payroll Reports"
      description="Salary registers, statutory reports, and analytics."
      comingSoonTitle="Payroll reports"
      comingSoonDescription="Export salary registers, PF/ESI returns, and bank advice statements."
      icon={BarChart3}
    />
  );
}
