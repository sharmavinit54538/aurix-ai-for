import { ShieldCheck } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollCompliancePage() {
  return (
    <PayrollPlaceholderPage
      title="Compliance"
      description="Stay compliant with statutory and regulatory requirements."
      comingSoonTitle="Compliance"
      comingSoonDescription="Track PF, ESI, PT, LWF, and gratuity filings with deadline reminders."
      icon={ShieldCheck}
    />
  );
}
