import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/use-current-role";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollValidationSummary,
} from "@/services/payrollApi";

export function usePayrollValidationCore() {
  const params = useParams({ strict: false }) as { runId?: string };
  const runId = params?.runId?.trim() || "";
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

  // ── Fetch Validation Summary & Issues ───────────────────────────────
  const fetchValidationData = useCallback(async () => {
    if (!runId) return;
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
  }, [runId]);

  useEffect(() => {
    fetchValidationData();
  }, [fetchValidationData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchValidationData();
    setIsRefreshing(false);
  }, [fetchValidationData]);

  return {
    runId,
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