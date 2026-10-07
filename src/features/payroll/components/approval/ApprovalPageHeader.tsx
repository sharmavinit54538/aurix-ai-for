import { ArrowLeft, FileCheck, RotateCcw, ShieldCheck, ThumbsDown, ThumbsUp, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";

interface ApprovalPageHeaderProps {
  runId: string;
  reviewData: any;
  statusTone: any;
  valBadge: any;
  canApprovePayroll: boolean;
  canRejectNow: boolean;
  canApproveNow: boolean;
  loadingReview: boolean;
  isApproved: boolean;
  isFinalized: boolean;
  isProcessing: boolean;
  hasBlockingErrors: boolean;
  onNavigateToValidation: () => void;
  onNavigateToPreview: () => void;
  onOpenApprovalModal: () => void;
  onOpenRejectionModal: () => void;
}

export function ApprovalPageHeader({
  runId,
  reviewData,
  statusTone,
  valBadge,
  canApprovePayroll,
  canRejectNow,
  canApproveNow,
  loadingReview,
  isApproved,
  isFinalized,
  isProcessing,
  hasBlockingErrors,
  onNavigateToValidation,
  onNavigateToPreview,
  onOpenApprovalModal,
  onOpenRejectionModal,
}: ApprovalPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Payroll Review & Approval
          </h1>
          <Badge
            variant="outline"
            className="font-mono text-[11px] font-medium border-border/80 bg-muted/30"
            title={`Payroll Run Identifier: ${runId}`}
          >
            Run: {runId}
          </Badge>
          {reviewData?.status ? (
            <Badge
              variant="outline"
              className={`text-xs font-semibold capitalize ${statusTone.badgeClass}`}
            >
              {statusTone.label}
            </Badge>
          ) : null}
          {!loadingReview && reviewData?.validation?.status ? (
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${valBadge.className}`}
            >
              Validation: {valBadge.label}
            </Badge>
          ) : null}
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {reviewData?.periodName
            ? `Review provisional results and execute sign-off for ${reviewData.periodName}.`
            : "Review actual provisional calculation results, assess validation readiness, and execute sign-off."}
          {reviewData?.lastUpdatedAt ? (
            <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
              <Clock className="h-3 w-3" />
              Updated {formatDate(reviewData.lastUpdatedAt)}
            </span>
          ) : null}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToValidation}
          className="h-9 gap-1.5 text-xs shadow-sm text-primary border-primary/30 hover:bg-primary/5"
          title="Inspect validation issues and audit findings in Step 6"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Validation Center</span>
        </Button>

        {canRejectNow ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenRejectionModal}
            disabled={loadingReview}
            className="h-9 gap-1.5 text-xs shadow-sm border-rose-500/30 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
            title="Return payroll run for corrections"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>Send Back / Reject</span>
          </Button>
        ) : null}

        {canApprovePayroll && !isApproved && !isFinalized ? (
          <Button
            variant="default"
            size="sm"
            onClick={onOpenApprovalModal}
            disabled={!canApproveNow || loadingReview}
            className="h-9 gap-1.5 text-xs shadow-sm"
            style={{ background: canApproveNow ? "var(--gradient-brand)" : undefined }}
            title={
              hasBlockingErrors
                ? "Approval blocked by validation errors"
                : isProcessing
                ? "Payroll calculation is still processing"
                : "Approve this payroll run"
            }
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Approve Payroll</span>
          </Button>
        ) : null}

        {isApproved ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: `/dashboard/payroll/runs/${runId}/finalize` as any,
              })
            }
            className="h-9 gap-1.5 text-xs shadow-sm border-violet-500/30 text-violet-600 hover:bg-violet-500/10 dark:text-violet-400"
            title="Proceed to Step 8 Payroll Finalization"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Finalize Payroll (Step 8)</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

import { ArrowLeft, Clock, FileCheck, Lock, RotateCcw, ShieldCheck, ThumbsDown, ThumbsUp, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { formatDate } from "../../utils/payrollApproval.utils";
import { ApprovalPageHeaderProps } from "../types/payrollApproval.types";