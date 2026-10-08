import { api } from "@/api";
import { TodayAttendanceEmployee, AttendanceAnalyticsSummary } from "./types";
import { extractListPayload, extractObjectPayload } from "./helpers";

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
