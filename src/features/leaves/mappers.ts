import type { LeaveBalance, LeaveRequest, LeaveStatus } from "./types";

/**
 * Normalizes any casing ("PENDING", "APPROVED", "REJECTED", "CANCELLED") to canonical LeaveStatus.
 */
export function mapStatus(rawStatus?: string | null): LeaveStatus {
  const s = String(rawStatus || "pending").trim().toLowerCase();
  if (s === "approved" || s === "rejected" || s === "cancelled") {
    return s;
  }
  return "pending";
}

/**
 * Normalizes backend leave response into safe LeaveRequest.
 */
export function mapLeave(raw: any): LeaveRequest {
  if (!raw || typeof raw !== "object") {
    return {
      id: "",
      employee_name: "Employee",
      department: "Staff",
      leave_type: "Leave",
      start_date: "",
      end_date: "",
      total_days: 0,
      reason: "No reason provided",
      status: "pending",
    };
  }

  const rawEmpName =
    raw.employee_name ??
    raw.employee?.fullName ??
    raw.employee?.full_name ??
    raw.full_name;

  const rawDept =
    raw.department ??
    raw.employee?.department;

  return {
    id: String(raw.id ?? ""),
    employee_name: rawEmpName && String(rawEmpName).trim() ? String(rawEmpName).trim() : "Employee",
    department: rawDept && String(rawDept).trim() ? String(rawDept).trim() : "Staff",
    leave_type: String(raw.leave_type ?? "Leave"),
    start_date: String(raw.start_date ?? ""),
    end_date: String(raw.end_date ?? ""),
    total_days: Number(raw.total_days) || 0,
    reason: String(raw.reason ?? "No reason provided"),
    status: mapStatus(raw.status),
    rejection_reason: raw.rejection_reason ? String(raw.rejection_reason) : undefined,
  };
}

/**
 * Normalizes backend leave balance item into safe LeaveBalance.
 */
export function mapBalance(raw: any): LeaveBalance {
  if (!raw || typeof raw !== "object") {
    return {
      leave_type: "Leave",
      total_days: 0,
      used_days: 0,
      remaining_days: 0,
    };
  }

  return {
    leave_type: String(raw.leave_type ?? "Leave"),
    total_days: Number(raw.total_days) || 0,
    used_days: Number(raw.used_days) || 0,
    remaining_days: Number(raw.remaining_days) || 0,
  };
}

/**
 * Formats YYYY-MM-DD strings without timezone shift.
 * Parses as local date parts (year, month, day) instead of new Date("YYYY-MM-DD").
 * Uses "en-IN" locale formatting.
 */
export function formatDateStr(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0-indexed month
    const day = parseInt(match[3], 10);
    const localDate = new Date(year, month, day);
    return localDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Calculates estimated calendar days between start and end dates inclusive.
 * Parses as local date parts to prevent timezone shifts.
 */
export function calculateEstimatedDays(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 0;
  const startMatch = startStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const endMatch = endStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!startMatch || !endMatch) return 0;

  const s = new Date(
    parseInt(startMatch[1], 10),
    parseInt(startMatch[2], 10) - 1,
    parseInt(startMatch[3], 10)
  );
  const e = new Date(
    parseInt(endMatch[1], 10),
    parseInt(endMatch[2], 10) - 1,
    parseInt(endMatch[3], 10)
  );

  const diffTime = e.getTime() - s.getTime();
  if (diffTime < 0) return 0;
  return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time.
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Determines whether a leave request can be cancelled by the user.
 * Pending rows or future Approved rows (start_date >= today).
 */
export function isLeaveCancellable(
  leave: { status: LeaveStatus; start_date: string },
  todayStr: string = getTodayDateString()
): boolean {
  if (leave.status === "pending") return true;
  if (leave.status === "approved" && leave.start_date >= todayStr) return true;
  return false;
}

/**
 * Rule 4: Distinguish leave types by an 8px dot via lookup map.
 * Sick -> amber, Casual -> emerald, Vacation -> primary.
 * Unknown type -> bg-muted-foreground.
 */
export const LEAVE_TYPE_DOT: Record<string, string> = {
  "Sick Leave": "bg-amber-500",
  "Casual Leave": "bg-emerald-500",
  "Vacation Leave": "bg-primary",
};

export function getLeaveTypeDot(leaveType: string): string {
  return LEAVE_TYPE_DOT[leaveType] || "bg-muted-foreground";
}

/**
 * Rule 5: Standard status badge classes across the entire leaves feature.
 * approved  -> bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20
 * pending   -> bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20
 * rejected  -> bg-destructive/10 text-destructive border-destructive/20
 * cancelled -> bg-muted text-muted-foreground border-border
 */
export function statusBadgeClass(status?: string | null): string {
  const s = String(status || "").toLowerCase().trim();
  switch (s) {
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "pending":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "cancelled":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

/**
 * Returns safe uppercase single letter avatar initial.
 */
export function getSafeInitial(name?: string | null): string {
  if (!name) return "E";
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "E";
}
