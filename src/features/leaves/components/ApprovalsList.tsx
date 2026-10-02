import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle, RefreshCw, ShieldCheck } from "lucide-react";
import type { LeaveRequest } from "../types";
import { formatDateStr, getSafeInitial, statusBadgeClass } from "../mappers";
import { cn } from "@/lib/utils";

interface ApprovalsListProps {
  approvals: LeaveRequest[];
  loading?: boolean;
  onRefresh: () => void;
  onApproveClick: (leave: LeaveRequest) => void;
  onRejectClick: (leave: LeaveRequest) => void;
  actionLoadingId?: string | null;
}

export function ApprovalsList({
  approvals,
  loading = false,
  onRefresh,
  onApproveClick,
  onRejectClick,
  actionLoadingId,
}: ApprovalsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Review Team Time-Off Requests</h3>
          <p className="text-sm text-muted-foreground">
            Approve leave filings or request revisions with feedback comments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("border", statusBadgeClass("pending"))}
          >
            {approvals.length} Pending
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {approvals.map((req) => {
          const isRowLoading = actionLoadingId === req.id;
          const isAnyRowLoading = Boolean(actionLoadingId);
          const initial = getSafeInitial(req.employee_name);

          return (
            <Card
              key={req.id}
              className="border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary font-semibold">
                      {initial}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>{req.employee_name}</span>
                        <Badge variant="outline" className="text-[10px] uppercase font-normal">
                          {req.department}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{req.leave_type}</span>
                        <span>
                          (<span className="text-foreground font-medium">{req.total_days} days</span>)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground block">Requested Dates Range</span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatDateStr(req.start_date)} to {formatDateStr(req.end_date)}
                    </span>
                  </div>

                  <div className="max-w-xs md:max-w-sm">
                    <span className="text-xs text-muted-foreground block">Reason for absence</span>
                    <p className="text-xs text-foreground mt-0.5 leading-relaxed truncate">
                      {req.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isAnyRowLoading}
                      className="text-emerald-600 dark:text-emerald-400 gap-1.5"
                      onClick={() => onApproveClick(req)}
                    >
                      {isRowLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      <span>Approve</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isAnyRowLoading}
                      className="text-destructive border-destructive/30 gap-1.5"
                      onClick={() => onRejectClick(req)}
                    >
                      {isRowLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>Reject</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {approvals.length === 0 && !loading && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="font-medium text-foreground">All caught up!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              There are no pending leave requests for your review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
