import { Layers } from "lucide-react";
import { PayrollPlaceholderPage } from "../components/PayrollPlaceholderPage";

export function PayrollSalaryStructurePage() {
  return (
    <PayrollPlaceholderPage
      title="Salary Structure"
      description="Define pay components, grades, and templates."
      comingSoonTitle="Salary structures"
      comingSoonDescription="Build reusable salary templates with earnings, deductions, and CTC breakups."
      icon={Layers}
    />
  );
}
