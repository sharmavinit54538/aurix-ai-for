import { api } from "@/api";
import type {
  RosterEntryRecord,
  RosterCreatePayload,
} from "./types";
import { z } from "zod";

const rosterEntrySchema = z.object({
  id: z.string().uuid(),
  employee_id: z.string().uuid(),
  employee_name: z.string().min(1),
  department: z.string().min(1),
  designation: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  shift: z.string().min(1),
  shift_id: z.string().uuid().optional(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/),
  working_hours: z.number().nullable(),
  break_time: z.string().min(1),
  location: z.string().min(1),
  manager: z.string().min(1),
  status: z.enum(["Approved", "Pending", "Rejected"]),
});

const rosterListResponseSchema = z.object({
  items: z.array(rosterEntrySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

function logParseError(context: string, payload: unknown, error: z.ZodError): never {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[rostersApi] ${context} - Contract validation failed:`, {
      payload,
      errors: error.flatten(),
    });
  }
  throw new Error(
    `API contract violation in ${context}: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`
  );
}

function mapRosterEntry(item: unknown): RosterEntryRecord {
  const raw = item as Record<string, unknown>;
  // Support both camelCase (new) and snake_case (legacy) property names
  return {
    id: (raw.id as string) || "",
    employeeId: (raw.employeeId as string) || (raw.employee_id as string) || "",
    employeeName: (raw.employeeName as string) || (raw.employee_name as string) || "",
    department: (raw.department as string) || "",
    designation: (raw.designation as string) || "",
    date: (raw.date as string) || "",
    shift: (raw.shift as string) || "",
    shiftId: (raw.shiftId as string) || (raw.shift_id as string) || undefined,
    startTime: (raw.startTime as string) || (raw.start_time as string) || "",
    endTime: (raw.endTime as string) || (raw.end_time as string) || "",
    workingHours: (raw.workingHours as number | null) ?? (raw.working_hours as number | null) ?? null,
    breakTime: (raw.breakTime as string) || (raw.break_time as string) || "",
    location: (raw.location as string) || "",
    manager: (raw.manager as string) || "",
    status: (raw.status as "Approved" | "Pending" | "Rejected") || "Pending",
    // Preserve snake_case for backward compatibility
    employee_id: raw.employee_id as string | undefined,
    employee_name: raw.employee_name as string | undefined,
    shift_id: raw.shift_id as string | undefined,
    start_time: raw.start_time as string | undefined,
    end_time: raw.end_time as string | undefined,
    working_hours: raw.working_hours as number | null | undefined,
    break_time: raw.break_time as string | undefined,
  };
}

function mapRosterList(data: unknown) {
  const result = rosterListResponseSchema.safeParse(data);
  if (!result.success) {
    logParseError("mapRosterList", data, result.error);
  }
  return result.data;
}

function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snakeKey] = value;
  }
  return result;
}

// ─────────────────────────────────────────────────────────────
// 4. Rosters Management (Strict Contract Mapping)
// ─────────────────────────────────────────────────────────────

/**
 * List rotational team roster entries.
 * Query params: date_from, date_to, department, employee_id
 */
export async function getRosters(params?: {
  date_from?: string;
  date_to?: string;
  department?: string;
  employee_id?: string;
}): Promise<RosterEntryRecord[]> {
  const query = new URLSearchParams();
  if (params?.date_from) query.set("date_from", params.date_from);
  if (params?.date_to) query.set("date_to", params.date_to);
  if (params?.department) query.set("department", params.department);
  if (params?.employee_id) query.set("employee_id", params.employee_id);
  const qs = query.toString();

  const res = await api.get(`attendance/rosters${qs ? `?${qs}` : ""}`);
  const mapped = mapRosterList(res);
  return mapped.items.map(mapRosterEntry);
}

/**
 * Create a roster entry.
 * Only sends fields the client controls; server derives employee_name, department, designation, manager.
 */
export async function createRoster(data: RosterCreatePayload): Promise<RosterEntryRecord> {
  const body = toSnakeCase({
    employee_id: data.employeeId ?? data.employee_id,
    date: data.date,
    shift: data.shift,
    shift_id: data.shiftId ?? data.shift_id,
    start_time: data.startTime ?? data.start_time,
    end_time: data.endTime ?? data.end_time,
    working_hours: data.workingHours ?? data.working_hours,
    break_time: data.breakTime ?? data.break_time,
    location: data.location,
    status: data.status,
    recurring: data.recurring,
  });

  const res = await api.post("attendance/rosters", body);
  return mapRosterEntry((res as { data?: unknown })?.data ?? res);
}

/**
 * Update a roster entry.
 * Only sends fields that are provided (partial update).
 */
export async function updateRoster(
  id: string,
  data: Partial<RosterCreatePayload>
): Promise<RosterEntryRecord> {
  const body = toSnakeCase({
    employee_id: data.employeeId ?? data.employee_id,
    date: data.date,
    shift: data.shift,
    shift_id: data.shiftId ?? data.shift_id,
    start_time: data.startTime ?? data.start_time,
    end_time: data.endTime ?? data.end_time,
    working_hours: data.workingHours ?? data.working_hours,
    break_time: data.breakTime ?? data.break_time,
    location: data.location,
    status: data.status,
  });

  const res = await api.put(`attendance/rosters/${id}`, body);
  return mapRosterEntry((res as { data?: unknown })?.data ?? res);
}

/**
 * Delete a roster entry.
 */
export async function deleteRoster(id: string): Promise<{ success: boolean }> {
  await api.delete(`attendance/rosters/${id}`);
  return { success: true };
}