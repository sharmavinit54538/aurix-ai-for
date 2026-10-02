import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Ban, RefreshCw } from "lucide-react";
import type { LeaveRequest, LeaveStatus } from "../types";
import { formatDateStr, isLeaveCancellable, getTodayDateString } from "../mappers";

interface HistoryTableProps {
  history: LeaveRequest[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  onCancelRequest?: (leave: LeaveRequest) => void;
  cancellingId?: string | null;
}

export function HistoryTable({
  history,
  loading = false,
  error = false,
  onRetry,
  onCancelRequest,
  cancellingId,
}: HistoryTableProps) {
  const todayStr = getTodayDateString();

  const renderStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="secondary"
            className="text-xs capitalize bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
          >
            approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="text-xs capitalize">
            rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-xs capitalize bg-amber-500/15 text-amber-500 border border-amber-500/30"
          >
            pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="text-xs capitalize bg-muted text-muted-foreground border-border"
          >
            cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs capitalize">
            {status}
          </Badge>
        );
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-3">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Failed to load leave history</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Unable to fetch past leave applications from the server.
          </p>
        </div>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="gap-2 border-destructive/20 hover:bg-destructive/10 text-destructive text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Leave Applications History
        </h3>
      </div>
      <Card className="border border-border bg-card/50 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="pl-6 py-4">Leave Type</TableHead>
              <TableHead className="py-4">Dates Range</TableHead>
              <TableHead className="text-center py-4">Days Claimed</TableHead>
              <TableHead className="py-4">Reason</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="pr-6 py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((rec) => {
              const cancellable = isLeaveCancellable(rec, todayStr);
              const isCancelling = cancellingId === rec.id;

              return (
                <TableRow
                  key={rec.id}
                  className="border-b border-border/80 hover:bg-muted/5 transition-all"
                >
                  <TableCell className="pl-6 py-4 font-semibold text-foreground">
                    {rec.leave_type}
                  </TableCell>
                  <TableCell className="py-4 text-muted-foreground whitespace-nowrap">
                    {formatDateStr(rec.start_date)} – {formatDateStr(rec.end_date)}
                  </TableCell>
                  <TableCell className="text-center py-4 font-semibold tabular-nums text-foreground">
                    {rec.total_days} d
                  </TableCell>
                  <TableCell className="py-4 text-muted-foreground max-w-[200px] truncate">
                    {rec.reason}
                  </TableCell>
                  <TableCell className="py-4">
                    {renderStatusBadge(rec.status)}
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rec.status === "rejected" && rec.rejection_reason && (
                        <div className="text-xs text-rose-500 flex items-center gap-1.5 justify-end">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Reason: {rec.rejection_reason}
                        </div>
                      )}

                      {cancellable && onCancelRequest && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isCancelling}
                          onClick={() => onCancelRequest(rec)}
                          className="h-8 text-xs text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 gap-1"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          {isCancelling ? "Cancelling..." : "Cancel"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {history.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No leave applications logged yet.
                </TableCell>
              </TableRow>
            )}

            {loading && history.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
                    <span>Loading leave history...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
