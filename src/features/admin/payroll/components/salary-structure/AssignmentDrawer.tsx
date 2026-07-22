import React, { useState } from "react";
import { UserPlus, Users, Check, Building, MapPin, Briefcase, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SalaryStructure } from "./salaryStructureTypes";
import { toast } from "sonner";

interface AssignmentDrawerProps {
  open: boolean;
  onClose: () => void;
  structure: SalaryStructure | null;
  onAssignSubmit: (structureId: string, assignment: any) => Promise<void>;
}

export const AssignmentDrawer: React.FC<AssignmentDrawerProps> = ({
  open,
  onClose,
  structure,
  onAssignSubmit,
}) => {
  const [selectedDepts, setSelectedDepts] = useState<string[]>(["Engineering", "Sales & BD"]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["Bangalore", "Hyderabad"]);
  const [assigning, setAssigning] = useState(false);

  if (!structure) return null;

  const handleExecuteAssignment = async () => {
    setAssigning(true);
    try {
      await onAssignSubmit(structure.id, {
        departmentIds: selectedDepts,
        locationIds: selectedLocations,
        roleIds: ["Principal Software Engineer"],
        employeeIds: ["emp-101", "emp-104", "emp-189"],
      });
      toast.success(`Structure '${structure.code}' assigned to selected departments & locations.`);
      onClose();
    } catch {
      toast.error("Failed to execute structure assignment.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl bg-[#070B17] border-white/10 text-white p-6">
        <DialogHeader className="pb-3 border-b border-white/10">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            Bulk Assign Salary Structure: <span className="text-blue-400">{structure.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Department Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              Target Departments
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-lg border border-white/5 text-xs">
              {["Engineering", "Sales & BD", "Operations", "Finance", "Human Resources"].map((dept) => (
                <label key={dept} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <Checkbox
                    checked={selectedDepts.includes(dept)}
                    onCheckedChange={(ch) => {
                      if (ch) setSelectedDepts([...selectedDepts, dept]);
                      else setSelectedDepts(selectedDepts.filter((d) => d !== dept));
                    }}
                  />
                  <span>{dept}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              Target Locations
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-lg border border-white/5 text-xs">
              {["Bangalore", "Hyderabad", "Mumbai", "Delhi NCR", "Global Remote"].map((loc) => (
                <label key={loc} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <Checkbox
                    checked={selectedLocations.includes(loc)}
                    onCheckedChange={(ch) => {
                      if (ch) setSelectedLocations([...selectedLocations, loc]);
                      else setSelectedLocations(selectedLocations.filter((l) => l !== loc));
                    }}
                  />
                  <span>{loc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Impact Preview Card */}
          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Projected Headcount Impact:</span>
            </div>
            <span className="font-bold text-white text-sm font-mono">+142 Employees Assigned</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 bg-slate-900 text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleExecuteAssignment}
            disabled={assigning}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs gap-1.5 shadow-lg shadow-cyan-600/25"
          >
            <Check className="w-4 h-4" /> {assigning ? "Assigning..." : "Confirm Bulk Assignment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
