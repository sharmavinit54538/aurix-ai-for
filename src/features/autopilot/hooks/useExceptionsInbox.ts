import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePoller } from "@/hooks/usePoller";
import { autopilotApi, type ExceptionsQueryParams } from "../services/autopilotApi";
import type { AutopilotException, ExceptionDecisionPayload } from "../types";
import { parseApiError } from "@/api/utils";

export interface UseExceptionsInboxReturn {
  exceptions: AutopilotException[];
  total: number;
  loading: boolean;
  error: string | null;
  backendUnavailable: boolean;
  filterWorkflow: string;
  filterUrgency: string;
  searchQuery: string;
  setFilterWorkflow: (wf: string) => void;
  setFilterUrgency: (urgency: string) => void;
  setSearchQuery: (query: string) => void;
  refetch: () => Promise<void>;
  submitDecision: (id: string, payload: ExceptionDecisionPayload) => Promise<boolean>;
}

export function useExceptionsInbox(): UseExceptionsInboxReturn {
  const [exceptions, setExceptions] = useState<AutopilotException[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const [filterWorkflow, setFilterWorkflow] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchExceptions = useCallback(async () => {
    try {
      const params: ExceptionsQueryParams = {
        workflow: filterWorkflow !== "all" ? filterWorkflow : undefined,
        urgency: filterUrgency !== "all" ? filterUrgency : undefined,
        search: searchQuery.trim() || undefined,
        status: "pending",
      };
      const res = await autopilotApi.getExceptions(params);
      setExceptions(res.items);
      setTotal(res.total);
      setError(null);
      setBackendUnavailable(false);
    } catch (err: unknown) {
      const { status, message } = parseApiError(err, "Failed to load exceptions");
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        setExceptions([]);
        setTotal(0);
        setError(null);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [filterWorkflow, filterUrgency, searchQuery]);

  useEffect(() => {
    void fetchExceptions();
  }, [fetchExceptions]);

  // Live polling every 15s using usePoller
  usePoller(fetchExceptions, {
    intervalMs: 15_000,
    maxIntervalMs: 45_000,
    enabled: !backendUnavailable,
  });

  const submitDecision = useCallback(
    async (id: string, payload: ExceptionDecisionPayload): Promise<boolean> => {
      // 1. Optimistic snapshot
      const previousExceptions = [...exceptions];
      const target = exceptions.find((e) => e.id === id);

      // 2. Apply optimistic update (remove or mark resolved)
      setExceptions((prev) => prev.filter((e) => e.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));

      try {
        await autopilotApi.submitExceptionDecision(id, payload);
        toast.success(
          `Exception #${id.slice(-6)} marked as ${payload.decision === "approve" ? "Approved" : payload.decision === "reject" ? "Rejected" : "Reassigned"}`,
        );
        return true;
      } catch (err: unknown) {
        // Rollback on error
        setExceptions(previousExceptions);
        if (target) {
          setTotal((prev) => prev + 1);
        }
        const { status, message } = parseApiError(
          err,
          "Failed to submit decision. Action rolled back.",
        );
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          toast.error(message);
        }
        return false;
      }
    },
    [exceptions],
  );

  return {
    exceptions,
    total,
    loading,
    error,
    backendUnavailable,
    filterWorkflow,
    filterUrgency,
    searchQuery,
    setFilterWorkflow,
    setFilterUrgency,
    setSearchQuery,
    refetch: fetchExceptions,
    submitDecision,
  };
}
