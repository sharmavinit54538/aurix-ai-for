import { api } from "@/api";
import type {
  Shift,
  ShiftCreatePayload,
  ShiftAssignPayload,
  ShiftOption,
  ShiftAssignResult,
  ShiftChangeRequest,
  MyScheduleData,
  ShiftListResponse,
  ShiftEmployeesResponse,
  ListChangeRequestsParams,
  CreateChangeRequestPayload,
  ApproveChangeRequestPayload,
  RejectChangeRequestPayload,
  ShiftApiErrorCode,
} from "./types";
import {
  mapShift,
  mapShiftList,
  mapShiftOption,
  mapShiftAssignResult,
  mapShiftChangeRequest,
  mapMySchedule,
  mapShiftEmployees,
} from "./shiftsMappers";

function toSnakeCase(obj: Record<string, unknown> | object): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snakeKey] = value;
  }
  return result;
}

export async function getShifts(params?: {
  search?: string;
  is_active?: boolean;
  night_shift?: boolean;
  page?: number;
  limit?: number;
}): Promise<ShiftListResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.is_active !== undefined) query.set("is_active", String(params.is_active));
  if (params?.night_shift !== undefined) query.set("night_shift", String(params.night_shift));
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  const res = await api.get(`attendance/shifts${qs ? `?${qs}` : ""}`);
  return mapShiftList(res);
}

export async function getShiftOptions(): Promise<ShiftOption[]> {
  try {
    const res = await api.get("attendance/shifts/options");
    const data = res as { data?: unknown } | unknown[];
    const list = Array.isArray(data) ? data : (data as { data?: unknown })?.data ?? [];
    if (Array.isArray(list) && list.length > 0) {
      return (list as unknown[]).map(mapShiftOption);
    }
  } catch {
    // If options endpoint is not present, attempt attendance/shifts
  }

  try {
    const res = await api.get("attendance/shifts");
    const data = res as { data?: unknown } | unknown[];
    const rawItems = (data as { data?: { items?: unknown[] } })?.data?.items ?? (data as { items?: unknown[] })?.items ?? (Array.isArray(data) ? data : []);
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      return rawItems.map((s: any) => ({
        id: String(s.id || s.name),
        name: String(s.name || "Shift"),
        code: String(s.code || s.name?.slice(0, 3).toUpperCase() || "SHF"),
        start_time: String(s.start_time || "09:30").slice(0, 5),
        end_time: String(s.end_time || "18:30").slice(0, 5),
        is_overnight: Boolean(s.is_overnight || s.night_shift),
      }));
    }
  } catch {
    // Fallback to standard shifts
  }

  return [
    { id: "general", name: "General Shift", code: "GEN", start_time: "09:30", end_time: "18:30", is_overnight: false },
    { id: "morning", name: "Morning Shift", code: "MORN", start_time: "06:00", end_time: "15:00", is_overnight: false },
    { id: "evening", name: "Evening Shift", code: "EVE", start_time: "14:00", end_time: "23:00", is_overnight: false },
    { id: "night", name: "Night Shift", code: "NIGHT", start_time: "22:00", end_time: "07:00", is_overnight: true },
  ];
}

export async function createShift(payload: ShiftCreatePayload): Promise<Shift> {
  const body = toSnakeCase(payload as unknown as Record<string, unknown>);
  const res = await api.post("attendance/shifts", body);
  const data = res as { data?: unknown } | unknown;
  const item = (data as { data?: unknown })?.data ?? data;
  return mapShift(item);
}

export async function updateShift(id: string, payload: Partial<ShiftCreatePayload>): Promise<Shift> {
  const body = toSnakeCase(payload as unknown as Record<string, unknown>);
  const res = await api.put(`attendance/shifts/${id}`, body);
  const data = res as { data?: unknown } | unknown;
  const item = (data as { data?: unknown })?.data ?? data;
  return mapShift(item);
}

export async function deleteShift(
  id: string,
  options?: { reassignTo?: string }
): Promise<{ success: boolean; reassigned?: boolean }> {
  const query = new URLSearchParams();
  if (options?.reassignTo) query.set("reassign_to", options.reassignTo);
  const qs = query.toString();

  await api.delete(`attendance/shifts/${id}${qs ? `?${qs}` : ""}`);
  return { success: true, reassigned: !!options?.reassignTo };
}

