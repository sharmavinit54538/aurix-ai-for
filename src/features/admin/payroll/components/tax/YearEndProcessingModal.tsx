import React, { useState } from "react";
import { Lock, FileCheck, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface YearEndProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (financialYear: string) => Promise<void>;
}

export const YearEndProcessingModal: React.FC<YearEndProcessingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [financialYear, setFinancialYear] = useState("2025-2026");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(financialYear);
      toast.success(`Year-end processing complete for ${financialYear}. Form-16 generated.`);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to complete year-end processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/60 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-400">
            <Lock className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">Year End Tax Processing</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Lock financial year tax declarations, freeze TDS assessments, and issue statutory Form 16 annual statements for all employees.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Select Financial Year</label>
            <Select value={financialYear} onValueChange={setFinancialYear}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Financial Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">FY 2025-2026 (Assessment Year 2026-2027)</SelectItem>
                <SelectItem value="2024-2025">FY 2024-2025 (Assessment Year 2025-2026)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400">
              <ShieldAlert className="h-4 w-4" />
              Statutory Year-End Checklist:
            </div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px]">
              <li>Lock all employee tax declarations and proof documents</li>
              <li>Reconcile 12-month payroll TDS deductions with Form 24Q</li>
              <li>Generate Part A & Part B Form 16 certificates</li>
              <li>Archive tax records for auditor compliance</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} className="h-9 px-4 text-xs">
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={isProcessing}
            className="h-9 px-4 text-xs bg-amber-600 hover:bg-amber-500 text-white gap-1.5"
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${isProcessing ? "animate-spin" : ""}`} />
            {isProcessing ? "Processing Year End..." : "Confirm & Lock Year"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
