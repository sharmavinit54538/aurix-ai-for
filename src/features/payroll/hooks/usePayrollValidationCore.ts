import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/use-current-role";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollValidationSummary,
  type PayrollDashboardData,
} from "@/services/payrollApi";

export function usePayrollValidationCore() {
  const params = useParams({ strict: false }) as { runId?: string };
  const rawRunId = params?.runId?.trim() || "";
  const navigate = useNavigate();

  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);
  const currentRole = useCurrentRole();
  const isHr = currentRole === "hr_admin";

  const canViewPayroll =
    isHr ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*");

  const canRunPayroll =
    isHr || userPermissions.includes("payroll.process") || userPermissions.includes("*");

  // State: Validation Data
  const [validationData, setValidationData] = useState<PayrollValidationSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);
  const [resolvedRunId, setResolvedRunId] = useState<string>("");

  // ── Resolve "current" to actual payroll run ID ───────────────────────
  const isCurrentAlias = rawRunId === "current";

  const resolveCurrentRunId = useCallback(async (): Promise<string | null> => {
    if (!isCurrentAlias) return rawRunId;

    try {
      const dashboardData = await payrollApi.getPayrollDashboard() as PayrollDashboardData & {
        active_run?: { id?: string; runId?: string; run_id?: string } | null;
      };
      const activeRun = dashboardData?.active_run;
      if (activeRun) {
        const runId = String(activeRun.id || activeRun.runId || activeRun.run_id || "");
        if (runId) return runId;
      }
      // Fallback to most recent run
      const recentRuns = dashboardData?.recentRuns;
      if (Array.isArray(recentRuns) && recentRuns.length > 0) {
        return String(recentRuns[0].id);
      }
      return null;
    } catch {
      return null;
    }
  }, [isCurrentAlias, rawRunId]);

  // Initialize resolvedRunId
  useEffect(() => {
    let mounted = true;
    (async () => {
      const runId = await resolveCurrentRunId();
      if (mounted) {
        setResolvedRunId(runId || "");
      }
    })();
    return () => { mounted = false; };
  }, [resolveCurrentRunId]);

  // The effective runId to use for API calls
  const runId = isCurrentAlias ? resolvedRunId : rawRunId;

  // ── Fetch Validation Summary & Issues ───────────────────────────────
  const fetchValidationData = useCallback(async () => {
    if (!runId) {
      if (isCurrentAlias && !resolvedRunId) {
        setApiError("No active payroll run is available for the selected payroll period.");
        setIsUnavailable(true);
      }
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setApiError(null);
    setIsUnavailable(false);

    try {
      const data = await payrollApi.getPayrollValidation(runId);
      setValidationData(data);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setIsUnavailable(true);
        setApiError(
          "Payroll validation data is currently unavailable on the backend server (404 Not Found).",
        );
      } else if (status === 401 || status === 403) {
        setApiError("You do not have permission to view validation issues for this payroll run.");
      } else if (status === 422) {
        setApiError(
          "Invalid payroll run identifier. Please select a valid payroll run."
        );
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payroll validation findings from the backend.",
        );
      }
      setValidationData(null);
    } finally {
      setIsLoading(false);
    }
  }, [runId, isCurrentAlias, resolvedRunId]);

  useEffect(() => {
    fetchValidationData();
  }, [fetchValidationData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (isCurrentAlias) {
      const newRunId = await resolveCurrentRunId();
      if (newRunId) {
        setResolvedRunId(newRunId);
      }
    }
    await fetchValidationData();
    setIsRefreshing(false);
  }, [fetchValidationData, isCurrentAlias, resolveCurrentRunId]);

  return {
    runId,
    rawRunId,
    isCurrentAlias,
    navigate,
    ws,
    canViewPayroll,
    canRunPayroll,
    isHr,
    validationData,
    isLoading,
    isRefreshing,
    apiError,
    isUnavailable,
    fetchValidationData,
    handleRefresh,
  };
}