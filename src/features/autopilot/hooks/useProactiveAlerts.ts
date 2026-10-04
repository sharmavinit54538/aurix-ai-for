import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { parseApiError } from "@/api/utils";
import { usePoller } from "@/hooks/usePoller";
import { autopilotApi } from "../services/autopilotApi";
import type {
  AlertCategory,
  AlertSeverity,
  AlertStatus,
  AutopilotAlert,
} from "../types";

export function useProactiveAlerts() {
  const [alerts, setAlerts] = useState<AutopilotAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | "all">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | "all">("all");

  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const data = await autopilotApi.getAlerts({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        severity: selectedSeverity !== "all" ? selectedSeverity : undefined,
      });
      setAlerts(Array.isArray(data) ? data : (data as { items?: AutopilotAlert[] })?.items || []);
      setBackendUnavailable(false);
    } catch (err: unknown) {
      const { status, message: msg } = parseApiError(err, "Failed to load proactive alerts");
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSeverity]);

  // Initial load
  useEffect(() => {
    void fetchAlerts();
  }, [fetchAlerts]);

  // Live polling every 20s
  usePoller(fetchAlerts, { intervalMs: 20000 });

  const acknowledgeAlert = useCallback(
    async (id: string): Promise<boolean> => {
      // Optimistic update
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "acknowledged" as AlertStatus } : a)),
      );

      try {
        await autopilotApi.acknowledgeAlert(id);
        toast.success("Alert acknowledged");
        return true;
      } catch (err: unknown) {
        // Rollback
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "active" as AlertStatus } : a)),
        );
        const { status, message: msg } = parseApiError(err, "Failed to acknowledge alert");
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          toast.error(msg);
        }
        return false;
      }
    },
    [],
  );

  const snoozeAlert = useCallback(
    async (id: string, hours: number): Promise<boolean> => {
      const snoozeUntil = new Date(Date.now() + hours * 3600000).toISOString();

      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "snoozed" as AlertStatus, snoozedUntil: snoozeUntil }
            : a,
        ),
      );

      try {
        await autopilotApi.snoozeAlert(id, snoozeUntil);
        toast.success(`Alert snoozed for ${hours} hours`);
        return true;
      } catch (err: unknown) {
        // Rollback
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "active" as AlertStatus } : a)),
        );
        const { status, message: msg } = parseApiError(err, "Failed to snooze alert");
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          toast.error(msg);
        }
        return false;
      }
    },
    [],
  );

  const createTaskFromAlert = useCallback(
    async (id: string, taskTitle: string): Promise<boolean> => {
      try {
        const res = await autopilotApi.createAlertTask(id, {
          title: taskTitle.trim(),
        });
        setAlerts((prev) =>
          prev.map((a) =>
            a.id === id
              ? { ...a, status: "acknowledged" as AlertStatus, taskId: res.taskId || `task-${Date.now()}` }
              : a,
          ),
        );
        toast.success(`Action task created: ${taskTitle}`);
        return true;
      } catch (err: unknown) {
        const { status, message: msg } = parseApiError(err, "Failed to create task");
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          toast.error(msg);
        }
        return false;
      }
    },
    [],
  );

  const activeCount = alerts.filter((a) => a.status === "active").length;

  return {
    alerts,
    loading,
    error,
    backendUnavailable,
    selectedCategory,
    selectedSeverity,
    activeCount,
    setSelectedCategory,
    setSelectedSeverity,
    refetch: fetchAlerts,
    acknowledgeAlert,
    snoozeAlert,
    createTaskFromAlert,
  };
}
