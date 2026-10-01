/**
 * Notifications compatibility layer.
 * Re-exports the API client, TanStack Query hooks, and types.
 * LocalStorage demo state and INITIAL_NOTIFICATIONS have been permanently replaced.
 */
export * from "@/features/notifications";
export * from "@/services/notificationsApi";

export type { NotificationItem as AppNotification } from "@/services/notificationsApi";
