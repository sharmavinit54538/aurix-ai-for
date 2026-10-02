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
import { Textarea } from "@/components/ui/textarea";
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
      <DialogContent className="max-w-md border border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
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
          <Textarea
            id="reject-textarea"
            value={rejectionReason}
            disabled={loading}
            placeholder="e.g. Project deliverable schedules are tight during these dates..."
            className="min-h-[100px]"
            onChange={(e) => setRejectionReason(e.target.value)}
          />
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
            variant="destructive"
            disabled={loading || !rejectionReason.trim()}
            className="gap-2"
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
