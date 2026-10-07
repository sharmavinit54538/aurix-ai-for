import { ArrowUpDown, Clock, ExternalLink, TrendingDown, TrendingUp, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/hrms/Shared";
import { formatINR, getValidationBadge, formatDate } from "../../utils/payrollPreview.utils";
import type { PayrollPreviewEmployee } from "@/services/payrollApi";

export function EmployeeDetailSheet({
  employee,
  open,
  onClose,
  loading,
  runId,
  onOpenFullDetail,
}: {
  employee: PayrollPreviewEmployee | null;
  open: boolean;
  onClose: () => void;
  loading: boolean;
  runId: string;
  onOpenFullDetail: (employee: PayrollPreviewEmployee) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="font-display text-lg font-bold text-foreground">
                {employee?.name || "Employee Payroll Detail"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                ID: <span className="font-mono">{employee?.employeeId}</span>
                {employee?.department ? ` • ${employee.department}` : ""}
                {employee?.designation ? ` • ${employee.designation}` : ""}
              </SheetDescription>
            </div>
            {employee?.validationStatus ? (
              <Badge
                variant="outline"
                className={`text-xs ${getValidationBadge(employee.validationStatus).className}`}
              >
                {getValidationBadge(employee.validationStatus).label}
              </Badge>
            ) : null}
          </div>
        </SheetHeader>

        {employee ? (
          <div className="mt-4">
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onOpenFullDetail(employee);
              }}
              className="w-full gap-1.5 text-xs shadow-sm"
              style={{ background: "var(--gradient-brand)" }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Dedicated Employee Payroll Page</span>
            </Button>
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-4 py-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : employee ? (
          <div className="mt-6 space-y-6 text-xs">
            <EmployeeNetPayCard employee={employee} />
            {employee.attendance && <EmployeeAttendanceCard attendance={employee.attendance} />}
            {employee.earnings && <EmployeeEarningsCard earnings={employee.earnings} grossEarnings={employee.grossEarnings} />}
            {employee.deductions && <EmployeeDeductionsCard deductions={employee.deductions} totalDeductions={employee.totalDeductions} />}
            {employee.issues && employee.issues.length > 0 && <EmployeeIssuesCard issues={employee.issues} />}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function EmployeeNetPayCard({ employee }: { employee: PayrollPreviewEmployee }) {
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

function EmployeeAttendanceCard({ attendance }: { attendance: any }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Attendance & Payable Days</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-lg bg-muted/40 p-2">
          <div className="text-[10px] text-muted-foreground">Working Days</div>
          <div className="font-semibold text-foreground">{attendance.workingDays ?? "—"}</div>
        </div>
        <div className="rounded-lg bg-muted/40 p-2">
          <div className="text-[10px] text-muted-foreground">Paid Days</div>
          <div className="font-semibold text-emerald-600 dark:text-emerald-400">{attendance.paidDays ?? "—"}</div>
        </div>
        <div className="rounded-lg bg-muted/40 p-2">
          <div className="text-[10px] text-muted-foreground">Unpaid / LOP</div>
          <div className="font-semibold text-rose-600 dark:text-rose-400">
            {attendance.unpaidDays ?? attendance.lopDays ?? "—"}
          </div>
        </div>
        <div className="rounded-lg bg-muted/40 p-2">
          <div className="text-[10px] text-muted-foreground">Leave Days</div>
          <div className="font-semibold text-foreground">{attendance.leaveDays ?? "—"}</div>
        </div>
        <div className="rounded-lg bg-muted/40 p-2">
          <div className="text-[10px] text-muted-foreground">Overtime Hours</div>
          <div className="font-semibold text-foreground">{attendance.overtimeHours ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}

function EmployeeEarningsCard({ earnings, grossEarnings }: { earnings: any; grossEarnings: any }) {
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

function EmployeeDeductionsCard({ deductions, totalDeductions }: { deductions: any; totalDeductions: any }) {
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

function EmployeeIssuesCard({ issues }: { issues: any[] }) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
      <div className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        <span>Employee Validation Findings</span>
      </div>
      <div className="space-y-1.5">
        {issues.map((iss, idx) => (
          <div key={iss.id || idx} className="text-xs text-amber-800 dark:text-amber-300">
            • {iss.message}
          </div>
        ))}
      </div>
    </div>
  );
}

import { AlertTriangle } from "lucide-react";