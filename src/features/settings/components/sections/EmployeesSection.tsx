import React, { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Building, Briefcase, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  fetchDepartmentsList,
  createDepartmentApi,
  deleteDepartmentApi,
  fetchDesignationsList,
  fetchEmployeeSettings,
  updateEmployeeSettings,
  isMissingApiError,
} from "../../api";
import type { DepartmentItem, DesignationItem, EmployeeSettingsForm } from "../../types";
import { UnsavedChangesBanner } from "../UnsavedChangesBanner";

interface EmployeesSectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function EmployeesSection({ canEdit, onDirtyChange }: EmployeesSectionProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Departments & Designations
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [designations, setDesignations] = useState<DesignationItem[]>([]);
  const [addDeptOpen, setAddDeptOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", code: "", description: "" });
  const [creatingDept, setCreatingDept] = useState(false);

  // Employee Rules
  const [initialRules, setInitialRules] = useState<EmployeeSettingsForm | null>(null);
  const [rules, setRules] = useState<EmployeeSettingsForm>({
    idPrefix: "EMP-",
    idNumberLength: 4,
    idSuffix: "",
    probationDays: 90,
    noticePeriodDays: 30,
    allowPastJoiningDate: true,
    maxPastJoiningDays: 60,
    statuses: ["Active", "Probation", "Notice Period", "Terminated", "Suspended"],
    employmentTypes: ["Full-Time", "Part-Time", "Contract", "Intern"],
  });

  const isDirty = initialRules ? JSON.stringify(initialRules) !== JSON.stringify(rules) : false;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const loadData = useCallback(async () => {
    setLoading(true);

    // 1. Load real departments
    try {
      const depts = await fetchDepartmentsList();
      setDepartments(depts);
    } catch (e) {
      console.error("Error loading departments", e);
    }

    // 2. Load real designations
    try {
      const desigs = await fetchDesignationsList();
      setDesignations(desigs);
    } catch (e) {
      console.error("Error loading designations", e);
    }

    // 3. Load employee configuration rules from backend
    try {
      const form = await fetchEmployeeSettings();
      setInitialRules(form);
      setRules(form);
    } catch (err: unknown) {
      if (!isMissingApiError(err)) {
        console.warn("Could not load employee settings rules:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name.trim()) {
      toast.error("Department name is required.");
      return;
    }

    setCreatingDept(true);
    try {
      await createDepartmentApi(newDept);
      toast.success(`Department "${newDept.name}" created successfully!`);
      setAddDeptOpen(false);
      setNewDept({ name: "", code: "", description: "" });
      // Refresh list
      const depts = await fetchDepartmentsList();
      setDepartments(depts);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to create department.";
      toast.error(msg);
    } finally {
      setCreatingDept(false);
    }
  };

  const handleDeleteDepartment = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete department "${name}"?`)) return;
    try {
      await deleteDepartmentApi(id);
      toast.success(`Department "${name}" deleted.`);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to delete department.";
      toast.error(msg);
    }
  };

  const handleSaveRules = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canEdit) return;

    setSubmitting(true);
    try {
      await updateEmployeeSettings(rules);
      setInitialRules(rules);
      toast.success("Employee settings saved successfully!");
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        toast.error("Employee configuration rules API is not implemented on the backend.");
      } else {
        const msg =
          (err as { message?: string })?.message || "Failed to update employee configuration.";
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
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Departments Management Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Departments</h3>
            <p className="text-xs text-muted-foreground">
              Active organizational units in your company.
            </p>
          </div>
          {canEdit && (
            <Button
              size="sm"
              onClick={() => setAddDeptOpen(true)}
              className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Department
            </Button>
          )}
        </div>

        {departments.length === 0 ? (
          <div className="py-8 text-center">
            <Building className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-xs text-muted-foreground">No departments configured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card/80 p-3.5 shadow-2xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {dept.name}
                    </span>
                    {dept.code && (
                      <Badge variant="secondary" className="text-[9px] px-1 py-0">
                        {dept.code}
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">
                    Head: {dept.managerName || "Unassigned"}
                  </p>
                </div>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                    aria-label={`Delete ${dept.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Designations Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Designations & Job Roles
          </h3>
          <p className="text-xs text-muted-foreground">
            Standard job titles configured for team members.
          </p>
        </div>

        {designations.length === 0 ? (
          <div className="py-6 text-center">
            <Briefcase className="mx-auto h-7 w-7 text-muted-foreground/50" />
            <p className="mt-2 text-xs text-muted-foreground">
              Designations are synced through employee onboarding records.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {designations.map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center rounded-lg border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground"
              >
                {d.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Employee ID Format & Joining Rules Card */}
      <form onSubmit={handleSaveRules} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
          <div className="mb-5 border-b border-border/60 pb-4">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Employee ID & Joining Rules
            </h3>
            <p className="text-xs text-muted-foreground">
              Conventions for auto-generating employee IDs and probation timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="id-prefix" className="text-xs font-medium">
                ID Prefix
              </Label>
              <Input
                id="id-prefix"
                value={rules.idPrefix}
                onChange={(e) => setRules({ ...rules, idPrefix: e.target.value })}
                disabled={!canEdit}
                placeholder="e.g. OFC-"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="id-digits" className="text-xs font-medium">
                Sequence Digits
              </Label>
              <Input
                id="id-digits"
                type="number"
                min={2}
                max={8}
                value={rules.idNumberLength}
                onChange={(e) => setRules({ ...rules, idNumberLength: Number(e.target.value) })}
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="id-suffix" className="text-xs font-medium">
                ID Suffix (Optional)
              </Label>
              <Input
                id="id-suffix"
                value={rules.idSuffix}
                onChange={(e) => setRules({ ...rules, idSuffix: e.target.value })}
                disabled={!canEdit}
                placeholder="e.g. -IN"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="probation-days" className="text-xs font-medium">
                Standard Probation Period (Days)
              </Label>
              <Input
                id="probation-days"
                type="number"
                min={0}
                value={rules.probationDays}
                onChange={(e) => setRules({ ...rules, probationDays: Number(e.target.value) })}
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notice-days" className="text-xs font-medium">
                Standard Notice Period (Days)
              </Label>
              <Input
                id="notice-days"
                type="number"
                min={0}
                value={rules.noticePeriodDays}
                onChange={(e) => setRules({ ...rules, noticePeriodDays: Number(e.target.value) })}
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="past-joining-days" className="text-xs font-medium">
                Max Backdated Joining (Days)
              </Label>
              <Input
                id="past-joining-days"
                type="number"
                min={0}
                value={rules.maxPastJoiningDays}
                onChange={(e) => setRules({ ...rules, maxPastJoiningDays: Number(e.target.value) })}
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border/80 bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">
              Generated Sample ID:{" "}
              <strong className="text-foreground">
                {rules.idPrefix}
                {"0".repeat(Math.max(0, rules.idNumberLength - 1))}1{rules.idSuffix}
              </strong>
            </p>
          </div>

          {canEdit && (
            <div className="mt-6 flex justify-end gap-2 border-t border-border/60 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => initialRules && setRules(initialRules)}
                disabled={!isDirty || submitting}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Discard
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!isDirty || submitting}
                className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-3.5 w-3.5" />
                {submitting ? "Saving..." : "Save Employee Rules"}
              </Button>
            </div>
          )}
        </div>

        <UnsavedChangesBanner
          isDirty={isDirty}
          submitting={submitting}
          onReset={() => initialRules && setRules(initialRules)}
          onSave={() => handleSaveRules()}
        />
      </form>

      {/* Add Department Dialog */}
      <Dialog open={addDeptOpen} onOpenChange={setAddDeptOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateDepartment}>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Add New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-dept-name" className="text-xs font-medium">
                  Department Name *
                </Label>
                <Input
                  id="new-dept-name"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  placeholder="e.g. Engineering, Sales, Finance"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-dept-code" className="text-xs font-medium">
                  Department Code
                </Label>
                <Input
                  id="new-dept-code"
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                  placeholder="e.g. ENG, SLS, FIN"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-dept-desc" className="text-xs font-medium">
                  Description
                </Label>
                <Input
                  id="new-dept-desc"
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Optional unit description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddDeptOpen(false)}
                disabled={creatingDept}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={creatingDept || !newDept.name.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {creatingDept ? "Creating..." : "Create Department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
