import React, { useState } from "react";
import { CreditCard, CheckCircle2, Building, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SalaryAdvanceRequest } from "./advancesTypes";
import { toast } from "sonner";

interface BankDisbursementModalProps {
  open: boolean;
  onClose: () => void;
  advance: SalaryAdvanceRequest | null;
  onConfirmDisbursement: (bankAccount: string, ref: string) => Promise<void>;
}

export const BankDisbursementModal: React.FC<BankDisbursementModalProps> = ({
  open,
  onClose,
  advance,
  onConfirmDisbursement,
}) => {
  const [bankAccount, setBankAccount] = useState(advance?.bankAccount || "HDFC **** 8821");
  const [ref, setRef] = useState(`FT${Date.now().toString().slice(-8)}`);
  const [submitting, setSubmitting] = useState(false);

  if (!advance) return null;

  const handleExecute = async () => {
    setSubmitting(true);
    try {
      await onConfirmDisbursement(bankAccount, ref);
      toast.success(`Disbursed ₹${advance.approvedAmount.toLocaleString("en-IN")} to ${advance.employeeName} via bank transfer.`);
      onClose();
    } catch {
      toast.error("Failed to disburse advance.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-[#070B17] border-white/10 text-white p-6">
        <DialogHeader className="pb-3 border-b border-white/10">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            Direct Bank Disbursal Gateway: <span className="font-mono text-cyan-300">{advance.advanceCode}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
            <span className="text-slate-300">Net Disbursal Amount:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              ₹{advance.approvedAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Employee Bank Account</label>
            <Input
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="bg-slate-900 border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-semibold">Transaction Reference Number</label>
            <Input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              className="bg-slate-900 border-white/10 text-xs text-cyan-300 font-mono"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-white/10 text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Integrated with Aurix Corporate Bank Transfer Gateway (HDFC / ICICI API).</span>
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
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 shadow-lg shadow-indigo-600/25"
          >
            <CheckCircle2 className="w-4 h-4" /> {submitting ? "Disbursing..." : "Confirm Bank Disbursal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
