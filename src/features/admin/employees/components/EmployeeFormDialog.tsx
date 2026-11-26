"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  IndianRupee,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Employee } from "../employeesTypes";
import { departmentsApi } from "@/services/departmentsApi";
import { designationsApi } from "@/services/designationsApi";
import { shiftsApi } from "@/services/shiftsApi";

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
] as const;

const EMPLOYMENT_TYPES = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Intern", value: "INTERN" },
] as const;

const WORK_MODES = [
  { label: "Office / On-Site", value: "OFFICE" },
  { label: "Remote / WFH", value: "REMOTE" },
  { label: "Hybrid", value: "HYBRID" },
] as const;

const PROBATION_OPTIONS = [
  { label: "3 months", value: 3 },
  { label: "6 months", value: 6 },
  { label: "No Probation (Confirmed)", value: 0 },
] as const;

const SYSTEM_ROLES = [
  { label: "Employee", value: "employee" },
  { label: "Manager", value: "manager" },
  { label: "Executive", value: "executive" },
  { label: "IT Admin", value: "it_admin" },
] as const;

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Employee | null;
  onDraftChange: (draft: Employee) => void;
  submitting: boolean;
  onSave: () => void;
  existingEmployees?: Employee[];
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  submitting,
  onSave,
  existingEmployees = [],
}: EmployeeFormDialogProps) {
  const isEdit = Boolean(draft && draft.id !== "");

  // State for dynamic options
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([]);
  const [designations, setDesignations] = useState<Array<{ id: string; name: string }>>([]);
  const [shifts, setShifts] = useState<Array<{ id: string; name: string }>>([]);
  const [managers, setManagers] = useState<Array<{ id: string; name: string; designation?: string; department?: string }>>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"firstName" | "officialEmail" | "personalEmail", string>>
  >({});

  useEffect(() => {
    setFieldErrors({});
  }, [open, draft?.id]);

  // Fetch dynamic options on mount and when draft changes
  useEffect(() => {
    let mounted = true;
    setLoadingOptions(true);

    const fetchOptions = async () => {
      try {
        const [deptsRes, desigsRes, shiftsRes] = await Promise.allSettled([
          departmentsApi.getDepartments({ limit: 100 }),
          designationsApi.getDesignations({ limit: 100 }),
          shiftsApi.getShifts({ limit: 100 }),
        ]);

        if (!mounted) return;

        if (deptsRes.status === "fulfilled") {
          setDepartments(deptsRes.value.items.map((d) => ({ id: d.id, name: d.name })));
        }
        if (desigsRes.status === "fulfilled") {
          setDesignations(desigsRes.value.items.map((d) => ({ id: d.id, name: d.name })));
        }
        if (shiftsRes.status === "fulfilled") {
          setShifts(shiftsRes.value.items.map((s) => ({ id: s.id, name: s.name })));
        }

        // Build managers list from existing employees
        const managerList = existingEmployees
          .filter((emp) => emp.id && emp.fullName)
          .map((emp) => ({
            id: emp.id,
            name: emp.fullName,
            designation: emp.designation,
            department: emp.department,
          }));
        setManagers(managerList);
      } catch {
        // Ignore errors, fallback to empty arrays
      } finally {
        if (mounted) setLoadingOptions(false);
      }
    };

    fetchOptions();
    return () => {
      mounted = false;
    };
  }, [existingEmployees]);

  // Build department list with fallback for current draft value
  const departmentList = useMemo(() => {
    const list = new Set<string>();
    departments.forEach((d) => list.add(d.name));
    if (draft?.department && !list.has(draft.department)) {
      list.add(draft.department);
    }
    return Array.from(list);
  }, [departments, draft?.department]);

  // Build managers list with fallback for current draft value
  const managerOptions = useMemo(() => {
    const list = new Set<string>();
    managers.forEach((m) => {
      const label = m.designation ? `${m.name} (${m.designation})` : m.name;
      list.add(label);
    });
    if (draft?.reportingManagerName && !list.has(draft.reportingManagerName)) {
      list.add(draft.reportingManagerName);
    }
    return Array.from(list);
  }, [managers, draft?.reportingManagerName]);

  // Build designations list with fallback
  const designationList = useMemo(() => {
    const list = new Set<string>();
    designations.forEach((d) => list.add(d.name));
    if (draft?.designation && !list.has(draft.designation)) {
      list.add(draft.designation);
    }
    return Array.from(list);
  }, [designations, draft?.designation]);

  // Build shifts list with fallback
  const shiftList = useMemo(() => {
    const list = new Set<string>();
    shifts.forEach((s) => list.add(s.name));
    if (draft?.shift && !list.has(draft.shift)) {
      list.add(draft.shift);
    }
    return Array.from(list);
  }, [shifts, draft?.shift]);

  if (!draft) return null;

  const firstNameVal =
    draft.firstName !== undefined
      ? draft.firstName
      : (draft.fullName || "").split(" ")[0] || "";
  const lastNameVal =
    draft.lastName !== undefined
      ? draft.lastName
      : (draft.fullName || "").split(" ").slice(1).join(" ") || "";

  const officialEmailVal = draft.companyEmail ?? draft.email ?? "";
  const personalEmailVal = draft.personalEmail ?? "";

  const updateName = (nextFirst: string, nextLast: string) => {
    const combined = `${nextFirst} ${nextLast}`.trim();
    onDraftChange({
      ...draft,
      firstName: nextFirst,
      lastName: nextLast,
      fullName: combined,
    });
  };

  // Handle reporting manager selection by ID
  const handleManagerChange = (val: string) => {
    const selectedManager = managers.find((m) =>
      `${m.name} (${m.designation || ""})`.trim() === val || m.name === val
    );
    onDraftChange({
      ...draft,
      managerName: val === "none" ? "" : val,
      reportingManagerName: val === "none" ? "" : val,
      reportingManagerId: selectedManager?.id || null,
    });
  };

  // Handle designation change - could fetch department if needed
  const handleDesignationChange = (val: string) => {
    onDraftChange({ ...draft, designation: val });
  };

  // Handle department change
  const handleDepartmentChange = (val: string) => {
    onDraftChange({ ...draft, department: val });
  };

  // Handle salary/CTC change - ensure numeric
  const handleSalaryChange = (val: string) => {
    const numericVal = val.replace(/[^0-9.]/g, "");
    onDraftChange({
      ...draft,
      ctc: numericVal ? Number(numericVal) : undefined,
      salary: numericVal ? Number(numericVal) : undefined,
    });
  };

  const handleValidateAndSave = () => {
    const nextErrors: Partial<Record<"firstName" | "officialEmail" | "personalEmail", string>> = {};
    if (!firstNameVal.trim()) {
      nextErrors.firstName = "First name is required.";
    }
    if (!officialEmailVal.trim()) {
      nextErrors.officialEmail = "Official email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(officialEmailVal.trim())) {
      nextErrors.officialEmail = "Enter a valid official email address.";
    }
    if (personalEmailVal.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalEmailVal.trim())) {
      nextErrors.personalEmail = "Enter a valid personal email address.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidId = nextErrors.firstName
        ? "emp-first-name"
        : nextErrors.officialEmail
          ? "emp-official-email"
          : "emp-personal-email";
      document.getElementById(firstInvalidId)?.focus();
      return;
    }
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden overflow-y-hidden">
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border bg-card">
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit Employee Profile" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Complete personal details, organization & job classification, and compensation & system access settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* ── Section 1: Personal Details ─────────────────────────────── */}
          <section aria-labelledby="emp-section-personal" className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border pb-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h3 id="emp-section-personal" className="text-sm font-semibold text-foreground">
                  Personal Details
                </h3>
                <p className="text-xs text-muted-foreground">
                  Legal name, official & personal email addresses, mobile number, gender, and date of birth
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="First Name *" htmlFor="emp-first-name" error={fieldErrors.firstName}>
                <Input
                  id="emp-first-name"
                  placeholder="e.g. Kabir"
                  value={firstNameVal}
                  aria-invalid={Boolean(fieldErrors.firstName)}
                  aria-describedby={fieldErrors.firstName ? "emp-first-name-error" : undefined}
                  onChange={(e) => {
                    updateName(e.target.value, lastNameVal);
                    if (fieldErrors.firstName && e.target.value.trim()) {
                      setFieldErrors((prev) => ({ ...prev, firstName: undefined }));
                    }
                  }}
                />
              </FormField>

              <FormField label="Last Name *" htmlFor="emp-last-name">
                <Input
                  id="emp-last-name"
                  placeholder="e.g. Mehta"
                  value={lastNameVal}
                  onChange={(e) => updateName(firstNameVal, e.target.value)}
                />
              </FormField>

              <FormField label="Official Email *" htmlFor="emp-official-email" error={fieldErrors.officialEmail}>
                <Input
                  id="emp-official-email"
                  type="email"
                  placeholder="e.g. kabir.mehta@ofc360.com"
                  value={officialEmailVal}
                  aria-invalid={Boolean(fieldErrors.officialEmail)}
                  aria-describedby={fieldErrors.officialEmail ? "emp-official-email-error" : undefined}
                  onChange={(e) => {
                    onDraftChange({
                      ...draft,
                      companyEmail: e.target.value,
                      email: e.target.value,
                    });
                    if (fieldErrors.officialEmail && e.target.value.trim()) {
                      setFieldErrors((prev) => ({ ...prev, officialEmail: undefined }));
                    }
                  }}
                />
              </FormField>

              <FormField label="Personal Email" htmlFor="emp-personal-email" error={fieldErrors.personalEmail}>
                <Input
                  id="emp-personal-email"
                  type="email"
                  placeholder="e.g. kabir.personal@gmail.com"
                  value={personalEmailVal}
                  aria-invalid={Boolean(fieldErrors.personalEmail)}
                  aria-describedby={fieldErrors.personalEmail ? "emp-personal-email-error" : undefined}
                  onChange={(e) => {
                    onDraftChange({
                      ...draft,
                      personalEmail: e.target.value,
                    });
                    if (fieldErrors.personalEmail) {
                      setFieldErrors((prev) => ({ ...prev, personalEmail: undefined }));
                    }
                  }}
                />
              </FormField>

              <FormField label="Mobile Number *" htmlFor="emp-mobile">
                <Input
                  id="emp-mobile"
                  placeholder="e.g. +91 98201 11223"
                  value={draft.phone || ""}
                  onChange={(e) =>
                    onDraftChange({ ...draft, phone: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Gender" htmlFor="emp-gender">
                <Select
                  value={draft.gender || "MALE"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, gender: val })
                  }
                >
                  <SelectTrigger id="emp-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Date of Birth" htmlFor="emp-dob">
                <Input
                  id="emp-dob"
                  type="date"
                  value={draft.dateOfBirth || ""}
                  onChange={(e) =>
                    onDraftChange({ ...draft, dateOfBirth: e.target.value })
                  }
                />
              </FormField>
            </div>
          </section>

          {/* ── Section 2: Organization, Job & Classification ───────────── */}
          <section aria-labelledby="emp-section-org" className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center gap-2.5 border-b border-border pb-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <h3 id="emp-section-org" className="text-sm font-semibold text-foreground">
                  Organization, Job & Classification
                </h3>
                <p className="text-xs text-muted-foreground">
                  Employee code, department, designation, reporting manager, shift, and work mode
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Employee Code" htmlFor="emp-code">
                <div className="flex items-center gap-2">
                  <Input
                    id="emp-code"
                    placeholder="Auto-generated if left blank"
                    value={draft.employeeId || ""}
                    onChange={(e) =>
                      onDraftChange({ ...draft, employeeId: e.target.value })
                    }
                    className="font-mono"
                    disabled={isEdit}
                  />
                  {loadingOptions && (
                    <Button type="button" variant="outline" size="icon" disabled aria-label="Loading options">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </Button>
                  )}
                </div>
              </FormField>

              <FormField label="Department *" htmlFor="emp-department">
                <Select
                  value={draft.department || ""}
                  onValueChange={handleDepartmentChange}
                  disabled={loadingOptions}
                >
                  <SelectTrigger id="emp-department">
                    <SelectValue placeholder={loadingOptions ? "Loading..." : "Select department"} />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentList.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingOptions && <p className="text-xs text-muted-foreground">Loading departments...</p>}
              </FormField>

              <FormField label="Designation *" htmlFor="emp-designation">
                <Select
                  value={draft.designation || ""}
                  onValueChange={handleDesignationChange}
                  disabled={loadingOptions}
                >
                  <SelectTrigger id="emp-designation">
                    <SelectValue placeholder={loadingOptions ? "Loading..." : "Select designation"} />
                  </SelectTrigger>
                  <SelectContent>
                    {designationList.map((desig) => (
                      <SelectItem key={desig} value={desig}>
                        {desig}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingOptions && <p className="text-xs text-muted-foreground">Loading designations...</p>}
              </FormField>

              <FormField label="Reporting Manager" htmlFor="emp-manager">
                <Select
                  value={draft.reportingManagerName ? `${draft.reportingManagerName} (${draft.designation || ""})`.trim() : "none"}
                  onValueChange={handleManagerChange}
                  disabled={loadingOptions}
                >
                  <SelectTrigger id="emp-manager">
                    <SelectValue placeholder={loadingOptions ? "Loading..." : "Select reporting manager"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Direct to Leadership)</SelectItem>
                    {managerOptions.map((mgr) => (
                      <SelectItem key={mgr} value={mgr}>
                        {mgr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Date of Joining *" htmlFor="emp-joining-date">
                <Input
                  id="emp-joining-date"
                  type="date"
                  value={draft.joiningDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    onDraftChange({ ...draft, joiningDate: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Employment Type" htmlFor="emp-employment-type">
                <Select
                  value={draft.employmentType || "FULL_TIME"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, employmentType: val })
                  }
                >
                  <SelectTrigger id="emp-employment-type">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Work Mode" htmlFor="emp-work-mode">
                <Select
                  value={draft.workMode || "OFFICE"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, workMode: val })
                  }
                >
                  <SelectTrigger id="emp-work-mode">
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_MODES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Probation Period" htmlFor="emp-probation">
                <Select
                  value={String(draft.probationPeriodMonths ?? 3)}
                  onValueChange={(val) =>
                    onDraftChange({
                      ...draft,
                      probationPeriodMonths: Number(val),
                    })
                  }
                >
                  <SelectTrigger id="emp-probation">
                    <SelectValue placeholder="Select probation period" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROBATION_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={String(p.value)}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Default Shift Assignment" htmlFor="emp-shift">
                <Select
                  value={draft.shift || ""}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, shift: val })
                  }
                  disabled={loadingOptions}
                >
                  <SelectTrigger id="emp-shift">
                    <SelectValue placeholder={loadingOptions ? "Loading..." : "Select default shift"} />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftList.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingOptions && <p className="text-xs text-muted-foreground">Loading shifts...</p>}
              </FormField>

              <FormField label="Work Location" htmlFor="emp-work-location">
                <Input
                  id="emp-work-location"
                  placeholder="e.g. Bengaluru · Global HQ"
                  value={draft.workLocation ?? draft.officeLocation ?? ""}
                  onChange={(e) =>
                    onDraftChange({
                      ...draft,
                      workLocation: e.target.value,
                      officeLocation: e.target.value,
                    })
                  }
                />
              </FormField>
            </div>
          </section>

          {/* ── Section 3: Compensation, Role & Invite ──────────────────── */}
          <section aria-labelledby="emp-section-comp" className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center gap-2.5 border-b border-border pb-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <IndianRupee className="h-4 w-4" />
              </div>
              <div>
                <h3 id="emp-section-comp" className="text-sm font-semibold text-foreground">
                  Compensation, Role & Invite
                </h3>
                <p className="text-xs text-muted-foreground">
                  Annual CTC package, system access role, and digital onboarding invitation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Annual CTC (₹)" htmlFor="emp-ctc">
                <Input
                  id="emp-ctc"
                  type="number"
                  placeholder="e.g. 1200000"
                  value={draft.ctc ? String(draft.ctc) : ""}
                  onChange={(e) => {
                    const numericVal = e.target.value.replace(/[^0-9]/g, "");
                    onDraftChange({
                      ...draft,
                      ctc: numericVal ? Number(numericVal) : undefined,
                    });
                  }}
                  step="1000"
                  min="0"
                />
              </FormField>

              <FormField label="Monthly Salary (₹)" htmlFor="emp-salary">
                <Input
                  id="emp-salary"
                  type="number"
                  placeholder="e.g. 100000"
                  value={draft.salary ? String(draft.salary) : ""}
                  onChange={(e) => {
                    const numericVal = e.target.value.replace(/[^0-9]/g, "");
                    onDraftChange({
                      ...draft,
                      salary: numericVal ? Number(numericVal) : undefined,
                    });
                  }}
                  step="1000"
                  min="0"
                />
              </FormField>

              <FormField label="System Access Role" htmlFor="emp-role">
                <Select
                  value={draft.role && draft.role !== "hr_admin" ? draft.role : "employee"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, role: val })
                  }
                >
                  <SelectTrigger id="emp-role">
                    <SelectValue placeholder="Select system role" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEM_ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                          {r.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="sm:col-span-2">
                <label className="flex items-start gap-3 rounded-lg border border-border bg-muted/25 p-3.5 cursor-pointer hover:bg-muted/45 transition-colors">
                  <Checkbox
                    checked={draft.sendOnboardingInvite !== false}
                    onCheckedChange={(checked) =>
                      onDraftChange({
                        ...draft,
                        sendOnboardingInvite: Boolean(checked),
                      })
                    }
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5 text-sm">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      Send Onboarding Invite
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatically dispatch a digital onboarding invitation link and portal credentials to{" "}
                      <span className="font-mono text-foreground">
                        {officialEmailVal || personalEmailVal || "the employee's email"}
                      </span>
                      .
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </section>
        </div>

        <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-card">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleValidateAndSave} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  htmlFor,
  error,
  children,
  wide,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}