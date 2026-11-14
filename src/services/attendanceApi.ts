import type {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceHistoryItem,
  HolidayItem,
  HolidayRecord,
  HolidayCreatePayload,
  RosterItem,
  RosterEntryRecord,
  RosterCreatePayload,
  RosterDayItem,
  ScheduleChangeRequestPayload,
  ShiftItem,
  ShiftChangeRequest,
  AttendancePunchResult,
  TimelineEventItem,
  FaceAttendanceStatus,
  FaceShiftSummary,
  TodayAttendanceEmployee,
  AttendanceTrendDataPoint,
  AttendanceTrendsResponse,
  AttendanceDistributionResponse,
  WeeklyAttendanceDataPoint,
  WeeklyAttendanceResponse,
  AttendanceRateKPIResponse,
  AttendanceAnalyticsFilters,
} from "./attendance/types";

export type {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceHistoryItem,
  HolidayItem,
  HolidayRecord,
  HolidayCreatePayload,
  RosterItem,
  RosterEntryRecord,
  RosterCreatePayload,
  RosterDayItem,
  ScheduleChangeRequestPayload,
  ShiftItem,
  ShiftChangeRequest,
  AttendancePunchResult,
  TimelineEventItem,
  FaceAttendanceStatus,
  FaceShiftSummary,
  TodayAttendanceEmployee,
  AttendanceTrendDataPoint,
  AttendanceTrendsResponse,
  AttendanceDistributionResponse,
  WeeklyAttendanceDataPoint,
  WeeklyAttendanceResponse,
  AttendanceRateKPIResponse,
  AttendanceAnalyticsFilters,
};

export function extractFaceApiError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unable to process attendance request.";
}

export function extractErrorCode(err: unknown): string | undefined {
  return (err as { code?: string })?.code;
}

export const getAttendanceSummary = async (): Promise<AttendanceSummary> => ({
  total_employees: 48,
  present_today: 44,
  absent_today: 1,
  late_today: 2,
  on_leave_today: 1,
  attendance_rate: 95.8,
});

export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => [
  {
    id: "att-1",
    employee_id: "EMP-1001",
    employee_name: "Alex Vance",
    department: "Engineering",
    date: new Date().toISOString().slice(0, 10),
    check_in: "09:02 AM",
    check_out: "06:15 PM",
    status: "Present",
    work_hours: 9.2,
    shift_name: "General Shift",
  },
];

let punchState = {
  checkedIn: false,
  checkedOut: false,
  onBreak: false,
  checkInTime: null as string | null,
  checkOutTime: null as string | null,
  breakDurationMinutes: 0,
  faceRegistered: true,
  locationLabel: "Bengaluru HQ",
};

let timelineStore: TimelineEventItem[] = [];

const MY_ASSIGNED_SHIFT: FaceShiftSummary = {
  shift_name: "General Morning Shift",
  start_time: "09:00",
  end_time: "18:00",
  grace_period_mins: 15,
  break_duration_mins: 60,
  night_premium_percent: 0,
  is_overnight: false,
  is_off: false,
  is_holiday: false,
  source: "assigned_shift",
};

let myAttendanceHistoryStore: AttendanceHistoryItem[] = Array.from({ length: 6 }, (_, idx) => {
  const d = new Date(Date.now() - (idx + 1) * 86400000);
  const dateStr = d.toISOString().slice(0, 10);
  const isWfh = idx === 2;
  const isLate = idx === 4;
  return {
    id: `hist-${idx + 1}`,
    date: dateStr,
    status: isWfh ? "WFH" : isLate ? "Late" : "Present",
    checkInTime: `${dateStr}T${isLate ? "09:24:00" : "09:04:00"}`,
    checkOutTime: `${dateStr}T18:12:00`,
    workingHours: isLate ? 8.1 : 8.6,
    location: isWfh ? "Remote / WFH" : "Bengaluru · Global HQ",
  };
});

function formatPunchClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getWorkspaceEmployeeIdentity() {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("aurix:workspace:v3");
      if (raw) {
        const parsed = JSON.parse(raw);
        const u = parsed?.user;
        if (u?.fullName) {
          return {
            id: u.id || "emp-kabir",
            employeeId: u.employeeCode || u.employeeId || "EMP-3655",
            fullName: u.fullName,
            department: u.department || "Engineering",
            designation: u.designation || "Senior Software Engineer",
          };
        }
      }
    } catch {
      // Fallback safely
    }
  }
  return {
    id: "emp-kabir",
    employeeId: "EMP-3655",
    fullName: "Kabir Mehta",
    department: "Engineering",
    designation: "Senior Software Engineer",
  };
}

