import { api } from "@/api";
import apiInstance from "@/api/apiInstance";
import { aurix } from "@/lib/aurix-store";
import {
  EmployeeShiftScheduleData,
  UpcomingShiftItem,
  ShiftHistoryItem,
  RosterDayItem,
  ScheduleChangeRequestPayload,
  HolidayRecord,
  RosterEntryRecord,
} from "./types";
import { getRosters } from "./rostersApi";
import { getHolidays } from "./holidaysApi";

// ─────────────────────────────────────────────────────────────
// 6. Employee Portal Self-Service Methods (Real Backend)
// ─────────────────────────────────────────────────────────────

/**
 * Resolves the authenticated employee profile from the backend database.
 * Returns null if the employee cannot be identified.
 * Note: Authorization is enforced server-side. This function only provides
 * display data; all mutations must go through the API with proper auth.
 */
export async function resolveCurrentEmployee(): Promise<{
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  shift?: string | null;
  branch?: string | null;
  work_location?: string | null;
  department?: string | null;
  designation?: string | null;
} | null> {
  const ws = aurix.get();
  const user = ws.user;
  if (!user) return null;

  // For employee self-service, check workspace cache and profile
  if (user.role === "employee") {
    const localMatch = ws.employees?.find(
      (e) => e.email === user.email || e.id === user.id
    );
    if (localMatch) {
      return {
        id: localMatch.id,
        employee_id: localMatch.employeeId,
        full_name: localMatch.fullName,
        email: localMatch.email,
        shift: localMatch.shift || null,
        branch: ws.company?.city || null,
        work_location: "Office",
        department: localMatch.department || null,
        designation: localMatch.designation || null,
      };
    }
  }

  try {
    const res: any = await apiInstance.get("/employees", {
      params: { search: user.email || user.fullName, limit: 10 },
    });
    const data = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
    const list = Array.isArray(data) ? data : [];
    const match = list.find(
      (e: any) =>
        e.user_id === user.id ||
        e.id === user.id ||
        e.company_email === user.email ||
        e.personal_email === user.email
    );

    if (match) {
      return {
        id: match.id,
        employee_id: match.employee_id || match.id,
        full_name: `${match.first_name || ""} ${match.last_name || ""}`.trim() || match.full_name || user.fullName,
        email: match.company_email || match.personal_email || user.email,
        shift: match.shift || null,
        branch: match.branch || null,
        work_location: match.work_location || null,
        department: match.department || "General",
        designation: match.designation || "Staff",
      };
    }
  } catch {
    // 403 or network error: fall back to local workspace user profile
  }

  // Fallback: check workspace employee cache if available
  const localMatch = ws.employees?.find(
    (e) => e.email === user.email || e.id === user.id
  );
  if (localMatch) {
    return {
      id: localMatch.id,
      employee_id: localMatch.employeeId,
      full_name: localMatch.fullName,
      email: localMatch.email,
      shift: localMatch.shift || null,
      branch: ws.company?.city || null,
      work_location: "Headquarters",
      department: localMatch.department,
      designation: localMatch.designation,
    };
  }

  return null;
}

/**
 * Fetches the authenticated employee's assigned shifts, today's schedule,
 * upcoming scheduled shifts, and shift history from real backend APIs.
 * Uses GET /attendance/shifts/me/schedule (the single source of truth).
 */
