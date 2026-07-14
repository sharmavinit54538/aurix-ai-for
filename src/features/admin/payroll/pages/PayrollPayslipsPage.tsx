import { FileText } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollPayslipsPage() {
  return (
    <PayrollPlaceholderPage
      title="Payslips"
      description="Generate, distribute, and download employee payslips."
      comingSoonTitle="Payslips"
      comingSoonDescription="Auto-generate monthly payslips and share them securely with employees."
      icon={FileText}
    />
  );
}
