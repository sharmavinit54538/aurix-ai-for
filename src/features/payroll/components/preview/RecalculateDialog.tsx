import { RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "../../utils/payrollPreview.utils";
import type { PayrollPreviewData } from "@/services/payrollApi";

export function RecalculateDialog({
  open,
  onClose,
  runId,
  previewData,
  isRecalculating,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  runId: string;
  previewData: PayrollPreviewData | null;
  isRecalculating: boolean;
  onConfirm: () => void;
}) {
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

        <div className="space-y-3 py-2 text-xs">
          <p className="text-muted-foreground">
            Recalculating will re-evaluate attendance, salary structures, statutory taxes (PF, ESI, TDS), and deductions for all employees in this period.
          </p>
          <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Run ID:</span>
              <span className="font-mono font-semibold text-foreground">{runId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-semibold text-foreground">
                {previewData?.periodName || "—"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isRecalculating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isRecalculating}
            style={{ background: "var(--gradient-brand)" }}
          >
            {isRecalculating ? (
              <>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Recalculating...
              </>
            ) : (
              "Confirm & Recalculate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}