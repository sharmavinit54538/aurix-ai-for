import { formatINR } from "../../utils/payrollPreview.utils";
import type { PayrollPreviewEmployee } from "@/services/payrollApi";

export function EmployeeNetPayCard({ employee }: { employee: PayrollPreviewEmployee }) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Net Payable
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatINR(employee.netPay)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-muted-foreground">
            Gross: {formatINR(employee.grossEarnings)}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400">
            Deductions: -{formatINR(employee.totalDeductions)}
          </div>
        </div>
      </div>
    </div>
  );
}