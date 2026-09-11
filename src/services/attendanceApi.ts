import { api } from "@/api";
import apiInstance from "@/api/apiInstance";

// ─────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────

export interface TodayAttendanceEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  designation?: string;
  avatarUrl?: string;
  status: "present" | "late" | "absent" | "leave";
  checkInTime?: string | null;
  checkOutTime?: string | null;
  workingHours?: number | null;
  location?: string;
}

export interface AttendanceAnalyticsSummary {
  totalEmployees: number;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  onTimeRate?: number;
  averageWorkingHours?: number;
}

export interface TodayPunchStatus {
  checkedIn: boolean;
  checkedOut: boolean;
  onBreak: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number | null;
  breakDurationMinutes?: number;
  activeSeconds?: number;
  message?: string;
  attendanceId?: string;
}

export interface CheckInPayload {
  latitude?: number | null;
  longitude?: number | null;
  deviceInfo?: string;
  ipAddress?: string;
  notes?: string;
  file?: Blob | File; // Captured photo if face verification used
}

export interface CheckOutPayload {
  latitude?: number | null;
  longitude?: number | null;
  deviceInfo?: string;
  ipAddress?: string;
  notes?: string;
  file?: Blob | File;
}

export interface BreakPayload {
  reason?: string;
  notes?: string;
}

export interface AttendancePunchResult {
  id: string;
  time: string;
  status: string;
  success: boolean;
  message?: string;
  isInsideGeofence?: boolean;
}

export interface TimelineEventItem {
  id: string;
  time: string;
  label: string;
  type: "checkin" | "checkout" | "break_start" | "break_end" | "regularization";
  notes?: string;
}

export interface GeofenceVerifyPayload {
  latitude: number;
  longitude: number;
  officeId?: string;
}

export interface GeofenceVerifyResult {
  isInside: boolean;
  distanceMeters?: number;
  officeName?: string;
  allowedRadiusMeters?: number;
}

export interface Shift {
  id: string;
  name: string;
  code: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "18:00"
  workHours: number; // e.g. 9
  gracePeriodMinutes: number; // e.g. 15
  breakDurationMinutes: number; // e.g. 60
  nightShift: boolean;
  nightPremiumPercent: number; // e.g. 15
  workingDays: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri"]
  assignedEmployeesCount?: number;
  isActive: boolean;
  color?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShiftCreatePayload {
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  breakDurationMinutes: number;
  nightShift: boolean;
  nightPremiumPercent: number;
  workingDays: string[];
  color?: string;
  description?: string;
  isActive?: boolean;
}

export interface ShiftAssignPayload {
  employeeIds: string[];
  effectiveDate: string;
  notes?: string;
}

export interface RosterEntryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  date: string; // YYYY-MM-DD
  shift: "Morning" | "Evening" | "Night" | "Off Day" | "Leave" | "Holiday" | "Training" | "WFH" | "Overtime";
  startTime: string;
  endTime: string;
  workingHours: number;
  breakTime: string;
  location: string;
  manager: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface RosterCreatePayload {
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  workingHours: number;
  breakTime: string;
  location: string;
  manager: string;
  status: "Approved" | "Pending" | "Rejected";
  recurring?: boolean;
}

export interface HolidayRecord {
  id: string;
  name: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: "Public" | "Company" | "Regional" | "Optional";
  country: string;
  state: string;
  office: string;
  department: string;
  status: "Active" | "Archived";
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  notes?: string;
  color?: string;
  recurring: boolean;
  everyYear: boolean;
  applyToAll: boolean;
}

export interface HolidayCreatePayload {
  name: string;
  description?: string;
  date: string;
  type: "Public" | "Company" | "Regional" | "Optional";
  country?: string;
  state?: string;
  office?: string;
  department?: string;
  color?: string;
  recurring?: boolean;
  everyYear?: boolean;
  applyToAll?: boolean;
  notes?: string;
}

// ─────────────────────────────────────────────────────────────
// Helper Extractors
// ─────────────────────────────────────────────────────────────

function extractListPayload(res: unknown): unknown[] {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];

