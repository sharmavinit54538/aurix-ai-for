import { RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RecalculateDialogProps {
  open: boolean;
  onClose: () => void;
  runId: string;
  isRecalculating: boolean;
  onConfirm: () => void;
}

export function RecalculateDialog({
  open,
  onClose,
  runId,
  isRecalculating,
  onConfirm,
}: RecalculateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-base">
            <RotateCcw className="h-4 w-4 text-primary" />
            Recalculate Payroll Run
          </DialogTitle>
          <DialogDescription className="text-xs">
            Trigger a fresh calculation cycle for this payroll run on the backend engine.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs text-muted-foreground">
          <p>
            Recalculating will re-evaluate attendance, salary components, statutory deductions
            (PF, ESI, TDS), and allowances for all employees in run{" "}
            <strong className="text-foreground font-mono">{runId}</strong>.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isRecalculating}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirm}
            disabled={isRecalculating}
            className="text-xs gap-1.5"
          >
            {isRecalculating ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            <span>Execute Recalculation</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";