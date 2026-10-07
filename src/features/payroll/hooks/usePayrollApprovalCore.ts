import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole, canManagePayroll } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollReviewData,
} from "@/services/payrollApi";
import { toast } from "sonner";

export function usePayrollApprovalCore() {
  const params = useParams({ strict: false }) as { runId?: string };
  const runId = params?.runId?.trim() || "";
  const navigate = useNavigate();

  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);
  const currentRole = useCurrentRole();
  const isPayrollAdmin = canManagePayroll(currentRole);

  const canViewPayroll =
    isPayrollAdmin ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*");

  const canApprovePayroll =
    isPayrollAdmin ||
    userPermissions.includes("payroll.approve") ||
    userPermissions.includes("payroll.admin") ||
    userPermissions.includes("*");

  const [reviewData, setReviewData] = useState<any>(null);
  const [loadingReview, setLoadingReview] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  const fetchReview = useCallback(
    async (showToast = false) => {
      if (!runId) return;

      try {
        setLoadingReview(true);
        setApiError(null);
        setIsUnavailable(false);

        const data = await payrollApi.getPayrollReview(runId);
        setReviewData(data);

        if (showToast) {
          toast.success("Payroll review data refreshed from backend.");
        }
      } catch (err: any) {
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load payroll review data.";

        if (status === 404) {
          setIsUnavailable(true);
          setApiError(
            `Payroll run "${runId}" was not found on the backend (404). Approval workflow is currently unavailable for this run identifier.`,
          );
        } else {
          setApiError(msg);
        }
        setReviewData(null);
      } finally {
        setLoadingReview(false);
        setIsRefreshing(false);
      }
    },
    [runId],
  );

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchReview(true);
  }, [fetchReview]);

  const canViewPayroll = useAppSelector(selectUserPermissions).some(
    (p) => p === "payroll.view" || p === "*"
  );

  const currentRole = useCurrentRole();
  const isPayrollAdmin = false; // This will be set from the component
  const canApprovePayroll = useAppSelector(selectUserPermissions).some(
    (p) => ["payroll.approve", "payroll.admin", "*"].includes(p)
  );

  return {
    runId,
    navigate,
    ws,
    canViewPayroll,
    canApprovePayroll,
    reviewData,
    loadingReview,
    isRefreshing,
    apiError,
    isUnavailable,
    fetchReview,
    handleRefresh,
  };
}