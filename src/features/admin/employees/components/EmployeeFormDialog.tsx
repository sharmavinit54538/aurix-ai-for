import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Employee } from "../employeesTypes";

const SHIFT_OPTIONS = ["General", "Morning", "Evening", "Night"] as const;

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{draft && draft.id !== "" ? "Edit employee" : "Add employee"}</DialogTitle>
        </DialogHeader>
        {draft ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Employee ID">
              <Input
                value={draft.employeeId}
                onChange={(e) => onDraftChange({ ...draft, employeeId: e.target.value })}
              />
            </FormField>
            <FormField label="Shift">
              <Select value={draft.shift} onValueChange={(v) => onDraftChange({ ...draft, shift: v })}>
                <SelectTrigger>
                  <SelectValue />
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
            <FormField label="Full name" wide>
              <Input value={draft.fullName} onChange={(e) => onDraftChange({ ...draft, fullName: e.target.value })} />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                value={draft.email}
                onChange={(e) => onDraftChange({ ...draft, email: e.target.value })}
              />
            </FormField>
            <FormField label="Phone">
              <Input value={draft.phone} onChange={(e) => onDraftChange({ ...draft, phone: e.target.value })} />
            </FormField>
            <FormField label="Department">
              <Input value={draft.department} onChange={(e) => onDraftChange({ ...draft, department: e.target.value })} />
            </FormField>
            <FormField label="Designation">
              <Input value={draft.designation} onChange={(e) => onDraftChange({ ...draft, designation: e.target.value })} />
            </FormField>
            <FormField label="Joining date">
              <Input
                type="date"
                value={draft.joiningDate}
                onChange={(e) => onDraftChange({ ...draft, joiningDate: e.target.value })}
              />
            </FormField>
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
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
