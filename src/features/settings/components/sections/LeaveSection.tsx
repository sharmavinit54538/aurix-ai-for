import React, { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, RotateCcw } from "lucide-react";
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
import { fetchLeaveSettings, updateLeaveSettings, isMissingApiError } from "../../api";
import type { LeaveSettingsForm, LeaveTypeItem } from "../../types";
import { UnsavedChangesBanner } from "../UnsavedChangesBanner";

interface LeaveSectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

const DEFAULT_LEAVE_TYPES: LeaveTypeItem[] = [
  {
    id: "sl",
    name: "Sick Leave",
    annualQuota: 12,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    requiresAttachment: true,
    paid: true,
  },
  {
    id: "cl",
    name: "Casual Leave",
    annualQuota: 12,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    requiresAttachment: false,
    paid: true,
  },
  {
    id: "el",
    name: "Earned / Privilege Leave",
    annualQuota: 15,
    carryForwardAllowed: true,
    maxCarryForwardDays: 30,
    requiresAttachment: false,
    paid: true,
  },
  {
    id: "mat",
    name: "Maternity Leave",
    annualQuota: 180,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    requiresAttachment: true,
    paid: true,
  },
  {
    id: "pat",
    name: "Paternity Leave",
    annualQuota: 15,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    requiresAttachment: false,
    paid: true,
  },
];

