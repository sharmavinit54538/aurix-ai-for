import { api } from "@/api";
import { RosterEntryRecord, RosterCreatePayload } from "./types";
import { extractListPayload, extractObjectPayload } from "./helpers";

// ─────────────────────────────────────────────────────────────
// 4. Rosters Management
// ─────────────────────────────────────────────────────────────

/**
 * List rotational team roster entries.
 */
export async function getRosters(params?: {
  dateFrom?: string;
  dateTo?: string;
  department?: string;
}): Promise<RosterEntryRecord[]> {
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
    workingHours: item.working_hours != null ? Number(item.working_hours) : (item.workingHours != null ? Number(item.workingHours) : null),
    breakTime: item.break_time || item.breakTime || "45 mins",
    location: item.location || "Office",
    manager: item.manager || item.manager_name || "Manager",
    status: item.status || "Approved",
  }));
}

/**
 * Create a roster entry.
 */
export async function createRoster(data: RosterCreatePayload): Promise<RosterEntryRecord> {
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
    workingHours: item.working_hours != null ? Number(item.working_hours) : (data.workingHours != null ? Number(data.workingHours) : null),
    breakTime: item.break_time || data.breakTime,
    location: item.location || data.location,
    manager: item.manager || data.manager,
    status: item.status || data.status,
  };
}

/**
 * Update a roster entry.
 */
export async function updateRoster(id: string, data: Partial<RosterCreatePayload>): Promise<RosterEntryRecord> {
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
    workingHours: item.working_hours != null ? Number(item.working_hours) : (data.workingHours != null ? Number(data.workingHours) : null),
    breakTime: item.break_time || data.breakTime || "",
    location: item.location || data.location || "",
    manager: item.manager || data.manager || "",
    status: item.status || data.status || "Approved",
  };
}

/**
 * Delete a roster entry.
 */
export async function deleteRoster(id: string): Promise<{ success: boolean }> {
  await api.delete(`attendance/rosters/${id}`);
  return { success: true };
}
