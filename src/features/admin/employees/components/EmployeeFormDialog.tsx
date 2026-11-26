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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-card/60">
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Edit Employee Profile" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Complete personal details, organization & job classification, and compensation & system access settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* ── Section 1: Personal Details ─────────────────────────────── */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  1. Personal Details
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Legal name, official & personal email addresses, mobile number, gender, and date of birth
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="First Name *">
                <Input
                  placeholder="e.g. Kabir"
                  value={firstNameVal}
                  onChange={(e) => updateName(e.target.value, lastNameVal)}
                />
              </FormField>

              <FormField label="Last Name *">
                <Input
                  placeholder="e.g. Mehta"
                  value={lastNameVal}
                  onChange={(e) => updateName(firstNameVal, e.target.value)}
                />
              </FormField>

              <FormField label="Official Email *">
                <Input
                  type="email"
                  placeholder="e.g. kabir.mehta@ofc360.com"
                  value={officialEmailVal}
                  onChange={(e) =>
                    onDraftChange({
                      ...draft,
                      companyEmail: e.target.value,
                      email: e.target.value,
                    })
                  }
                />
              </FormField>

              <FormField label="Personal Email">
                <Input
                  type="email"
                  placeholder="e.g. kabir.personal@gmail.com"
                  value={personalEmailVal}
                  onChange={(e) =>
                    onDraftChange({
                      ...draft,
                      personalEmail: e.target.value,
                    })
                  }
                />
              </FormField>

              <FormField label="Mobile Number *">
                <Input
                  placeholder="e.g. +91 98201 11223"
                  value={draft.phone || ""}
                  onChange={(e) =>
                    onDraftChange({ ...draft, phone: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Gender">
                <Select
                  value={draft.gender || "MALE"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, gender: val })
                  }
                >
                  <SelectTrigger>
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

              <FormField label="Date of Birth">
                <Input
                  type="date"
                  value={draft.dateOfBirth || ""}
                  onChange={(e) =>
                    onDraftChange({ ...draft, dateOfBirth: e.target.value })
                  }
                />
              </FormField>
            </div>
          </div>

          {/* ── Section 2: Organization, Job & Classification ───────────── */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  2. Organization, Job & Classification
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Employee code, department, designation, reporting manager, shift, and work mode
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Employee Code">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Auto-generated if left blank"
                    value={draft.employeeId || ""}
                    onChange={(e) =>
                      onDraftChange({ ...draft, employeeId: e.target.value })
                    }
                    className="font-mono"
                    disabled={isEdit}
                  />
                  {loadingOptions && (
                    <Button type="button" variant="outline" size="icon" disabled>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </Button>
                  )}
                </div>
              </FormField>

              <FormField label="Department *">
                <Select
                  value={draft.department || ""}
                  onValueChange={handleDepartmentChange}
                  disabled={loadingOptions}
                >
                  <SelectTrigger>
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
                {loadingOptions && <p className="text-[11px] text-muted-foreground">Loading departments...</p>}
              </FormField>

              <FormField label="Designation *">
                <Select
                  value={draft.designation || ""}
                  onValueChange={handleDesignationChange}
                  disabled={loadingOptions}
                >
                  <SelectTrigger>
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
                {loadingOptions && <p className="text-[11px] text-muted-foreground">Loading designations...</p>}
              </FormField>

              <FormField label="Reporting Manager">
                <Select
                  value={draft.reportingManagerName ? `${draft.reportingManagerName} (${draft.designation || ""})`.trim() : "none"}
                  onValueChange={handleManagerChange}
                  disabled={loadingOptions}
                >
                  <SelectTrigger>
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

              <FormField label="Date of Joining *">
                <Input
                  type="date"
                  value={draft.joiningDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    onDraftChange({ ...draft, joiningDate: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Employment Type">
                <Select
                  value={draft.employmentType || "FULL_TIME"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, employmentType: val })
                  }
                >
                  <SelectTrigger>
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

              <FormField label="Work Mode">
                <Select
                  value={draft.workMode || "OFFICE"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, workMode: val })
                  }
                >
                  <SelectTrigger>
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

              <FormField label="Probation Period">
                <Select
                  value={String(draft.probationPeriodMonths ?? 3)}
                  onValueChange={(val) =>
                    onDraftChange({
                      ...draft,
                      probationPeriodMonths: Number(val),
                    })
                  }
                >
                  <SelectTrigger>
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

              <FormField label="Default Shift Assignment">
                <Select
                  value={draft.shift || ""}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, shift: val })
                  }
                  disabled={loadingOptions}
                >
                  <SelectTrigger>
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
                {loadingOptions && <p className="text-[11px] text-muted-foreground">Loading shifts...</p>}
              </FormField>

              <FormField label="Work Location">
                <Input
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
          </div>

          {/* ── Section 3: Compensation, Role & Invite ──────────────────── */}
          <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <IndianRupee className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  3. Compensation, Role & Invite
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Annual CTC package, system access role, and digital onboarding invitation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Annual CTC (₹)">
                <Input
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

              <FormField label="Monthly Salary (₹)">
                <Input
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

              <FormField label="System Access Role">
                <Select
                  value={draft.role && draft.role !== "hr_admin" ? draft.role : "employee"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, role: val })
                  }
                >
                  <SelectTrigger>
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
                <label className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-3.5 cursor-pointer hover:bg-accent/30 transition-colors">
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
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      Send Onboarding Invite
                    </div>
                    <p className="text-[11px] text-muted-foreground">
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
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/60 bg-card/60">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSave} disabled={submitting}>
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
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}