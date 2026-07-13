import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepartmentSelectContent } from "@/features/admin/employees/components/DepartmentSelectContent";
import { resolveDepartmentValue } from "@/features/admin/employees/utils/departmentOptions";
import { Loader } from "@/components/aurix/Loader";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Manager } from "../types";
import type { SaveManagerResult } from "../managersTypes";
import { setManagerForm, resetManagerForm, initManagerForm } from "../managersSlice";
import type { ManagerFormState } from "../managersTypes";
import { validateManagerForm } from "../utils";
import {
  OFFICES,
  STATUS_OPTIONS,
  GENDER_OPTIONS,
  MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS,
  MANAGER_FORM_WORK_LOCATION_OPTIONS,
  MANAGER_FORM_PERMISSION_FIELDS,
  SHIFT_OPTIONS,
} from "../constants";
import type { ManagerPermissions } from "../types";

interface ManagerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  manager?: Manager | null;
  detailLoading?: boolean;
  detailError?: string | null;
  existingManagers?: Manager[];
  onSubmit: () => Promise<SaveManagerResult>;
}

export function ManagerFormDialog({
  open,
  onOpenChange,
  isEdit = false,
  manager,
  detailLoading = false,
  detailError = null,
  existingManagers = [],
  onSubmit,
}: ManagerFormDialogProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.managers.managerForm);
  const selectedManagerForm = useAppSelector((state) => state.managers.selectedManagerForm);
  const submitting = useAppSelector((state) => state.managers.submitting);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const departmentValue = useMemo(() => resolveDepartmentValue(form.department), [form.department]);

  const reportingManagerOptions = useMemo(() => {
    const options = existingManagers.filter((m) => !manager || m.id !== manager.id);
    const reportingId = form.reporting_to;
    if (reportingId && !options.some((m) => m.id === reportingId)) {
      const reportingName =
        manager?.reportingManagerName ||
        existingManagers.find((m) => m.id === reportingId)?.fullName ||
        "Reporting Manager";
      return [
        {
          id: reportingId,
          fullName: reportingName,
          designation: "",
        } as Manager,
        ...options,
      ];
    }
    return options;
  }, [existingManagers, form.reporting_to, manager]);
  const officeOptions = useMemo(() => {
    if (form.branch && !OFFICES.includes(form.branch)) {
      return [form.branch, ...OFFICES];
    }
    return OFFICES;
  }, [form.branch]);
  const shiftOptions = useMemo(() => {
    if (form.shift && !SHIFT_OPTIONS.some((opt) => opt.value === form.shift)) {
      return [{ value: form.shift, label: form.shift }, ...SHIFT_OPTIONS];
    }
    return SHIFT_OPTIONS;
  }, [form.shift]);
  const genderOptions = useMemo(() => {
    if (form.gender && !GENDER_OPTIONS.some((opt) => opt.value === form.gender)) {
      const label = form.gender.charAt(0).toUpperCase() + form.gender.slice(1).replace(/_/g, " ");
      return [{ value: form.gender, label }, ...GENDER_OPTIONS];
    }
    return GENDER_OPTIONS;
  }, [form.gender]);
  const workLocationOptions = useMemo(() => {
    if (
      form.work_location &&
      !MANAGER_FORM_WORK_LOCATION_OPTIONS.some((opt) => opt.value === form.work_location)
    ) {
      const label = form.work_location.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      return [{ value: form.work_location, label }, ...MANAGER_FORM_WORK_LOCATION_OPTIONS];
    }
    return MANAGER_FORM_WORK_LOCATION_OPTIONS;
  }, [form.work_location]);
  React.useEffect(() => {
    if (!open) return;
    setFormErrors({});
    if (!isEdit) {
      dispatch(resetManagerForm());
      return;
    }
    if (detailLoading || !selectedManagerForm) return;
    dispatch(initManagerForm(selectedManagerForm));
  }, [dispatch, detailLoading, isEdit, open, selectedManagerForm]);

  const updateField = <K extends keyof ManagerFormState>(field: K, value: ManagerFormState[K]) => {
    dispatch(setManagerForm({ [field]: value } as Partial<ManagerFormState>));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateManagerForm(form, existingManagers, isEdit, manager?.id);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    const result = await onSubmit();
    if (!result.success) {
      setFormErrors(result.fieldErrors);
      if (result.message) toast.error(result.message);
      return;
    }

    setFormErrors({});
    onOpenChange(false);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-black/60 backdrop-blur-sm"
        className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-6 md:max-w-4xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "✏️ Edit Manager" : "➕ Add Manager"}
          </DialogTitle>
        </DialogHeader>

        {isEdit && detailLoading ? (
          <Loader variant="panel" label="Loading manager details..." className="py-12" />
        ) : isEdit && detailError ? (
          <div className="py-12 text-center text-sm text-rose-500">{detailError}</div>
        ) : (
        <form key={manager?.id ?? "new-manager"} onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="after:content-['*'] after:text-rose-500 after:ml-0.5">First Name</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  placeholder="e.g. John"
                  className={formErrors.first_name ? "border-rose-500" : ""}
                />
                {formErrors.first_name && <p className="text-[10px] text-rose-500">{formErrors.first_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Last Name</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  placeholder="e.g. Doe"
                  className={formErrors.last_name ? "border-rose-500" : ""}
                />
                {formErrors.last_name && <p className="text-[10px] text-rose-500">{formErrors.last_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="personal_email" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Email Address</Label>
                <Input
                  id="personal_email"
                  type="email"
                  value={form.personal_email}
                  onChange={(e) => {
                    const email = e.target.value;
                    dispatch(setManagerForm({ personal_email: email, company_email: email }));
                  }}
                  placeholder="e.g. john.doe@aurix.com"
                  className={formErrors.personal_email ? "border-rose-500" : ""}
                />
                {formErrors.personal_email && <p className="text-[10px] text-rose-500">{formErrors.personal_email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Phone Number</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className={formErrors.phone ? "border-rose-500" : ""}
                />
                {formErrors.phone && <p className="text-[10px] text-rose-500">{formErrors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => updateField("date_of_birth", e.target.value)}
                  className={formErrors.date_of_birth ? "border-rose-500" : ""}
                />
                {formErrors.date_of_birth && <p className="text-[10px] text-rose-500">{formErrors.date_of_birth}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Gender</Label>
                <Select
                  key={`gender-${form.gender}`}
                  value={form.gender || undefined}
                  onValueChange={(val) => updateField("gender", val)}
                >
                  <SelectTrigger id="gender" className={formErrors.gender ? "border-rose-500" : ""}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.gender && <p className="text-[10px] text-rose-500">{formErrors.gender}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="blood_group" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Blood Group</Label>
                <Input
                  id="blood_group"
                  value={form.blood_group}
                  onChange={(e) => updateField("blood_group", e.target.value)}
                  placeholder="e.g. A+"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marital_status" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Marital Status</Label>
                <Input
                  id="marital_status"
                  value={form.marital_status}
                  onChange={(e) => updateField("marital_status", e.target.value)}
                  placeholder="e.g. Single"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile_photo_url">Profile Image URL (Optional)</Label>
                <Input
                  id="profile_photo_url"
                  value={form.profile_photo_url}
                  onChange={(e) => updateField("profile_photo_url", e.target.value)}
                  placeholder="https://images.unsplash.com/... or leave blank for initials"
                />
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Job Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="department" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Department</Label>
                <Select
                  key={`department-${departmentValue ?? form.department}`}
                  value={departmentValue}
                  onValueChange={(val) => updateField("department", val)}
                >
                  <SelectTrigger id="department" className={formErrors.department ? "border-rose-500" : ""}>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <DepartmentSelectContent
                    key={`${manager?.id ?? "new"}-${departmentValue ?? form.department}`}
                    selectedValue={departmentValue ?? form.department}
                    extraValues={form.department ? [form.department] : []}
                  />
                </Select>
                {formErrors.department && <p className="text-[10px] text-rose-500">{formErrors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Designation</Label>
                <Input
                  id="designation"
                  value={form.designation}
                  onChange={(e) => updateField("designation", e.target.value)}
                  placeholder="e.g. Senior Engineering Manager"
                  className={formErrors.designation ? "border-rose-500" : ""}
                />
                {formErrors.designation && <p className="text-[10px] text-rose-500">{formErrors.designation}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reporting_to">Reporting Manager</Label>
                <Select
                  key={`reporting-${form.reporting_to}`}
                  value={form.reporting_to || undefined}
                  onValueChange={(val) => updateField("reporting_to", val)}
                >
                  <SelectTrigger id="reporting_to">
                    <SelectValue placeholder="Select Reporting Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportingManagerOptions.length > 0 ? reportingManagerOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.designation ? `${opt.fullName} (${opt.designation})` : opt.fullName}
                      </SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Office Location</Label>
                <Select
                  key={`branch-${form.branch}`}
                  value={form.branch || undefined}
                  onValueChange={(val) => updateField("branch", val)}
                >
                  <SelectTrigger id="branch" className={formErrors.branch ? "border-rose-500" : ""}>
                    <SelectValue placeholder="Select Office" />
                  </SelectTrigger>
                  <SelectContent>
                    {officeOptions.map((off) => (
                      <SelectItem key={off} value={off}>
                        {off}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.branch && <p className="text-[10px] text-rose-500">{formErrors.branch}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="work_location" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Work Location Mode</Label>
                <Select
                  key={`work-location-${form.work_location}`}
                  value={form.work_location || undefined}
                  onValueChange={(val) => updateField("work_location", val)}
                >
                  <SelectTrigger id="work_location" className={formErrors.work_location ? "border-rose-500" : ""}>
                    <SelectValue placeholder="Select Location Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {workLocationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.work_location && <p className="text-[10px] text-rose-500">{formErrors.work_location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="joining_date" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Joining Date</Label>
                <Input
                  id="joining_date"
                  type="date"
                  value={form.joining_date}
                  onChange={(e) => updateField("joining_date", e.target.value)}
                  className={formErrors.joining_date ? "border-rose-500" : ""}
                />
                {formErrors.joining_date && <p className="text-[10px] text-rose-500">{formErrors.joining_date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select
                  value={form.employment_type || undefined}
                  onValueChange={(val) => updateField("employment_type", val)}
                >
                  <SelectTrigger id="employment_type">
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift">Work Shift</Label>
                <Select value={form.shift || undefined} onValueChange={(val) => updateField("shift", val)}>
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="Select Work Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctc">CTC (Optional Annual USD)</Label>
                <Input
                  id="ctc"
                  type="number"
                  value={form.ctc || ""}
                  onChange={(e) => updateField("ctc", Number(e.target.value) || 0)}
                  placeholder="e.g. 120000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_status">Employment Status</Label>
                <Select
                  value={form.employment_status || undefined}
                  onValueChange={(val) => {
                    dispatch(
                      setManagerForm({
                        employment_status: val,
                        probation_period_months: val === "PROBATION" ? 3 : 0,
                      }),
                    );
                  }}
                >
                  <SelectTrigger id="employment_status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <hr className="border-border/60" />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Permissions & Access Settings
            </h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {(Object.keys(form.permissions) as Array<keyof ManagerPermissions>).map((key) => (
                <div key={key} className="flex items-center space-x-2 rounded-xl border border-border/40 p-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <Checkbox
                    id={key}
                    checked={form.permissions[key as keyof ManagerFormState["permissions"] as keyof ManagerPermissions & keyof ManagerFormState["permissions"]]}
                    onCheckedChange={(checked) =>
                      updateField("permissions", { ...form.permissions, [key as keyof ManagerFormState["permissions"] as keyof ManagerPermissions & keyof ManagerFormState["permissions"]]: !!checked })
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor={key} className="text-xs font-medium cursor-pointer leading-tight select-none">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-6 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="rounded-xl border-border bg-card hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
            >
              {submitting ? (
                <Loader label="Saving..." size="sm" className="text-brand-foreground" />
              ) : (
                "Save Manager"
              )}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
