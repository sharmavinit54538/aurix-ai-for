import { Banknote, Layers, TrendingDown, TrendingUp, Users, XCircle } from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";

interface ApprovalSummaryCardsProps {
  reviewData: any;
  formatCount: (value: number | null | undefined) => string;
  formatINR: (value: number | null | undefined) => string;
}

export function ApprovalSummaryCards({
  reviewData,
  formatCount,
  formatINR,
}: ApprovalSummaryCardsProps) {
  return (
    <section aria-labelledby="approval-summary-heading">
      <h2 id="approval-summary-heading" className="sr-only">
        Payroll Totals & Summary
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard
          label="Employees Processed"
          value={formatCount(reviewData?.summary?.employeeCount)}
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Gross Payroll"
          value={formatINR(reviewData?.summary?.grossPayroll)}
          icon={Banknote}
          accent="muted"
        />
        <StatCard
          label="Total Earnings"
          value={formatINR(reviewData?.summary?.totalEarnings ?? reviewData?.summary?.grossPayroll)}
          icon={TrendingUp}
          accent="muted"
        />
        <StatCard
          label="Total Deductions"
          value={formatINR(reviewData?.summary?.totalDeductions)}
          icon={TrendingDown}
          accent="warning"
        />
        <StatCard
          label="Net Payroll"
          value={formatINR(reviewData?.summary?.netPayroll)}
          icon={Banknote}
          accent="success"
        />
        <StatCard
          label="Employer Cost"
          value={formatINR(reviewData?.summary?.employerCost)}
          icon={Layers}
          accent="muted"
        />
      </div>
    </section>
  );
}

import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Banknote, Layers, TrendingDown, TrendingUp, Users, XCircle } from "lucide-react";