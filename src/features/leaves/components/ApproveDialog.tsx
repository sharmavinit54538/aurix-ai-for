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
import { CheckCircle2, RefreshCw } from "lucide-react";
import type { LeaveRequest } from "../types";
import { formatDateStr } from "../mappers";

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetLeave: LeaveRequest | null;
  onConfirm: (leaveId: string) => Promise<void>;
  loading?: boolean;
}

export function ApproveDialog({
  open,
  onOpenChange,
  targetLeave,
  onConfirm,
  loading = false,
}: ApproveDialogProps) {
  if (!targetLeave) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Confirm Leave Approval
          </DialogTitle>
          <DialogDescription className="text-xs">
            Please confirm that you want to approve this leave request.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-2 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground text-xs">Employee:</span>
            <span className="font-semibold text-foreground">{targetLeave.employee_name}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground text-xs">Department:</span>
            <span className="text-foreground">{targetLeave.department}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground text-xs">Leave Type:</span>
            <span className="font-medium text-primary">{targetLeave.leave_type}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground text-xs">Duration:</span>
            <span className="font-semibold text-foreground">
              {targetLeave.total_days} {targetLeave.total_days === 1 ? "day" : "days"} (
              {formatDateStr(targetLeave.start_date)} to {formatDateStr(targetLeave.end_date)})
            </span>
          </div>
          {targetLeave.reason && (
            <div className="pt-1">
              <span className="text-muted-foreground text-xs block mb-1">Reason:</span>
              <p className="text-xs bg-muted p-2.5 rounded-lg border border-border text-foreground">
                {targetLeave.reason}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            className="gap-2"
            onClick={() => onConfirm(targetLeave.id)}
          >
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