export const getTodayStatus = async () => ({
  checked_in: punchState.checkedIn,
  check_in_time: punchState.checkInTime,
  check_out_time: punchState.checkOutTime,
  status: punchState.checkedOut ? "Checked Out" : punchState.onBreak ? "On Break" : punchState.checkedIn ? "Present" : "Not Checked In",
  work_hours: punchState.checkedOut ? 8.5 : 0,
  enrolled: punchState.faceRegistered,
  verified: true,
  shift_name: MY_ASSIGNED_SHIFT.shift_name,
  start_time: MY_ASSIGNED_SHIFT.start_time,
  end_time: MY_ASSIGNED_SHIFT.end_time,
});

export const getMyTodayStatus = async () => ({
  checkedIn: punchState.checkedIn,
  checkedOut: punchState.checkedOut,
  onBreak: punchState.onBreak,
  checkInTime: punchState.checkInTime,
  checkOutTime: punchState.checkOutTime,
  breakDurationMinutes: punchState.breakDurationMinutes,
  workingHours: punchState.checkedOut
    ? Number(
        Math.max(
          0.1,
          punchState.checkInTime && punchState.checkOutTime
            ? (new Date(punchState.checkOutTime).getTime() - new Date(punchState.checkInTime).getTime()) / 3600000
            : 8.5
        ).toFixed(2)
      )
    : 0,
  activeSeconds:
    punchState.checkedIn && !punchState.checkedOut && punchState.checkInTime
      ? Math.max(0, Math.floor((Date.now() - new Date(punchState.checkInTime).getTime()) / 1000))
      : 0,
  status: punchState.checkedOut
    ? "Checked Out"
    : punchState.onBreak
    ? "On Break"
    : punchState.checkedIn
    ? "Present"
    : "Not Checked In",
  location: punchState.locationLabel,
});

export const checkIn = async (payload?: Record<string, any>): Promise<AttendancePunchResult> => {
  const ts = new Date().toISOString();
  const identity = getWorkspaceEmployeeIdentity();
  const modeLabel = payload?.workMode === "Remote" ? "Remote / WFH" : "Bengaluru · Global HQ";
  punchState = {
    ...punchState,
    checkedIn: true,
    checkedOut: false,
    onBreak: false,
    checkInTime: ts,
    checkOutTime: null,
    locationLabel: modeLabel,
  };
  timelineStore = [
    ...timelineStore,
    {
      id: `tl-${Date.now()}`,
      type: "checkin",
      timestamp: ts,
      time: formatPunchClock(ts),
      label: `Checked in (${modeLabel})`,
    },
  ];
  const todayKey = ts.slice(0, 10);
  myAttendanceHistoryStore = [
    {
      id: `hist-today-${todayKey}`,
      date: todayKey,
      status: payload?.workMode === "Remote" ? "WFH" : "Present",
      checkInTime: ts,
      checkOutTime: null,
      workingHours: 0,
      location: modeLabel,
      notes: payload?.notes,
    },
    ...myAttendanceHistoryStore.filter((h) => h.date !== todayKey),
  ];
  return {
    id: `punch-in-${Date.now()}`,
    success: true,
    timestamp: ts,
    time: ts,
    checkInTime: ts,
    status: "Present",
    employeeName: identity.fullName,
    employeeId: identity.employeeId,
    isInsideGeofence: payload?.workMode !== "Remote",
    message: "Checked in successfully",
  };
};

export const checkOut = async (payload?: Record<string, any>): Promise<AttendancePunchResult> => {
  const ts = new Date().toISOString();
  const identity = getWorkspaceEmployeeIdentity();
  const inMs = punchState.checkInTime ? new Date(punchState.checkInTime).getTime() : Date.now() - 3600000;
  const elapsedHours = Number(Math.max(0.1, (Date.now() - inMs) / 3600000).toFixed(2));
  punchState = {
    ...punchState,
    checkedOut: true,
    onBreak: false,
    checkOutTime: ts,
  };
  timelineStore = [
    ...timelineStore,
    {
      id: `tl-${Date.now()}`,
      type: "checkout",
      timestamp: ts,
      time: formatPunchClock(ts),
      label: "Checked out for the day",
    },
  ];
  const todayKey = ts.slice(0, 10);
  myAttendanceHistoryStore = myAttendanceHistoryStore.map((item) =>
    item.date === todayKey
      ? {
          ...item,
          checkOutTime: ts,
          workingHours: elapsedHours,
          notes: payload?.notes || item.notes,
        }
      : item
  );
  return {
    id: `punch-out-${Date.now()}`,
    success: true,
    timestamp: ts,
    time: ts,
    checkInTime: punchState.checkInTime,
    checkOutTime: ts,
    workingHours: elapsedHours,
    status: "Checked Out",
    employeeName: identity.fullName,
    employeeId: identity.employeeId,
    isInsideGeofence: true,
    message: "Checked out successfully",
  };
};

