import apiInstance from "@/api/apiInstance";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: "low" | "normal" | "high" | "urgent" | string;
  author_name: string;
  created_at: string;
  is_pinned?: boolean;
  acknowledged?: boolean;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  category?: string;
  priority?: string;
  is_pinned?: boolean;
  target_departments?: string[];
  target_roles?: string[];
}

export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput>;

export interface AnnouncementsListResult {
  items: AnnouncementItem[];
  total: number;
  page?: number;
  limit?: number;
}

export function extractValidationErrors(err: unknown): Record<string, string> {
  const data = (err as any)?.response?.data;
  const fieldErrors: Record<string, string> = {};
  if (data?.errors && typeof data.errors === "object") {
    for (const [k, v] of Object.entries(data.errors)) {
      fieldErrors[k] = Array.isArray(v) ? String(v[0]) : String(v);
    }
  }
  return fieldErrors;
}

export const getAnnouncements = async (
  params?: Record<string, unknown>,
): Promise<AnnouncementsListResult> => {
  const res = await apiInstance.get("/announcements", { params });
  const payload = res.data?.data ?? res.data;
  const items: AnnouncementItem[] = Array.isArray(payload)
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

export const getAnnouncementById = async (
  id: string,
): Promise<AnnouncementItem> => {
  const res = await apiInstance.get(`/announcements/${id}`);
  return res.data?.data ?? res.data;
};

export const createAnnouncement = async (
  data: Partial<AnnouncementItem> | CreateAnnouncementInput,
): Promise<AnnouncementItem> => {
  const res = await apiInstance.post("/announcements", data);
  return res.data?.data ?? res.data;
};

export const updateAnnouncement = async (
  id: string,
  data: Partial<AnnouncementItem> | UpdateAnnouncementInput,
): Promise<AnnouncementItem> => {
  const res = await apiInstance.put(`/announcements/${id}`, data);
  return res.data?.data ?? res.data;
};

export const deleteAnnouncement = async (id: string) => {
  const res = await apiInstance.delete(`/announcements/${id}`);
  return res.data?.data ?? res.data ?? { success: true };
};

export const acknowledgeAnnouncement = async (id: string) => {
  const res = await apiInstance.post(`/announcements/${id}/acknowledge`, {});
  return res.data?.data ?? res.data ?? { success: true };
};

export const announcementsApi = {
  getAnnouncements,
  list: getAnnouncements,
  getAnnouncementById,
  getById: getAnnouncementById,
  createAnnouncement,
  create: createAnnouncement,
  updateAnnouncement,
  update: updateAnnouncement,
  deleteAnnouncement,
  delete: deleteAnnouncement,
  acknowledgeAnnouncement,
  acknowledge: acknowledgeAnnouncement,
};

export default announcementsApi;
