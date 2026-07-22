import React from "react";
import { ShieldCheck, Play, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RunComplianceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRun: () => void;
  isRunning?: boolean;
}

export const RunComplianceCheckModal: React.FC<RunComplianceCheckModalProps> = ({
  isOpen,
  onClose,
  onConfirmRun,
  isRunning = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/60 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">Run Automated Statutory Audit</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Execute full labor law, EPF, ESIC, PT, and TDS compliance validation engine across all active employees.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-xl border border-border/40 bg-muted/20 space-y-2 text-xs">
          <div className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Audit Parameters Checked:
          </div>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px] pl-1">
            <li>EPF UAN verification & 12% statutory ceiling compliance</li>
            <li>ESIC Insurance Number verification for employees &lt;= ₹21,000</li>
            <li>Professional Tax state slab accuracy</li>
            <li>Minimum wage threshold compliance by role & region</li>
            <li>Income Tax TDS deduction under active Tax Regimes</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isRunning} className="h-8 px-4 text-xs">
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirmRun}
            disabled={isRunning}
            className="h-8 px-4 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white gap-1.5"
          >
            <Play className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Running Check..." : "Start Audit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