export const startBreak = async (_payload?: Record<string, any>): Promise<AttendancePunchResult> => {
  const ts = new Date().toISOString();
  const identity = getWorkspaceEmployeeIdentity();
  punchState = { ...punchState, onBreak: true };
  timelineStore = [
    ...timelineStore,
    {
      id: `tl-${Date.now()}`,
      type: "break_start",
      timestamp: ts,
      time: formatPunchClock(ts),
      label: "Started break",
    },
  ];
  return {
    success: true,
    timestamp: ts,
    time: ts,
    status: "On Break",
    employeeName: identity.fullName,
    employeeId: identity.employeeId,
    message: "Break started",
  };
};

export const endBreak = async (_payload?: Record<string, any>): Promise<AttendancePunchResult> => {
  const ts = new Date().toISOString();
  const identity = getWorkspaceEmployeeIdentity();
  punchState = { ...punchState, onBreak: false, breakDurationMinutes: punchState.breakDurationMinutes + 15 };
  timelineStore = [
    ...timelineStore,
    {
      id: `tl-${Date.now()}`,
      type: "break_end",
      timestamp: ts,
      time: formatPunchClock(ts),
      label: "Resumed shift from break",
    },
  ];
  return {
    success: true,
    timestamp: ts,
    time: ts,
    status: "Present",
    employeeName: identity.fullName,
    employeeId: identity.employeeId,
    message: "Break ended",
  };
};

let holidaysStore: HolidayRecord[] = [
  {
    id: "hol-1",
    name: "New Year's Day",
    date: "2026-01-01",
    type: "Public",
    description: "Annual national public holiday celebrating the start of the calendar year.",
    country: "India",
    state: "All States",
    office: "All Offices",
    department: "All Departments",
    color: "#3B82F6",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    status: "Active",
    createdBy: "HR Operations",
    createdDate: "2026-01-01",
  },
  {
    id: "hol-2",
    name: "Republic Day",
    date: "2026-01-26",
    type: "Public",
    description: "National public holiday honoring the Constitution of India.",
    country: "India",
    state: "All States",
    office: "All Offices",
    department: "All Departments",
    color: "#3B82F6",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    status: "Active",
    createdBy: "HR Operations",
    createdDate: "2026-01-01",
  },
  {
    id: "hol-3",
    name: "Independence Day",
    date: "2026-08-15",
    type: "Public",
    description: "National public holiday commemorating Independence Day.",
    country: "India",
    state: "All States",
    office: "All Offices",
    department: "All Departments",
    color: "#3B82F6",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    status: "Active",
    createdBy: "HR Operations",
    createdDate: "2026-01-01",
  },
  {
    id: "hol-4",
    name: "Diwali Festival",
    date: "2026-11-08",
    type: "Public",
    description: "Festival of Lights holiday observed across offices.",
    country: "India",
    state: "All States",
    office: "Bengaluru Tech Park",
    department: "All Departments",
    color: "#F59E0B",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    status: "Active",
    createdBy: "HR Operations",
    createdDate: "2026-01-01",
  },
  {
    id: "hol-5",
    name: "Christmas Day",
    date: "2026-12-25",
    type: "Public",
    description: "Annual company and public holiday.",
    country: "Global",
    state: "All States",
    office: "All Offices",
    department: "All Departments",
    color: "#3B82F6",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    status: "Active",
    createdBy: "HR Operations",
    createdDate: "2026-01-01",
  },
];

export const getHolidays = async (_params?: unknown): Promise<HolidayRecord[]> => [...holidaysStore];

