import { useState, useEffect, useCallback } from "react";

export type NotificationCategory = "approval" | "alert" | "recruitment" | "system" | "payroll";
export type NotificationSeverity = "info" | "warning" | "success" | "critical";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  message: string;
  time: string;
  createdAt: number;
  read: boolean;
  link?: string;
  actionText?: string;
}

const STORAGE_KEY = "ofc360_notifications_state_v1";

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    category: "approval",
    severity: "warning",
    title: "Offboarding Clearance Pending",
    message: "2 executive offboarding requests require management clearance & asset handoff sign-off.",
    time: "5m ago",
    createdAt: Date.now() - 5 * 60 * 1000,
    read: false,
    link: "/dashboard/exit",
    actionText: "Review Exits",
  },
  {
    id: "notif-2",
    category: "recruitment",
    severity: "info",
    title: "3 New Candidate Applications",
    message: "New applicants submitted profiles for the Full Stack Developer role via QR apply link.",
    time: "18m ago",
    createdAt: Date.now() - 18 * 60 * 1000,
    read: false,
    link: "/dashboard/recruitment/jobs",
    actionText: "View Candidates",
  },
  {
    id: "notif-3",
    category: "payroll",
    severity: "info",
    title: "Monthly Payroll Processing Ready",
    message: "Payroll overview calculations generated. Review preliminary disbursements before cutoff.",
    time: "1h ago",
    createdAt: Date.now() - 60 * 60 * 1000,
    read: false,
    link: "/dashboard/payroll",
    actionText: "Check Payroll",
  },
  {
    id: "notif-4",
    category: "system",
    severity: "success",
    title: "Security & MFA Compliance Audit",
    message: "All executive and administrative logins verified with two-factor authentication active.",
    time: "3h ago",
    createdAt: Date.now() - 3 * 3600 * 1000,
    read: true,
    link: "/dashboard/settings",
    actionText: "Security Details",
  },
  {
    id: "notif-5",
    category: "alert",
    severity: "warning",
    title: "Leave Approvals Queued",
    message: "4 department leave requests awaiting supervisor approvals for the upcoming cycle.",
    time: "5h ago",
    createdAt: Date.now() - 5 * 3600 * 1000,
    read: true,
    link: "/dashboard/leaves",
    actionText: "Manage Leaves",
  },
  {
    id: "notif-6",
    category: "system",
    severity: "info",
    title: "Executive Directory Synced",
    message: "Organization executive hierarchy and team records updated across the active workspace.",
    time: "Yesterday",
    createdAt: Date.now() - 24 * 3600 * 1000,
    read: true,
    link: "/dashboard/people",
    actionText: "View People",
  },
];

function loadSavedNotifications(): AppNotification[] {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_NOTIFICATIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

function saveNotifications(items: AppNotification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("ofc360_notifications_updated"));
  } catch {
    // Ignore storage quota errors
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(loadSavedNotifications);

  const refresh = useCallback(() => {
    setNotifications(loadSavedNotifications());
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(loadSavedNotifications());
    };
    window.addEventListener("ofc360_notifications_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("ofc360_notifications_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveNotifications([]);
  }, []);

  const resetToDefaults = useCallback(() => {
    setNotifications(INITIAL_NOTIFICATIONS);
    saveNotifications(INITIAL_NOTIFICATIONS);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    resetToDefaults,
    refresh,
  };
}
