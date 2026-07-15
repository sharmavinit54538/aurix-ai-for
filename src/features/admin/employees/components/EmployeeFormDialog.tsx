import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Loader } from "@/components/aurix/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Manager } from "@/features/admin/managers/types";
import {
  GENDER_OPTIONS,
  MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS,
  MANAGER_FORM_WORK_LOCATION_OPTIONS,
  OFFICES,
  SHIFT_OPTIONS,
} from "@/features/admin/managers/constants";
import type { EmployeeFormState } from "../employeesTypes";
import { DepartmentSelectContent } from "./DepartmentSelectContent";
import { EmployeeFormArraySections } from "./EmployeeFormArraySections";
import { resolveDepartmentValue } from "../utils/departmentOptions";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  detailLoading?: boolean;
  draft: EmployeeFormState | null;
  onDraftChange: (draft: EmployeeFormState) => void;
  submitting: boolean;
  onSave: () => void;
  managers?: Manager[];
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  isEdit = false,
  detailLoading = false,
  draft,
  onDraftChange,
  submitting,
  onSave,
  managers = [],
}: EmployeeFormDialogProps) {
  const departmentValue = resolveDepartmentValue(draft?.department);

  const reportingManagerOptions = useMemo(() => {
    if (!draft?.reporting_manager_id) return managers;
    if (managers.some((m) => m.id === draft.reporting_manager_id)) return managers;
    return [
      {
        id: draft.reporting_manager_id,
        fullName: "Reporting Manager",
        designation: "",
      } as Manager,
      ...managers,
    ];
  }, [draft?.reporting_manager_id, managers]);

  const officeOptions = useMemo(() => {
    if (draft?.branch && !OFFICES.includes(draft.branch)) {
      return [draft.branch, ...OFFICES];
    }
    return OFFICES;
  }, [draft?.branch]);

  const shiftOptions = useMemo(() => {
    if (draft?.shift && !SHIFT_OPTIONS.some((opt) => opt.value === draft.shift)) {
      return [{ value: draft.shift, label: draft.shift }, ...SHIFT_OPTIONS];
    }
    return SHIFT_OPTIONS;
  }, [draft?.shift]);

  const genderOptions = useMemo(() => {
    if (draft?.gender && !GENDER_OPTIONS.some((opt) => opt.value === draft.gender)) {
      const label = draft.gender.charAt(0).toUpperCase() + draft.gender.slice(1).replace(/_/g, " ");
      return [{ value: draft.gender, label }, ...GENDER_OPTIONS];
    }
    return GENDER_OPTIONS;
  }, [draft?.gender]);

  const workLocationOptions = useMemo(() => {
    if (
      draft?.work_location &&
      !MANAGER_FORM_WORK_LOCATION_OPTIONS.some((opt) => opt.value === draft.work_location)
    ) {
      const label = draft.work_location
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return [{ value: draft.work_location, label }, ...MANAGER_FORM_WORK_LOCATION_OPTIONS];
    }
    return MANAGER_FORM_WORK_LOCATION_OPTIONS;
  }, [draft?.work_location]);

  const updateField = <K extends keyof EmployeeFormState>(field: K, value: EmployeeFormState[K]) => {
    if (!draft) return;
    onDraftChange({ ...draft, [field]: value });
  };

  const isFormReady = Boolean(draft);
  const showForm = isFormReady && !detailLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
      overlayClassName="bg-black/60 backdrop-blur-sm"
      className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl border-border bg-card p-6 md:max-w-4xl"
      onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Edit employee" : "Add employee"}
          </DialogTitle>
        </DialogHeader>
        {isEdit && detailLoading ? (
          <Loader variant="panel" label="Loading employee details..." className="py-12" />
        ) : null}
        {showForm && draft ? (
          <div className="space-y-6 py-2">
            <FormSection title="Personal Information">
              <FormField label="First name" required>
                <Input
                  value={draft.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  placeholder="e.g. John"
                />
              </FormField>
              <FormField label="Last name" required>
                <Input
                  value={draft.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  placeholder="e.g. Doe"
                />
              </FormField>
              <FormField label="Personal email" required>
                <Input
                  type="email"
                  value={draft.personal_email}
                  onChange={(e) => updateField("personal_email", e.target.value)}
                  placeholder="e.g. john.doe@gmail.com"
                />
              </FormField>
              <FormField label="Company email">
                <Input
                  type="email"
                  value={draft.company_email}
                  onChange={(e) => updateField("company_email", e.target.value)}
                  placeholder="e.g. john.doe@company.com"
                />
              </FormField>
              <FormField label="Phone" required>
                <Input
                  value={draft.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
              </FormField>
              <FormField label="Alternate phone">
                <Input
                  value={draft.alternate_phone}
                  onChange={(e) => updateField("alternate_phone", e.target.value)}
                  placeholder="Optional"
                />
              </FormField>
              <FormField label="Date of birth">
                <Input
                  type="date"
                  value={draft.date_of_birth}
                  onChange={(e) => updateField("date_of_birth", e.target.value)}
                />
              </FormField>
              <FormField label="Gender">
                <Select
                  key={`gender-${draft.gender}`}
                  value={draft.gender || undefined}
                  onValueChange={(v) => updateField("gender", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Blood group">
                <Input
                  value={draft.blood_group}
                  onChange={(e) => updateField("blood_group", e.target.value)}
                  placeholder="e.g. A+"
                />
              </FormField>
              <FormField label="Marital status">
                <Input
                  value={draft.marital_status}
                  onChange={(e) => updateField("marital_status", e.target.value)}
                  placeholder="e.g. Single"
                />
              </FormField>
              <FormField label="Profile photo URL" wide>
                <Input
                  value={draft.profile_photo_url}
                  onChange={(e) => updateField("profile_photo_url", e.target.value)}
                  placeholder="https://..."
                />
              </FormField>
            </FormSection>

            <FormSection title="Job Information">
              <FormField label="Department" required>
                <Select
                  key={`department-${departmentValue ?? draft.department}`}
                  value={departmentValue}
                  onValueChange={(v) => updateField("department", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <DepartmentSelectContent
                    key={draft.id || "new"}
                    selectedValue={departmentValue ?? draft.department}
                    extraValues={draft.department ? [draft.department] : []}
                  />
                </Select>
              </FormField>
              <FormField label="Designation" required>
                <Input
                  value={draft.designation}
                  onChange={(e) => updateField("designation", e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </FormField>
              <FormField label="Team">
                <Input
                  value={draft.team}
                  onChange={(e) => updateField("team", e.target.value)}
                  placeholder="e.g. Platform"
                />
              </FormField>
              <FormField label="Reporting manager">
                <Select
                  key={`reporting-${draft.reporting_manager_id}`}
                  value={draft.reporting_manager_id || undefined}
                  onValueChange={(v) => updateField("reporting_manager_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reporting manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportingManagerOptions.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.designation
                          ? `${manager.fullName} (${manager.designation})`
                          : manager.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Office / Branch">
                <Select
                  key={`branch-${draft.branch}`}
                  value={draft.branch || undefined}
                  onValueChange={(v) => updateField("branch", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select office" />
                  </SelectTrigger>
                  <SelectContent>
                    {officeOptions.map((office) => (
                      <SelectItem key={office} value={office}>
                        {office}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Work location">
                <Select
                  key={`work-location-${draft.work_location}`}
                  value={draft.work_location || undefined}
                  onValueChange={(v) => updateField("work_location", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {workLocationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Joining date" required>
                <Input
                  type="date"
                  value={draft.joining_date}
                  onChange={(e) => updateField("joining_date", e.target.value)}
                />
              </FormField>
              <FormField label="Employment type">
                <Select
                  value={draft.employment_type || undefined}
                  onValueChange={(v) => updateField("employment_type", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Shift">
                <Select value={draft.shift || undefined} onValueChange={(v) => updateField("shift", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Leave group">
                <Input
                  value={draft.leave_group}
                  onChange={(e) => updateField("leave_group", e.target.value)}
                  placeholder="e.g. Standard"
                />
              </FormField>
            </FormSection>

            <FormSection title="Compensation">
              <FormField label="CTC (annual)">
                <Input
                  type="number"
                  min={0}
                  value={draft.ctc || ""}
                  onChange={(e) => updateField("ctc", Number(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="Basic salary">
                <Input
                  type="number"
                  min={0}
                  value={draft.basic_salary || ""}
                  onChange={(e) => updateField("basic_salary", Number(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="HRA">
                <Input
                  type="number"
                  min={0}
                  value={draft.hra || ""}
                  onChange={(e) => updateField("hra", Number(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="Bonus">
                <Input
                  type="number"
                  min={0}
                  value={draft.bonus || ""}
                  onChange={(e) => updateField("bonus", Number(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="PF">
                <Input
                  type="number"
                  min={0}
                  value={draft.pf || ""}
                  onChange={(e) => updateField("pf", Number(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="ESI">
                <Input
                  type="number"
                  min={0}
                  value={draft.esi || ""}
                  onChange={(e) => updateField("esi", Number(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="Professional tax">
                <Input
                  type="number"
                  min={0}
                  value={draft.professional_tax || ""}
                  onChange={(e) => updateField("professional_tax", Number(e.target.value) || 0)}
                />
              </FormField>
            </FormSection>

            <EmployeeFormArraySections draft={draft} onDraftChange={onDraftChange} />
          </div>
        ) : null}
        <DialogFooter className="mt-2 flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={submitting || detailLoading || !isFormReady}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
      <hr className="border-border/60" />
    </div>
  );
}

function FormField({
  label,
  children,
  wide,
  required,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
  required?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${wide ? "md:col-span-2 lg:col-span-3" : ""}`}>
      <Label className={`text-xs ${required ? "after:ml-0.5 after:text-rose-500 after:content-['*']" : ""}`}>
        {label}
      </Label>
      {children}
    </div>
  );
}
