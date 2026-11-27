import apiInstance from "@/api/apiInstance";
import {
  getAttendanceTrends as fetchAttendanceTrendsCanonical,
  getAttendanceDistribution as fetchAttendanceDistributionCanonical,
  getWeeklyAttendance as fetchAttendanceWeeklyCanonical,
  getAttendanceRateKPI as fetchAttendanceRateKPICanonical,
} from "./attendance/todayAttendanceApi";
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
  const axiosDetail =
    (err as any)?.response?.data?.detail ||
    (err as any)?.response?.data?.message;
  if (typeof axiosDetail === "string" && axiosDetail.trim()) {
    return axiosDetail;
  }
  if (err instanceof Error) return err.message;
  return "Unable to process attendance request.";
}

export function extractErrorCode(err: unknown): string | undefined {
  return (
    (err as any)?.response?.data?.code ||
    (err as { code?: string })?.code
  );
}

export const getAttendanceSummary = async (): Promise<AttendanceSummary> => {
  const res = await apiInstance.get("/attendance/summary");
  const d = res.data?.data ?? res.data ?? {};
  return {
    total_employees: Number(d.total_employees ?? d.totalEmployees ?? 0),
    present_today: Number(d.present_today ?? d.presentToday ?? 0),
    absent_today: Number(d.absent_today ?? d.absentToday ?? 0),
    late_today: Number(d.late_today ?? d.lateToday ?? 0),
    on_leave_today: Number(d.on_leave_today ?? d.onLeaveToday ?? 0),
    attendance_rate: Number(d.attendance_rate ?? d.attendanceRate ?? 0),
  };
};

export const getAttendanceRecords = async (
  params?: Record<string, unknown>,
): Promise<AttendanceRecord[]> => {
  const res = await apiInstance.get("/attendance/records", { params });
  const d = res.data?.data ?? res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  return [];
};

export const getTodayStatus = async () => {
  const res = await apiInstance.get("/attendance/today-status");
  return res.data?.data ?? res.data ?? {
    checked_in: false,
    check_in_time: null,
    check_out_time: null,
    status: "Not Checked In",
    work_hours: 0,
    enrolled: false,
    verified: false,
  };
};

export const getMyTodayStatus = async () => {
  const res = await apiInstance.get("/attendance/my-today");
  const d = res.data?.data ?? res.data ?? {};
  return {
    checkedIn: Boolean(d.checkedIn ?? d.checked_in ?? false),
    checkedOut: Boolean(d.checkedOut ?? d.checked_out ?? false),
    onBreak: Boolean(d.onBreak ?? d.on_break ?? false),
    checkInTime: d.checkInTime ?? d.check_in_time ?? null,
    checkOutTime: d.checkOutTime ?? d.check_out_time ?? null,
    breakDurationMinutes: Number(
      d.breakDurationMinutes ?? d.break_duration_minutes ?? 0,
    ),
    workingHours: Number(d.workingHours ?? d.working_hours ?? 0),
    activeSeconds: Number(d.activeSeconds ?? d.active_seconds ?? 0),
    status: String(d.status || "Not Checked In"),
    location: d.location || undefined,
  };
};

export const checkIn = async (
  payload?: Record<string, any>,
): Promise<AttendancePunchResult> => {
  const res = await apiInstance.post("/attendance/check-in", payload ?? {});
  return res.data?.data ?? res.data;
};

export const checkOut = async (
  payload?: Record<string, any>,
): Promise<AttendancePunchResult> => {
  const res = await apiInstance.post("/attendance/check-out", payload ?? {});
  return res.data?.data ?? res.data;
};

export const startBreak = async (
  payload?: Record<string, any>,
): Promise<AttendancePunchResult> => {
  const res = await apiInstance.post("/attendance/break-start", payload ?? {});
  return res.data?.data ?? res.data;
};

export const endBreak = async (
  payload?: Record<string, any>,
): Promise<AttendancePunchResult> => {
  const res = await apiInstance.post("/attendance/break-end", payload ?? {});
  return res.data?.data ?? res.data;
};

export const getRosters = async (
  params?: Record<string, unknown>,
): Promise<RosterItem[]> => {
  const res = await apiInstance.get("/attendance/rosters", { params });
  const d = res.data?.data ?? res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  return [];
};

export const getMyRoster = async (
  month: number,
  year: number,
  employeeId?: string,
) => {
  const res = await apiInstance.get("/attendance/rosters/my", {
    params: { month, year, employee_id: employeeId },
  });
  const d = res.data?.data ?? res.data ?? {};
  const entries: RosterDayItem[] = Array.isArray(d.entries)
    ? d.entries
    : Array.isArray(d.items)
      ? d.items
      : [];
  return {
    entries,
    hasRoster: Boolean(d.hasRoster ?? d.has_roster ?? entries.length > 0),
    employeeName: String(d.employeeName || d.employee_name || ""),
    shiftName: String(d.shiftName || d.shift_name || ""),
  };
};

export const requestScheduleChange = async (
  payload: Partial<ScheduleChangeRequestPayload> & Record<string, any>,
) => {
  const res = await apiInstance.post("/attendance/rosters/change-request", payload);
  return res.data?.data ?? res.data;
};

