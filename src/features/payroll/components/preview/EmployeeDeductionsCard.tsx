import { TrendingDown } from "lucide-react";
import { formatINR } from "../../utils/payrollPreview.utils";

export function EmployeeDeductionsCard({ deductions, totalDeductions }: { deductions: any; totalDeductions: any }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="font-semibold text-foreground mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
          <span>Statutory & Policy Deductions</span>
        </div>
        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
          -{formatINR(totalDeductions)}
        </span>
      </div>

      <div className="space-y-1.5">
        {deductions.pf != null && <DeductionRow label="Provident Fund (PF)" value={deductions.pf} />}
        {deductions.esi != null && <DeductionRow label="Employee State Insurance (ESI)" value={deductions.esi} />}
        {deductions.pt != null && <DeductionRow label="Professional Tax (PT)" value={deductions.pt} />}
        {(deductions.tds != null || deductions.incomeTax != null) && (
          <DeductionRow label="TDS / Income Tax (Sec 192)" value={deductions.tds ?? deductions.incomeTax} />
        )}
        {(deductions.loan != null || deductions.advance != null) && (
          <DeductionRow
            label="Loan / Advance Recovery"
            value={(deductions.loan || 0) + (deductions.advance || 0)}
          />
        )}
        {deductions.other != null && <DeductionRow label="Other Deductions" value={deductions.other} />}
      </div>
    </div>
  );
}

function DeductionRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between py-1 border-b border-border/50">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium">{formatINR(value)}</span>
    </div>
  );
}