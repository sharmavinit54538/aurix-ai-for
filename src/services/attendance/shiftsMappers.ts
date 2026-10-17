import { z } from "zod";
import type {
  Shift,
  ShiftOption,
  ShiftAssignResult,
  ShiftChangeRequest,
  MyScheduleData,
  MyShiftInfo,
  MyTodayShift,
  MyUpcomingShift,
  MyShiftHistory,
  ShiftListResponse,
  ShiftEmployeesResponse,
  WeekDay,
  ShiftApiErrorCode,
} from "./types";
import { ApiContractError } from "./types";

const weekDaySchema = z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

const shiftSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  code: z.string().min(1),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_overnight: z.boolean(),
  duration_minutes: z.number().int().nonnegative(),
  work_hours: z.number().nonnegative(),
  grace_period_minutes: z.number().int().nonnegative(),
  break_duration_minutes: z.number().int().nonnegative(),
  night_shift: z.boolean(),
  night_premium_percent: z.number().int().min(0).max(100),
  working_days: z.array(weekDaySchema).min(1),
  is_active: z.boolean(),
  is_default: z.boolean(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  description: z.string(),
  assigned_employees_count: z.number().int().nonnegative(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

const shiftOptionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  code: z.string().min(1),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_overnight: z.boolean(),
});

const shiftAssignResultSchema = z.object({
  assigned_count: z.number().int().nonnegative(),
  skipped: z.array(
    z.object({
      employee_id: z.string().uuid(),
      reason: z.string(),
    })
  ),
  effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const shiftChangeRequestSchema = z.object({
  id: z.string().uuid(),
  employee_id: z.string().uuid().optional(),
  employee_name: z.string().optional(),
  current_shift_name: z.string().optional(),
  requested_shift_id: z.string().uuid(),
  requested_shift_name: z.string().min(1),
  effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(1),
  status: z.enum(["pending", "approved", "rejected", "cancelled"]),
  review_note: z.string().nullable().optional(),
  created_at: z.string().datetime(),
});

const myShiftInfoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  code: z.string().min(1),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_overnight: z.boolean(),
  is_off: z.boolean(),
  is_holiday: z.boolean(),
  holiday_name: z.string().nullable().optional(),
  source: z.enum(["roster", "assignment", "company_default", "fallback"]),
  grace_period_mins: z.number().int().nonnegative(),
  break_duration_mins: z.number().int().nonnegative(),
  night_shift: z.boolean(),
  night_premium_percent: z.number().int().min(0).max(100),
  working_days: z.array(weekDaySchema).min(1),
});

const myTodayShiftSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  day: z.string().min(1),
  shift_name: z.string().min(1),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_overnight: z.boolean(),
  is_off: z.boolean(),
  is_holiday: z.boolean(),
  holiday_name: z.string().nullable().optional(),
  source: z.enum(["roster", "assignment", "company_default", "fallback"]),
  checked_in: z.boolean(),
  checked_out: z.boolean(),
  check_in_time: z.string().datetime().nullable(),
  check_out_time: z.string().datetime().nullable(),
  working_hours: z.number().nullable(),
  is_late: z.boolean(),
  late_minutes: z.number().int().nonnegative(),
});

const myUpcomingShiftSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  day: z.string().min(1),
  shift_name: z.string().min(1),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_overnight: z.boolean(),
  is_off: z.boolean(),
  is_holiday: z.boolean(),
  holiday_name: z.string().nullable().optional(),
  source: z.enum(["roster", "assignment", "company_default", "fallback"]),
  working_hours: z.number().nullable(),
});

const myShiftHistorySchema = z.object({
  attendance_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  day: z.string().min(1),
  shift_name: z.string().min(1),
  scheduled_start: z.string().regex(/^\d{2}:\d{2}$/),
  scheduled_end: z.string().regex(/^\d{2}:\d{2}$/),
  check_in_time: z.string().datetime().nullable(),
  check_out_time: z.string().datetime().nullable(),
  working_hours: z.number().nullable(),
  overtime_hours: z.number().nullable(),
  status: z.enum(["Present", "Late", "Half Day", "Absent", "On Leave", "Off", "Holiday", "Auto Closed"]),
  is_late: z.boolean(),
  late_minutes: z.number().int().nonnegative(),
  is_early_checkout: z.boolean(),
  early_minutes: z.number().int().nonnegative(),
  auto_closed: z.boolean(),
});

