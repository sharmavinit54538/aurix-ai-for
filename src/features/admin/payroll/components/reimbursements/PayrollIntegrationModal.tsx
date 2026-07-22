import React, { useState } from "react";
import { CreditCard, CheckCircle2, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PayrollIntegrationModalProps {
  open: boolean;
  onClose: () => void;
  selectedClaimIds: string[];
  onConfirmIntegration: (payrollCycle: string, mode: "SALARY_CYCLE" | "STANDALONE") => Promise<void>;
}

export const PayrollIntegrationModal: React.FC<PayrollIntegrationModalProps> = ({
  open,
  onClose,
  selectedClaimIds,
  onConfirmIntegration,
}) => {
  const [payrollCycle, setPayrollCycle] = useState("JULY-2026");
  const [integrationMode, setIntegrationMode] = useState<"SALARY_CYCLE" | "STANDALONE">("SALARY_CYCLE");
  const [submitting, setSubmitting] = useState(false);

  const handleExecute = async () => {
    setSubmitting(true);
    try {
      await onConfirmIntegration(payrollCycle, integrationMode);
      toast.success(`Generated payroll entries for ${selectedClaimIds.length} reimbursement claim(s).`);
      onClose();
    } catch {
      toast.error("Failed to generate payroll entries.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg bg-[#070B17] border-white/10 text-white p-6">
        <DialogHeader className="pb-3 border-b border-white/10">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            Payroll Integration & Direct Ledger Entry
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/30 flex items-center justify-between">
            <span className="text-slate-300">Selected Claims for Integration:</span>
            <span className="font-mono font-bold text-blue-300 text-sm">{selectedClaimIds.length} Claim(s)</span>
          </div>

          {/* Integration Mode Radio Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-300 font-semibold">Payment Disbursal Mode</Label>
            <RadioGroup
              value={integrationMode}
              onValueChange={(val: any) => setIntegrationMode(val)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-900 border border-white/10">
                <RadioGroupItem value="SALARY_CYCLE" id="mode1" />
                <Label htmlFor="mode1" className="text-xs text-white cursor-pointer font-medium">
                  Include in Next Salary Processing Run (Add to Monthly Payslip)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-900 border border-white/10">
                <RadioGroupItem value="STANDALONE" id="mode2" />
                <Label htmlFor="mode2" className="text-xs text-white cursor-pointer font-medium">
                  Process Standalone Direct Bank Transfer Disbursal
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Target Payroll Cycle */}
          {integrationMode === "SALARY_CYCLE" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300 font-semibold">Target Payroll Cycle</Label>
              <Select value={payrollCycle} onValueChange={setPayrollCycle}>
                <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                  <SelectItem value="JULY-2026">July 2026 Pay Run (Active)</SelectItem>
                  <SelectItem value="AUGUST-2026">August 2026 Pay Run</SelectItem>
                  <SelectItem value="SEPTEMBER-2026">September 2026 Pay Run</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 bg-slate-900 text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleExecute}
            disabled={submitting || selectedClaimIds.length === 0}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs gap-1.5 shadow-lg shadow-cyan-600/25"
          >
            <CheckCircle2 className="w-4 h-4" /> {submitting ? "Processing..." : "Generate Payroll Entries"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
