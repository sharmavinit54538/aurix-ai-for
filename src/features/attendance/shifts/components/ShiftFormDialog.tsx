"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Moon, Sun, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { shiftFormSchema, ShiftFormData, computeShiftDuration, computeWorkHours, isOvernight, formatDurationMinutes, formatHHmmTo12h } from "../schemas/shiftFormSchema";
import { WEEK_DAYS } from "@/lib/datetime";

interface ShiftFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ShiftFormData) => Promise<void>;
  initialData?: Partial<ShiftFormData> | null;
  submitting: boolean;
  isEditing: boolean;
}

export function ShiftFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  submitting,
  isEditing,
}: ShiftFormDialogProps) {
  const form = useForm<ShiftFormData>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      name: "",
      code: "",
      startTime: "09:00",
      endTime: "18:00",
      gracePeriodMinutes: 15,
      breakDurationMinutes: 60,
      nightShift: false,
      nightPremiumPercent: 0,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      description: "",
      isActive: true,
      ...initialData,
    },
    mode: "onChange",
  });

  const watchedStartTime = form.watch("startTime");
  const watchedEndTime = form.watch("endTime");
  const watchedBreakDuration = form.watch("breakDurationMinutes");
  const watchedNightShift = form.watch("nightShift");
  const watchedNightPremium = form.watch("nightPremiumPercent");
  const watchedGrace = form.watch("gracePeriodMinutes");
  const errors = form.formState.errors;

  // Reset night premium when night shift is disabled
  useEffect(() => {
    if (!watchedNightShift) {
      form.setValue("nightPremiumPercent", 0, { shouldValidate: true });
    }
  }, [watchedNightShift, form]);

  // Force uppercase for code
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "code") {
        form.setValue("code", value.code?.toUpperCase() || "", { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data: ShiftFormData) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      // Error handled by caller
    }
  };

  const duration = computeShiftDuration(watchedStartTime, watchedEndTime);
  const workHours = computeWorkHours(watchedStartTime, watchedEndTime, watchedBreakDuration);
  const overnight = isOvernight(watchedStartTime, watchedEndTime);
  const showOvernightHint = overnight && !watchedNightShift;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Shift Schedule" : "Create New Shift"}</DialogTitle>
          <DialogDescription>
            Configure timing, grace periods, night differentials, and working days for this shift profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shift Name *</Label>
              <Input
                placeholder="e.g. Morning Shift"
                {...form.register("name")}
                className="mt-1 h-9 text-xs"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-destructive" role="alert">{errors.name.message}</p>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shift Code *</Label>
              <Input
                placeholder="e.g. MS-01"
                {...form.register("code")}
                className="mt-1 h-9 text-xs uppercase"
                aria-invalid={!!errors.code}
              />
              {errors.code && (
                <p className="mt-1 text-[11px] text-destructive" role="alert">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Start Time *</Label>
              <Input
                type="time"
                {...form.register("startTime")}
                className="mt-1 h-9 text-xs"
                aria-invalid={!!errors.startTime || !!errors.endTime}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">End Time *</Label>
              <Input
                type="time"
                {...form.register("endTime")}
                className="mt-1 h-9 text-xs"
                aria-invalid={!!errors.endTime || !!errors.startTime}
              />
            </div>
          </div>

          {/* Computed duration display */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Shift Duration</span>
              <span className="font-mono font-semibold text-foreground">{formatDurationMinutes(duration)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Net Working Hours</span>
              <span className="font-mono font-semibold text-foreground">{formatDurationMinutes(workHours)}</span>
            </div>
            {overnight && (
              <Badge variant={watchedNightShift ? "secondary" : "outline"} className="gap-1 text-[10px]">
                {watchedNightShift ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                {watchedNightShift ? "Night Shift (overnight)" : "Overnight shift — Night Shift disabled"}
              </Badge>
            )}
            {showOvernightHint && (
              <p className="text-[11px] text-amber-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This shift spans midnight; enable Night Shift if night differential applies.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Grace Period (minutes)</Label>
              <Input
                type="number"
                min={0}
                max={120}
                {...form.register("gracePeriodMinutes", { valueAsNumber: true })}
                className="mt-1 h-9 text-xs"
                aria-invalid={!!errors.gracePeriodMinutes}
                aria-describedby="grace-help"
              />
              {errors.gracePeriodMinutes && (
                <p className="mt-1 text-[11px] text-destructive" role="alert">{errors.gracePeriodMinutes.message}</p>
              )}
              <p id="grace-help" className="mt-1 text-[10px] text-muted-foreground">Late tolerance window</p>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Break Duration (minutes)</Label>
              <Input
                type="number"
                min={0}
                max={180}
                {...form.register("breakDurationMinutes", { valueAsNumber: true })}
                className="mt-1 h-9 text-xs"
                aria-invalid={!!errors.breakDurationMinutes}
                aria-describedby="break-help"
              />
              {errors.breakDurationMinutes && (
                <p className="mt-1 text-[11px] text-destructive" role="alert">{errors.breakDurationMinutes.message}</p>
              )}
              <p id="break-help" className="mt-1 text-[10px] text-muted-foreground">Unpaid break time</p>
            </div>
          </div>

          {/* Night Shift Toggle & Premium */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-purple-400" />
                <div>
                  <div className="text-xs font-semibold">Night Shift Schedule</div>
                  <p className="text-[11px] text-muted-foreground">Applies night shift policy and differential pay.</p>
                </div>
              </div>
              <Checkbox
                checked={watchedNightShift}
                onCheckedChange={(checked) => form.setValue("nightShift", checked)}
                className="h-4 w-4 rounded cursor-pointer"
              />
            </div>

            {watchedNightShift && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Night Shift Differential Premium (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  {...form.register("nightPremiumPercent", { valueAsNumber: true })}
                  className="mt-1 h-8 text-xs w-32"
                  aria-invalid={!!errors.nightPremiumPercent}
                />
                {errors.nightPremiumPercent && (
                  <p className="mt-1 text-[11px] text-destructive" role="alert">{errors.nightPremiumPercent.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Working Days */}
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Working Days</Label>
            <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="Working days">
              {WEEK_DAYS.map((d) => {
                const selected = form.watch("workingDays").includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      const current = form.getValues("workingDays");
                      form.setValue(
                        "workingDays",
                        current.includes(d) ? current.filter((day) => day !== d) : [...current, d],
                        { shouldValidate: true }
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selected
                        ? "bg-indigo-600 text-white font-semibold shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    aria-pressed={selected}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            {errors.workingDays && (
              <p className="mt-1 text-[11px] text-destructive" role="alert">{errors.workingDays.message}</p>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description / Notes</Label>
            <Textarea
              rows={2}
              placeholder="Optional notes or eligibility requirements..."
              {...form.register("description")}
              className="mt-1 resize-none text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="shift-active"
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
            <Label htmlFor="shift-active" className="text-xs font-medium cursor-pointer">
              Active Shift (available for scheduling and roster assignment)
            </Label>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <p className="font-medium">Please fix the errors above before saving.</p>
            </div>
          )}

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="gap-1.5">
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEditing ? "Update Shift" : "Save Shift"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}