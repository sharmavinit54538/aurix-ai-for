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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department } from "../types";
import {
  OFFICES,
  THEME_COLORS,
  DEPARTMENT_ICONS,
  STATUS_OPTIONS,
} from "../constants";
import { validateDepartmentForm } from "../utils";
import { useManagersList } from "../managers/hooks/useManagersList";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null; // null for add, Department for edit
  existingDepartments: Department[];
  onSave: (dept: Department) => void;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  existingDepartments,
  onSave,
}: DepartmentFormDialogProps) {
  const isEdit = !!department;

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [departmentHeadId, setDepartmentHeadId] = useState("");
  const [reportingManagerId, setReportingManagerId] = useState("none");
  const [office, setOffice] = useState("");
  const [budget, setBudget] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [employeeCapacity, setEmployeeCapacity] = useState("");
  const [currentEmployeeCount, setCurrentEmployeeCount] = useState("0");
  const [extensionNumber, setExtensionNumber] = useState("");
  const [status, setStatus] = useState<Department["status"]>("active");
  const [themeColor, setThemeColor] = useState("#3b82f6");
  const [iconName, setIconName] = useState("Code2");
  const [parentId, setParentId] = useState("none");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const managers = useManagersList();

  // Exclude current department from parent options on edit to prevent circular dependencies
  const parentDeptOptions = existingDepartments.filter(
    (d) => !department || d.id !== department.id
  );

  // Load / Reset form state
  useEffect(() => {
    if (open) {
      setErrors({});
      if (department) {
        setName(department.name);
        setCode(department.code);
        setDescription(department.description);
        setDepartmentHeadId(department.departmentHeadId || "");
        setReportingManagerId(department.reportingManagerId || "none");
        setOffice(department.office);
        setBudget(String(department.budget));
        setCostCenter(department.costCenter);
        setEmployeeCapacity(String(department.employeeCapacity));
        setCurrentEmployeeCount(String(department.currentEmployeeCount));
        setExtensionNumber(department.extensionNumber);
        setStatus(department.status);
        setThemeColor(department.themeColor);
        setIconName(department.iconName);
        setParentId(department.parentId || "none");
      } else {
        setName("");
        setCode("");
        setDescription("");
        setDepartmentHeadId(managers[0]?.id || "");
        setReportingManagerId("none");
        setOffice(OFFICES[0] || "");
        setBudget("");
        setCostCenter("CC-");
        setEmployeeCapacity("30");
        setCurrentEmployeeCount("0");
        setExtensionNumber("");
        setStatus("active");
        setThemeColor(THEME_COLORS[0]?.hex || "#3b82f6");
        setIconName(DEPARTMENT_ICONS[0]?.name || "Code2");
        setParentId("none");
      }
    }
  }, [open, department, managers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const headManager = managers.find((m) => m.id === departmentHeadId);
    const selectedReport = managers.find((m) => m.id === reportingManagerId);
    const parentDept = parentDeptOptions.find((d) => d.id === parentId);

    const draft: Partial<Department> = {
      id: department?.id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      departmentHeadId: departmentHeadId || null,
      departmentHeadName: headManager?.fullName || "Unassigned",
      reportingManagerId: reportingManagerId === "none" ? null : reportingManagerId,
      reportingManagerName: reportingManagerId === "none" ? "None" : selectedReport?.fullName || "None",
      office,
      budget: budget ? parseFloat(budget) : 0,
      costCenter: costCenter.trim(),
      employeeCapacity: employeeCapacity ? parseInt(employeeCapacity) : 30,
      currentEmployeeCount: parseInt(currentEmployeeCount) || 0,
      extensionNumber: extensionNumber.trim(),
      status,
      themeColor,
      iconName,
      parentId: parentId === "none" ? null : parentId,
      parentName: parentId === "none" ? "None" : parentDept?.name || "None",
    };

    const val = validateDepartmentForm(draft, existingDepartments, isEdit);

    if (!val.valid) {
      setErrors(val.errors);
      toast.error("Please resolve validation errors in the form.");
      return;
    }

    // Build the final department object
    const finalDept: Department = {
      id: department?.id || `dept_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      departmentHeadId: departmentHeadId || null,
      departmentHeadName: headManager?.fullName || "Unassigned",
      reportingManagerId: reportingManagerId === "none" ? null : reportingManagerId,
      reportingManagerName: reportingManagerId === "none" ? "None" : selectedReport?.fullName || "None",
      office,
      budget: budget ? parseFloat(budget) : 0,
      costCenter: costCenter.trim(),
      employeeCapacity: employeeCapacity ? parseInt(employeeCapacity) : 30,
      currentEmployeeCount: department?.currentEmployeeCount ?? (parseInt(currentEmployeeCount) || 0),
      extensionNumber: extensionNumber.trim(),
      status,
      themeColor,
      iconName,
      parentId: parentId === "none" ? null : parentId,
      parentName: parentId === "none" ? "None" : parentDept?.name || "None",
      createdDate: department?.createdDate || new Date().toISOString().split("T")[0],
      employeeIds: department?.employeeIds || [],
      openPositions: department?.openPositions ?? (status === "hiring" ? 2 : 0),
      performanceScore: department?.performanceScore ?? 85,
      attendanceScore: department?.attendanceScore ?? 92,
      hiringStatus: department?.hiringStatus ?? (status === "hiring" ? "open" : "closed"),
      recentActivity: department?.recentActivity || [
        { id: `act_${Date.now()}`, action: isEdit ? "Updated department specifications" : "Department created", timestamp: new Date().toISOString() },
      ],
      documents: department?.documents || [],
    };

    onSave(finalDept);
    toast.success(isEdit ? "Department Updated Successfully" : "Department Created Successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-6 backdrop-blur-xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "✏️ Edit Department" : "➕ Add Department"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Department Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Frontend Engineering"
                  className={errors.name ? "border-rose-500" : ""}
                />
                {errors.name && <p className="text-[10px] text-rose-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Department Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. FE-ENG"
                  className={errors.code ? "border-rose-500" : ""}
                />
                {errors.code && <p className="text-[10px] text-rose-500">{errors.code}</p>}
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="description">Description / Purpose</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the core activities and responsibilities of this department division..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Section 2: Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Management & Hierarchy
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="departmentHead" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Department Head</Label>
                <Select value={departmentHeadId} onValueChange={(val) => setDepartmentHeadId(val)}>
                  <SelectTrigger id="departmentHead" className={errors.departmentHeadId ? "border-rose-500" : ""}>
                    <SelectValue placeholder="Select Department Head" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((mgr) => (
                      <SelectItem key={mgr.id} value={mgr.id}>
                        {mgr.fullName} ({mgr.designation || "Manager"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departmentHeadId && <p className="text-[10px] text-rose-500">{errors.departmentHeadId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportingManager">Reporting Manager</Label>
                <Select value={reportingManagerId} onValueChange={(val) => setReportingManagerId(val)}>
                  <SelectTrigger id="reportingManager">
                    <SelectValue placeholder="Select Reporting Lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (C-Level / Board)</SelectItem>
                    {managers.map((mgr) => (
                      <SelectItem key={mgr.id} value={mgr.id}>
                        {mgr.fullName} ({mgr.designation || "Manager"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentDept">Parent Department</Label>
                <Select value={parentId} onValueChange={(val) => setParentId(val)}>
                  <SelectTrigger id="parentDept">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level Root)</SelectItem>
                    {parentDeptOptions.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Section 3: Details & Numbers */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Location, Budget & capacity
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="office" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Office Location</Label>
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
                <Label htmlFor="budget">Annual Budget (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 250000"
                  className={errors.budget ? "border-rose-500" : ""}
                />
                {errors.budget && <p className="text-[10px] text-rose-500">{errors.budget}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="costCenter">Cost Center ID</Label>
                <Input
                  id="costCenter"
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  placeholder="e.g. CC-TECH-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCapacity">Employee Capacity Limit</Label>
                <Input
                  id="employeeCapacity"
                  type="number"
                  value={employeeCapacity}
                  onChange={(e) => setEmployeeCapacity(e.target.value)}
                  placeholder="e.g. 30"
                  className={errors.employeeCapacity ? "border-rose-500" : ""}
                />
                {errors.employeeCapacity && <p className="text-[10px] text-rose-500">{errors.employeeCapacity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="extensionNumber">Phone Extension</Label>
                <Input
                  id="extensionNumber"
                  value={extensionNumber}
                  onChange={(e) => setExtensionNumber(e.target.value)}
                  placeholder="e.g. 104"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Department Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as Department["status"])}>
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

          {/* Section 4: Visual Colors and Icons */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Aesthetics & Theme Settings
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Color Picker Swatches */}
              <div className="space-y-2">
                <Label>Department Theme Color Picker</Label>
                <div className="flex flex-wrap gap-2.5 pt-1.5">
                  {THEME_COLORS.map((tc) => (
                    <button
                      key={tc.hex}
                      type="button"
                      onClick={() => setThemeColor(tc.hex)}
                      className={`h-8 w-8 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                        themeColor === tc.hex ? "border-foreground scale-110 shadow-md" : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"
                      }`}
                      style={{ backgroundColor: tc.hex }}
                      title={tc.label}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Picker List */}
              <div className="space-y-2">
                <Label htmlFor="iconPicker">Department Icon Picker</Label>
                <Select value={iconName} onValueChange={(val) => setIconName(val)}>
                  <SelectTrigger id="iconPicker" className="h-10">
                    <SelectValue placeholder="Select Department Icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENT_ICONS.map((di) => {
                      // Dynamically retrieve lucide icon component
                      const IconComponent = (LucideIcons as any)[di.name] || LucideIcons.HelpCircle;
                      return (
                        <SelectItem key={di.name} value={di.name}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                            <span>{di.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
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
              style={{ background: isEdit ? undefined : `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }}
            >
              {isEdit ? "Save Changes" : "Create Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
