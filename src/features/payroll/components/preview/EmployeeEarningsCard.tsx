import { TrendingUp, TrendingDown } from "lucide-react";
import { formatINR } from "../../utils/payrollPreview.utils";

export function EmployeeEarningsCard({ earnings, grossEarnings }: { earnings: any; grossEarnings: any }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="font-semibold text-foreground mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          <span>Earnings Breakdown</span>
        </div>
        <span className="font-mono font-bold text-foreground">{formatINR(grossEarnings)}</span>
      </div>

      <div className="space-y-1.5">
        {earnings.basic != null && <EarningRow label="Basic Salary" value={earnings.basic} />}
        {earnings.hra != null && <EarningRow label="House Rent Allowance (HRA)" value={earnings.hra} />}
        {earnings.specialAllowance != null && <EarningRow label="Special Allowance" value={earnings.specialAllowance} />}
        {earnings.conveyance != null && <EarningRow label="Conveyance Allowance" value={earnings.conveyance} />}
        {earnings.overtime != null && <EarningRow label="Overtime Earnings" value={earnings.overtime} />}
        {earnings.bonus != null && <EarningRow label="Bonus / Incentives" value={earnings.bonus} />}
        {earnings.other != null && <EarningRow label="Other Allowances" value={earnings.other} />}
      </div>
    </div>
  );
}

function EarningRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between py-1 border-b border-border/50">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium">{formatINR(value)}</span>
    </div>
  );
}