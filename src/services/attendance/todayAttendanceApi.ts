import { api } from "@/api";
import {
  TodayAttendanceEmployee,
  AttendanceAnalyticsSummary,
  AttendanceTrendsResponse,
  AttendanceDistributionResponse,
  WeeklyAttendanceResponse,
  AttendanceRateKPIResponse,
  AttendanceAnalyticsFilters,
} from "./types";
import { extractListPayload, extractObjectPayload } from "./helpers";

function buildQueryParams(filters?: AttendanceAnalyticsFilters): string {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append("start_date", filters.startDate);
  if (filters?.endDate) params.append("end_date", filters.endDate);
  if (filters?.departmentId) params.append("department_id", filters.departmentId);
  if (filters?.shiftId) params.append("shift_id", filters.shiftId);
  if (filters?.locationId) params.append("location_id", filters.locationId);
  if (filters?.viewMode) params.append("view_mode", filters.viewMode);
  return params.toString() ? `?${params.toString()}` : "";
}

// ─────────────────────────────────────────────────────────────
// 1. Attendance Hub & Today's Attendance
// ─────────────────────────────────────────────────────────────

/**
 * Fetch today's company-wide attendance logs.
 * Calls GET /api/v1/attendance/today.
 * If missing, tries GET /api/v1/attendance/face/company as backend fallback.
 */
export async function getTodayAttendance(dateStr?: string): Promise<TodayAttendanceEmployee[]> {
  const query = dateStr ? `?date=${encodeURIComponent(dateStr)}` : "";
  try {
    const res = await api.get(`attendance/today${query}`);
    const list = extractListPayload(res);
    return list.map((item: any) => ({
      id: item.id || item.employee_id || item._id,
      employeeId: item.employee_id || item.employeeId || item.id,
      fullName: item.full_name || item.employee_name || item.fullName || "Unknown",
      department: item.department || "General",
      designation: item.designation || "",
      avatarUrl: item.avatar_url || item.avatarUrl,
      status: (item.status?.toLowerCase() || (item.check_in_time ? "present" : "absent")) as any,
      checkInTime: item.check_in_time || item.checkInTime || null,
      checkOutTime: item.check_out_time || item.checkOutTime || null,
      workingHours: item.working_hours ?? item.workingHours ?? null,
      location: item.location || item.branch || "Office",
    }));
  } catch (err: any) {
    // If /attendance/today returns 404, fallback to live face company logs
    if (err?.status === 404) {
      try {
        const fallbackRes = await api.get("attendance/face/company?limit=100");
        const list = extractListPayload(fallbackRes);
        return list.map((item: any) => {
          let status: TodayAttendanceEmployee["status"] = "present";
          if (item.check_in_time) {
            const [hour] = new Date(item.check_in_time).toLocaleTimeString("en-GB").split(":");
            if (Number(hour) >= 10) status = "late";
          } else {
            status = "absent";
          }
          return {
            id: item.id || item.employee_id,
            employeeId: item.employee_id || item.id,
            fullName: item.employee_name || "Employee",
            department: item.department || "General",
            designation: item.designation || "",
            avatarUrl: item.face_image_url,
            status,
            checkInTime: item.check_in_time,
            checkOutTime: item.check_out_time,
            workingHours: item.working_hours,
            location: "Office",
          };
        });
      } catch {
        throw err;
      }
    }
    throw err;
  }
}

/**
 * Fetch attendance dashboard analytics summary.
 * Calls GET /api/v1/attendance/face/analytics.
 */
export async function getAttendanceAnalytics(): Promise<AttendanceAnalyticsSummary> {
  const res: any = await api.get("attendance/face/analytics");
  const data = extractObjectPayload<any>(res);
  return {
    totalEmployees:
      data.total_active_employees ??
      data.totalActiveEmployees ??
      data.total_employees ??
      data.totalEmployees ??
      0,
    present:
      data.checked_in_today ??
      data.checkedInToday ??
      data.present_today ??
      data.present ??
      0,
    late:
      data.late_check_ins_today ??
      data.lateCheckInsToday ??
      data.late_today ??
      data.late ??
      0,
    absent:
      data.absent_today ??
      data.absentToday ??
      data.absent ??
      0,
    onLeave:
      data.on_leave_today ??
      data.onLeaveToday ??
      data.on_leave ??
      data.onLeave ??
      0,
    onTimeRate:
      data.attendance_rate_percentage ??
      data.attendanceRatePercentage ??
      data.on_time_rate ??
      data.onTimeRate,
    averageWorkingHours:
      data.average_working_hours_today ??
      data.averageWorkingHoursToday ??
      data.average_working_hours ??
      data.averageWorkingHours,
    checkedOutToday:
      data.checked_out_today ??
      data.checkedOutToday ??
      0,
  };
}

