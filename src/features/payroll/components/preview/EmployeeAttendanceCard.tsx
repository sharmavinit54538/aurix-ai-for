import { Clock } from "lucide-react";

export function EmployeeAttendanceCard({ attendance }: { attendance: any }) {
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