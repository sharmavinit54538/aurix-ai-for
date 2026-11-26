import { formatINR } from "../../utils/payrollPreview.utils";
import type { PayrollPreviewEmployee } from "@/services/payrollApi";

export function EmployeeNetPayCard({ employee }: { employee: PayrollPreviewEmployee }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground">
            Net Payable
          </div>
          <div className="mt-1 font-display text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
            {formatINR(employee.netPay)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">
            Gross: {formatINR(employee.grossEarnings)}
          </div>
          <div className="text-xs text-rose-700 dark:text-rose-300">
            Deductions: -{formatINR(employee.totalDeductions)}
          </div>
        </div>
      </div>
    </div>
  );
}