/**
 * Fetch daily attendance trends over a date range.
 * Calls GET /api/v1/attendance/analytics/trends.
 */
export async function getAttendanceTrends(
  filters?: AttendanceAnalyticsFilters
): Promise<AttendanceTrendsResponse> {
  const query = buildQueryParams(filters);
  const res: any = await api.get(`attendance/analytics/trends${query}`);
  const data = extractObjectPayload<any>(res);
  return {
    trends: (data.trends || data.data || []).map((item: any) => ({
      date: item.date || item.day,
      present: item.present ?? item.present_count ?? 0,
      late: item.late ?? item.late_count ?? 0,
      absent: item.absent ?? item.absent_count ?? 0,
      onLeave: item.on_leave ?? item.onLeave ?? item.leave_count ?? 0,
      total: item.total ?? item.total_employees ?? 0,
    })),
    dateRange: {
      start: data.start_date || data.dateRange?.start || filters?.startDate || "",
      end: data.end_date || data.dateRange?.end || filters?.endDate || "",
    },
  };
}

/**
 * Fetch attendance distribution for a period.
 * Calls GET /api/v1/attendance/analytics/distribution.
 */
export async function getAttendanceDistribution(
  filters?: AttendanceAnalyticsFilters
): Promise<AttendanceDistributionResponse> {
  const query = buildQueryParams(filters);
  const res: any = await api.get(`attendance/analytics/distribution${query}`);
  const data = extractObjectPayload<any>(res);
  return {
    present: data.present ?? data.present_count ?? 0,
    late: data.late ?? data.late_count ?? 0,
    absent: data.absent ?? data.absent_count ?? 0,
    onLeave: data.on_leave ?? data.onLeave ?? data.leave_count ?? 0,
    total: data.total ?? data.total_employees ?? 0,
  };
}

/**
 * Fetch weekly/monthly attendance comparison.
 * Calls GET /api/v1/attendance/analytics/weekly.
 */
export async function getWeeklyAttendance(
  filters?: AttendanceAnalyticsFilters
): Promise<WeeklyAttendanceResponse> {
  const query = buildQueryParams(filters);
  const res: any = await api.get(`attendance/analytics/weekly${query}`);
  const data = extractObjectPayload<any>(res);
  return {
    weekly: (data.weekly || data.data || []).map((item: any) => ({
      day: item.day || item.name,
      date: item.date,
      present: item.present ?? item.present_count ?? 0,
      late: item.late ?? item.late_count ?? 0,
      absent: item.absent ?? item.absent_count ?? 0,
      onLeave: item.on_leave ?? item.onLeave ?? item.leave_count ?? 0,
      total: item.total ?? item.total_employees ?? 0,
    })),
    dateRange: {
      start: data.start_date || data.dateRange?.start || filters?.startDate || "",
      end: data.end_date || data.dateRange?.end || filters?.endDate || "",
    },
    viewMode: data.view_mode || filters?.viewMode || "week",
  };
}

/**
 * Fetch attendance rate KPI with trend comparison.
 * Calls GET /api/v1/attendance/analytics/rate.
 */
export async function getAttendanceRateKPI(
  filters?: AttendanceAnalyticsFilters
): Promise<AttendanceRateKPIResponse> {
  const query = buildQueryParams(filters);
  const res: any = await api.get(`attendance/analytics/rate${query}`);
  const data = extractObjectPayload<any>(res);
  const currentRate = data.current_rate ?? data.attendance_rate ?? data.rate ?? 0;
  const previousRate = data.previous_rate ?? data.prev_rate ?? null;
  const change = data.change_percentage_points ?? data.change ?? null;
  const trend =
    change === null
      ? "stable"
      : change > 0
        ? "up"
        : change < 0
          ? "down"
          : "stable";
  return {
    currentRate,
    previousRate,
    changePercentagePoints: change,
    trend,
    period: {
      start: data.period_start || data.period?.start || filters?.startDate || "",
      end: data.period_end || data.period?.end || filters?.endDate || "",
    },
    previousPeriod: data.previous_period
      ? {
          start: data.previous_period.start,
          end: data.previous_period.end,
        }
      : null,
  };
}
