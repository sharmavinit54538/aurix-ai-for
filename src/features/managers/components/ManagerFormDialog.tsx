import React, { useState, useEffect } from "react";
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
import type { Manager, Gender, EmploymentType, ManagerRole, ManagerPermissions } from "../types";
import {
  DEPARTMENTS,
  OFFICES,
  SHIFTS,
  STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  MANAGER_ROLE_OPTIONS,
  WORK_LOCATION_OPTIONS,
  GENDER_OPTIONS,
  PERMISSION_LABELS,
  DEFAULT_PERMISSIONS,
} from "../constants";
import { validateManagerForm } from "../utils";
import { toast } from "sonner";

interface ManagerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manager: Manager | null; // null for add, Manager for edit
  existingManagers: Manager[];
  onSave: (manager: Manager) => void;
}

export function ManagerFormDialog({
  open,
  onOpenChange,
  manager,
  existingManagers,
  onSave,
}: ManagerFormDialogProps) {
  const isEdit = !!manager;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<Gender>("prefer_not_to_say");

  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [managerRole, setManagerRole] = useState<ManagerRole>("team_lead");
  const [reportingManagerId, setReportingManagerId] = useState<string>("none");
  const [office, setOffice] = useState("");
  const [workLocation, setWorkLocation] = useState<"on_site" | "remote" | "hybrid">("hybrid");
  const [joiningDate, setJoiningDate] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("full_time");
  const [shift, setShift] = useState("");
  const [salary, setSalary] = useState<string>("");
  const [status, setStatus] = useState<Manager["status"]>("active");

  const [permissions, setPermissions] = useState<Manager["permissions"]>({
    ...DEFAULT_PERMISSIONS,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form on edit
  useEffect(() => {
    if (open) {
      setErrors({});
      if (manager) {
        setFirstName(manager.firstName);
        setLastName(manager.lastName);
        setProfileImage(manager.profileImage || "");
        setEmployeeId(manager.employeeId);
        setEmail(manager.email);
        setPhone(manager.phone);
        setDob(manager.dob);
        setGender(manager.gender);
        setDepartment(manager.department);
        setDesignation(manager.designation);
        setManagerRole(manager.managerRole);
        setReportingManagerId(manager.reportingManagerId || "none");
        setOffice(manager.office);
        setWorkLocation(manager.workLocation);
        setJoiningDate(manager.joiningDate);
        setEmploymentType(manager.employmentType);
        setShift(manager.shift);
        setSalary(manager.salary ? String(manager.salary) : "");
        setStatus(manager.status);
        setPermissions({ ...manager.permissions });
      } else {
        setFirstName("");
        setLastName("");
        setProfileImage("");
        // Generate a new employee ID recommendation (e.g. EMP-XXXX)
        const nextNum = 1000 + existingManagers.length + 1;
        setEmployeeId(`EMP-${nextNum}`);
        setEmail("");
        setPhone("");
        setDob("");
        setGender("prefer_not_to_say");
        setDepartment(DEPARTMENTS[0] || "");
        setDesignation("");
        setManagerRole("team_lead");
        setReportingManagerId("none");
        setOffice(OFFICES[0] || "");
        setWorkLocation("hybrid");
        // Today in YYYY-MM-DD
        setJoiningDate(new Date().toISOString().split("T")[0]);
        setEmploymentType("full_time");
        setShift(SHIFTS[0] || "");
        setSalary("");
        setStatus("active");
        setPermissions({ ...DEFAULT_PERMISSIONS });
      }
    }
  }, [open, manager, existingManagers]);

  // Form options for Reporting Manager
  const reportingManagerOptions = existingManagers.filter(
    (m) => !manager || m.id !== manager.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedReport = reportingManagerOptions.find((m) => m.id === reportingManagerId);

    const draft: Partial<Manager> = {
      id: manager?.id,
      firstName,
      lastName,
      email,
      phone,
      employeeId,
      department,
      designation,
      dob,
      gender,
      profileImage: profileImage || undefined,
      managerRole,
      reportingManagerId: reportingManagerId === "none" ? null : reportingManagerId,
      reportingManagerName: reportingManagerId === "none" ? "None" : selectedReport?.fullName || "None",
      office,
      workLocation,
      joiningDate,
      employmentType,
      shift,
      salary: salary ? parseFloat(salary) : undefined,
      status,
      permissions,
    };

    const val = validateManagerForm(draft, existingManagers, isEdit);

    if (!val.valid) {
      setErrors(val.errors);
      toast.error("Please resolve validation errors in the form.");
      return;
    }

    // Build the final manager object
    const finalManager: Manager = {
      id: manager?.id || `mgr_${Math.random().toString(36).substr(2, 9)}`,
      employeeId: employeeId.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      phone: phone.trim(),
      dob,
      gender,
      profileImage: profileImage.trim() || undefined,
      department,
      designation: designation.trim(),
      managerRole,
      reportingManagerId: reportingManagerId === "none" ? null : reportingManagerId,
      reportingManagerName: reportingManagerId === "none" ? "None" : selectedReport?.fullName || "None",
      office,
      workLocation,
      joiningDate,
      employmentType,
      shift,
      salary: salary ? parseFloat(salary) : undefined,
      status,
      teamSize: manager?.teamSize ?? 0,
      teamIds: manager?.teamIds ?? [],
      permissions,
      lastActive: manager?.lastActive || new Date().toISOString(),
      attendanceSummary: manager?.attendanceSummary || { present: 20, absent: 0, late: 0, leave: 0 },
      leaveBalance: manager?.leaveBalance || { annual: 12, sick: 6, casual: 4 },
      performanceScore: manager?.performanceScore ?? 85,
      recentActivity: manager?.recentActivity || [
        { id: `act_${Date.now()}`, action: isEdit ? "Updated manager profile" : "Manager created", timestamp: new Date().toISOString() }
      ],
    };

    onSave(finalManager);
    toast.success(isEdit ? "Manager Updated Successfully" : "Manager Created Successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-6 backdrop-blur-xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "✏️ Edit Manager" : "➕ Add Manager"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="after:content-['*'] after:text-rose-500 after:ml-0.5">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className={errors.firstName ? "border-rose-500" : ""}
                />
                {errors.firstName && <p className="text-[10px] text-rose-500">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Doe"
                  className={errors.lastName ? "border-rose-500" : ""}
                />
                {errors.lastName && <p className="text-[10px] text-rose-500">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-1009"
                  className={errors.employeeId ? "border-rose-500" : ""}
                />
                {errors.employeeId && <p className="text-[10px] text-rose-500">{errors.employeeId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john.doe@aurix.com"
                  className={errors.email ? "border-rose-500" : ""}
                />
                {errors.email && <p className="text-[10px] text-rose-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className={errors.phone ? "border-rose-500" : ""}
                />
                {errors.phone && <p className="text-[10px] text-rose-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={(val) => setGender(val as Gender)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profileImage">Profile Image URL (Optional)</Label>
                <Input
                  id="profileImage"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or leave blank for initials"
                />
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Section 2: Job Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Job Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="department" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Department</Label>
                <Select value={department} onValueChange={(val) => setDepartment(val)}>
                  <SelectTrigger id="department" className={errors.department ? "border-rose-500" : ""}>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-[10px] text-rose-500">{errors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Designation</Label>
                <Input
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Engineering Manager"
                  className={errors.designation ? "border-rose-500" : ""}
                />
                {errors.designation && <p className="text-[10px] text-rose-500">{errors.designation}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerRole">Manager Role</Label>
                <Select value={managerRole} onValueChange={(val) => setManagerRole(val as ManagerRole)}>
                  <SelectTrigger id="managerRole">
                    <SelectValue placeholder="Select Manager Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {MANAGER_ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportingManager">Reporting Manager</Label>
                <Select value={reportingManagerId} onValueChange={(val) => setReportingManagerId(val)}>
                  <SelectTrigger id="reportingManager">
                    <SelectValue placeholder="Select Reporting Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (C-Level / Board)</SelectItem>
                    {reportingManagerOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.fullName} ({opt.designation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="office">Office Location</Label>
                <Select value={office} onValueChange={(val) => setOffice(val)}>
                  <SelectTrigger id="office">
                    <SelectValue placeholder="Select Office" />
                  </SelectTrigger>
                  <SelectContent>
                    {OFFICES.map((off) => (
                      <SelectItem key={off} value={off}>
                        {off}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workLocation">Work Location Mode</Label>
                <Select
                  value={workLocation}
                  onValueChange={(val) => setWorkLocation(val as "on_site" | "remote" | "hybrid")}
                >
                  <SelectTrigger id="workLocation">
                    <SelectValue placeholder="Select Location Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_LOCATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select
                  value={employmentType}
                  onValueChange={(val) => setEmploymentType(val as EmploymentType)}
                >
                  <SelectTrigger id="employmentType">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift">Work Shift</Label>
                <Select value={shift} onValueChange={(val) => setShift(val)}>
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIFTS.map((sh) => (
                      <SelectItem key={sh} value={sh}>
                        {sh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary (Optional Annual USD)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 120000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Employment Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as Manager["status"])}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Section 3: Permissions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Permissions & Access Settings
            </h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {(Object.keys(PERMISSION_LABELS) as Array<keyof ManagerPermissions>).map((key) => (
                <div key={key} className="flex items-center space-x-2 rounded-xl border border-border/40 p-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <Checkbox
                    id={key}
                    checked={permissions[key]}
                    onCheckedChange={(checked) =>
                      setPermissions((prev) => ({
                        ...prev,
                        [key]: !!checked,
                      }))
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor={key} className="text-xs font-medium cursor-pointer leading-tight select-none">
                    {PERMISSION_LABELS[key]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="mt-6 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-border bg-card hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
            >
              Save Manager
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
