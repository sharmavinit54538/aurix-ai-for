import apiInstance from "@/api/apiInstance";

export type NotificationCategory =
  | "recruitment"
  | "payroll"
  | "leave"
  | "attendance"
  | "documents"
  | "assets"
  | "onboarding_exit"
  | "approvals"
  | "security"
  | "system"
  | "ai_insights"
  | string;

export type NotificationPriority = "low" | "medium" | "high" | "critical";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | string;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  is_read: boolean;
  read?: boolean;
  readAt?: string | null;
  created_at: string;
  action_url?: string | null;
  link?: string | null;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  unread_only?: boolean;
  category?: string;
  type?: string;
}

let unreadCountCircuitBroken = false;

export function resetUnreadCountCircuitBreaker(): void {
  unreadCountCircuitBroken = false;
}

export function isUnreadCountCircuitBroken(): boolean {
  return unreadCountCircuitBroken;
}

export const getNotifications = async (
  params?: NotificationListParams,
): Promise<{
  items: NotificationItem[];
  unread_count: number;
  total?: number;
}> => {
  const res = await apiInstance.get("/notifications", { params });
  const payload = res.data?.data ?? res.data;
  const items: NotificationItem[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : [];
  const unreadCount = Number(
    payload?.unread_count ??
      items.filter((i) => !i.is_read && !i.read).length,
  );
  return {
    items,
    unread_count: unreadCount,
    total: Number(payload?.total ?? items.length),
  };
};

export const getUnreadCount = async (): Promise<{
  unread_count: number;
  count: number;
}> => {
  if (unreadCountCircuitBroken) {
    throw new Error("Unread count endpoint circuit broken");
  }
  try {
    const res = await apiInstance.get("/notifications/unread-count");
    const payload = res.data?.data ?? res.data ?? {};
    const count = Number(
      payload.unread_count ?? payload.totalUnread ?? payload.count ?? 0,
    );
    return {
      unread_count: count,
      count,
    };
  } catch (err: any) {
    const status = err?.response?.status ?? err?.status;
    if (status === 404 || status === 501) {
      unreadCountCircuitBroken = true;
      throw new Error("Unread count endpoint unavailable (circuit broken)");
    }
    throw err;
  }
};

export const markAsRead = async (id: string) => {
  const res = await apiInstance.post(`/notifications/${id}/read`, {});
  return res.data?.data ?? res.data ?? { success: true };
};

export const markAllAsRead = async () => {
  const res = await apiInstance.post("/notifications/read-all", {});
  return res.data?.data ?? res.data ?? { success: true };
};

export const deleteNotification = async (id: string) => {
  const res = await apiInstance.delete(`/notifications/${id}`);
  return res.data?.data ?? res.data ?? { success: true };
};

export const notificationsApi = {
  getNotifications,
  list: getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  resetUnreadCountCircuitBreaker,
};

export default notificationsApi;
