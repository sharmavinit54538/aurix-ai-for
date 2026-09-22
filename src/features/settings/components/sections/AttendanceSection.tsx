import React, { useEffect, useState, useCallback } from "react";
import { ScanFace, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchAttendanceSettings,
  updateAttendanceSettings,
  fetchFaceBiometricSupport,
  isMissingApiError,
} from "../../api";
import type { AttendanceSettingsForm } from "../../types";
import { UnsavedChangesBanner } from "../UnsavedChangesBanner";

interface AttendanceSectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function AttendanceSection({ canEdit, onDirtyChange }: AttendanceSectionProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [faceSupported, setFaceSupported] = useState(false);

  const [initialData, setInitialData] = useState<AttendanceSettingsForm | null>(null);
  const [formData, setFormData] = useState<AttendanceSettingsForm>({
    attendanceMethod: "web",
    faceVerificationEnabled: false,
    faceConfidenceThreshold: 85,
    workStartTime: "09:30",
    workEndTime: "18:30",
    fullDayMinHours: 8,
    halfDayMinHours: 4,
    gracePeriodMinutes: 15,
    maxLateMarksPerMonth: 3,
    lateMarkPenaltyType: "half_day",
    earlyLeaveThresholdMinutes: 30,
    overtimeEligible: true,
    minOvertimeMinutes: 60,
    overtimeRateMultiplier: 1.5,
    notifyOnLateCheckIn: true,
    notifyOnMissedCheckOut: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const loadData = useCallback(async () => {
    setLoading(true);

    // 1. Check live backend face biometric enrollment capability
    try {
      const face = await fetchFaceBiometricSupport();
      setFaceSupported(face.supported);
    } catch {
      setFaceSupported(false);
    }

    // 2. Load attendance settings from backend
    try {
      const data = await fetchAttendanceSettings();
      setInitialData(data);
      setFormData(data);
    } catch (err: unknown) {
      if (!isMissingApiError(err)) {
        const msg =
          (err as { message?: string })?.message || "Failed to load attendance configuration.";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (formData.fullDayMinHours <= 0 || formData.fullDayMinHours > 24) {
      errs.fullDayMinHours = "Must be between 1 and 24 hours";
    }
    if (formData.halfDayMinHours <= 0 || formData.halfDayMinHours >= formData.fullDayMinHours) {
      errs.halfDayMinHours = "Must be positive and less than full day hours";
    }
    if (formData.gracePeriodMinutes < 0) {
      errs.gracePeriodMinutes = "Grace period cannot be negative";
    }
    if (formData.overtimeRateMultiplier < 1) {
      errs.overtimeRateMultiplier = "Multiplier must be at least 1.0x";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canEdit) return;
    if (!validate()) {
      toast.error("Please correct invalid attendance rules before saving.");
      return;
    }

    setSubmitting(true);
    try {
      await updateAttendanceSettings(formData);
      setInitialData(formData);
      toast.success("Attendance policies updated successfully!");
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        toast.error("Attendance settings API is not implemented on backend.");
      } else {
        const msg =
          (err as { message?: string })?.message || "Failed to update attendance configuration.";
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Attendance Method & Biometrics */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Attendance Verification Mode
            </h3>
            <p className="text-xs text-muted-foreground">
              Select authorized check-in mechanisms and face verification status.
            </p>
          </div>
          <ScanFace className="h-4 w-4 text-primary shrink-0" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Primary Attendance Method</Label>
            <Select
              value={formData.attendanceMethod}
              onValueChange={(v: AttendanceSettingsForm["attendanceMethod"]) =>
                setFormData({ ...formData, attendanceMethod: v })
              }
              disabled={!canEdit}
            >
              <SelectTrigger id="attendance-method" className="w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web Browser Portal</SelectItem>
                <SelectItem value="mobile_geofence">Mobile App with Geofencing</SelectItem>
                <SelectItem value="face_biometric" disabled={!faceSupported}>
                  Biometric Face Recognition {!faceSupported && "(Backend Unsupported)"}
                </SelectItem>
                <SelectItem value="hybrid">Hybrid (Web + Mobile + Geofence)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">AI Face Verification</Label>
              <p className="text-[11px] text-muted-foreground">
                {faceSupported
                  ? "Live backend support active. Enforces facial recognition at check-in."
                  : "Unavailable: Face recognition module is not enabled by backend attendance service."}
              </p>
            </div>
            <Switch
              checked={formData.faceVerificationEnabled && faceSupported}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, faceVerificationEnabled: checked })
              }
              disabled={!canEdit || !faceSupported}
            />
          </div>
        </div>
      </div>

      {/* Work Hours & Minimum Thresholds */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Work Hours & Shift Boundaries
          </h3>
          <p className="text-xs text-muted-foreground">
            Default office hours and minimum required working duration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="start-time" className="text-xs font-medium">
              Shift Start Time
            </Label>
            <Input
              id="start-time"
              type="time"
              value={formData.workStartTime}
              onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="end-time" className="text-xs font-medium">
              Shift End Time
            </Label>
            <Input
              id="end-time"
              type="time"
              value={formData.workEndTime}
              onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullday-hours" className="text-xs font-medium">
              Full-Day Hours
            </Label>
            <Input
              id="fullday-hours"
              type="number"
              step="0.5"
              min="1"
              max="24"
              value={formData.fullDayMinHours}
              onChange={(e) =>
                setFormData({ ...formData, fullDayMinHours: Number(e.target.value) })
              }
              disabled={!canEdit}
              className={errors.fullDayMinHours ? "border-destructive" : ""}
            />
            {errors.fullDayMinHours && (
              <p className="text-[11px] text-destructive">{errors.fullDayMinHours}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="halfday-hours" className="text-xs font-medium">
              Half-Day Hours
            </Label>
            <Input
              id="halfday-hours"
              type="number"
              step="0.5"
              min="1"
              max="12"
              value={formData.halfDayMinHours}
              onChange={(e) =>
                setFormData({ ...formData, halfDayMinHours: Number(e.target.value) })
              }
              disabled={!canEdit}
              className={errors.halfDayMinHours ? "border-destructive" : ""}
            />
            {errors.halfDayMinHours && (
              <p className="text-[11px] text-destructive">{errors.halfDayMinHours}</p>
            )}
          </div>
        </div>
      </div>

      {/* Late Mark & Grace Period Rules */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Late Marks, Grace Period & Early Exit
          </h3>
          <p className="text-xs text-muted-foreground">
            Tolerance window and automatic deduction triggers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="grace-period" className="text-xs font-medium">
              Grace Period (Minutes)
            </Label>
            <Input
              id="grace-period"
              type="number"
              min="0"
              value={formData.gracePeriodMinutes}
              onChange={(e) =>
                setFormData({ ...formData, gracePeriodMinutes: Number(e.target.value) })
              }
              disabled={!canEdit}
              className={errors.gracePeriodMinutes ? "border-destructive" : ""}
            />
            {errors.gracePeriodMinutes && (
              <p className="text-[11px] text-destructive">{errors.gracePeriodMinutes}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="max-late-marks" className="text-xs font-medium">
              Max Monthly Late Marks
            </Label>
            <Input
              id="max-late-marks"
              type="number"
              min="0"
              value={formData.maxLateMarksPerMonth}
              onChange={(e) =>
                setFormData({ ...formData, maxLateMarksPerMonth: Number(e.target.value) })
              }
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Late Mark Consequence</Label>
            <Select
              value={formData.lateMarkPenaltyType}
              onValueChange={(v: AttendanceSettingsForm["lateMarkPenaltyType"]) =>
                setFormData({ ...formData, lateMarkPenaltyType: v })
              }
              disabled={!canEdit}
            >
              <SelectTrigger id="late-penalty">
                <SelectValue placeholder="Select consequence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="half_day">Deduct Half-Day Leave</SelectItem>
                <SelectItem value="lop">Deduct 1 Day Salary (LOP)</SelectItem>
                <SelectItem value="warning">Official Warning Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Overtime & Notification Rules */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Overtime & Alert Preferences
          </h3>
          <p className="text-xs text-muted-foreground">
            Extra working hours remuneration and system notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="min-ot-minutes" className="text-xs font-medium">
              Minimum Extra Time for OT (Minutes)
            </Label>
            <Input
              id="min-ot-minutes"
              type="number"
              min="0"
              value={formData.minOvertimeMinutes}
              onChange={(e) =>
                setFormData({ ...formData, minOvertimeMinutes: Number(e.target.value) })
              }
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ot-multiplier" className="text-xs font-medium">
              Overtime Rate Multiplier
            </Label>
            <Input
              id="ot-multiplier"
              type="number"
              step="0.1"
              min="1.0"
              value={formData.overtimeRateMultiplier}
              onChange={(e) =>
                setFormData({ ...formData, overtimeRateMultiplier: Number(e.target.value) })
              }
              disabled={!canEdit}
              className={errors.overtimeRateMultiplier ? "border-destructive" : ""}
            />
            {errors.overtimeRateMultiplier && (
              <p className="text-[11px] text-destructive">{errors.overtimeRateMultiplier}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3 sm:col-span-2">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">
                Late Check-in Email Alert
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Notify employee and manager when clock-in exceeds grace period.
              </p>
            </div>
            <Switch
              checked={formData.notifyOnLateCheckIn}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, notifyOnLateCheckIn: checked })
              }
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => initialData && setFormData(initialData)}
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Discard Changes
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-3.5 w-3.5" />
            {submitting ? "Saving..." : "Save Attendance Settings"}
          </Button>
        </div>
      )}

      <UnsavedChangesBanner
        isDirty={isDirty}
        submitting={submitting}
        onReset={() => initialData && setFormData(initialData)}
        onSave={() => handleSave()}
      />
    </form>
  );
}
