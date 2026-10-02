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

export interface LeaveTypeColorConfig {
  cardClass: string;
  progressClass: string;
}

/**
 * Direct lookup map by exact leave type name (not string includes).
 */
export const LEAVE_TYPE_COLOR_MAP: Record<string, LeaveTypeColorConfig> = {
  "Sick Leave": {
    cardClass: "from-amber-500/10 to-orange-500/5 text-orange-500 border-orange-500/20",
    progressClass: "bg-orange-500",
  },
  "Casual Leave": {
    cardClass: "from-sky-500/10 to-blue-500/5 text-sky-500 border-sky-500/20",
    progressClass: "bg-sky-500",
  },
  "Vacation Leave": {
    cardClass: "from-emerald-500/10 to-teal-500/5 text-emerald-500 border-emerald-500/20",
    progressClass: "bg-emerald-500",
  },
};

export const DEFAULT_LEAVE_TYPE_COLOR: LeaveTypeColorConfig = {
  cardClass: "from-slate-500/10 to-zinc-500/5 text-foreground border-border",
  progressClass: "bg-muted-foreground",
};

/**
 * Returns color tokens for leave type; falls back to neutral styling for unknown types.
 */
export function getLeaveTypeColor(leaveType: string): LeaveTypeColorConfig {
  return LEAVE_TYPE_COLOR_MAP[leaveType] || DEFAULT_LEAVE_TYPE_COLOR;
}

/**
 * Returns safe uppercase single letter avatar initial.
 */
export function getSafeInitial(name?: string | null): string {
  if (!name) return "E";
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "E";
}
