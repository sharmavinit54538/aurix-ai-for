import { api } from "@/api";
import apiInstance from "@/api/apiInstance";
import { HolidayRecord, HolidayCreatePayload } from "./types";
import { extractListPayload, extractObjectPayload } from "./helpers";

// ─────────────────────────────────────────────────────────────
// 5. Holidays Management (Connects to /api/v1/calendar/holidays)
// ─────────────────────────────────────────────────────────────

/**
 * List holidays from backend.
 * Primary route: GET /api/v1/calendar/holidays.
 * Also aliases to GET /api/v1/attendance/holidays.
 */
export async function getHolidays(params?: { branch?: string; year?: number }): Promise<HolidayRecord[]> {
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
}

/**
 * Create a holiday entry.
 * Primary route: POST /api/v1/calendar/holidays.
 */
export async function createHoliday(data: HolidayCreatePayload): Promise<HolidayRecord> {
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
}

/**
 * Update an existing holiday.
 * Primary route: PUT /api/v1/calendar/holidays/:id.
 */
export async function updateHoliday(id: string, data: Partial<HolidayCreatePayload>): Promise<HolidayRecord> {
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
}

/**
 * Delete a holiday entry.
 * Primary route: DELETE /api/v1/calendar/holidays/:id.
 */
export async function deleteHoliday(id: string): Promise<{ success: boolean }> {
  try {
    await api.delete(`calendar/holidays/${id}`);
  } catch {
    await api.delete(`attendance/holidays/${id}`);
  }
  return { success: true };
}

/**
 * Bulk import holidays via CSV/Excel file or payload.
 */
export async function importHolidays(fileOrList: File | HolidayCreatePayload[]): Promise<{ importedCount: number }> {
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
      await createHoliday(h);
      count++;
    }
    return { importedCount: count };
  }
}