export async function assignShift(
  shiftId: string,
  payload: ShiftAssignPayload
): Promise<ShiftAssignResult> {
  const body = toSnakeCase(payload as unknown as Record<string, unknown>);
  const res = await api.post(`attendance/shifts/${shiftId}/assign`, body);
  const data = res as { data?: unknown } | unknown;
  const item = (data as { data?: unknown })?.data ?? data;
  return mapShiftAssignResult(item);
}

export async function getShiftEmployees(
  shiftId: string,
  params?: { page?: number; limit?: number }
): Promise<ShiftEmployeesResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  const res = await api.get(`attendance/shifts/${shiftId}/employees${qs ? `?${qs}` : ""}`);
  return mapShiftEmployees(res);
}

export async function getMySchedule(params?: {
  days_ahead?: number;
  history_days?: number;
}): Promise<MyScheduleData> {
  const query = new URLSearchParams();
  if (params?.days_ahead) query.set("days_ahead", String(params.days_ahead));
  if (params?.history_days) query.set("history_days", String(params.history_days));
  const qs = query.toString();

  const res = await api.get(`attendance/shifts/me/schedule${qs ? `?${qs}` : ""}`);
  const data = res as { data?: unknown } | unknown;
  const item = (data as { data?: unknown })?.data ?? data;
  return mapMySchedule(item);
}

export async function getMyChangeRequests(): Promise<ShiftChangeRequest[]> {
  const res = await api.get("attendance/shifts/change-requests/mine");
  const data = res as { data?: unknown } | unknown[];
  const list = Array.isArray(data) ? data : (data as { data?: unknown })?.data ?? [];
  return (list as unknown[]).map(mapShiftChangeRequest);
}

export async function createChangeRequest(payload: CreateChangeRequestPayload): Promise<ShiftChangeRequest> {
  const body = toSnakeCase(payload as unknown as Record<string, unknown>);
  const res = await api.post("attendance/shifts/change-requests", body);
  const data = res as { data?: unknown } | unknown;
  const item = (data as { data?: unknown })?.data ?? data;
  return mapShiftChangeRequest(item);
}

export async function listChangeRequests(params?: ListChangeRequestsParams): Promise<{
  items: ShiftChangeRequest[];
  total: number;
  page: number;
  limit: number;
}> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  const res = await api.get(`attendance/shifts/change-requests${qs ? `?${qs}` : ""}`);
  const data = res as { data?: unknown } | unknown;
  const list = ((data as { data?: unknown })?.data as { items?: unknown[] } | undefined)?.items ?? [];
  return {
    items: list.map(mapShiftChangeRequest),
    total: ((data as { data?: unknown })?.data as { total?: number } | undefined)?.total ?? 0,
    page: ((data as { data?: unknown })?.data as { page?: number } | undefined)?.page ?? 1,
    limit: ((data as { data?: unknown })?.data as { limit?: number } | undefined)?.limit ?? 20,
  };
}

export async function approveChangeRequest(
  id: string,
  payload?: ApproveChangeRequestPayload
): Promise<ShiftChangeRequest> {
  const body = payload ? toSnakeCase(payload as unknown as Record<string, unknown>) : {};
  const res = await api.post(`attendance/shifts/change-requests/${id}/approve`, body);
  const data = res as { data?: unknown } | unknown;
  const item = (data as { data?: unknown })?.data ?? data;
  return mapShiftChangeRequest(item);
}

export async function rejectChangeRequest(
  id: string,
  payload: RejectChangeRequestPayload
): Promise<ShiftChangeRequest> {
  const body = toSnakeCase(payload as unknown as Record<string, unknown>);
  const res = await api.post(`attendance/shifts/change-requests/${id}/reject`, body);
  const data = res as { data?: unknown } | unknown;
  const item = (data as { data?: unknown })?.data ?? data;
  return mapShiftChangeRequest(item);
}

export async function cancelChangeRequest(id: string): Promise<ShiftChangeRequest> {
  const res = await api.post(`attendance/shifts/change-requests/${id}/cancel`);
  const data = res as { data?: unknown } | unknown;
  const item = (data as { data?: unknown })?.data ?? data;
  return mapShiftChangeRequest(item);
}