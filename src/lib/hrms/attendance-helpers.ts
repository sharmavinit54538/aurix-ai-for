export type EmployeePunchStatus =
  | "not-checked-in"
  | "checked-in"
  | "on-break"
  | "checked-out";

export interface AttendanceSummaryInputRecord {
  date?: string;
  status?: string;
  workingHours?: number | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  location?: string | null;
}

export interface ComputedAttendanceMetrics {
  totalDays: number;
  presentDays: number;
  wfhDays: number;
  lateDays: number;
  avgHours: number;
  attendanceRate: number;
}

export function isEmployeeAttendanceRole(role?: string | null): boolean {
  return (role || "").trim().toLowerCase() === "employee";
}

export function resolveCheckInStatus(state: {
  checkedIn?: boolean;
  checkedOut?: boolean;
  onBreak?: boolean;
}): EmployeePunchStatus {
  if (state.checkedOut) return "checked-out";
  if (state.onBreak) return "on-break";
  if (state.checkedIn) return "checked-in";
  return "not-checked-in";
}

export function formatDurationHM(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0));
  if (safe === 0) return "0h 00m";
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function formatAttendanceTime(raw?: string | null): string {
  if (!raw) return "—";
  const trimmed = String(raw).trim();
  if (!trimmed) return "—";

  // Already formatted like "09:05 AM"
  if (/^\d{1,2}:\d{2}(\s?[AP]M)$/i.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return trimmed;
}

export function computeAttendanceMetrics(
  records: AttendanceSummaryInputRecord[]
): ComputedAttendanceMetrics {
  const safeList = Array.isArray(records) ? records : [];
  const totalDays = safeList.length;

  if (totalDays === 0) {
    return {
      totalDays: 0,
      presentDays: 0,
      wfhDays: 0,
      lateDays: 0,
      avgHours: 0,
      attendanceRate: 100,
    };
  }

  let presentDays = 0;
  let wfhDays = 0;
  let lateDays = 0;
  let totalHours = 0;
  let countedHours = 0;

  for (const item of safeList) {
    const status = (item.status || "").toLowerCase();
    if (status === "wfh" || status === "remote") {
      wfhDays += 1;
      presentDays += 1;
    } else if (status === "late") {
      lateDays += 1;
      presentDays += 1;
    } else if (status === "present" || status === "checked out" || status === "half day") {
      presentDays += 1;
    }

    if (typeof item.workingHours === "number" && item.workingHours > 0) {
      totalHours += item.workingHours;
      countedHours += 1;
    }
  }

  const avgHours = countedHours > 0 ? Number((totalHours / countedHours).toFixed(1)) : 0;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  return {
    totalDays,
    presentDays,
    wfhDays,
    lateDays,
    avgHours,
    attendanceRate,
  };
}
