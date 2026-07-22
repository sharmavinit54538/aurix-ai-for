import React, { useState } from "react";
import { Layers, CheckCircle2, Building, DollarSign, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BonusType } from "./bonusesTypes";
import { BONUS_TYPES_LIST } from "@/services/bonusesApi";
import { toast } from "sonner";

interface BulkAllocationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirmBulk: (allocation: { department: string; bonusType: BonusType; amount: number }) => Promise<void>;
}

export const BulkAllocationModal: React.FC<BulkAllocationModalProps> = ({
  open,
  onClose,
  onConfirmBulk,
}) => {
  const [department, setDepartment] = useState("Engineering");
  const [bonusType, setBonusType] = useState<BonusType>("Performance Bonus");
  const [amount, setAmount] = useState<number>(50000);
  const [submitting, setSubmitting] = useState(false);

  const handleExecute = async () => {
    setSubmitting(true);
    try {
      await onConfirmBulk({ department, bonusType, amount });
      toast.success(`Bulk allocated ${bonusType} to department '${department}'.`);
      onClose();
    } catch {
      toast.error("Failed to execute bulk bonus allocation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg bg-[#070B17] border-white/10 text-white p-6">
        <DialogHeader className="pb-3 border-b border-white/10">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Bulk Bonus & Incentive Allocation Engine
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Target Department</label>
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

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Bonus Category</label>
            <Select value={bonusType} onValueChange={(val: any) => setBonusType(val)}>
              <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                {BONUS_TYPES_LIST.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Allocation Amount per Employee (₹)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-slate-900 border-white/10 text-xs text-emerald-400 font-mono font-bold"
            />
          </div>

          {/* Allocation Preview Card */}
          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Projected Total Budget Payout:</span>
            </div>
            <span className="font-bold text-white text-sm font-mono">
              ₹{(amount * 3).toLocaleString("en-IN")} Total
            </span>
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
            <CheckCircle2 className="w-4 h-4" /> {submitting ? "Allocating..." : "Confirm Bulk Allocation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
