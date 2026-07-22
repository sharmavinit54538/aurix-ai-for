import React, { useState } from "react";
import { Layers, CheckCircle2, DollarSign, PauseCircle, PlayCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SalaryAdvanceRequest } from "./advancesTypes";
import { toast } from "sonner";

interface RecoveryPlanModalProps {
  open: boolean;
  onClose: () => void;
  advance: SalaryAdvanceRequest | null;
  onConfirmPlan: (newEmi: number) => Promise<void>;
}

export const RecoveryPlanModal: React.FC<RecoveryPlanModalProps> = ({
  open,
  onClose,
  advance,
  onConfirmPlan,
}) => {
  const [emi, setEmi] = useState<number>(advance?.installmentAmount || 15000);
  const [submitting, setSubmitting] = useState(false);

  if (!advance) return null;

  const handleExecute = async () => {
    setSubmitting(true);
    try {
      await onConfirmPlan(emi);
      toast.success(`Updated recovery EMI schedule to ₹${emi.toLocaleString("en-IN")}/month for ${advance.employeeName}`);
      onClose();
    } catch {
      toast.error("Failed to update recovery plan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-[#070B17] border-white/10 text-white p-6">
        <DialogHeader className="pb-3 border-b border-white/10">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Adjust Payroll Recovery Schedule: <span className="font-mono text-cyan-300">{advance.advanceCode}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-between">
            <span className="text-slate-400">Current Outstanding Balance:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              ₹{advance.outstandingBalance.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">New Monthly EMI Recovery Cut (₹)</label>
            <Input
              type="number"
              value={emi}
              onChange={(e) => setEmi(Number(e.target.value))}
              className="bg-slate-900 border-white/10 text-xs text-emerald-400 font-mono font-bold"
            />
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
            <CheckCircle2 className="w-4 h-4" /> {submitting ? "Updating..." : "Save Recovery Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
