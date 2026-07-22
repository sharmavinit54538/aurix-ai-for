import React, { useState } from "react";
import { Layers, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomReportBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuild: (config: any) => void;
  isBuilding?: boolean;
}

const METRICS = [
  { id: "basic_salary", label: "Basic Salary" },
  { id: "hra", label: "HRA" },
  { id: "special_allowance", label: "Special Allowance" },
  { id: "conveyance", label: "Conveyance" },
  { id: "medical", label: "Medical Allowance" },
  { id: "performance_bonus", label: "Performance Bonus" },
  { id: "overtime_pay", label: "Overtime Pay" },
  { id: "pf_employee", label: "PF (Employee)" },
  { id: "pf_employer", label: "PF (Employer)" },
  { id: "esi_employee", label: "ESI (Employee)" },
  { id: "esi_employer", label: "ESI (Employer)" },
  { id: "tds", label: "TDS" },
  { id: "professional_tax", label: "Professional Tax" },
  { id: "gross_salary", label: "Gross Salary" },
  { id: "net_salary", label: "Net Salary" },
  { id: "ctc", label: "Cost to Company" },
];

export const CustomReportBuilderModal: React.FC<CustomReportBuilderModalProps> = ({
  isOpen,
  onClose,
  onBuild,
  isBuilding = false,
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["basic_salary", "hra", "gross_salary", "net_salary"]);
  const [groupBy, setGroupBy] = useState("department");

  const toggleMetric = (id: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-card border-border/60 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-violet-400">
            <Layers className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">Custom Report Builder</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Select metrics, columns, and grouping dimensions to generate a custom payroll analytics report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Metrics Selection */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground">Select Metrics & Columns</h4>
            <div className="grid grid-cols-2 gap-2">
              {METRICS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedMetrics.includes(m.id)
                      ? "border-violet-500/50 bg-violet-500/10 text-foreground"
                      : "border-border/40 bg-background/30 text-muted-foreground hover:border-border/60"
                  }`}
                >
                  <Checkbox
                    checked={selectedMetrics.includes(m.id)}
                    onCheckedChange={() => toggleMetric(m.id)}
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </div>

          {/* Group By */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground">Group By</h4>
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="h-9 text-xs bg-background/50 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="designation">Designation</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview Summary */}
          <div className="p-3 rounded-xl border border-border/40 bg-muted/20 text-xs space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Report Preview:
            </div>
            <p className="text-muted-foreground">
              {selectedMetrics.length} metrics selected, grouped by <strong>{groupBy}</strong>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isBuilding} className="h-8 text-xs">
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onBuild({ metrics: selectedMetrics, group_by: groupBy })}
            disabled={isBuilding || selectedMetrics.length === 0}
            className="h-8 px-4 text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white gap-1.5"
          >
            <Layers className={`h-3.5 w-3.5 ${isBuilding ? "animate-spin" : ""}`} />
            {isBuilding ? "Generating..." : "Generate Custom Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
