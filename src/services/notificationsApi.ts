export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | string;
  category?: string;
  is_read: boolean;
  read?: boolean;
  created_at: string;
  action_url?: string | null;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  unread_only?: boolean;
  category?: string;
  type?: string;
}

export function resetUnreadCountCircuitBreaker(): void {
  // No-op in standalone client mode
}

export function isUnreadCountCircuitBroken(): boolean {
  return false;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Payroll Cycle Ready",
    message: "Current month payroll run is validated and ready for review.",
    type: "info",
    category: "payroll",
    is_read: false,
    read: false,
    created_at: new Date().toISOString(),
    action_url: "/dashboard/payroll",
  },
];

export const getNotifications = async (_params?: NotificationListParams): Promise<{ items: NotificationItem[]; unread_count: number; total?: number }> => ({
  items: MOCK_NOTIFICATIONS,
  unread_count: 1,
  total: 1,
});

export const getUnreadCount = async (): Promise<{ unread_count: number; count: number }> => ({
  unread_count: 1,
  count: 1,
});

export const markAsRead = async (_id: string) => ({ success: true });
export const markAllAsRead = async () => ({ success: true });
export const deleteNotification = async (_id: string) => ({ success: true });

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
