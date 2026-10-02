import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ban, RefreshCw } from "lucide-react";
import type { LeaveRequest } from "../types";
import { formatDateStr } from "../mappers";

interface CancelLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetLeave: LeaveRequest | null;
  onConfirm: (leaveId: string) => Promise<void>;
  loading?: boolean;
}

export function CancelLeaveDialog({
  open,
  onOpenChange,
  targetLeave,
  onConfirm,
  loading = false,
}: CancelLeaveDialogProps) {
  if (!targetLeave) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Ban className="h-5 w-5 text-destructive" />
            Cancel Leave Application
          </DialogTitle>
          <DialogDescription className="text-xs">
            Are you sure you want to cancel this leave application? This will withdraw the request and restore allocated balances.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-2 text-sm">
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-xs">Leave Type:</span>
            <span className="font-semibold text-foreground">{targetLeave.leave_type}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-xs">Dates:</span>
            <span className="font-semibold text-foreground">
              {formatDateStr(targetLeave.start_date)} to {formatDateStr(targetLeave.end_date)}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-xs">Total Days:</span>
            <span className="font-semibold tabular-nums text-foreground">
              {targetLeave.total_days} {targetLeave.total_days === 1 ? "day" : "days"}
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Keep Leave
          </Button>
          <Button
            variant="destructive"
            disabled={loading}
            className="gap-2"
            onClick={() => onConfirm(targetLeave.id)}
          >
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
