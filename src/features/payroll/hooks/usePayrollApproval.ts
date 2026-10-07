import { useState, useEffect, useCallback, useMemo } from "react";
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
import { computeChecklistItems } from "../utils/payrollApproval.utils";
import type { PayrollReviewData } from "@/services/payrollApi";

export function usePayrollApproval() {
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

  const [approvalModalOpen, setApprovalModalOpen] = useState<boolean>(false);
  const [approvalComments, setApprovalComments] = useState<string>("");
  const [isApproving, setIsApproving] = useState<boolean>(false);

  const [rejectionModalOpen, setRejectionModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [rejectionComments, setRejectionComments] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

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
    }, [runId]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchReview(true);
  }, [fetchReview]);

  const handleConfirmApproval = useCallback(async () => {
    if (!runId || isApproving) return;

    try {
      setIsApproving(true);
      const res = await payrollApi.approvePayroll(runId, {
        comments: approvalComments.trim() || undefined,
      });

      toast.success(res.message || "Payroll run approved successfully.");
      setApprovalModalOpen(false);
      setApprovalComments("");

      await fetchReview(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to approve payroll run.";
      toast.error(msg);
    } finally {
      setIsApproving(false);
    }
  }, [runId, approvalComments, fetchReview]);

  const handleConfirmRejection = useCallback(async () => {
    if (!runId || isRejecting) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejecting or sending back payroll.");
      return;
    }

    try {
      setIsRejecting(true);
      const res = await payrollApi.rejectPayroll(runId, {
        reason: rejectionReason.trim(),
        comments: rejectionComments.trim() || undefined,
      });

      toast.success(res.message || "Payroll run sent back for correction.");
      setRejectionModalOpen(false);
      setRejectionReason("");
      setRejectionComments("");

      await fetchReview(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to return payroll run.";
      toast.error(msg);
    } finally {
      setIsRejecting(false);
    }
  }, [runId, rejectionReason, rejectionComments, fetchReview]);

  // State Machine Evaluation
  const statusLower = (reviewData?.status || "").toLowerCase().trim();
  const isApproved = statusLower === "approved";
  const isRejected = statusLower === "rejected";
  const isFinalized =
    statusLower === "finalized" ||
    statusLower === "closed" ||
    statusLower === "locked";
  const isProcessing = statusLower === "processing";

  const validationErrorsCount = Number(reviewData?.validation?.errorsCount || 0);
  const validationBlockingCount =
    reviewData?.validation?.blockingCount != null
      ? Number(reviewData.validation.blockingCount)
      : validationErrorsCount;
  const hasBlockingErrors = validationBlockingCount > 0;

  const currentRole = useCurrentRole();
  const isPayrollAdmin = canManagePayroll(currentRole);
  const canApprovePayroll =
    isPayrollAdmin ||
    userPermissions.includes("payroll.approve") ||
    userPermissions.includes("payroll.admin") ||
    userPermissions.includes("*");

  const canRejectNow =
    canApprovePayroll &&
    !isFinalized &&
    !isProcessing;

  const canApproveNow =
    canApprovePayroll &&
    !isApproved &&
    !isFinalized &&
    !isProcessing &&
    !hasBlockingErrors;

  const checklistItems = useMemo(
    () => computeChecklistItems(reviewData, reviewData?.status?.toLowerCase().trim() === "processing", validationBlockingCount > 0, validationBlockingCount, isFinalized),
    [reviewData, hasBlockingErrors, validationBlockingCount, isFinalized]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchReview(true);
  }, [fetchReview]);

  const handleConfirmApproval = useCallback(async () => {
    if (!runId || isApproving) return;

    try {
      setIsApproving(true);
      const res = await payrollApi.approvePayroll(runId, {
        comments: approvalComments.trim() || undefined,
      });

      toast.success(res.message || "Payroll run approved successfully.");
      setApprovalModalOpen(false);
      setApprovalComments("");

      await fetchReview(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to approve payroll run.";
      toast.error(msg);
    } finally {
      setIsApproving(false);
    }
  }, [runId, approvalComments, fetchReview]);

  const handleConfirmRejection = useCallback(async () => {
    if (!runId || isRejecting) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejecting or sending back payroll.");
      return;
    }

    try {
      setIsRejecting(true);
      const res = await payrollApi.rejectPayroll(runId, {
        reason: rejectionReason.trim(),
        comments: rejectionComments.trim() || undefined,
      });

      toast.success(res.message || "Payroll run sent back for correction.");
      setRejectionModalOpen(false);
      setRejectionReason("");
      setRejectionComments("");

      await fetchReview(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to return payroll run.";
      toast.error(msg);
    } finally {
      setIsRejecting(false);
    }
  }, [runId, rejectionReason, rejectionComments, fetchReview]);

  return {
    runId,
    navigate,
    ws: useAurix(),
    canViewPayroll: canViewPayroll,
    canRunPayroll: false,
    canApprovePayroll,
    canRejectNow,
    canApproveNow,
    isPayrollAdmin: canManagePayroll(useCurrentRole()),
    isHr: canManagePayroll(useCurrentRole()),
    reviewData,
    loadingReview,
    isRefreshing,
    apiError,
    isUnavailable,
    approvalModalOpen,
    setApprovalModalOpen,
    approvalComments,
    setApprovalComments,
    isApproving,
    rejectionModalOpen,
    setRejectionModalOpen,
    rejectionReason,
    setRejectionReason,
    rejectionComments,
    setRejectionComments,
    isRejecting,
    isApproved: (reviewData?.status || "").toLowerCase().trim() === "approved",
    isRejected: (reviewData?.status || "").toLowerCase().trim() === "rejected",
    isFinalized:
      ["finalized", "closed", "locked"].includes(
        (reviewData?.status || "").toLowerCase().trim()
      ),
    isProcessing: (reviewData?.status || "").toLowerCase().trim() === "processing",
    hasBlockingErrors,
    validationBlockingCount: validationBlockingCount,
    validationErrorsCount: Number(reviewData?.validation?.errorsCount || 0),
    checklistItems,
    statusTone: getApprovalStatusTone(reviewData?.status),
    valBadge: getValidationBadge(reviewData?.validation?.status),
    fetchReview,
    handleRefresh,
    handleConfirmApproval,
    handleConfirmRejection,
    setApprovalModalOpen,
    setRejectionModalOpen,
    setApprovalComments,
    setRejectionReason,
    setRejectionComments,
    isApproving,
    isRejecting,
    setApprovalModalOpen,
    setRejectionModalOpen,
    setApprovalComments,
    setRejectionReason,
    setRejectionComments,
  };
}

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { computeChecklistItems, getApprovalStatusTone, getValidationBadge } from "../utils/payrollApproval.utils";
import type { PayrollReviewData } from "@/services/payrollApi";