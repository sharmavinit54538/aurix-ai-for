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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api";
import { LEAVE_TYPES, type LeaveBalance } from "../types";
import { calculateEstimatedDays, getTodayDateString, statusBadgeClass } from "../mappers";
import { cn } from "@/lib/utils";

interface ApplyLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balances: LeaveBalance[];
  isHrAdmin: boolean;
  onSuccess: () => void;
}

export function ApplyLeaveDialog({
  open,
  onOpenChange,
  balances,
  isHrAdmin,
  onSuccess,
}: ApplyLeaveDialogProps) {
  const [leaveType, setLeaveType] = useState<string>(LEAVE_TYPES[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const todayStr = getTodayDateString();

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setLeaveType(LEAVE_TYPES[0]);
      setStartDate("");
      setEndDate("");
      setReason("");
      setLoading(false);
    }
  }, [open]);

  // Estimated days calculation (parsed as local date parts)
  const calculatedDays = calculateEstimatedDays(startDate, endDate);

  // Remaining balance of the selected type
  const selectedBalance = balances.find((b) => b.leave_type === leaveType);
  const remainingDays = selectedBalance ? Number(selectedBalance.remaining_days) || 0 : 0;
  const isExceedingBalance = calculatedDays > 0 && calculatedDays > remainingDays;

  // HR Admin can backdate; others cannot select dates earlier than today
  const minStartDate = isHrAdmin ? undefined : todayStr;
  const minEndDate = startDate || (isHrAdmin ? undefined : todayStr);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (calculatedDays <= 0) {
      toast.error("Invalid dates selected. End date must be on or after start date.");
      return;
    }

    if (!reason.trim() || reason.trim().length < 5) {
      toast.error("Please provide a valid reason (min 5 characters).");
      return;
    }

    setLoading(true);
    try {
      // Backend calculates total_days, so omit it from payload per backend contract
      const payload = {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
      };

      const res = await api.post<any>("/leaves/apply", payload);
      if (res?.success !== false) {
        toast.success("Leave request submitted successfully!");
        onOpenChange(false);
        onSuccess();
      } else {
        throw new Error(res?.message || "Failed to submit leave request.");
      }
    } catch (err: any) {
      console.error("Error submitting leave request", err);
      toast.error(
        err?.data?.message ||
        err?.message ||
        "Failed to apply leave. Ensure you have sufficient balance."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Calendar className="h-5 w-5 text-primary" />
            Apply for Leave
          </DialogTitle>
          <DialogDescription className="text-xs">
            Fill in your leave details and submit to your manager for approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Leave Type & Balance Preview */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Leave Type
              </Label>
              <span className="text-xs text-muted-foreground">
                Remaining:{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {remainingDays} days
                </span>
              </span>
            </div>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="apply-start-date"
                className="text-xs font-semibold text-muted-foreground uppercase"
              >
                Start Date
              </Label>
              <Input
                id="apply-start-date"
                type="date"
                required
                min={minStartDate}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="apply-end-date"
                className="text-xs font-semibold text-muted-foreground uppercase"
              >
                End Date
              </Label>
              <Input
                id="apply-end-date"
                type="date"
                required
                min={minEndDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Estimated Days Preview */}
          {calculatedDays > 0 && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between text-sm">
              <span className="text-muted-foreground text-xs">Estimated Duration:</span>
              <span className="font-bold text-primary tabular-nums">
                {calculatedDays} {calculatedDays === 1 ? "day" : "days"} (estimated)
              </span>
            </div>
          )}

          {/* Insufficient balance warning (warns, does not block) */}
          {isExceedingBalance && (
            <div className={cn("p-3 rounded-lg flex items-start gap-2.5 text-xs border", statusBadgeClass("warning"))}>
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>Balance Warning:</strong> Requested {calculatedDays} days exceed your remaining{" "}
                {remainingDays} days for {leaveType}. You may still submit, but approval is subject to managerial discretion.
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label
              htmlFor="apply-reason-input"
              className="text-xs font-semibold text-muted-foreground uppercase"
            >
              Reason for absence
            </Label>
            <Textarea
              id="apply-reason-input"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why you need time off (min 5 characters)..."
              className="min-h-[90px]"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || calculatedDays <= 0 || reason.trim().length < 5}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
