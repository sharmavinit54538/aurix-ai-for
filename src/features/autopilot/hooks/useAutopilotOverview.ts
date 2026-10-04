import { useState, useCallback, useEffect } from "react";
import { usePoller } from "@/hooks/usePoller";
import { autopilotApi } from "../services/autopilotApi";
import type { AutopilotOverview } from "../types";

export function useAutopilotOverview() {
  const [overview, setOverview] = useState<AutopilotOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      setError(null);
      const data = await autopilotApi.getOverview();
      setOverview(data);
      setBackendUnavailable(false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
      } else {
        setError(err?.response?.data?.message || "Failed to load Autopilot overview");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOverview();
  }, [fetchOverview]);

  usePoller(fetchOverview, 30000);

  return {
    overview,
    loading,
    error,
    backendUnavailable,
    refetch: fetchOverview,
  };
}
