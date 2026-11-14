"use client";

import { useMemo } from "react";
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
import { generateEmployeeCode } from "../utils/employeeStatus";

const DEPARTMENT_OPTIONS = [
  "Engineering",
  "HR",
  "Sales",
  "Finance",
  "Product",
  "Marketing",
  "AI Research",
  "Operations & People",
];

const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Non-Binary",
  "Prefer not to say",
];

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
];

const WORK_MODES = [
  "Office / On-Site",
  "Remote / WFH",
  "Hybrid",
];

const PROBATION_OPTIONS = [
  { label: "3 months", value: "3" },
  { label: "6 months", value: "6" },
  { label: "No Probation (Confirmed)", value: "0" },
];

const SHIFT_OPTIONS = [
  "General Shift (09:30 - 18:30)",
  "Morning Shift (06:00 - 15:00)",
  "Night Shift (22:00 - 07:00)",
  "Flexible",
];

const SYSTEM_ROLES = [
  { label: "Employee", value: "employee" },
  { label: "Manager", value: "manager" },
  { label: "Executive", value: "executive" },
  { label: "IT-Admin", value: "it_admin" },
];

const DEFAULT_MANAGERS = [
  "Alex Vance (VP of Engineering)",
  "Sarah Chen (Head of Product)",
  "Elena Rostova (People Operations Lead)",
  "Marcus Sterling (Principal AI Scientist)",
];

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

  const managerOptions = useMemo(() => {
    const names = new Set<string>(DEFAULT_MANAGERS);
    existingEmployees.forEach((emp) => {
      if (emp.fullName) {
        const label = emp.designation
          ? `${emp.fullName} (${emp.designation})`
          : emp.fullName;
        names.add(label);
      }
    });
    if (draft?.managerName && !names.has(draft.managerName)) {
      names.add(draft.managerName);
    }
    return Array.from(names);
  }, [existingEmployees, draft?.managerName]);

  const departmentList = useMemo(() => {
    const list = new Set<string>(DEPARTMENT_OPTIONS);
    if (draft?.department && !list.has(draft.department)) {
      list.add(draft.department);
    }
    return Array.from(list);
  }, [draft?.department]);

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
                  value={draft.gender || "Male"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, gender: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
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
                    placeholder="e.g. EMP-3655"
                    value={draft.employeeId || ""}
                    onChange={(e) =>
                      onDraftChange({ ...draft, employeeId: e.target.value })
                    }
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Auto-generate Employee Code"
                    onClick={() =>
                      onDraftChange({
                        ...draft,
                        employeeId: generateEmployeeCode(),
                      })
                    }
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </FormField>

              <FormField label="Department *">
                <Select
                  value={draft.department || "Engineering"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, department: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentList.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Designation *">
                <Input
                  placeholder="e.g. Senior Software Engineer"
                  value={draft.designation || ""}
                  onChange={(e) =>
                    onDraftChange({ ...draft, designation: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Reporting Manager">
                <Select
                  value={draft.managerName || "Alex Vance (VP of Engineering)"}
                  onValueChange={(val) =>
                    onDraftChange({
                      ...draft,
                      managerName: val === "none" ? "" : val,
                      reportingManagerName: val === "none" ? "" : val,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reporting manager" />
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
                  value={draft.joiningDate || ""}
                  onChange={(e) =>
                    onDraftChange({ ...draft, joiningDate: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Employment Type">
                <Select
                  value={draft.employmentType || "Full-time"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, employmentType: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Work Mode">
                <Select
                  value={draft.workMode || "Office / On-Site"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, workMode: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_MODES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
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
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Default Shift Assignment">
                <Select
                  value={draft.shift || "General Shift (09:30 - 18:30)"}
                  onValueChange={(val) =>
                    onDraftChange({ ...draft, shift: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select default shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIFT_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Office Location">
                <Input
                  placeholder="e.g. Bengaluru · Global HQ"
                  value={draft.officeLocation ?? draft.workLocation ?? ""}
                  onChange={(e) =>
                    onDraftChange({
                      ...draft,
                      officeLocation: e.target.value,
                      workLocation: e.target.value,
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
              <FormField label="Initial CTC / Salary Structure">
                <Input
                  placeholder="e.g. ₹12,00,000 / year"
                  value={draft.ctc ?? draft.salary ?? ""}
                  onChange={(e) =>
                    onDraftChange({
                      ...draft,
                      ctc: e.target.value,
                      salary: e.target.value,
                    })
                  }
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