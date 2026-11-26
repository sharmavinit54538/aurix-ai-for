import React, { useState, useEffect, useMemo } from "react";
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
import { Calendar, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api";
import { LEAVE_TYPES, type LeaveBalance } from "../types";
import { calculateEstimatedDays, getTodayDateString, statusBadgeClass, normalizeLeaveType } from "../mappers";
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
  // Build leave type options from balances (unique leave_type values), fallback to LEAVE_TYPES
  const leaveTypeOptions = useMemo(() => {
    if (balances.length > 0) {
      const uniqueTypes = Array.from(new Set(balances.map((b) => b.leave_type.trim())));
      return uniqueTypes.length > 0 ? uniqueTypes : LEAVE_TYPES;
    }
    return LEAVE_TYPES;
  }, [balances]);

  const [leaveType, setLeaveType] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  const todayStr = getTodayDateString();

  // Sync leaveType when balances load or dialog opens
  useEffect(() => {
    if (open && leaveTypeOptions.length > 0) {
      const currentNormalized = normalizeLeaveType(leaveType);
      const match = leaveTypeOptions.find((t) => normalizeLeaveType(t) === currentNormalized);
      setLeaveType(match ?? leaveTypeOptions[0]);
    } else if (!open) {
      setLeaveType(leaveTypeOptions[0] ?? LEAVE_TYPES[0]);
    }
  }, [open, leaveTypeOptions, leaveType]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setStartDate("");
      setEndDate("");
      setReason("");
      setLoading(false);
      setDateError(null);
      setStartError(null);
      setReasonError(null);
    }
  }, [open]);

  // Estimated days calculation (parsed as local date parts)
  const calculatedDays = calculateEstimatedDays(startDate, endDate);

  // Remaining balance of the selected type (case-insensitive, ignore spaces/underscores)
  const selectedBalance = balances.find((b) => normalizeLeaveType(b.leave_type) === normalizeLeaveType(leaveType));
  const remainingDays = selectedBalance ? Number(selectedBalance.remaining_days) || 0 : 0;
  const isExceedingBalance = calculatedDays > 0 && calculatedDays > remainingDays;

  // HR Admin can backdate; others cannot select dates earlier than today
  const minStartDate = isHrAdmin ? undefined : todayStr;
  const minEndDate = startDate || (isHrAdmin ? undefined : todayStr);

  // Validate dates: end date must be on or after start date
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setDateError("End date must be on or after start date");
        setEndDate(""); // Clear end date when it's before start date
      } else {
        setDateError(null);
      }
    } else {
      setDateError(null);
    }
  }, [startDate, endDate]);

  // Clear end date if start date changes and end < start
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setEndDate("");
      }
    }
  }, [startDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!startDate) {
      setStartError("Select a start date.");
      hasError = true;
    } else {
      setStartError(null);
    }

    if (!endDate || calculatedDays <= 0) {
      setDateError("End date must be on or after start date.");
      hasError = true;
    }

    if (!reason.trim() || reason.trim().length < 5) {
      setReasonError("Please provide at least 5 characters explaining your leave.");
      hasError = true;
    } else {
      setReasonError(null);
    }

    if (hasError) {
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
      <DialogContent className="max-w-lg border border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Calendar className="h-5 w-5 text-primary" />
            Apply for Leave
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in your leave details and submit to your manager for approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 py-2">
          {/* Leave Type & Balance Preview */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="apply-leave-type" className="text-sm font-medium text-foreground">
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
              <SelectTrigger id="apply-leave-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date pickers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="apply-start-date"
                className="text-sm font-medium text-foreground"
              >
                Start Date
              </Label>
              <Input
                id="apply-start-date"
                type="date"
                required
                min={minStartDate}
                value={startDate}
                aria-invalid={Boolean(startError)}
                aria-describedby={startError ? "apply-start-date-error" : undefined}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (startError) setStartError(null);
                }}
              />
              {startError && (
                <p id="apply-start-date-error" className="text-xs text-destructive flex items-center gap-1" role="alert">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {startError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="apply-end-date"
                className="text-sm font-medium text-foreground"
              >
                End Date
              </Label>
              <Input
                id="apply-end-date"
                type="date"
                required
                min={minEndDate}
                value={endDate}
                aria-invalid={Boolean(dateError)}
                aria-describedby={dateError ? "apply-end-date-error" : undefined}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (dateError) setDateError(null);
                }}
              />
              {dateError && (
                <p id="apply-end-date-error" className="text-xs text-destructive flex items-center gap-1" role="alert">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {dateError}
                </p>
              )}
            </div>
          </div>

          {/* Estimated Days Preview */}
          {calculatedDays > 0 && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between text-sm">
              <span className="text-foreground/80 text-[13px]">Estimated Duration:</span>
              <span className="font-semibold text-primary tabular-nums">
                {calculatedDays} {calculatedDays === 1 ? "day" : "days"} (estimated)
              </span>
            </div>
          )}

          {/* Estimated days label */}
          {calculatedDays > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Estimated (calendar days). Final days are calculated by the server.
            </p>
          )}

          {/* Insufficient balance warning (warns, does not block) */}
          {isExceedingBalance && (
            <div className={cn("p-3 rounded-lg flex items-start gap-2.5 text-xs border", statusBadgeClass("warning"))}>
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>Balance Warning (estimated):</strong> Requested {calculatedDays} days exceed your remaining{" "}
                {remainingDays} days for {leaveType}. You may still submit, but approval is subject to managerial discretion.
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label
              htmlFor="apply-reason-input"
              className="text-sm font-medium text-foreground"
            >
              Reason for absence
            </Label>
            <Textarea
              id="apply-reason-input"
              required
              value={reason}
              aria-invalid={Boolean(reasonError)}
              aria-describedby={reasonError ? "apply-reason-error" : undefined}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError && e.target.value.trim().length >= 5) {
                  setReasonError(null);
                }
              }}
              placeholder="Describe why you need time off (min 5 characters)..."
              className="min-h-[96px]"
            />
            {reasonError && (
              <p id="apply-reason-error" className="text-xs text-destructive flex items-center gap-1" role="alert">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                {reasonError}
              </p>
            )}
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
