import { api } from "@/api";
import { Shift, ShiftCreatePayload, ShiftAssignPayload } from "./types";
import { extractListPayload, extractObjectPayload } from "./helpers";

// ─────────────────────────────────────────────────────────────
// 3. Shifts Management
// ─────────────────────────────────────────────────────────────

/**
 * List all configured work shifts.
 */
export async function getShifts(): Promise<Shift[]> {
  const res = await api.get("attendance/shifts");
  const list = extractListPayload(res);
  return list.map((item: any) => ({
    id: item.id || item._id,
    name: item.name || item.shift_name,
    code: item.code || item.shift_code || "SHIFT",
    startTime: item.start_time || item.startTime || "09:00",
    endTime: item.end_time || item.endTime || "18:00",
    workHours: item.work_hours != null ? Number(item.work_hours) : (item.workHours != null ? Number(item.workHours) : null),
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
}

/**
 * Create a new shift template.
 */
export async function createShift(data: ShiftCreatePayload): Promise<Shift> {
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
    workHours: item.work_hours != null ? Number(item.work_hours) : null,
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
}

/**
 * Update an existing shift.
 */
export async function updateShift(id: string, data: Partial<ShiftCreatePayload>): Promise<Shift> {
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
    workHours: item.work_hours != null ? Number(item.work_hours) : null,
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
}

/**
 * Assign shift to one or more employees.
 */
export async function assignShift(
  shiftId: string,
  payload: ShiftAssignPayload
): Promise<{ success: boolean; assignedCount: number }> {
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
}

/**
 * Delete a shift.
 */
export async function deleteShift(id: string): Promise<{ success: boolean }> {
  await api.delete(`attendance/shifts/${id}`);
  return { success: true };
}
