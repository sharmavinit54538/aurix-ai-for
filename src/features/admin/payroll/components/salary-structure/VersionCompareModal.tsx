import React, { useState } from "react";
import { GitCompare, ArrowRight, RotateCcw, X, CheckCircle2, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SalaryStructure } from "./salaryStructureTypes";
import { toast } from "sonner";

interface VersionCompareModalProps {
  open: boolean;
  onClose: () => void;
  structure: SalaryStructure | null;
  onRollback: (structureId: string, targetVersion: string) => Promise<void>;
}

export const VersionCompareModal: React.FC<VersionCompareModalProps> = ({
  open,
  onClose,
  structure,
  onRollback,
}) => {
  const [versionA, setVersionA] = useState("v2.4");
  const [versionB, setVersionB] = useState("v2.3");

  if (!structure) return null;

  const handleExecuteRollback = async () => {
    try {
      await onRollback(structure.id, versionB);
      toast.success(`Successfully rolled back '${structure.name}' to version ${versionB}`);
      onClose();
    } catch {
      toast.error("Rollback failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl bg-[#070B17] border-white/10 text-white p-6">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/10">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-purple-400" />
            Side-by-Side Version Matrix Comparison: {structure.code}
          </DialogTitle>
        </DialogHeader>

        {/* Version Pickers */}
        <div className="grid grid-cols-2 gap-4 py-3 bg-slate-950/60 p-3 rounded-lg border border-white/5">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Version A (Current Active):</label>
            <Select value={versionA} onValueChange={setVersionA}>
              <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-blue-300 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                <SelectItem value="v2.4">v2.4 (Active - Effective Apr 2026)</SelectItem>
                <SelectItem value="v3.0-DRAFT">v3.0-DRAFT (In Review)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Version B (Comparison Target):</label>
            <Select value={versionB} onValueChange={setVersionB}>
              <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-amber-300 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                <SelectItem value="v2.3">v2.3 (Superseded - Effective Apr 2025)</SelectItem>
                <SelectItem value="v2.2">v2.2 (Historical)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Diff Table Comparison */}
        <div className="salary-table-wrapper my-2">
          <table className="salary-table">
            <thead>
              <tr>
                <th>Component / Parameter</th>
                <th>{versionA} (Current)</th>
                <th>{versionB} (Target)</th>
                <th>Variation / Delta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold text-slate-200">Annual CTC Ceiling</td>
                <td className="font-mono text-emerald-400">₹36,00,000</td>
                <td className="font-mono text-slate-300">₹32,00,000</td>
                <td><Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">+₹4.0L (+12.5%)</Badge></td>
              </tr>
              <tr>
                <td className="font-semibold text-slate-200">HRA Percentage</td>
                <td className="font-mono text-blue-300">50% of Basic (Metro)</td>
                <td className="font-mono text-slate-300">40% of Basic</td>
                <td><Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">+10% Metro Shift</Badge></td>
              </tr>
              <tr>
                <td className="font-semibold text-slate-200">Special Allowance Formula</td>
                <td className="font-mono text-xs text-slate-300">CTC - (BASIC + HRA + MED)</td>
                <td className="font-mono text-xs text-slate-400">CTC - (BASIC + HRA)</td>
                <td><Badge variant="outline" className="text-slate-400">Formula Modified</Badge></td>
              </tr>
              <tr>
                <td className="font-semibold text-slate-200">Executive ESOP Stock Options</td>
                <td className="font-mono text-cyan-300">₹10,000 / month</td>
                <td className="font-mono text-slate-400">None</td>
                <td><Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">New Benefit Added</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Audit trail preserved across both structure revisions.
          </span>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 bg-slate-900 text-xs">
              Close
            </Button>
            <Button
              size="sm"
              onClick={handleExecuteRollback}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs gap-1.5 shadow-lg shadow-amber-600/25"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Rollback to {versionB}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
