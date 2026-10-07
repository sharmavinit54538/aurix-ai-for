import type {
  PayrollApprovalInfo,
} from "../../types";

export function extractReviewApproval(
  rawObj: Record<string, unknown>,
  rawStatus: string,
): PayrollApprovalInfo | null {
  const rawApp = (rawObj.approval || rawObj.approval_status || rawObj) as Record<string, unknown> | undefined;
  if (!rawApp || typeof rawApp !== "object") return null;

  const appStatus =
    (rawApp.status ||
    rawApp.approval_status ||
    (String(rawStatus).toLowerCase() === "approved"
      ? "approved"
      : String(rawStatus).toLowerCase() === "rejected"
        ? "rejected"
        : "pending")) as PayrollApprovalInfo["status"];

  return {
    status: appStatus,
    approvedBy:
      (rawApp.approvedBy ||
      rawApp.approved_by ||
      rawApp.approver_id ||
      rawObj.approvedBy ||
      rawObj.approved_by ||
      null) as string | null,
    approvedByName:
      (rawApp.approvedByName ||
      rawApp.approved_by_name ||
      rawApp.approver_name ||
      rawObj.approvedByName ||
      rawObj.approved_by_name ||
      null) as string | null,
    approvedAt:
      (rawApp.approvedAt ||
      rawApp.approved_at ||
      rawObj.approvedAt ||
      rawObj.approved_at ||
      null) as string | null,
    rejectedBy:
      (rawApp.rejectedBy ||
      rawApp.rejected_by ||
      rawObj.rejectedBy ||
      rawObj.rejected_by ||
      null) as string | null,
    rejectedByName:
      (rawApp.rejectedByName ||
      rawApp.rejected_by_name ||
      rawObj.rejectedByName ||
      rawObj.rejected_by_name ||
      null) as string | null,
    rejectedAt:
      (rawApp.rejectedAt ||
      rawApp.rejected_at ||
      rawObj.rejectedAt ||
      rawObj.rejected_at ||
      null) as string | null,
    rejectionReason:
      (rawApp.rejectionReason ||
      rawApp.rejection_reason ||
      rawObj.rejectionReason ||
      rawObj.rejection_reason ||
      null) as string | null,
    comments:
      (rawApp.comments ||
      rawApp.comment ||
      rawApp.notes ||
      rawObj.approvalComments ||
      rawObj.approval_comments ||
      null) as string | null,
    canApprove: Boolean(rawApp.canApprove ?? rawApp.can_approve ?? false),
    canReject: Boolean(rawApp.canReject ?? rawApp.can_reject ?? false),
    blockingReasons: (rawApp.blockingReasons || rawApp.blocking_reasons || []) as string[],
    ...rawApp,
  };
}