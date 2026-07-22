import React, { useState } from "react";
import { Users, CheckCircle2, Building, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeductionRule } from "./deductionsTypes";
import { toast } from "sonner";

interface EmployeeAssignmentDrawerProps {
  open: boolean;
  onClose: () => void;
  rule: DeductionRule | null;
  onConfirmAssign: (department: string, deductionId: string) => Promise<void>;
}

export const EmployeeAssignmentDrawer: React.FC<EmployeeAssignmentDrawerProps> = ({
  open,
  onClose,
  rule,
  onConfirmAssign,
}) => {
  const [department, setDepartment] = useState("Engineering");
  const [submitting, setSubmitting] = useState(false);

  if (!rule) return null;

  const handleExecute = async () => {
    setSubmitting(true);
    try {
      await onConfirmAssign(department, rule.id);
      toast.success(`Assigned deduction rule '${rule.name}' to department '${department}'.`);
      onClose();
    } catch {
      toast.error("Failed to assign deduction rule.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-[#070B17] border-l border-white/10 text-white p-6 flex flex-col h-full">
        <SheetHeader className="pb-3 border-b border-white/10">
          <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Assign Deduction Rule: <span className="font-mono text-rose-300">{rule.code}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 py-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-white/10 space-y-1">
            <span className="text-slate-400">Target Rule:</span>
            <h4 className="font-bold text-white">{rule.name}</h4>
            <p className="text-[11px] text-slate-400">Formula: {rule.formulaExpression}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Assign to Department</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                <SelectItem value="Engineering">Engineering (142 Employees)</SelectItem>
                <SelectItem value="Sales & BD">Sales & BD (88 Employees)</SelectItem>
                <SelectItem value="Operations">Operations (310 Employees)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/30 text-purple-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-purple-400 mb-1" />
            <p>Will map this deduction policy rule to all active employees in the selected department during the upcoming July pay cycle.</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 bg-slate-900 text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleExecute}
            disabled={submitting}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5 shadow-lg shadow-purple-600/25"
          >
            <CheckCircle2 className="w-4 h-4" /> {submitting ? "Assigning..." : "Confirm Assignment"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
