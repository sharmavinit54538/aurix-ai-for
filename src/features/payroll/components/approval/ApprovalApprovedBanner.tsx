import { CheckCircle2, Lock, UserCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/hrms/Shared";
import { formatDate, formatINR } from "../../utils/payrollApproval.utils";

interface ApprovalApprovedBannerProps {
  reviewData: any;
  runId: string;
  formatDate: (val: string | null | undefined) => string;
}

export function ApprovalApprovedBanner({
  reviewData,
  runId,
  formatDate,
}: ApprovalApprovedBannerProps) {
  const navigate = useNavigate();

  return (
    <GlassCard className="border-emerald-500/30 bg-emerald-500/10 p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-sm font-semibold text-emerald-950 dark:text-emerald-200">
              Payroll Run Approved
            </h3>
            <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 mt-0.5">
              This payroll run has been formally approved. It is pending subsequent finalization and disbursement workflows.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-emerald-900/80 dark:text-emerald-300/80">
              {reviewData.approval?.approvedByName || reviewData.approval?.approvedBy ? (
                <span>
                  <strong>Approved by:</strong>{" "}
                  {reviewData.approval.approvedByName || reviewData.approval.approvedBy}
                </span>
              ) : null}
              {reviewData.approval?.approvedAt ? (
                <span>
                  <strong>Approved at:</strong> {formatDate(reviewData.approval.approvedAt)}
                </span>
              ) : null}
            </div>
          </div>
          {reviewData.approval?.comments ? (
            <p className="mt-1.5 text-xs text-emerald-900/90 dark:text-emerald-200/90 italic bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              &ldquo;{reviewData.approval.comments}&rdquo;
            </p>
          ) : null}
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold uppercase text-[10px] px-2.5 py-1"
          >
            Status: Approved
          </Badge>
          <Button
            size="sm"
            onClick={() =>
              navigate({
                to: `/dashboard/payroll/runs/${runId}/finalize` as any,
              })
            }
            className="h-8 gap-1.5 text-xs font-semibold"
            style={{ background: "var(--gradient-brand)" }}
            title="Proceed to Step 8 Payroll Finalization"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Proceed to Finalization (Step 8)</span>
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

import { CheckCircle2, Lock, UserCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/hrms/Shared";
import { formatDate, formatINR } from "../../utils/payrollApproval.utils";
import { useNavigate } from "@tanstack/react-router";