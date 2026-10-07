import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollPreviewData,
  type PayrollPreviewEmployee,
} from "@/services/payrollApi";
import { toast } from "sonner";
import type {
  PayrollPreviewFiltersState,
  StatusTone,
} from "../types/payrollPreview.types";
import {
  extractDepartments,
  getStatusTone,
} from "../utils/payrollPreview.utils";

export function usePayrollPreviewCore() {
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
    isHr ||
    userPermissions.includes("payroll.process") ||
    userPermissions.includes("*");

  // State: Preview Data & Status
  const [previewData, setPreviewData] = useState<PayrollPreviewData | null>(null);

  // Loading & Error States
  const [loadingPreview, setLoadingPreview] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  // ── 1. Fetch Preview Summary & Metadata ─────────────────────────────
  const fetchPreviewSummary = useCallback(async () => {
    if (!runId) return;
    setLoadingPreview(true);
    try {
      const data = await payrollApi.getPayrollPreview(runId);
      setPreviewData(data);
      setIsUnavailable(false);
      setApiError(null);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setIsUnavailable(true);
        setApiError(
          "Payroll preview data is currently unavailable on the backend server or pending calculation (404 Not Found)."
        );
      } else if (status === 401 || status === 403) {
        setApiError("You are not authorized to view this payroll preview.");
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payroll preview from the server."
        );
      }
      setPreviewData(null);
    } finally {
      setLoadingPreview(false);
    }
  }, [runId]);

  // Initial load
  useEffect(() => {
    if (!runId) {
      setLoadingPreview(false);
      return;
    }
    fetchPreviewSummary();
  }, [runId, fetchPreviewSummary]);

  // Full Refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPreviewSummary();
    setIsRefreshing(false);
  }, [fetchPreviewSummary]);

  const statusTone = useMemo(() => getStatusTone(previewData?.status), [previewData]);

  return {
    runId,
    navigate,
    ws,
    canViewPayroll,
    canRunPayroll,
    isHr,
    previewData,
    statusTone,
    loadingPreview,
    isRefreshing,
    apiError,
    isUnavailable,
    fetchPreviewSummary,
    handleRefresh,
  };
}

