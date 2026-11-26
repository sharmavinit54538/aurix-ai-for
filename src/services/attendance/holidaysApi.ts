import { api } from "@/api";
import type {
  HolidayRecord,
  HolidayCreatePayload,
  HolidayUpdatePayload,
} from "./types";
import { extractListPayload, extractObjectPayload } from "./helpers";

// ─────────────────────────────────────────────────────────────
// 5. Holidays Management (Connects to /api/v1/calendar/holidays)
// ─────────────────────────────────────────────────────────────

/**
 * List holidays from backend.
 * Primary route: GET /api/v1/calendar/holidays.
 */
export async function getHolidays(params?: { branch?: string; year?: number }): Promise<HolidayRecord[]> {
  const query = new URLSearchParams();
  if (params?.branch && params.branch !== "all") query.set("branch", params.branch);
  if (params?.year) query.set("year", params.year.toString());
  const qs = query.toString();

  const res = await api.get(`calendar/holidays${qs ? `?${qs}` : ""}`);
  const data = extractListPayload<{ items: any[] }>(res);
  const items = data?.items ?? [];

  return items.map((item: any) => ({
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
export async function createHoliday(data: {
  name: string;
  description: string;
  date: string;
  type: "Public" | "Company" | "Regional" | "Optional";
  country: string;
  state: string;
  office: string;
  department: string;
  color: string;
  recurring: boolean;
  everyYear: boolean;
  applyToAll: boolean;
  notes: string;
}): Promise<any> {
  const res = await api.post("calendar/holidays", data);
  const item = extractObjectPayload<any>(res);
  return {
    id: item.id || item._id,
    name: item.name || data.name,
    description: item.description || data.description || "",
    date: item.date || data.date,
    type: (item.type || data.type) as any,
    country: data.country,
    state: data.state,
    office: data.office,
    department: data.department,
    status: "Active",
    createdBy: "Current User",
    createdDate: new Date().toISOString().split("T")[0],
    updatedDate: new Date().toISOString().split("T")[0],
    notes: data.notes || "",
    color: data.color || "#3B82F6",
    recurring: data.recurring,
    everyYear: data.everyYear,
    applyToAll: data.applyToAll,
  };
}

/**
 * Update an existing holiday.
 * Primary route: PUT /api/v1/calendar/holidays/:id.
 */
export async function updateHoliday(id: string, data: {
  name?: string;
  description?: string;
  date?: string;
  type?: "Public" | "Company" | "Regional" | "Optional";
  country?: string;
  state?: string;
  office?: string;
  department?: string;
  color?: string;
  recurring?: boolean;
  everyYear?: boolean;
  applyToAll?: boolean;
  notes?: string;
}): Promise<any> {
  const res = await api.put(`calendar/holidays/${id}`, data);
  const item = extractObjectPayload<any>(res);
  return {
    id: item.id || id,
    name: item.name || data.name || "",
    description: item.description || data.description || "",
    date: item.date || data.date || "",
    type: (item.type || data.type || "Public") as any,
    country: data.country,
    state: data.state,
    office: data.office,
    department: data.department,
    status: "Active",
    createdBy: "Current User",
    createdDate: new Date().toISOString().split("T")[0],
    updatedDate: new Date().toISOString().split("T")[0],
    notes: data.notes || "",
    color: data.color || "#3B82F6",
    recurring: data.recurring,
    everyYear: data.everyYear,
    applyToAll: data.applyToAll,
  };
}

/**
 * Delete a holiday entry.
 * Primary route: DELETE /api/v1/calendar/holidays/:id.
 */
export async function deleteHoliday(id: string): Promise<{ success: boolean }> {
  await api.delete(`calendar/holidays/${id}`);
  return { success: true };
}

/**
 * Archive a holiday.
 * PATCH /api/v1/calendar/holidays/:id/archive
 */
export async function archiveHoliday(id: string): Promise<any> {
  const res = await api.patch(`calendar/holidays/${id}/archive`);
  return extractObjectPayload<any>(res);
}

/**
 * Restore an archived holiday.
 * PATCH /api/v1/calendar/holidays/:id/restore
 */
export async function restoreHoliday(id: string): Promise<any> {
  const res = await api.patch(`calendar/holidays/${id}/restore`);
  return extractObjectPayload<any>(res);
}

/**
 * Bulk import holidays via CSV/Excel file or payload.
 */
export async function importHolidays(fileOrList: File | { name: string; description: string; date: string; type: "Public" | "Company" | "Regional" | "Optional"; country: string; state: string; office: string; department: string; color: string; recurring: boolean; everyYear: boolean; applyToAll: boolean; notes: string }[]): Promise<{ importedCount: number }> {
  if (fileOrList instanceof File) {
    const formData = new FormData();
    formData.append("file", fileOrList);
    try {
      const res = await api.post("calendar/holidays/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = extractObjectPayload<any>(res);
      return { importedCount: data.imported_count ?? 1 };
    } catch (err: any) {
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

/**
 * Export holidays to CSV.
 */
export async function exportHolidays(params?: { branch?: string; year?: number }): Promise<Blob> {
  const query = new URLSearchParams();
  if (params?.branch && params.branch !== "all") query.set("branch", params.branch);
  if (params?.year) query.set("year", params.year.toString());
  const qs = query.toString();

  const res = await api.get(`calendar/holidays/export${qs ? `?${qs}` : ""}`, {
    responseType: "blob",
  });
  return res.data as Blob;
}

/**
 * Get holiday statistics.
 */
export async function getHolidayStatistics(year?: number): Promise<{
  total: number;
  active: number;
  archived: number;
  public: number;
  company: number;
  regional: number;
  optional: number;
  upcoming: number;
}> {
  const query = new URLSearchParams();
  if (year) query.set("year", year.toString());
  const qs = query.toString();

  const res = await api.get(`calendar/holidays/statistics${qs ? `?${qs}` : ""}`);
  return extractObjectPayload<any>(res);
}