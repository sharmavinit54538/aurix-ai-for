import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
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
      setAlerts(data.items);
      setBackendUnavailable(false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
      } else {
        setError(err?.response?.data?.message || "Failed to load proactive alerts");
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
  usePoller(fetchAlerts, 20000);

  const acknowledgeAlert = useCallback(
    async (id: string): Promise<boolean> => {
      // Optimistic update
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "acknowledged" as AlertStatus } : a)),
      );

      try {
        await autopilotApi.acknowledgeAlert(id, { action: "ack" });
        toast.success("Alert acknowledged");
        return true;
      } catch (err: any) {
        // Rollback
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "active" as AlertStatus } : a)),
        );
        const status = err?.response?.status;
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          toast.error(err?.response?.data?.message || "Failed to acknowledge alert");
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
        await autopilotApi.acknowledgeAlert(id, {
          action: "snooze",
          snooze_until: snoozeUntil,
        });
        toast.success(`Alert snoozed for ${hours} hours`);
        return true;
      } catch (err: any) {
        // Rollback
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "active" as AlertStatus } : a)),
        );
        const status = err?.response?.status;
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          toast.error(err?.response?.data?.message || "Failed to snooze alert");
        }
        return false;
      }
    },
    [],
  );

  const createTaskFromAlert = useCallback(
    async (id: string, taskTitle: string): Promise<boolean> => {
      try {
        const res = await autopilotApi.acknowledgeAlert(id, {
          action: "create_task",
          task_title: taskTitle.trim(),
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
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          toast.error(err?.response?.data?.message || "Failed to create task");
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