export const createRoster = async (
  data: Partial<RosterCreatePayload>,
): Promise<RosterItem> => {
  const res = await apiInstance.post("/attendance/rosters", data);
  return res.data?.data ?? res.data;
};

export const updateRoster = async (
  id: string,
  data: Partial<RosterCreatePayload>,
): Promise<RosterItem> => {
  const res = await apiInstance.put(`/attendance/rosters/${id}`, data);
  return res.data?.data ?? res.data;
};

export const deleteRoster = async (id: string) => {
  const res = await apiInstance.delete(`/attendance/rosters/${id}`);
  return res.data?.data ?? res.data ?? { success: true };
};

export const getTodayAttendance = async (): Promise<
  TodayAttendanceEmployee[]
> => {
  const res = await apiInstance.get("/attendance/today");
  const d = res.data?.data ?? res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  return [];
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
  getRosters,
  getMyRoster,
  requestScheduleChange,
  createRoster,
  updateRoster,
  deleteRoster,
  getFaceStatus: async (): Promise<FaceAttendanceStatus> => {
    const res = await apiInstance.get("/attendance/face/status");
    return res.data?.data ?? res.data ?? { enrolled: false, verified: false };
  },
  getFaceAttendanceStatus: async (): Promise<FaceAttendanceStatus> => {
    const res = await apiInstance.get("/attendance/face/attendance-status");
    return res.data?.data ?? res.data ?? { enrolled: false, verified: false };
  },
  enrollFace: async (base64: string, allowReEnroll = true) => {
    const res = await apiInstance.post("/attendance/face/enroll", {
      image: base64,
      allow_re_enroll: allowReEnroll,
    });
    return res.data?.data ?? res.data;
  },
  getMyAttendanceHistory: async (page = 1, limit = 20) => {
    const res = await apiInstance.get("/attendance/my-history", {
      params: { page, limit },
    });
    const d = res.data?.data ?? res.data;
    const items: AttendanceHistoryItem[] = Array.isArray(d)
      ? d
      : Array.isArray(d?.items)
        ? d.items
        : [];
    return {
      items,
      total: Number(d?.total ?? items.length),
    };
  },
  resolveCurrentEmployee: async () => {
    const res = await apiInstance.get("/employees/me");
    return res.data?.data ?? res.data ?? null;
  },
  getShiftSummary: async (): Promise<FaceShiftSummary> => {
    const res = await apiInstance.get("/attendance/shift-summary");
    return res.data?.data ?? res.data ?? {};
  },
  getTimeline: async (): Promise<TimelineEventItem[]> => {
    const res = await apiInstance.get("/attendance/timeline");
    const d = res.data?.data ?? res.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.items)) return d.items;
    return [];
  },
  getTodayAttendance,
  getTodayEmployees: getTodayAttendance,
  getAttendanceAnalytics: async (filters?: AttendanceAnalyticsFilters) => {
    const res = await apiInstance.get("/attendance/analytics", {
      params: filters,
    });
    const d = res.data?.data ?? res.data ?? {};
    const totalEmployees = Number(d.totalEmployees ?? d.total_employees ?? d.total_active_employees ?? 0);
    const present = Number(d.present ?? d.present_today ?? d.checked_in_today ?? 0);
    const late = Number(d.late ?? d.late_today ?? d.late_check_ins_today ?? 0);
    const onLeave = Number(d.onLeave ?? d.on_leave ?? d.on_leave_today ?? 0);
    const absent = Number(d.absent ?? d.absent_today ?? 0);
    return {
      totalEmployees,
      present,
      late,
      onLeave,
      absent,
      presentToday: Number(d.presentToday ?? d.present_today ?? present),
      absentToday: Number(d.absentToday ?? d.absent_today ?? absent),
      lateToday: Number(d.lateToday ?? d.late_today ?? late),
      onLeaveToday: Number(d.onLeaveToday ?? d.on_leave_today ?? onLeave),
      attendanceRate: Number(d.attendanceRate ?? d.attendance_rate ?? d.attendance_rate_percentage ?? 0),
    };
  },
  getAttendanceTrends: async (
    filters?: AttendanceAnalyticsFilters,
  ): Promise<AttendanceTrendsResponse> => fetchAttendanceTrendsCanonical(filters),
  getAttendanceDistribution: async (
    filters?: AttendanceAnalyticsFilters,
  ): Promise<AttendanceDistributionResponse> => fetchAttendanceDistributionCanonical(filters),
  getWeeklyAttendance: async (
    filters?: AttendanceAnalyticsFilters,
  ): Promise<WeeklyAttendanceResponse> => fetchAttendanceWeeklyCanonical(filters),
  getAttendanceRateKPI: async (
    filters?: AttendanceAnalyticsFilters,
  ): Promise<AttendanceRateKPIResponse> => fetchAttendanceRateKPICanonical(filters),
};

export { createHoliday, updateHoliday, deleteHoliday, importHolidays, archiveHoliday, restoreHoliday, exportHolidays, getHolidayStatistics } from "./attendance/holidaysApi";

export default attendanceApi;
