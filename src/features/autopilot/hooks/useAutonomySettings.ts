import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { autopilotApi } from "../services/autopilotApi";
import type { AutonomySettings } from "../types";
import { mapAutonomySettingsFromBackend } from "../utils/mappers";

export interface UseAutonomySettingsReturn {
  settings: AutonomySettings;
  loading: boolean;
  saving: boolean;
  error: string | null;
  backendUnavailable: boolean;
  refetch: () => Promise<void>;
  updateWorkflowLevel: (workflowId: string, level: any) => void;
  updateWorkflowThresholds: (workflowId: string, thresholds: Record<string, any>) => void;
  saveSettings: () => Promise<boolean>;
  resetToDefaults: () => void;
}

export function useAutonomySettings(): UseAutonomySettingsReturn {
  const [settings, setSettings] = useState<AutonomySettings>(() =>
    mapAutonomySettingsFromBackend({}),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await autopilotApi.getSettings();
      setSettings(data);
      setBackendUnavailable(false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        setError(null);
      } else {
        const msg = err?.response?.data?.message || err?.message || "Failed to load autonomy settings";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const updateWorkflowLevel = useCallback((workflowId: string, level: any) => {
    setSettings((prev) => {
      const existing = prev.workflows[workflowId as keyof typeof prev.workflows];
      if (!existing) return prev;
      return {
        ...prev,
        workflows: {
          ...prev.workflows,
          [workflowId]: {
            ...existing,
            level,
          },
        },
      };
    });
  }, []);

  const updateWorkflowThresholds = useCallback(
    (workflowId: string, partialThresholds: Record<string, any>) => {
      setSettings((prev) => {
        const existing = prev.workflows[workflowId as keyof typeof prev.workflows];
        if (!existing) return prev;
        return {
          ...prev,
          workflows: {
            ...prev.workflows,
            [workflowId]: {
              ...existing,
              thresholds: {
                ...existing.thresholds,
                ...partialThresholds,
              },
            },
          },
        };
      });
    },
    [],
  );

  const saveSettings = useCallback(async (): Promise<boolean> => {
    setSaving(true);
    try {
      const updated = await autopilotApi.updateSettings(settings);
      setSettings(updated);
      toast.success("Autonomy settings saved successfully");
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        toast.error("Feature unavailable — backend pending");
        setBackendUnavailable(true);
      } else {
        const msg = err?.response?.data?.message || err?.message || "Failed to save autonomy settings";
        toast.error(msg);
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const resetToDefaults = useCallback(() => {
    setSettings(mapAutonomySettingsFromBackend({}));
    toast.info("Settings reset to recommended defaults");
  }, []);

  return {
    settings,
    loading,
    saving,
    error,
    backendUnavailable,
    refetch: fetchSettings,
    updateWorkflowLevel,
    updateWorkflowThresholds,
    saveSettings,
    resetToDefaults,
  };
}
