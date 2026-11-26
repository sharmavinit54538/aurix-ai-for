import apiInstance from "@/api/apiInstance";

export type AnnouncementPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type AnnouncementStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type AnnouncementVisibility = "ALL_EMPLOYEES" | "DEPARTMENT" | "BRANCH" | "ROLE" | "CUSTOM";

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: AnnouncementPriority;
  department: string | null;
  branch: string | null;
  visibility: AnnouncementVisibility;
  publish_date: string;
  expiry_date: string | null;
  is_pinned: boolean;
  status: AnnouncementStatus;
  created_by: string;
  created_at: string;
}

export interface AnnouncementDetail extends Announcement {
  author_name?: string;
}

export interface CreateAnnouncementInput {
  title: string;
  description: string;
  category?: string;
  priority?: AnnouncementPriority;
  department?: string | null;
  branch?: string | null;
  visibility?: AnnouncementVisibility;
  publish_date: string;
  expiry_date?: string | null;
  is_pinned?: boolean;
  status?: "DRAFT";
}

export interface UpdateAnnouncementInput {
  title?: string;
  description?: string;
  category?: string;
  priority?: AnnouncementPriority;
  department?: string | null;
  branch?: string | null;
  visibility?: AnnouncementVisibility;
  publish_date?: string;
  expiry_date?: string | null;
  is_pinned?: boolean;
}

export interface AnnouncementsListResult {
  items: Announcement[];
  total: number;
  page?: number;
  limit?: number;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export function extractValidationErrors(err: unknown): Record<string, string> {
  const data = (err as any)?.response?.data;
  const fieldErrors: Record<string, string> = {};
  if (data?.errors && typeof data.errors === "object") {
    for (const [k, v] of Object.entries(data.errors)) {
      fieldErrors[k] = Array.isArray(v) ? String(v[0]) : String(v);
    }
  } else if (data?.detail && Array.isArray(data.detail)) {
    for (const err of data.detail) {
      if (err.loc && err.loc.length > 1) {
        const field = err.loc[err.loc.length - 1];
        fieldErrors[field] = err.msg;
      }
    }
  } else if (data?.message) {
    fieldErrors.general = data.message;
  }
  return fieldErrors;
}

function unwrapData<T>(res: any): T {
  const payload = res.data?.data ?? res.data;
  if (payload && typeof payload === "object" && "success" in payload) {
    if (payload.success === false) {
      throw new Error(payload.message || "API request failed");
    }
    return payload.data as T;
  }
  return payload as T;
}

export const getAnnouncements = async (
  params?: Record<string, unknown>,
): Promise<AnnouncementsListResult> => {
  const res = await apiInstance.get("/announcements", { params });
  const payload = unwrapData<{ items: Announcement[]; total: number; page: number; limit: number }>(res);
  const items: Announcement[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : [];
  return {
    items,
    total: Number(payload?.total ?? items.length),
    page: payload?.page,
    limit: payload?.limit,
  };
};

export const getAnnouncement = async (
  id: string,
): Promise<AnnouncementDetail> => {
  const res = await apiInstance.get(`/announcements/${id}`);
  return unwrapData<AnnouncementDetail>(res);
};

export const getAnnouncementById = getAnnouncement;

export const createAnnouncement = async (
  data: CreateAnnouncementInput,
): Promise<Announcement> => {
  const res = await apiInstance.post("/announcements", data);
  return unwrapData<Announcement>(res);
};

export const updateAnnouncement = async (
  id: string,
  data: UpdateAnnouncementInput,
): Promise<Announcement> => {
  const res = await apiInstance.put(`/announcements/${id}`, data);
  return unwrapData<Announcement>(res);
};

export const deleteAnnouncement = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await apiInstance.delete(`/announcements/${id}`);
  return unwrapData<{ success: boolean; message: string }>(res);
};

export const publishAnnouncement = async (id: string): Promise<Announcement> => {
  const res = await apiInstance.patch(`/announcements/${id}/publish`);
  return unwrapData<Announcement>(res);
};

export const archiveAnnouncement = async (id: string): Promise<Announcement> => {
  const res = await apiInstance.patch(`/announcements/${id}/archive`);
  return unwrapData<Announcement>(res);
};

export const announcementsApi = {
  getAnnouncements,
  list: getAnnouncements,
  getAnnouncement,
  getAnnouncementById: getAnnouncement,
  getById: getAnnouncement,
  createAnnouncement,
  create: createAnnouncement,
  updateAnnouncement,
  update: updateAnnouncement,
  deleteAnnouncement,
  delete: deleteAnnouncement,
  publishAnnouncement,
  publish: publishAnnouncement,
  archiveAnnouncement,
  archive: archiveAnnouncement,
};

export default announcementsApi;