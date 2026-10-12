"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/api";
import type { Shift, ShiftOption } from "@/services/attendance/types";

interface DeleteShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift | null;
  onConfirm: (reassignTo?: string) => Promise<void>;
  deleting: boolean;
}

export function DeleteShiftDialog({ open, onOpenChange, shift, onConfirm, deleting }: DeleteShiftDialogProps) {
  const [step, setStep] = useState<"confirm" | "reassign">("confirm");
  const [reassignTo, setReassignTo] = useState("");
  const [reassignOptions, setReassignOptions] = useState<ShiftOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Fetch other active shifts for reassignment
  const loadReassignOptions = async () => {
    if (!shift) return;
    setLoadingOptions(true);
    try {
      const res = await api.get("attendance/shifts/options");
      const data = res as { data?: unknown } | unknown[];
      let list: unknown[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && typeof data === "object" && "data" in data) {
        const d = data as { data?: unknown };
        list = Array.isArray(d.data) ? d.data : [];
      }
      const options = list
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          start_time: item.start_time,
          end_time: item.end_time,
          is_overnight: item.is_overnight,
        }))
        .filter((s: ShiftOption) => s.id !== shift.id);
      setReassignOptions(options);
    } catch (error) {
      console.error("Failed to load reassignment options:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setStep("confirm");
      setReassignTo("");
    }
    onOpenChange(o);
  };

  const handleDelete = async () => {
    if (!shift) return;
    try {
      if (step === "reassign") {
        await onConfirm(reassignTo || undefined);
      } else {
        await onConfirm();
      }
      handleOpenChange(false);
    } catch (error: any) {
      // Check for SHIFT_HAS_ASSIGNMENTS error
      const errorCode = error?.response?.data?.detail?.code || error?.errorCode;
      if (errorCode === "SHIFT_HAS_ASSIGNMENTS") {
        // Switch to reassign step
        await loadReassignOptions();
        setStep("reassign");
      } else if (errorCode === "SHIFT_IS_DEFAULT") {
        toast.error("Cannot delete the default shift. Please assign another shift as default first.");
      } else {
        toast.error(error?.message || "Failed to delete shift");
      }
    }
  };

  if (!shift) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "confirm" ? (
          <>
            <DialogHeader>
              <DialogTitle>Delete Shift Profile</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong className="text-foreground">{shift.name}</strong>?
                {shift.assigned_employees_count && shift.assigned_employees_count > 0 && (
                  <p className="mt-2 text-sm text-amber-500">
                    <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
                    This shift has {shift.assigned_employees_count} assigned employee(s). You will need to reassign them.
                  </p>
                )}
                {shift.is_default && (
                  <p className="mt-2 text-sm text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
                    This is the default shift. It cannot be deleted unless another shift is set as default.
                  </p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting || shift.is_default}
                onClick={handleDelete}
                className="gap-1.5"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <Trash2 className="h-3.5 w-3.5" />
                Delete Shift
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-indigo-400" />
                Reassign Employees
              </DialogTitle>
              <DialogDescription>
                Select a shift to reassign the {shift.assigned_employees_count} employee(s) currently assigned to "{shift.name}".
              </DialogDescription>
            </DialogHeader>
            <div className="py-2 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reassign To</Label>
                <Select value={reassignTo} onValueChange={setReassignTo} disabled={loadingOptions}>
                  <SelectTrigger className="w-full" disabled={loadingOptions}>
                    <SelectValue placeholder="Select a shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingOptions ? (
                      <SelectItem value="" disabled>
                        Loading shifts...
                      </SelectItem>
                    ) : reassignOptions.length === 0 ? (
                      <SelectItem value="" disabled>
                        No other active shifts available
                      </SelectItem>
                    ) : (
                      reassignOptions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({s.code}) - {s.start_time}–{s.end_time} {s.is_overnight ? "(overnight)" : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              {reassignOptions.length === 0 && !loadingOptions && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  No other active shifts available for reassignment. Create another shift first or delete the employees manually.
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep("confirm")} disabled={deleting}>
                Back
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting || !reassignTo}
                onClick={handleDelete}
                className="gap-1.5"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Confirm Reassign & Delete
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}