export async function getMyShiftSchedule(): Promise<EmployeeShiftScheduleData> {
  const currentEmp = await resolveCurrentEmployee();
  if (!currentEmp) {
    throw new Error("Unable to identify the authenticated employee.");
  }

  try {
    // Fetch the complete schedule from the backend
    const res = await api.get("attendance/shifts/me/schedule");
    const data = res as { data?: unknown } | unknown;
    const item = (data as { data?: unknown })?.data ?? data;

    // Transform the backend response to the existing EmployeeShiftScheduleData shape
    // for backward compatibility with UI components during migration
    const schedule = item as {
      has_assigned_shift: boolean;
      timezone: string;
      employee: {
        id: string;
        employee_id: string;
        full_name: string;
        department: string;
        designation: string;
        branch: string;
      };
      current_shift: {
        id: string;
        name: string;
        code: string;
        start_time: string;
        end_time: string;
        is_overnight: boolean;
        is_off: boolean;
        is_holiday: boolean;
        holiday_name?: string | null;
        source: "roster" | "assignment" | "company_default" | "fallback";
        grace_period_mins: number;
        break_duration_mins: number;
        night_shift: boolean;
        night_premium_percent: number;
        working_days: string[];
      } | null;
      today: {
        date: string;
        day: string;
        shift_name: string;
        start_time: string;
        end_time: string;
        is_overnight: boolean;
        is_off: boolean;
        is_holiday: boolean;
        holiday_name?: string | null;
        source: "roster" | "assignment" | "company_default" | "fallback";
        checked_in: boolean;
        checked_out: boolean;
        check_in_time: string | null;
        check_out_time: string | null;
        working_hours: number | null;
        is_late: boolean;
        late_minutes: number;
      } | null;
      upcoming: Array<{
        date: string;
        day: string;
        shift_name: string;
        start_time: string;
        end_time: string;
        is_overnight: boolean;
        is_off: boolean;
        is_holiday: boolean;
        holiday_name?: string | null;
        source: "roster" | "assignment" | "company_default" | "fallback";
        working_hours: number | null;
      }>;
      history: Array<{
        attendance_id: string;
        date: string;
        day: string;
        shift_name: string;
        scheduled_start: string;
        scheduled_end: string;
        check_in_time: string | null;
        check_out_time: string | null;
        working_hours: number | null;
        overtime_hours: number | null;
        status: "Present" | "Late" | "Half Day" | "Absent" | "On Leave" | "Off" | "Holiday" | "Auto Closed";
        is_late: boolean;
        late_minutes: number;
        is_early_checkout: boolean;
        early_minutes: number;
        auto_closed: boolean;
      }>;
    };

    if (!schedule.has_assigned_shift || !schedule.current_shift) {
      return {
        hasAssignedShift: false,
        employeeId: schedule.employee.employee_id,
        employeeName: schedule.employee.full_name,
        department: schedule.employee.department,
        designation: schedule.employee.designation,
        branch: schedule.employee.branch,
        currentShift: null,
        todayShift: null,
        upcomingShifts: [],
        shiftHistory: [],
      };
    }

    const shiftDef = schedule.current_shift;
    const today = schedule.today;
    const upcoming = schedule.upcoming;
    const history = schedule.history;

    return {
      hasAssignedShift: true,
      employeeId: schedule.employee.employee_id,
      employeeName: schedule.employee.full_name,
      department: schedule.employee.department,
      designation: schedule.employee.designation,
      branch: schedule.employee.branch,
      currentShift: {
        shiftName: shiftDef.name,
        shiftType: shiftDef.night_shift ? "Night" : shiftDef.is_overnight ? "Night" : "Regular",
        startTime: shiftDef.start_time,
        endTime: shiftDef.end_time,
        breakDuration: `${shiftDef.break_duration_mins} min`,
        breakWindow: "Scheduled break",
        totalWorkingHours: Math.round((parseTimeToMinutes(shiftDef.end_time) - parseTimeToMinutes(shiftDef.start_time) + (shiftDef.is_overnight ? 1440 : 0) - shiftDef.break_duration_mins) / 60),
        gracePeriodMinutes: shiftDef.grace_period_mins,
        nightPremiumPercent: shiftDef.night_premium_percent,
        workingDays: shiftDef.working_days as any,
        description: `Source: ${shiftDef.source}`,
      },
      todayShift: today
        ? {
            date: today.date,
            day: today.day,
            shift: {
              shiftName: today.shift_name,
              shiftType: shiftDef.night_shift ? "Night" : shiftDef.is_overnight ? "Night" : "Regular",
              startTime: today.start_time,
              endTime: today.end_time,
              breakDuration: `${shiftDef.break_duration_mins} min`,
              breakWindow: "Scheduled break",
              totalWorkingHours: Math.round((parseTimeToMinutes(today.end_time) - parseTimeToMinutes(today.start_time) + (today.is_overnight ? 1440 : 0) - shiftDef.break_duration_mins) / 60),
              gracePeriodMinutes: shiftDef.grace_period_mins,
              nightPremiumPercent: shiftDef.night_premium_percent,
              workingDays: shiftDef.working_days as any,
            },
            checkedIn: today.checked_in,
            checkedOut: today.checked_out,
            checkInTime: today.check_in_time,
            checkOutTime: today.check_out_time,
            workingHours: today.working_hours,
            isOffDay: today.is_off || today.is_holiday,
          }
        : null,
      upcomingShifts: upcoming.map((u) => ({
        id: `upcoming-${u.date}`,
        date: u.date,
        day: u.day,
        shiftName: u.shift_name,
        startTime: u.start_time,
        endTime: u.end_time,
        breakDuration: `${shiftDef.break_duration_mins} min`,
        workingHours: u.working_hours ?? Math.round((parseTimeToMinutes(u.end_time) - parseTimeToMinutes(u.start_time) + (u.is_overnight ? 1440 : 0) - shiftDef.break_duration_mins) / 60),
        shiftType: shiftDef.night_shift ? "Night" : shiftDef.is_overnight ? "Night" : "Regular",
        status: u.is_off ? "Off Day" : u.is_holiday ? "Holiday" : "Scheduled",
      })),
      shiftHistory: history.map((h) => ({
        id: h.attendance_id,
        date: h.date,
        day: h.day,
        shiftName: h.shift_name,
        checkInTime: h.check_in_time,
        checkOutTime: h.check_out_time,
        workingHours: h.working_hours,
        status: h.status === "Auto Closed" ? "Completed" : h.status,
      })),
    };
  } catch (err) {
    console.error("Failed to fetch shift schedule from backend:", err);
    throw new Error("Unable to load shift schedule. Please try again.");
  }
}

