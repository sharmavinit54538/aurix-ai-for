import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Banknote, Layers, TrendingDown, TrendingUp, Users } from "lucide-react";
import { formatINR } from "../../utils/payrollPreview.utils";

interface PayrollSummaryCardsProps {
  previewData: any;
}

export function PayrollSummaryCards({ previewData }: PayrollSummaryCardsProps) {
  return (
    <section aria-labelledby="preview-summary-heading">
      <h2 id="preview-summary-heading" className="sr-only">
        Payroll Preview Summary
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard
          label="Employees"
          value={formatINR(previewData?.summary?.employeeCount)}
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Gross Payroll"
          value={formatINR(previewData?.summary?.grossPayroll)}
          icon={Banknote}
          accent="muted"
        />
        <StatCard
          label="Total Earnings"
          value={formatINR(previewData?.summary?.totalEarnings ?? previewData?.summary?.grossPayroll)}
          icon={TrendingUp}
          accent="muted"
        />
        <StatCard
          label="Total Deductions"
          value={formatINR(previewData?.summary?.totalDeductions)}
          icon={TrendingDown}
          accent="warning"
        />
        <StatCard
          label="Net Payroll"
          value={formatINR(previewData?.summary?.netPayroll)}
          icon={Banknote}
          accent="success"
        />
        <StatCard
          label="Employer Cost"
          value={formatINR(previewData?.summary?.employerCost)}
          icon={Layers}
          accent="muted"
        />
      </div>
    </section>
  );
}