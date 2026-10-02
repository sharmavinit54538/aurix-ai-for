import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { LeaveRequest } from "../types";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetLeave: LeaveRequest | null;
  onConfirm: (leaveId: string, reason: string) => Promise<void>;
  loading?: boolean;
}

export function RejectDialog({
  open,
  onOpenChange,
  targetLeave,
  onConfirm,
  loading = false,
}: RejectDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!open) {
      setRejectionReason("");
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!targetLeave || !rejectionReason.trim()) return;
    await onConfirm(targetLeave.id, rejectionReason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-border bg-card/95 backdrop-blur-2xl text-foreground">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-500" />
            Reason for Rejection
          </DialogTitle>
          <DialogDescription className="text-xs">
            Provide feedback explaining why this leave application for{" "}
            <span className="font-semibold text-foreground">
              {targetLeave?.employee_name}
            </span>{" "}
            is being rejected.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Label htmlFor="reject-textarea" className="sr-only">
            Rejection Reason
          </Label>
          <textarea
            id="reject-textarea"
            value={rejectionReason}
            disabled={loading}
            placeholder="e.g. Project deliverable schedules are tight during these dates..."
            className="w-full min-h-[100px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-rose-500 focus:outline-none"
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            disabled={loading || !rejectionReason.trim()}
            className="bg-rose-600 hover:bg-rose-500 text-white gap-2"
            onClick={handleConfirm}
          >
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