export function LeaveSection({ canEdit, onDirtyChange }: LeaveSectionProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [missingNotice, setMissingNotice] = useState<string | null>(null);

  const [initialData, setInitialData] = useState<LeaveSettingsForm | null>(null);
  const [formData, setFormData] = useState<LeaveSettingsForm>({
    leaveTypes: DEFAULT_LEAVE_TYPES,
    approvalWorkflow: "manager_then_hr",
    autoApproveDaysAfterPending: 7,
    allowNegativeBalance: false,
    notifyOnLeaveRequest: true,
    notifyOnApprovalDecision: true,
  });

  const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setMissingNotice(null);
    try {
      const data = await fetchLeaveSettings();
      const combined = {
        ...data,
        leaveTypes:
          data.leaveTypes && data.leaveTypes.length > 0 ? data.leaveTypes : DEFAULT_LEAVE_TYPES,
      };
      setInitialData(combined);
      setFormData(combined);
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        setMissingNotice(err.message);
        setInitialData(formData);
      } else {
        const msg = (err as { message?: string })?.message || "Failed to load leave settings.";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateType = <K extends keyof LeaveTypeItem>(
    index: number,
    key: K,
    val: LeaveTypeItem[K],
  ) => {
    const updated = [...formData.leaveTypes];
    updated[index] = { ...updated[index], [key]: val };
    setFormData({ ...formData, leaveTypes: updated });
  };

  const handleAddType = () => {
    const newId = `leave_${Date.now()}`;
    const newType: LeaveTypeItem = {
      id: newId,
      name: "New Leave Category",
      annualQuota: 10,
      carryForwardAllowed: false,
      maxCarryForwardDays: 0,
      requiresAttachment: false,
      paid: true,
    };
    setFormData({ ...formData, leaveTypes: [...formData.leaveTypes, newType] });
  };

  const handleDeleteType = (index: number) => {
    const updated = formData.leaveTypes.filter((_, i) => i !== index);
    setFormData({ ...formData, leaveTypes: updated });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canEdit) return;

    for (const lt of formData.leaveTypes) {
      if (lt.annualQuota < 0) {
        toast.error(`Quota for ${lt.name} cannot be negative.`);
        return;
      }
      if (lt.maxCarryForwardDays < 0) {
        toast.error(`Carry forward days for ${lt.name} cannot be negative.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await updateLeaveSettings(formData);
      setInitialData(formData);
      toast.success("Leave policies updated successfully!");
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        setMissingNotice(err.message);
        toast.error("Leave configuration API is not implemented on backend.");
      } else {
        const msg = (err as { message?: string })?.message || "Failed to update leave settings.";
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
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Leave Types & Allowances Table */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Leave Categories & Annual Quotas
            </h3>
            <p className="text-xs text-muted-foreground">
              Define statutory leave allowances and rollover rules.
            </p>
          </div>
          {canEdit && (
            <Button
              type="button"
              size="sm"
              onClick={handleAddType}
              className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Leave Type
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {formData.leaveTypes.map((type, idx) => (
            <div
              key={type.id}
              className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card/80 p-3.5 sm:grid-cols-12 sm:items-center"
            >
              <div className="space-y-1 sm:col-span-4">
                <Label className="text-[11px] font-medium text-muted-foreground">
                  Category Name
                </Label>
                <Input
                  value={type.name}
                  onChange={(e) => handleUpdateType(idx, "name", e.target.value)}
                  disabled={!canEdit}
                  className="h-8 text-xs font-medium"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-[11px] font-medium text-muted-foreground">Annual Days</Label>
                <Input
                  type="number"
                  min={0}
                  value={type.annualQuota}
                  onChange={(e) => handleUpdateType(idx, "annualQuota", Number(e.target.value))}
                  disabled={!canEdit}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-medium text-muted-foreground">
                    Carry Forward
                  </Label>
                  <Switch
                    checked={type.carryForwardAllowed}
                    onCheckedChange={(c) => handleUpdateType(idx, "carryForwardAllowed", c)}
                    disabled={!canEdit}
                  />
                </div>
                {type.carryForwardAllowed ? (
                  <Input
                    type="number"
                    min={0}
                    value={type.maxCarryForwardDays}
                    onChange={(e) =>
                      handleUpdateType(idx, "maxCarryForwardDays", Number(e.target.value))
                    }
                    disabled={!canEdit}
                    placeholder="Max days"
                    className="h-8 text-xs"
                  />
                ) : (
                  <span className="text-[10px] text-muted-foreground italic">No carry-forward</span>
                )}
              </div>

              <div className="flex items-center justify-between sm:col-span-2">
                <div className="space-y-0.5">
                  <Label className="text-[11px] font-medium text-muted-foreground">Paid</Label>
                  <div>
                    <Switch
                      checked={type.paid}
                      onCheckedChange={(c) => handleUpdateType(idx, "paid", c)}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end sm:col-span-1">
                {canEdit && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteType(idx)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Flow & Policy Rules */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Approval Routing & Restrictions
          </h3>
          <p className="text-xs text-muted-foreground">
            Multi-tier hierarchy and balance deficit safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Leave Approval Hierarchy</Label>
            <Select
              value={formData.approvalWorkflow}
              onValueChange={(v: LeaveSettingsForm["approvalWorkflow"]) =>
                setFormData({ ...formData, approvalWorkflow: v })
              }
              disabled={!canEdit}
            >
              <SelectTrigger id="leave-workflow" className="w-full">
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_manager">Reporting Manager Only</SelectItem>
                <SelectItem value="manager_then_hr">Reporting Manager then HR Admin</SelectItem>
                <SelectItem value="hr_only">HR Operations Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auto-approve-days" className="text-xs font-medium">
              Auto-Escalate / Approve (Days)
            </Label>
            <Input
              id="auto-approve-days"
              type="number"
              min={1}
              value={formData.autoApproveDaysAfterPending}
              onChange={(e) =>
                setFormData({ ...formData, autoApproveDaysAfterPending: Number(e.target.value) })
              }
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4 sm:col-span-2">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">
                Prevent Negative Leave Balances
              </Label>
              <p className="text-[11px] text-muted-foreground">
                When enabled, employees cannot apply for leave beyond their earned/allocated
                balance.
              </p>
            </div>
            <Switch
              checked={!formData.allowNegativeBalance}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, allowNegativeBalance: !checked })
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
            {submitting ? "Saving..." : "Save Leave Settings"}
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