  const root = res as Record<string, unknown>;
  const nested = root.data;

  if (Array.isArray(nested)) return nested;
  if (nested && typeof nested === "object") {
    const dataObj = nested as Record<string, unknown>;
    for (const key of ["items", "records", "rows", "employees", "shifts", "rosters", "holidays", "results", "data"]) {
      if (Array.isArray(dataObj[key])) return dataObj[key] as unknown[];
    }
  }

  for (const key of ["items", "records", "rows", "employees", "shifts", "rosters", "holidays", "results"]) {
    if (Array.isArray(root[key])) return root[key] as unknown[];
  }

  return [];
}

function extractObjectPayload<T = Record<string, unknown>>(res: unknown): T {
  if (!res || typeof res !== "object") return {} as T;
  const root = res as Record<string, unknown>;
  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    return root.data as T;
  }
  return root as unknown as T;
}

// ─────────────────────────────────────────────────────────────
// Centralized Attendance API Service
// ─────────────────────────────────────────────────────────────

export const attendanceApi = {
  // ───────────────────────────────────────────────────────────
  // 1. Attendance Hub & Today's Attendance
  // ───────────────────────────────────────────────────────────

  /**
   * Fetch today's company-wide attendance logs.
   * Calls GET /api/v1/attendance/today.
   * If missing, tries GET /api/v1/attendance/face/company as backend fallback.
   *
   * TODO (Backend): Ensure GET /api/v1/attendance/today returns:
   * { success: true, data: [ { id, employeeId, fullName, department, status, checkInTime, checkOutTime, workingHours } ] }
   */
  getTodayAttendance: async (dateStr?: string): Promise<TodayAttendanceEmployee[]> => {
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
  },

  /**
   * Fetch attendance dashboard analytics summary.
   * Calls GET /api/v1/attendance/face/analytics (or /attendance/analytics).
   */
  getAttendanceAnalytics: async (): Promise<AttendanceAnalyticsSummary> => {
    try {
      const res: any = await api.get("attendance/face/analytics");
      const data = extractObjectPayload<any>(res);
      return {
        totalEmployees: data.total_employees ?? data.totalEmployees ?? 0,
        present: data.present_today ?? data.present ?? 0,
        late: data.late_today ?? data.late ?? 0,
        absent: data.absent_today ?? data.absent ?? 0,
        onLeave: data.on_leave_today ?? data.onLeave ?? 0,
        onTimeRate: data.on_time_rate ?? data.onTimeRate,
        averageWorkingHours: data.average_working_hours ?? data.averageWorkingHours,
      };
    } catch {
      // Try alternate analytics endpoint
      const res: any = await api.get("attendance/analytics");
      const data = extractObjectPayload<any>(res);
      return {
        totalEmployees: data.total_employees ?? data.totalEmployees ?? 0,
        present: data.present_today ?? data.present ?? 0,
        late: data.late_today ?? data.late ?? 0,
        absent: data.absent_today ?? data.absent ?? 0,
        onLeave: data.on_leave_today ?? data.onLeave ?? 0,
        onTimeRate: data.on_time_rate ?? data.onTimeRate,
        averageWorkingHours: data.average_working_hours ?? data.averageWorkingHours,
      };
    }
  },

  // ───────────────────────────────────────────────────────────
  // 2. Check In / Check Out / Break / Geofence
  // ───────────────────────────────────────────────────────────

  /**
   * Get current authenticated employee's punch status for today.
   * Calls GET /api/v1/attendance/face/me (or /api/v1/attendance/today/me).
   */
  getMyTodayStatus: async (): Promise<TodayPunchStatus> => {
    try {
      const res: any = await api.get("attendance/face/me");
      const data = extractObjectPayload<any>(res);
      const checkedIn = Boolean(data.checked_in ?? data.checkedIn);
      const checkedOut = Boolean(data.checked_out ?? data.checkedOut);
      const onBreak = Boolean(data.on_break ?? data.onBreak);

      return {
        checkedIn,
        checkedOut,
        onBreak,
        checkInTime: data.check_in_time || data.checkInTime || null,
        checkOutTime: data.check_out_time || data.checkOutTime || null,
        workingHours: data.working_hours ?? data.workingHours ?? null,
        breakDurationMinutes: data.break_duration_minutes ?? data.breakDurationMinutes,
        message: data.message,
        attendanceId: data.attendance_id || data.id,
      };
    } catch (err: any) {
      if (err?.status === 404) {
        // Try alternate endpoint if face/me is unavailable
        const res: any = await api.get("attendance/today/me");
        const data = extractObjectPayload<any>(res);
        return {
          checkedIn: Boolean(data.checked_in ?? data.checkedIn),
          checkedOut: Boolean(data.checked_out ?? data.checkedOut),
          onBreak: Boolean(data.on_break ?? data.onBreak),
          checkInTime: data.check_in_time || data.checkInTime || null,
          checkOutTime: data.check_out_time || data.checkOutTime || null,
          workingHours: data.working_hours ?? data.workingHours ?? null,
          message: data.message,
        };
      }
      throw err;
    }
  },

  /**
   * Perform attendance check-in.
   * Sends coordinates and device info to backend.
   * Backend validates geofence and records time.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/checkin
   * Body: { latitude, longitude, device_info, ip_address, notes }
   * Response: { success: true, data: { id, time, status, is_inside_geofence } }
   */
  checkIn: async (payload: CheckInPayload): Promise<AttendancePunchResult> => {
    try {
      const res: any = await api.post("attendance/checkin", {
        latitude: payload.latitude,
        longitude: payload.longitude,
        device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"),
        ip_address: payload.ipAddress,
        notes: payload.notes,
      });
      const data = extractObjectPayload<any>(res);
      return {
        id: data.id || data.attendance_id || new Date().getTime().toString(),
        time: data.time || data.check_in_time || new Date().toISOString(),
        status: data.status || "checked-in",
        success: true,
        message: res.message || "Checked in successfully",
        isInsideGeofence: data.is_inside_geofence ?? true,
      };
    } catch (err: any) {
      // If /attendance/checkin returns 404, fallback to face check-in if photo exists
      if (err?.status === 404 && payload.file) {
        const formData = new FormData();
        formData.append("file", payload.file);
        if (payload.latitude != null) formData.append("latitude", payload.latitude.toString());
        if (payload.longitude != null) formData.append("longitude", payload.longitude.toString());
        if (payload.deviceInfo) formData.append("device_info", payload.deviceInfo);

        const res: any = await apiInstance.post("/attendance/face/check-in", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const data = extractObjectPayload<any>(res.data);
        return {
          id: data.id,
          time: data.check_in_time,
          status: "checked-in",
          success: true,
          message: "Checked in successfully via face recognition",
        };
      }
      throw err;
    }
  },

  /**
   * Perform attendance check-out.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/checkout
   * Body: { latitude, longitude, device_info, ip_address, notes }
   */
  checkOut: async (payload: CheckOutPayload): Promise<AttendancePunchResult> => {
    try {
      const res: any = await api.post("attendance/checkout", {
        latitude: payload.latitude,
        longitude: payload.longitude,
        device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"),
        ip_address: payload.ipAddress,
        notes: payload.notes,
      });
      const data = extractObjectPayload<any>(res);
      return {
        id: data.id || data.attendance_id || new Date().getTime().toString(),
        time: data.time || data.check_out_time || new Date().toISOString(),
        status: data.status || "checked-out",
        success: true,
        message: res.message || "Checked out successfully",
      };
    } catch (err: any) {
      if (err?.status === 404 && payload.file) {
        const formData = new FormData();
        formData.append("file", payload.file);
        if (payload.latitude != null) formData.append("latitude", payload.latitude.toString());
        if (payload.longitude != null) formData.append("longitude", payload.longitude.toString());

        const res: any = await apiInstance.post("/attendance/face/check-out", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const data = extractObjectPayload<any>(res.data);
        return {
          id: data.id,
          time: data.check_out_time,
          status: "checked-out",
          success: true,
        };
      }
      throw err;
    }
  },

  /**
   * Start employee break.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/break/start
   * Body: { reason?: string, notes?: string }
   */
  startBreak: async (payload?: BreakPayload): Promise<AttendancePunchResult> => {
    const res: any = await api.post("attendance/break/start", payload || {});
    const data = extractObjectPayload<any>(res);
    return {
      id: data.id || new Date().getTime().toString(),
      time: data.time || new Date().toISOString(),
      status: "on-break",
      success: true,
      message: res.message || "Break started",
    };
  },

  /**
   * End employee break.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/break/end
   */
  endBreak: async (): Promise<AttendancePunchResult> => {
    const res: any = await api.post("attendance/break/end", {});
    const data = extractObjectPayload<any>(res);
    return {
      id: data.id || new Date().getTime().toString(),
      time: data.time || new Date().toISOString(),
      status: "checked-in",
      success: true,
      message: res.message || "Break ended",
    };
  },

  /**
   * Fetch today's activity timeline.
   *
   * TODO (Backend): Endpoint GET /api/v1/attendance/timeline
   */
  getTimeline: async (): Promise<TimelineEventItem[]> => {
    try {
      const res = await api.get("attendance/timeline");
      const list = extractListPayload(res);
      return list.map((item: any) => ({
        id: item.id || item._id,
        time: item.time || item.created_at,
        label: item.label || item.event_name,
        type: item.type || "checkin",
        notes: item.notes,
      }));
    } catch (err: any) {
      if (err?.status === 404) {
        // Fallback: derive recent timeline from personal attendance history
        const histRes = await api.get("attendance/face/history?limit=1");
        const list = extractListPayload(histRes);
        const latest = list[0] as any;
        if (!latest) return [];

        const events: TimelineEventItem[] = [];
        if (latest.check_in_time) {
          events.push({
            id: `${latest.id}-in`,
            time: new Date(latest.check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
            label: "Checked In",
            type: "checkin",
          });
        }
        if (latest.check_out_time) {
          events.push({
            id: `${latest.id}-out`,
            time: new Date(latest.check_out_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
            label: "Checked Out",
            type: "checkout",
          });
        }
        return events;
      }
      throw err;
    }
  },

  /**
   * Backend geofence validation.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/geofence/verify
   * Body: { latitude, longitude, office_id? }
   */
  verifyGeofence: async (coords: GeofenceVerifyPayload): Promise<GeofenceVerifyResult> => {
    const res: any = await api.post("attendance/geofence/verify", {
      latitude: coords.latitude,
      longitude: coords.longitude,
      office_id: coords.officeId,
    });
    const data = extractObjectPayload<any>(res);
    return {
      isInside: Boolean(data.is_inside ?? data.isInside),
      distanceMeters: data.distance_meters ?? data.distanceMeters,
      officeName: data.office_name ?? data.officeName,
      allowedRadiusMeters: data.allowed_radius_meters ?? data.allowedRadiusMeters,
    };
  },

  // ───────────────────────────────────────────────────────────
  // 3. Shifts Management
  // ───────────────────────────────────────────────────────────

  /**
   * List all configured work shifts.
   *
   * TODO (Backend): Endpoint GET /api/v1/attendance/shifts
   */
  getShifts: async (): Promise<Shift[]> => {
    const res = await api.get("attendance/shifts");
    const list = extractListPayload(res);
    return list.map((item: any) => ({
      id: item.id || item._id,
      name: item.name || item.shift_name,
      code: item.code || item.shift_code || "SHIFT",
      startTime: item.start_time || item.startTime || "09:00",
      endTime: item.end_time || item.endTime || "18:00",
      workHours: Number(item.work_hours ?? item.workHours ?? 9),
      gracePeriodMinutes: Number(item.grace_period_minutes ?? item.gracePeriodMinutes ?? 15),
      breakDurationMinutes: Number(item.break_duration_minutes ?? item.breakDurationMinutes ?? 60),
      nightShift: Boolean(item.night_shift ?? item.nightShift ?? false),
      nightPremiumPercent: Number(item.night_premium_percent ?? item.nightPremiumPercent ?? 0),
      workingDays: Array.isArray(item.working_days) ? item.working_days : (item.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri"]),
      assignedEmployeesCount: item.assigned_employees_count ?? item.assignedEmployeesCount ?? 0,
      isActive: item.is_active ?? item.isActive ?? true,
      color: item.color || "#6366F1",
      description: item.description || "",
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  },

  /**
   * Create a new shift template.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/shifts
   */
  createShift: async (data: ShiftCreatePayload): Promise<Shift> => {
    const res: any = await api.post("attendance/shifts", {
      name: data.name,
      code: data.code,
      start_time: data.startTime,
      end_time: data.endTime,
      grace_period_minutes: data.gracePeriodMinutes,
      break_duration_minutes: data.breakDurationMinutes,
      night_shift: data.nightShift,
      night_premium_percent: data.nightPremiumPercent,
      working_days: data.workingDays,
      color: data.color,
      description: data.description,
      is_active: data.isActive ?? true,
    });
    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || item._id,
      name: item.name || data.name,
      code: item.code || data.code,
      startTime: item.start_time || data.startTime,
      endTime: item.end_time || data.endTime,
      workHours: Number(item.work_hours || 9),
      gracePeriodMinutes: Number(item.grace_period_minutes || data.gracePeriodMinutes),
      breakDurationMinutes: Number(item.break_duration_minutes || data.breakDurationMinutes),
      nightShift: Boolean(item.night_shift ?? data.nightShift),
      nightPremiumPercent: Number(item.night_premium_percent ?? data.nightPremiumPercent),
      workingDays: item.working_days || data.workingDays,
      assignedEmployeesCount: 0,
      isActive: item.is_active ?? true,
      color: item.color || data.color,
      description: item.description || data.description,
    };
  },

  /**
   * Update an existing shift.
   *
   * TODO (Backend): Endpoint PUT /api/v1/attendance/shifts/:id
   */
  updateShift: async (id: string, data: Partial<ShiftCreatePayload>): Promise<Shift> => {
    const res: any = await api.put(`attendance/shifts/${id}`, {
      name: data.name,
      code: data.code,
      start_time: data.startTime,
      end_time: data.endTime,
      grace_period_minutes: data.gracePeriodMinutes,
      break_duration_minutes: data.breakDurationMinutes,
      night_shift: data.nightShift,
      night_premium_percent: data.nightPremiumPercent,
      working_days: data.workingDays,
      color: data.color,
      description: data.description,
      is_active: data.isActive,
    });
    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || id,
      name: item.name || data.name || "",
      code: item.code || data.code || "",
      startTime: item.start_time || data.startTime || "",
      endTime: item.end_time || data.endTime || "",
      workHours: Number(item.work_hours || 9),
      gracePeriodMinutes: Number(item.grace_period_minutes || data.gracePeriodMinutes || 15),
      breakDurationMinutes: Number(item.break_duration_minutes || data.breakDurationMinutes || 60),
      nightShift: Boolean(item.night_shift ?? data.nightShift),
      nightPremiumPercent: Number(item.night_premium_percent ?? data.nightPremiumPercent ?? 0),
      workingDays: item.working_days || data.workingDays || [],
      assignedEmployeesCount: item.assigned_employees_count ?? 0,
      isActive: item.is_active ?? true,
      color: item.color || data.color,
      description: item.description || data.description,
    };
  },

  /**
   * Assign shift to one or more employees.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/shifts/:id/assign
   * Body: { employee_ids: string[], effective_date: string, notes?: string }
   */
  assignShift: async (shiftId: string, payload: ShiftAssignPayload): Promise<{ success: boolean; assignedCount: number }> => {
    const res: any = await api.post(`attendance/shifts/${shiftId}/assign`, {
      employee_ids: payload.employeeIds,
      effective_date: payload.effectiveDate,
      notes: payload.notes,
    });
    const data = extractObjectPayload<any>(res);
    return {
      success: true,
      assignedCount: data.assigned_count ?? payload.employeeIds.length,
    };
  },

  /**
   * Delete a shift.
   *
   * TODO (Backend): Endpoint DELETE /api/v1/attendance/shifts/:id
   */
  deleteShift: async (id: string): Promise<{ success: boolean }> => {
    await api.delete(`attendance/shifts/${id}`);
    return { success: true };
  },

  // ───────────────────────────────────────────────────────────
  // 4. Rosters Management
  // ───────────────────────────────────────────────────────────

  /**
   * List rotational team roster entries.
   *
   * TODO (Backend): Endpoint GET /api/v1/attendance/rosters
   * Query params: date_from, date_to, department, employee_id
   */
  getRosters: async (params?: { dateFrom?: string; dateTo?: string; department?: string }): Promise<RosterEntryRecord[]> => {
    const query = new URLSearchParams();
    if (params?.dateFrom) query.set("date_from", params.dateFrom);
    if (params?.dateTo) query.set("date_to", params.dateTo);
    if (params?.department) query.set("department", params.department);
    const qs = query.toString();

    const res = await api.get(`attendance/rosters${qs ? `?${qs}` : ""}`);
    const list = extractListPayload(res);
    return list.map((item: any) => ({
      id: item.id || item._id,
      employeeId: item.employee_id || item.employeeId,
      employeeName: item.employee_name || item.employeeName || "Employee",
      department: item.department || "General",
      designation: item.designation || "",
      date: item.date,
      shift: item.shift || "Morning",
      startTime: item.start_time || item.startTime || "08:00",
      endTime: item.end_time || item.endTime || "16:00",
      workingHours: Number(item.working_hours ?? item.workingHours ?? 8),
      breakTime: item.break_time || item.breakTime || "45 mins",
      location: item.location || "Office",
      manager: item.manager || item.manager_name || "Manager",
      status: item.status || "Approved",
    }));
  },

  /**
   * Create a roster entry.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/rosters
   */
  createRoster: async (data: RosterCreatePayload): Promise<RosterEntryRecord> => {
    const res: any = await api.post("attendance/rosters", {
      employee_id: data.employeeId,
      employee_name: data.employeeName,
      department: data.department,
      designation: data.designation,
      date: data.date,
      shift: data.shift,
      start_time: data.startTime,
      end_time: data.endTime,
      working_hours: data.workingHours,
      break_time: data.breakTime,
      location: data.location,
      manager: data.manager,
      status: data.status,
      recurring: data.recurring,
    });
    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || item._id,
      employeeId: item.employee_id || data.employeeId,
      employeeName: item.employee_name || data.employeeName,
      department: item.department || data.department,
      designation: item.designation || data.designation,
      date: item.date || data.date,
      shift: item.shift || data.shift as any,
      startTime: item.start_time || data.startTime,
      endTime: item.end_time || data.endTime,
      workingHours: Number(item.working_hours ?? data.workingHours),
      breakTime: item.break_time || data.breakTime,
      location: item.location || data.location,
      manager: item.manager || data.manager,
      status: item.status || data.status,
    };
  },

  /**
   * Update a roster entry.
   *
   * TODO (Backend): Endpoint PUT /api/v1/attendance/rosters/:id
   */
  updateRoster: async (id: string, data: Partial<RosterCreatePayload>): Promise<RosterEntryRecord> => {
    const res: any = await api.put(`attendance/rosters/${id}`, {
      employee_id: data.employeeId,
      employee_name: data.employeeName,
      department: data.department,
      designation: data.designation,
      date: data.date,
      shift: data.shift,
      start_time: data.startTime,
      end_time: data.endTime,
      working_hours: data.workingHours,
      break_time: data.breakTime,
      location: data.location,
      manager: data.manager,
      status: data.status,
    });
    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || id,
      employeeId: item.employee_id || data.employeeId || "",
      employeeName: item.employee_name || data.employeeName || "",
      department: item.department || data.department || "",
      designation: item.designation || data.designation || "",
      date: item.date || data.date || "",
      shift: item.shift || data.shift as any || "Morning",
      startTime: item.start_time || data.startTime || "",
      endTime: item.end_time || data.endTime || "",
      workingHours: Number(item.working_hours ?? data.workingHours ?? 8),
      breakTime: item.break_time || data.breakTime || "",
      location: item.location || data.location || "",
      manager: item.manager || data.manager || "",
      status: item.status || data.status || "Approved",
    };
  },

  /**
   * Delete a roster entry.
   *
   * TODO (Backend): Endpoint DELETE /api/v1/attendance/rosters/:id
   */
  deleteRoster: async (id: string): Promise<{ success: boolean }> => {
    await api.delete(`attendance/rosters/${id}`);
    return { success: true };
  },

  // ───────────────────────────────────────────────────────────
  // 5. Holidays Management (Connects to /api/v1/calendar/holidays)
  // ───────────────────────────────────────────────────────────

  /**
   * List holidays from backend.
   * Primary route: GET /api/v1/calendar/holidays (Existing on backend).
   * Also aliases to GET /api/v1/attendance/holidays.
   */
  getHolidays: async (params?: { branch?: string; year?: number }): Promise<HolidayRecord[]> => {
    const query = new URLSearchParams();
    if (params?.branch && params.branch !== "all") query.set("branch", params.branch);
    if (params?.year) query.set("year", params.year.toString());
    const qs = query.toString();

    let res: unknown;
    try {
      res = await api.get(`calendar/holidays${qs ? `?${qs}` : ""}`);
    } catch {
      // Fallback if attendance/holidays is mounted
      res = await api.get(`attendance/holidays${qs ? `?${qs}` : ""}`);
    }

    const list = extractListPayload(res);
    return list.map((item: any) => ({
      id: item.id || item._id,
      name: item.holiday_name || item.name,
      description: item.description || "",
      date: item.holiday_date || item.date,
      type: (item.holiday_type || item.type || "Public") as any,
      country: item.country || "USA",
      state: item.state || "All States",
      office: item.branch || item.office || "All Offices",
      department: item.department || "All Departments",
      status: (item.status || "Active") as any,
      createdBy: item.created_by || item.createdBy || "Admin",
      createdDate: item.created_at ? item.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      updatedDate: item.updated_at ? item.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
      notes: item.notes || "",
      color: item.color || "#3B82F6",
      recurring: Boolean(item.is_recurring ?? item.recurring),
      everyYear: Boolean(item.every_year ?? item.everyYear ?? true),
      applyToAll: Boolean(item.apply_to_all ?? item.applyToAll ?? true),
    }));
  },

  /**
   * Create a holiday entry.
   * Primary route: POST /api/v1/calendar/holidays.
   */
  createHoliday: async (data: HolidayCreatePayload): Promise<HolidayRecord> => {
    const payload = {
      holiday_name: data.name,
      holiday_date: data.date,
      holiday_type: data.type,
      branch: data.office || null,
      description: data.description || null,
      is_recurring: data.recurring ?? false,
    };

    let res: any;
    try {
      res = await api.post("calendar/holidays", payload);
    } catch {
      res = await api.post("attendance/holidays", {
        ...payload,
        name: data.name,
        date: data.date,
        type: data.type,
      });
    }

    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || item._id,
      name: item.holiday_name || data.name,
      description: item.description || data.description || "",
      date: item.holiday_date || data.date,
      type: (item.holiday_type || data.type) as any,
      country: data.country || "USA",
      state: data.state || "All States",
      office: item.branch || data.office || "All Offices",
      department: data.department || "All Departments",
      status: "Active",
      createdBy: "Current User",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
      notes: data.notes || "",
      color: data.color || "#3B82F6",
      recurring: Boolean(item.is_recurring ?? data.recurring),
      everyYear: Boolean(data.everyYear ?? true),
      applyToAll: Boolean(data.applyToAll ?? true),
    };
  },

  /**
   * Update an existing holiday.
   * Primary route: PUT /api/v1/calendar/holidays/:id.
   */
  updateHoliday: async (id: string, data: Partial<HolidayCreatePayload>): Promise<HolidayRecord> => {
    const payload: Record<string, unknown> = {};
    if (data.name) payload.holiday_name = data.name;
    if (data.date) payload.holiday_date = data.date;
    if (data.type) payload.holiday_type = data.type;
    if (data.office !== undefined) payload.branch = data.office;
    if (data.description !== undefined) payload.description = data.description;
    if (data.recurring !== undefined) payload.is_recurring = data.recurring;

    let res: any;
    try {
      res = await api.put(`calendar/holidays/${id}`, payload);
    } catch {
      res = await api.put(`attendance/holidays/${id}`, payload);
    }

    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || id,
      name: item.holiday_name || data.name || "",
      description: item.description || data.description || "",
      date: item.holiday_date || data.date || "",
      type: (item.holiday_type || data.type || "Public") as any,
      country: data.country || "USA",
      state: data.state || "All States",
      office: item.branch || data.office || "All Offices",
      department: data.department || "All Departments",
      status: "Active",
      createdBy: "Current User",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
      notes: data.notes || "",
      color: data.color || "#3B82F6",
      recurring: Boolean(item.is_recurring ?? data.recurring),
      everyYear: Boolean(data.everyYear ?? true),
      applyToAll: Boolean(data.applyToAll ?? true),
    };
  },

  /**
   * Delete a holiday entry.
   * Primary route: DELETE /api/v1/calendar/holidays/:id.
   */
  deleteHoliday: async (id: string): Promise<{ success: boolean }> => {
    try {
      await api.delete(`calendar/holidays/${id}`);
    } catch {
      await api.delete(`attendance/holidays/${id}`);
    }
    return { success: true };
  },

  /**
   * Bulk import holidays via CSV/Excel file or payload.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/holidays/import (or /calendar/holidays/import)
   * Accepts multipart/form-data with file or JSON list of holidays.
   */
  importHolidays: async (fileOrList: File | HolidayCreatePayload[]): Promise<{ importedCount: number }> => {
    if (fileOrList instanceof File) {
      const formData = new FormData();
      formData.append("file", fileOrList);
      try {
        const res: any = await apiInstance.post("/calendar/holidays/import", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const data = extractObjectPayload<any>(res.data);
        return { importedCount: data.imported_count ?? 1 };
      } catch (err: any) {
        if (err?.response?.status === 404) {
          const res: any = await apiInstance.post("/attendance/holidays/import", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const data = extractObjectPayload<any>(res.data);
          return { importedCount: data.imported_count ?? 1 };
        }
        throw err;
      }
    } else {
      // List of holiday payloads: persist via sequential creates
      let count = 0;
      for (const h of fileOrList) {
        await attendanceApi.createHoliday(h);
        count++;
      }
      return { importedCount: count };
    }
  },
};

export default attendanceApi;