export const createHoliday = async (data: Partial<HolidayRecord>): Promise<HolidayRecord> => {
  const created: HolidayRecord = {
    id: `hol-${Date.now()}`,
    name: data.name || "Holiday",
    date: data.date || new Date().toISOString().slice(0, 10),
    type: data.type || "Public",
    description: data.description || "Company scheduled holiday.",
    country: data.country || "India",
    state: data.state || "All States",
    office: data.office || "All Offices",
    department: data.department || "All Departments",
    color: data.color || "#3B82F6",
    recurring: Boolean(data.recurring),
    everyYear: data.everyYear ?? true,
    applyToAll: data.applyToAll ?? true,
    status: "Active",
    createdBy: "HR Operations",
    createdDate: new Date().toISOString().slice(0, 10),
    ...data,
  };
  holidaysStore = [created, ...holidaysStore];
  return created;
};

export const updateHoliday = async (id: string, data: Partial<HolidayRecord>): Promise<HolidayRecord> => {
  holidaysStore = holidaysStore.map((h) => (h.id === id ? { ...h, ...data } : h));
  return (
    holidaysStore.find((h) => h.id === id) || {
      id,
      name: data.name || "Holiday",
      date: data.date || "",
      type: data.type || "Public",
      description: data.description || "",
    }
  );
};

export const deleteHoliday = async (id: string) => {
  holidaysStore = holidaysStore.filter((h) => h.id !== id);
  return { success: true };
};

export const importHolidays = async (_payload: unknown) => ({
  success: true,
  imported: 0,
  importedCount: 0,
  message: "Holiday import complete",
});

