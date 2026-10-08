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
import { parseShiftDefinition, formatTimeStr } from "./helpers";
import { getRosters } from "./rostersApi";
import { getHolidays } from "./holidaysApi";

// ─────────────────────────────────────────────────────────────
// 6. Employee Portal Self-Service Methods (Real Backend)
// ─────────────────────────────────────────────────────────────

/**
 * Resolves the authenticated employee profile from the backend database.
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
    return {
      id: user.id,
      employee_id: localMatch?.employeeId || `EMP-${user.id.slice(0, 6).toUpperCase()}`,
      full_name: user.fullName || "Employee",
      email: user.email,
      shift: localMatch?.shift || null,
      branch: ws.company?.city || null,
      work_location: "Office",
      department: localMatch?.department || null,
      designation: localMatch?.designation || null,
    };
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
        employee_id: match.employee_id || `EMP-${match.id.slice(0, 6)}`,
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
 */
export async function getMyShiftSchedule(requestedEmployeeId?: string): Promise<EmployeeShiftScheduleData> {
  const currentEmp = await resolveCurrentEmployee();
  if (!currentEmp) {
    throw new Error("Unable to identify the authenticated employee.");
  }

  // Security check: Employee can only view their own schedule
  if (requestedEmployeeId && requestedEmployeeId !== currentEmp.id && requestedEmployeeId !== currentEmp.employee_id) {
    throw new Error("403 Forbidden: You do not have authorization to view shifts of other employees.");
  }

  const assignedShiftName = currentEmp.shift;
  if (!assignedShiftName || !assignedShiftName.trim()) {
    return {
      hasAssignedShift: false,
      employeeId: currentEmp.employee_id,
      employeeName: currentEmp.full_name,
      department: currentEmp.department || "General",
      designation: currentEmp.designation || "Staff",
      branch: currentEmp.branch || "Headquarters",
      currentShift: null,
      todayShift: null,
      upcomingShifts: [],
      shiftHistory: [],
    };
  }

  // Map shift definition
  const shiftDef = parseShiftDefinition(assignedShiftName);

  // Concurrently fetch real punch status and face attendance history
  const [todayPunchRes, historyRes, holidaysRes] = await Promise.allSettled([
    api.get<any>("attendance/face/me"),
    api.get<any>("attendance/face/history?limit=20"),
    getHolidays({ branch: currentEmp.branch || undefined, year: new Date().getFullYear() }),
  ]);

  const todayPunch = todayPunchRes.status === "fulfilled" && todayPunchRes.value?.data
    ? todayPunchRes.value.data
    : todayPunchRes.status === "fulfilled" && todayPunchRes.value?.checked_in !== undefined
    ? todayPunchRes.value
    : null;

  const historyItems = historyRes.status === "fulfilled"
    ? (historyRes.value?.data?.items || historyRes.value?.items || [])
    : [];

  const holidayDates = new Set(
    holidaysRes.status === "fulfilled" ? holidaysRes.value.map((h) => h.date) : []
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const todayDateObj = new Date();
  const dayOfWeek = todayDateObj.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  const isHoliday = holidayDates.has(todayStr);

  const todayShift = {
    date: todayStr,
    day: todayDateObj.toLocaleDateString("en-US", { weekday: "long" }),
    shift: shiftDef,
    checkedIn: Boolean(todayPunch?.checked_in),
    checkedOut: Boolean(todayPunch?.checked_out),
    checkInTime: todayPunch?.check_in_time ? formatTimeStr(todayPunch.check_in_time) : null,
    checkOutTime: todayPunch?.check_out_time ? formatTimeStr(todayPunch.check_out_time) : null,
    workingHours: todayPunch?.working_hours ?? (todayPunch?.checked_in ? shiftDef.totalWorkingHours : null),
    isOffDay: isWeekend || isHoliday,
  };

  // Build upcoming shifts for next 14 business days
  const upcomingShifts: UpcomingShiftItem[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(todayDateObj);
    d.setDate(todayDateObj.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dOfWeek = d.getDay();
    const isOff = dOfWeek === 0 || dOfWeek === 6;
    const isHol = holidayDates.has(dateStr);

    if (!isOff && !isHol) {
      upcomingShifts.push({
        id: `upcoming-${dateStr}`,
        date: dateStr,
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        shiftName: shiftDef.shiftName,
        startTime: shiftDef.startTime,
        endTime: shiftDef.endTime,
        breakDuration: shiftDef.breakDuration,
        workingHours: shiftDef.totalWorkingHours,
        shiftType: shiftDef.shiftType,
        status: "Scheduled",
      });
    }
  }

  // Map past history
  const shiftHistory: ShiftHistoryItem[] = historyItems.map((item: any, idx: number) => {
    const dStr = item.date ? item.date.split("T")[0] : todayStr;
    const dObj = new Date(dStr);
    return {
      id: item.id || `hist-${idx}-${dStr}`,
      date: dStr,
      day: dObj.toLocaleDateString("en-US", { weekday: "long" }),
      shiftName: shiftDef.shiftName,
      checkInTime: item.check_in_time ? formatTimeStr(item.check_in_time) : null,
      checkOutTime: item.check_out_time ? formatTimeStr(item.check_out_time) : null,
      workingHours: item.working_hours ? Number(item.working_hours) : null,
      status: item.check_in_time ? "Present" : "Absent",
    };
  });

  return {
    hasAssignedShift: true,
    employeeId: currentEmp.employee_id,
    employeeName: currentEmp.full_name,
    department: currentEmp.department || "General",
    designation: currentEmp.designation || "Staff",
    branch: currentEmp.branch || "Headquarters",
    currentShift: shiftDef,
    todayShift,
    upcomingShifts,
    shiftHistory,
  };
}

/**
 * Fetches the employee's planned work schedule / roster entries from the real backend.
 */
export async function getMyRoster(month?: number, year?: number, requestedEmployeeId?: string): Promise<{
  entries: RosterDayItem[];
  hasRoster: boolean;
  employeeName: string;
  shiftName: string;
}> {
  const currentEmp = await resolveCurrentEmployee();
  if (!currentEmp) {
    throw new Error("Unable to identify the authenticated employee.");
  }

  if (requestedEmployeeId && requestedEmployeeId !== currentEmp.id && requestedEmployeeId !== currentEmp.employee_id) {
    throw new Error("403 Forbidden: You do not have authorization to view the roster of other employees.");
  }

  const targetYear = year ?? new Date().getFullYear();
  const targetMonth = month ?? (new Date().getMonth() + 1); // 1-indexed

  // Check if employee has an assigned shift
  const assignedShiftName = currentEmp.shift;

  // Check backend for explicit rosters first
  let backendRosters: RosterEntryRecord[] = [];
  try {
    backendRosters = await getRosters();
  } catch {
    // Backend attendance/rosters may not be populated
  }

  const myBackendRosters = backendRosters.filter(
    (r) => r.employeeId === currentEmp.id || r.employeeId === currentEmp.employee_id
  );

  // Fetch real holidays
  const holidays = await getHolidays({
    branch: currentEmp.branch || undefined,
    year: targetYear,
  }).catch(() => [] as HolidayRecord[]);

  const holidayMap = new Map<string, HolidayRecord>();
  holidays.forEach((h) => holidayMap.set(h.date, h));

  if (!assignedShiftName && myBackendRosters.length === 0) {
    return {
      entries: [],
      hasRoster: false,
      employeeName: currentEmp.full_name,
      shiftName: "None",
    };
  }

  const shiftDef = parseShiftDefinition(assignedShiftName || "Morning");
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const entries: RosterDayItem[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(targetYear, targetMonth - 1, day);
    const dateStr = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Check if explicit backend roster exists for this day
    const explicit = myBackendRosters.find((r) => r.date === dateStr);
    if (explicit) {
      entries.push({
        id: explicit.id,
        date: dateStr,
        day: dayName,
        shiftName: explicit.shift,
        startTime: formatTimeStr(explicit.startTime),
        endTime: formatTimeStr(explicit.endTime),
        workingHours: explicit.workingHours,
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
      workingHours: shiftDef.totalWorkingHours,
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
 * Submits an employee request for shift or roster change to the backend support ticket workflow.
 */
export async function requestScheduleChange(payload: ScheduleChangeRequestPayload): Promise<{ success: boolean; message: string }> {
  const res: any = await api.post("/api/v2/employee-support/tickets", {
    category: "HR",
    priority: "MEDIUM",
    title: `${payload.type === "shift" ? "Shift" : "Roster"} Change Request: ${payload.requestedShift}`,
    description: `Schedule change requested to ${payload.requestedShift}. Effective Date: ${payload.effectiveDate}. Reason: ${payload.reason}`,
  });

  const isSuccess = res?.success !== false;
  return {
    success: isSuccess,
    message: res?.message || "Your schedule change request has been submitted to HR.",
  };
}