const myScheduleDataSchema = z.object({
  has_assigned_shift: z.boolean(),
  timezone: z.string().min(1),
  employee: z.object({
    id: z.string().uuid(),
    employee_id: z.string().min(1),
    full_name: z.string().min(1),
    department: z.string().min(1),
    designation: z.string().min(1),
    branch: z.string().min(1),
  }),
  current_shift: myShiftInfoSchema.nullable(),
  today: myTodayShiftSchema.nullable(),
  upcoming: z.array(myUpcomingShiftSchema),
  history: z.array(myShiftHistorySchema),
});

const shiftListResponseSchema = z.object({
  items: z.array(shiftSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

const shiftEmployeesResponseSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      employee_id: z.string().uuid(),
      full_name: z.string().min(1),
      department: z.string().min(1),
      designation: z.string().min(1),
      effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
  ),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

function logParseError(context: string, payload: unknown, error: z.ZodError): never {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[shiftsMappers] ${context} - Contract validation failed:`, {
      payload,
      errors: error.flatten(),
    });
  }
  throw new ApiContractError(
    `API contract violation in ${context}: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`,
    payload,
    error.errors.map((e) => e.path.join("."))
  );
}

export function mapShift(data: unknown): Shift {
  const result = shiftSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapShift", data, result.error);
  }
  return result.data;
}

export function mapShiftOption(data: unknown): ShiftOption {
  const result = shiftOptionSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  const raw = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  return {
    id: String(raw.id || raw.code || raw.name || Math.random()),
    name: String(raw.name || "Shift"),
    code: String(raw.code || raw.name?.toString().slice(0, 3).toUpperCase() || "SHF"),
    start_time: String(raw.start_time || "09:30").slice(0, 5),
    end_time: String(raw.end_time || "18:30").slice(0, 5),
    is_overnight: Boolean(raw.is_overnight || raw.night_shift),
  };
}

export function mapShiftList(data: unknown): ShiftListResponse {
  const result = shiftListResponseSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapShiftList", data, result.error);
  }
  return result.data;
}

export function mapShiftAssignResult(data: unknown): ShiftAssignResult {
  const result = shiftAssignResultSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapShiftAssignResult", data, result.error);
  }
  return result.data;
}

export function mapShiftChangeRequest(data: unknown): ShiftChangeRequest {
  const result = shiftChangeRequestSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapShiftChangeRequest", data, result.error);
  }
  return result.data;
}

export function mapMySchedule(data: unknown): MyScheduleData {
  const result = myScheduleDataSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapMySchedule", data, result.error);
  }
  return result.data;
}

export function mapShiftEmployees(data: unknown): ShiftEmployeesResponse {
  const result = shiftEmployeesResponseSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapShiftEmployees", data, result.error);
  }
  return result.data;
}

export function mapMyShiftInfo(data: unknown): MyShiftInfo {
  const result = myShiftInfoSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapMyShiftInfo", data, result.error);
  }
  return result.data;
}

export function mapMyTodayShift(data: unknown): MyTodayShift {
  const result = myTodayShiftSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapMyTodayShift", data, result.error);
  }
  return result.data;
}

export function mapMyUpcomingShift(data: unknown): MyUpcomingShift {
  const result = myUpcomingShiftSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapMyUpcomingShift", data, result.error);
  }
  return result.data;
}

export function mapMyShiftHistory(data: unknown): MyShiftHistory {
  const result = myShiftHistorySchema.safeParse(data);
  if (!result.success) {
    logParseError("mapMyShiftHistory", data, result.error);
  }
  return result.data;
}

export const shiftCreatePayloadSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  code: z.string().min(2).max(20).trim().regex(/^[A-Z0-9_-]+$/),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  grace_period_minutes: z.number().int().min(0).max(120),
  break_duration_minutes: z.number().int().min(0).max(180),
  night_shift: z.boolean(),
  night_premium_percent: z.number().int().min(0).max(100),
  working_days: z.array(weekDaySchema).min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  description: z.string().max(300).optional(),
  is_active: z.boolean().optional(),
});

export const shiftUpdatePayloadSchema = shiftCreatePayloadSchema.partial();

export type ShiftCreatePayloadInput = z.infer<typeof shiftCreatePayloadSchema>;
export type ShiftUpdatePayloadInput = z.infer<typeof shiftUpdatePayloadSchema>;