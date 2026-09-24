import React from "react";
import { ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

export interface MakerCheckerBannerProps {
  creatorId: string;
  creatorName: string;
  createdAt: string;
  approverName?: string | null;
  approvedAt?: string | null;
  approvalRemarks?: string | null;
  currentUserId?: string;
  className?: string;
}

export function MakerCheckerBanner({
  creatorId,
  creatorName,
  createdAt,
  approverName,
  approvedAt,
  approvalRemarks,
  currentUserId,
  className,
}: MakerCheckerBannerProps) {
  const isCreator = Boolean(currentUserId && currentUserId === creatorId);

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 backdrop-blur-xl transition-all",
        isCreator
          ? "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
          : "border-border/60 bg-muted/30 text-foreground",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
              isCreator
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                : "bg-primary/10 text-primary"
            )}
          >
            {isCreator ? (
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            ) : approverName ? (
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            ) : (
              <UserCheck className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight">
              Governance & Maker-Checker Protocol
            </h4>
            <div className="mt-0.5 text-xs opacity-85">
              <span>Created by <strong>{creatorName}</strong> on {formatDate(createdAt)}</span>
              {approverName && (
                <span className="ml-2">
                  • Approved by <strong>{approverName}</strong> on {formatDate(approvedAt)}
                </span>
              )}
            </div>
            {approvalRemarks && (
              <p className="mt-1 text-xs italic opacity-80">
                "{approvalRemarks}"
              </p>
            )}
          </div>
        </div>

        {isCreator && (
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/40">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>The batch creator cannot approve this batch.</span>
          </div>
        )}
      </div>
    </div>
  );
}
