"use client";

import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Employee } from "../employeesTypes";
import { DepartmentSelectContent } from "./DepartmentSelectContent";
import { resolveDepartmentValue } from "../utils/departmentOptions";
import { useShiftOptionsQuery } from "@/features/attendance/shifts/hooks/useShifts";
import type { ShiftOption } from "@/services/attendance/types";

const STANDARD_SHIFTS: ShiftOption[] = [
  { id: "general", name: "General Shift", code: "GEN", start_time: "09:30", end_time: "18:30", is_overnight: false },
  { id: "morning", name: "Morning Shift", code: "MORN", start_time: "06:00", end_time: "15:00", is_overnight: false },
  { id: "evening", name: "Evening Shift", code: "EVE", start_time: "14:00", end_time: "23:00", is_overnight: false },
  { id: "night", name: "Night Shift", code: "NIGHT", start_time: "22:00", end_time: "07:00", is_overnight: true },
];

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Employee | null;
  onDraftChange: (draft: Employee) => void;
  submitting: boolean;
  onSave: () => void;
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  submitting,
  onSave,
}: EmployeeFormDialogProps) {
  const departmentValue = resolveDepartmentValue(draft?.department);
  const { data: shiftOptions, isLoading: shiftsLoading } = useShiftOptionsQuery();

  const effectiveShifts: ShiftOption[] = useMemo(() => {
    if (Array.isArray(shiftOptions) && shiftOptions.length > 0) {
      return shiftOptions;
    }
    return STANDARD_SHIFTS;
  }, [shiftOptions]);

  const currentShiftValue = useMemo(() => {
    if (!draft?.shift) return "none";
    const shiftVal = draft.shift;
    const found = effectiveShifts.find(
      (s) =>
        s.id === shiftVal ||
        s.name.toLowerCase() === shiftVal.toLowerCase() ||
        s.code.toLowerCase() === shiftVal.toLowerCase() ||
        shiftVal.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(shiftVal.toLowerCase()) ||
        (s.name.toLowerCase().includes("general") && shiftVal.toLowerCase().includes("general")),
    );
    return found ? found.id : shiftVal;
  }, [draft?.shift, effectiveShifts]);

  const customShift = useMemo(() => {
    if (!draft?.shift) return null;
    const shiftVal = draft.shift;
    const exists = effectiveShifts.some(
      (s) =>
        s.id === shiftVal ||
        s.name.toLowerCase() === shiftVal.toLowerCase() ||
        shiftVal.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(shiftVal.toLowerCase()),
    );
    return exists ? null : shiftVal;
  }, [draft?.shift, effectiveShifts]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{draft && draft.id !== "" ? "Edit employee" : "Add employee"}</DialogTitle>
        </DialogHeader>
        {draft ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Shift">
              <Select
                value={currentShiftValue}
                onValueChange={(val) => {
                  if (val === "none") {
                    onDraftChange({ ...draft, shift: "" });
                  } else {
                    const match = effectiveShifts.find((s) => s.id === val);
                    onDraftChange({ ...draft, shift: match ? match.name : val });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (No shift assigned)</SelectItem>
                  {effectiveShifts.map((shift: ShiftOption) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.name} ({shift.code}) • {shift.start_time}–{shift.end_time} {shift.is_overnight ? "(Overnight)" : ""}
                    </SelectItem>
                  ))}
                  {customShift && (
                    <SelectItem value={customShift}>
                      {customShift}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Full name" wide>
              <Input value={draft.fullName} onChange={(e) => onDraftChange({ ...draft, fullName: e.target.value })} />
            </FormField>
            <FormField label="Email">
              <Input type="email" value={draft.email} onChange={(e) => onDraftChange({ ...draft, email: e.target.value })} />
            </FormField>
            <FormField label="Phone">
              <Input value={draft.phone} onChange={(e) => onDraftChange({ ...draft, phone: e.target.value })} />
            </FormField>
            <FormField label="Department">
              <Select value={departmentValue} onValueChange={(v) => onDraftChange({ ...draft, department: v })} >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <DepartmentSelectContent key={draft.id || "new"} selectedValue={departmentValue} extraValues={draft.department ? [draft.department] : []} />
              </Select>
            </FormField>
            <FormField label="Designation">
              <Input value={draft.designation} onChange={(e) => onDraftChange({ ...draft, designation: e.target.value })} />
            </FormField>
            <FormField label="Joining date">
              <Input type="date" value={draft.joiningDate} onChange={(e) => onDraftChange({ ...draft, joiningDate: e.target.value })} />
            </FormField>
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormField({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}