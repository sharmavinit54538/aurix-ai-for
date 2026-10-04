import { useState, useCallback, useEffect } from "react";
import { usePoller } from "@/hooks/usePoller";
import { autopilotApi } from "../services/autopilotApi";
import type { AutopilotOverview } from "../types";
import { parseApiError } from "@/api/utils";

const FALLBACK_OVERVIEW: AutopilotOverview = {
  autoResolvedPercent: {
    available: true,
    value: 92,
    unit: "%",
    changePercent: 4.8,
    description: "Resolved automatically within verified policy rules",
  },
  autoResolvedPercentage: {
    available: true,
    value: 92,
    unit: "%",
    changePercent: 4.8,
    description: "Resolved automatically within verified policy rules",
  },
  exceptionsPending: {
    available: true,
    value: 4,
    changePercent: -15,
    description: "Pending human exception review in Inbox",
  },
  hoursSaved: {
    available: true,
    value: 320,
    unit: "hrs",
    changePercent: 12,
    description: "Manual HR operational hours saved this month",
  },
  overrideRate: {
    available: true,
    value: 1.8,
    unit: "%",
    changePercent: -0.5,
    description: "Rate of human overrides on decisions",
  },
  overrideRatePercentage: {
    available: true,
    value: 1.8,
    unit: "%",
    changePercent: -0.5,
    description: "Rate of human overrides on decisions",
  },
  history12Months: [
    { month: "2026-05", autoResolved: 340, exceptions: 22, overridden: 5, hoursSaved: 210 },
    { month: "2026-06", autoResolved: 390, exceptions: 18, overridden: 4, hoursSaved: 245 },
    { month: "2026-07", autoResolved: 430, exceptions: 15, overridden: 3, hoursSaved: 270 },
    { month: "2026-08", autoResolved: 480, exceptions: 11, overridden: 2, hoursSaved: 295 },
    { month: "2026-09", autoResolved: 530, exceptions: 7, overridden: 2, hoursSaved: 320 },
  ],
  timeSeries12Months: [
    { month: "2026-05", autoResolved: 340, exceptions: 22, overridden: 5, hoursSaved: 210 },
    { month: "2026-06", autoResolved: 390, exceptions: 18, overridden: 4, hoursSaved: 245 },
    { month: "2026-07", autoResolved: 430, exceptions: 15, overridden: 3, hoursSaved: 270 },
    { month: "2026-08", autoResolved: 480, exceptions: 11, overridden: 2, hoursSaved: 295 },
    { month: "2026-09", autoResolved: 530, exceptions: 7, overridden: 2, hoursSaved: 320 },
  ],
  lastUpdated: new Date().toISOString(),
};

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
    } catch (err: unknown) {
      const { status, message } = parseApiError(err, "Failed to load Autopilot overview");
      if (status === 404 || status === 501) {
        setOverview(FALLBACK_OVERVIEW);
        setBackendUnavailable(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOverview();
  }, [fetchOverview]);

  usePoller(fetchOverview, { intervalMs: 30000 });

  return {
    overview,
    loading,
    error,
    backendUnavailable,
    refetch: fetchOverview,
  };
}
