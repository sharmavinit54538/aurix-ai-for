import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { payrollApi } from "@/services/payrollApi";
import { toast } from "sonner";

export function usePayrollApprovalActions(
  runId: string,
  reviewData: any,
  fetchReview: () => Promise<void>,
  setApprovalModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsApproving: React.Dispatch<React.SetStateAction<boolean>>,
  approvalComments: string,
  setApprovalComments: React.Dispatch<React.SetStateAction<string>>,
  setRejectionModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRejecting: React.Dispatch<React.SetStateAction<boolean>>,
  rejectionReason: string,
  setRejectionReason: React.Dispatch<React.SetStateAction<string>>,
  rejectionComments: string,
  setRejectionComments: React.Dispatch<React.SetStateAction<string>>
) {
  const navigate = useNavigate();

  const handleConfirmApproval = useCallback(async () => {
    if (!runId) return;

    try {
      const res = await payrollApi.approvePayroll(runId, {
        comments: approvalComments.trim() || undefined,
      });

      toast.success(res.message || "Payroll run approved successfully.");
      // The modal will be closed by the parent component
      await fetchReview(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to approve payroll run.";
      toast.error(msg);
    }
  }, [runId, approvalComments, fetchReview]);

  const handleConfirmRejection = useCallback(async () => {
    if (!runId) return;

    try {
      const res = await payrollApi.rejectPayroll(runId, {
        reason: rejectionReason.trim(),
        comments: rejectionComments.trim() || undefined,
      });

      toast.success(res.message || "Payroll run sent back for correction.");
      // The modal will be closed by the parent component
      await fetchReview(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to return payroll run.";
      toast.error(msg);
    }
  }, [runId, rejectionReason, rejectionComments, fetchReview]);

  return {
    handleConfirmApproval,
    handleConfirmRejection,
  };
}