function getCurrentWeekDates(): string[] {
  const now = new Date();
  const currentDay = now.getDay();
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

function buildInitialRosters(): RosterItem[] {
  const weekDates = getCurrentWeekDates();
  const employees = [
    {
      code: "EMP-1001",
      name: "Alex Vance",
      dept: "Engineering",
      role: "VP of Engineering",
      mgr: "Direct Leadership",
      location: "Corporate HQ",
      pattern: ["Morning", "Morning", "WFH", "Morning", "Morning", "Off Day", "Off Day"] as const,
    },
    {
      code: "EMP-1002",
      name: "Sarah Chen",
      dept: "Product",
      role: "Head of Product",
      mgr: "Direct Leadership",
      location: "Corporate HQ",
      pattern: ["Morning", "WFH", "Morning", "Morning", "Evening", "Off Day", "Off Day"] as const,
    },
    {
      code: "EMP-1003",
      name: "Marcus Sterling",
      dept: "Engineering",
      role: "Senior Software Engineer",
      mgr: "Alex Vance",
      location: "Remote",
      pattern: ["Morning", "Morning", "Morning", "WFH", "Morning", "Off Day", "Off Day"] as const,
    },
    {
      code: "EMP-1004",
      name: "Elena Rostova",
      dept: "HR",
      role: "People Operations Lead",
      mgr: "Direct Leadership",
      location: "Corporate HQ",
      pattern: ["Morning", "Morning", "Morning", "Morning", "WFH", "Off Day", "Off Day"] as const,
    },
  ];

  const items: RosterItem[] = [];
  employees.forEach((emp, empIdx) => {
    weekDates.forEach((dateStr, dayIdx) => {
      const shift = emp.pattern[dayIdx];
      const isOff = shift === "Off Day";
      const isEvening = shift === "Evening";
      const startTime = isOff ? "—" : isEvening ? "14:00" : "09:00";
      const endTime = isOff ? "—" : isEvening ? "22:00" : "18:00";
      items.push({
        id: `ros-${empIdx + 1}-${dayIdx + 1}`,
        employee_id: emp.code,
        employeeId: emp.code,
        employee_name: emp.name,
        employeeName: emp.name,
        department: emp.dept,
        designation: emp.role,
        shift_id: isEvening ? "sh-2" : "sh-1",
        shift_name: `${shift} Shift`,
        shiftName: `${shift} Shift`,
        shift,
        date: dateStr,
        startTime,
        endTime,
        workingHours: isOff ? 0 : 8,
        breakTime: isOff ? "—" : "45 mins",
        location: emp.location,
        manager: emp.mgr,
        status: dayIdx === 4 && empIdx === 2 ? "Pending" : "Approved",
      });
    });
  });

  return items;
}

let rosterStore: RosterItem[] | null = null;
function getRosterStore(): RosterItem[] {
  if (!rosterStore) {
    rosterStore = buildInitialRosters();
  }
  return rosterStore;
}

export const getRosters = async (): Promise<RosterItem[]> => {
  return [...getRosterStore()];
};

export const getMyRoster = async (month: number, year: number, employeeId?: string) => {
  const identity = getWorkspaceEmployeeIdentity();
  const daysInMonth = new Date(year, month, 0).getDate();
  const entries: RosterDayItem[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dObj = new Date(year, month - 1, day);
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayOfWeek = dObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidaysStore.some((h) => h.date === dateStr);

    entries.push({
      id: `my-ros-${dateStr}`,
      employeeId: employeeId || identity.employeeId,
      employeeName: identity.fullName,
      department: identity.department,
      shift: isHoliday ? "Holiday" : isWeekend ? "Off Day" : day % 5 === 0 ? "WFH" : "Morning",
      date: dateStr,
      day: dObj.toLocaleDateString("en-US", { weekday: "long" }),
      shiftName: isHoliday ? "Company Holiday" : isWeekend ? "Weekly Off" : "General Morning Shift",
      startTime: isHoliday || isWeekend ? "—" : "09:00",
      endTime: isHoliday || isWeekend ? "—" : "18:00",
      workingHours: isHoliday || isWeekend ? 0 : 8,
      breakTime: isHoliday || isWeekend ? "—" : "60 mins",
      location: day % 5 === 0 ? "Remote / WFH" : "Bengaluru · Global HQ",
      manager: "Alex Vance",
      status: isHoliday ? "Holiday" : isWeekend ? "Weekly Off" : "Working",
    });
  }

  return {
    entries,
    hasRoster: true,
    employeeName: identity.fullName,
    shiftName: "General Morning Shift",
  };
};

export const requestScheduleChange = async (_payload: Partial<ScheduleChangeRequestPayload> & Record<string, any>) => ({
  success: true,
  message: "Schedule change request sent to your reporting manager.",
});

export const createRoster = async (data: Partial<RosterCreatePayload>): Promise<RosterItem> => {
  const shift = (data.shift || "Morning") as RosterItem["shift"];
  const isOff = shift === "Off Day" || shift === "Leave" || shift === "Holiday";
  const created: RosterItem = {
    id: `ros-${Date.now()}`,
    employee_id: data.employeeId || data.employee_id || "EMP-001",
    employeeId: data.employeeId || data.employee_id || "EMP-001",
    employee_name: data.employeeName || "Alex Vance",
    employeeName: data.employeeName || "Alex Vance",
    department: data.department || "Engineering",
    designation: data.designation || "Staff",
    shift_id: data.shift_id || "sh-1",
    shift_name: `${shift} Shift`,
    shiftName: `${shift} Shift`,
    shift,
    date: data.date || data.start_date || new Date().toISOString().slice(0, 10),
    startTime: data.startTime || (isOff ? "—" : "09:00"),
    endTime: data.endTime || (isOff ? "—" : "18:00"),
    workingHours: data.workingHours ?? (isOff ? 0 : 8),
    breakTime: data.breakTime || (isOff ? "—" : "45 mins"),
    location: data.location || "Corporate HQ",
    manager: data.manager || "Direct Leadership",
    status: (data.status as RosterItem["status"]) || "Approved",
  };
  rosterStore = [created, ...getRosterStore()];
  return created;
};

export const updateRoster = async (id: string, data: Partial<RosterCreatePayload>): Promise<RosterItem> => {
  const store = getRosterStore();
  const idx = store.findIndex((r) => r.id === id);
  const existing = idx >= 0 ? store[idx] : store[0];
  const updated: RosterItem = {
    ...existing,
    ...data,
    id,
    employeeId: data.employeeId || existing?.employeeId || "EMP-001",
    employee_id: data.employeeId || existing?.employee_id || "EMP-001",
    employeeName: data.employeeName || existing?.employeeName || "Alex Vance",
    employee_name: data.employeeName || existing?.employee_name || "Alex Vance",
  };
  if (idx >= 0) {
    store[idx] = updated;
  }
  return updated;
};

export const deleteRoster = async (id: string) => {
  rosterStore = getRosterStore().filter((r) => r.id !== id);
  return { success: true };
};

export const getTodayAttendance = async (): Promise<TodayAttendanceEmployee[]> => {
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      id: "att-e1",
      employee_id: "EMP-1001",
      employeeId: "EMP-1001",
      employee_name: "Alex Vance",
      fullName: "Alex Vance",
      department: "Engineering",
      status: "present",
      check_in: "09:02 AM",
      checkInTime: `${today}T09:02:00`,
      check_out: null,
      checkOutTime: null,
      workingHours: 6.5,
    },
    {
      id: "att-e2",
      employee_id: "EMP-1002",
      employeeId: "EMP-1002",
      employee_name: "Sarah Chen",
      fullName: "Sarah Chen",
      department: "Product",
      status: "present",
      check_in: "09:10 AM",
      checkInTime: `${today}T09:10:00`,
      check_out: null,
      checkOutTime: null,
      workingHours: 6.4,
    },
    {
      id: "att-e3",
      employee_id: "EMP-1003",
      employeeId: "EMP-1003",
      employee_name: "Marcus Sterling",
      fullName: "Marcus Sterling",
      department: "Engineering",
      status: "late",
      check_in: "09:32 AM",
      checkInTime: `${today}T09:32:00`,
      check_out: null,
      checkOutTime: null,
      workingHours: 6.0,
    },
    {
      id: "att-e4",
      employee_id: "EMP-3655",
      employeeId: "EMP-3655",
      employee_name: "Kabir Mehta",
      fullName: "Kabir Mehta",
      department: "Engineering",
      status: "present",
      check_in: "09:05 AM",
      checkInTime: `${today}T09:05:00`,
      check_out: null,
      checkOutTime: null,
      workingHours: 6.5,
    },
  ];
};