/**
 * Fetches the employee's planned work schedule / roster entries from the real backend.
 * Uses GET /rosters with employee_id filter.
 */
export async function getMyRoster(
  month?: number,
  year?: number
): Promise<{
  entries: RosterDayItem[];
  hasRoster: boolean;
  employeeName: string;
  shiftName: string;
}> {
  const currentEmp = await resolveCurrentEmployee();
  if (!currentEmp) {
    throw new Error("Unable to identify the authenticated employee.");
  }

  const targetYear = year ?? new Date().getFullYear();
  const targetMonth = month ?? new Date().getMonth() + 1;

  // Fetch rosters for this employee from backend
  let backendRosters: RosterEntryRecord[] = [];
  try {
    backendRosters = await getRosters({ employee_id: currentEmp.id });
  } catch {
    // Backend attendance/rosters may not be populated
  }

  // Fetch real holidays
  const holidays = await getHolidays({
    branch: currentEmp.branch || undefined,
    year: targetYear,
  }).catch(() => [] as HolidayRecord[]);

  const holidayMap = new Map<string, HolidayRecord>();
  holidays.forEach((h) => holidayMap.set(h.date, h));

  const assignedShiftName = currentEmp.shift;
  if (!assignedShiftName && backendRosters.length === 0) {
    return {
      entries: [],
      hasRoster: false,
      employeeName: currentEmp.full_name,
      shiftName: "None",
    };
  }

  const shiftDef = {
    shiftName: assignedShiftName || "Morning Shift",
    startTime: "09:00",
    endTime: "18:00",
    workingHours: 8,
    breakDuration: "1 Hour",
    breakWindow: "01:00 PM – 02:00 PM",
    gracePeriodMinutes: 15,
    nightPremiumPercent: 0,
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  };

  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const entries: RosterDayItem[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(targetYear, targetMonth - 1, day);
    const dateStr = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Check if explicit backend roster exists for this day
    const explicit = backendRosters.find((r) => r.date === dateStr);
    if (explicit) {
      entries.push({
        id: explicit.id,
        date: dateStr,
        day: dayName,
        shiftName: explicit.shift,
        startTime: explicit.start_time,
        endTime: explicit.end_time,
        workingHours: explicit.working_hours,
        status: explicit.shift === "Off Day" ? "Weekly Off" : explicit.shift === "Holiday" ? "Holiday" : "Working",
        notes: explicit.location,
      });
      continue;
    }

    // Check if holiday
    const holiday = holidayMap.get(dateStr);
    if (holiday) {
      entries.push({
        id: `roster-${dateStr}`,
        date: dateStr,
        day: dayName,
        shiftName: holiday.name,
        startTime: "—",
        endTime: "—",
        workingHours: 0,
        status: "Holiday",
        notes: holiday.description || holiday.type,
      });
      continue;
    }

    // Check weekend
    if (isWeekend) {
      entries.push({
        id: `roster-${dateStr}`,
        date: dateStr,
        day: dayName,
        shiftName: "—",
        startTime: "—",
        endTime: "—",
        workingHours: 0,
        status: "Weekly Off",
      });
      continue;
    }

    // Standard working day based on assigned shift
    entries.push({
      id: `roster-${dateStr}`,
      date: dateStr,
      day: dayName,
      shiftName: shiftDef.shiftName,
      startTime: shiftDef.startTime,
      endTime: shiftDef.endTime,
      workingHours: shiftDef.workingHours,
      status: "Working",
    });
  }

  return {
    entries,
    hasRoster: true,
    employeeName: currentEmp.full_name,
    shiftName: shiftDef.shiftName,
  };
}

/**
 * Submits an employee request for shift change to the backend.
 * Uses POST /attendance/shifts/change-requests.
 */
export async function requestScheduleChange(payload: ScheduleChangeRequestPayload): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post("attendance/shifts/change-requests", {
      requested_shift_id: payload.requestedShift,
      effective_date: payload.effectiveDate,
      reason: payload.reason,
    });
    const data = res as { data?: unknown } | unknown;
    return {
      success: true,
      message: (data as { message?: string })?.message || "Your shift change request has been submitted for approval.",
    };
  } catch (err: any) {
    const errorCode = err?.response?.data?.detail?.code;
    if (errorCode === "CHANGE_REQUEST_INVALID_STATE") {
      throw new Error("You already have a pending shift change request.");
    }
    throw err;
  }
}

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}