export const attendanceApi = {
  getAttendanceSummary,
  getAttendanceRecords,
  getTodayStatus,
  getMyTodayStatus,
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  importHolidays,
  getRosters,
  getMyRoster,
  requestScheduleChange,
  createRoster,
  updateRoster,
  deleteRoster,
  getFaceStatus: async (): Promise<FaceAttendanceStatus> => ({ enrolled: true, verified: true, confidence: 0.99 }),
  getFaceAttendanceStatus: async (): Promise<FaceAttendanceStatus> => ({
    enrolled: true,
    verified: true,
    faceRegistered: punchState.faceRegistered,
    enrolled_at: "2026-10-01T09:00:00Z",
    checkedIn: punchState.checkedIn,
    checkedOut: punchState.checkedOut,
    checkInTime: punchState.checkInTime,
    checkOutTime: punchState.checkOutTime,
    workingHours: punchState.checkedOut ? 8.5 : 0,
    shiftName: MY_ASSIGNED_SHIFT.shift_name,
    shiftStartTime: MY_ASSIGNED_SHIFT.start_time,
    shiftEndTime: MY_ASSIGNED_SHIFT.end_time,
    shift: MY_ASSIGNED_SHIFT,
  }),
  enrollFace: async (_base64: string, _allowReEnroll = true) => {
    punchState = { ...punchState, faceRegistered: true };
    return { success: true, message: "Face biometrics verified and updated." };
  },
  getMyAttendanceHistory: async (_page = 1, _limit = 20) => ({
    items: [...myAttendanceHistoryStore],
    total: myAttendanceHistoryStore.length,
  }),
  resolveCurrentEmployee: async () => {
    const identity = getWorkspaceEmployeeIdentity();
    return {
      ...identity,
      employee_id: identity.employeeId,
      full_name: identity.fullName,
      shift: "General Morning Shift (09:00 - 18:00)",
    };
  },
  getShiftSummary: async (): Promise<FaceShiftSummary> => ({
    ...MY_ASSIGNED_SHIFT,
    checked_in: punchState.checkedIn,
    check_in_time: punchState.checkInTime,
    check_out_time: punchState.checkOutTime,
  }),
  getTimeline: async (): Promise<TimelineEventItem[]> => [...timelineStore],
  getTodayAttendance,
  getTodayEmployees: getTodayAttendance,
  getAttendanceAnalytics: async () => ({
    totalEmployees: 48,
    present: 44,
    late: 2,
    onLeave: 1,
    absent: 1,
    presentToday: 44,
    absentToday: 1,
    lateToday: 2,
    onLeaveToday: 1,
    attendanceRate: 95.8,
  }),
  getAttendanceTrends: async (_filters?: AttendanceAnalyticsFilters): Promise<AttendanceTrendsResponse> => ({ data: [] }),
  getAttendanceDistribution: async (_filters?: AttendanceAnalyticsFilters): Promise<AttendanceDistributionResponse> => ({
    present: 44,
    absent: 1,
    late: 2,
    on_leave: 1,
  }),
  getWeeklyAttendance: async (_filters?: AttendanceAnalyticsFilters): Promise<WeeklyAttendanceResponse> => ({ data: [] }),
  getAttendanceRateKPI: async (_filters?: AttendanceAnalyticsFilters): Promise<AttendanceRateKPIResponse> => ({
    rate: 95.8,
    change: 1.4,
    present_count: 44,
    total_count: 48,
  }),
};

export default attendanceApi;
