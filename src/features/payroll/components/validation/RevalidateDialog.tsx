import { FileCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RevalidateDialogProps {
  open: boolean;
  onClose: () => void;
  runId: string;
  isValidating: boolean;
  onConfirm: () => void;
}

export function RevalidateDialog({
  open,
  onClose,
  runId,
  isValidating,
  onConfirm,
}: RevalidateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-base">
            <FileCheck className="h-4 w-4 text-primary" />
            Revalidate Payroll Run
          </DialogTitle>
          <DialogDescription className="text-xs">
            Execute a fresh validation cycle on the server-side payroll engine.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs text-muted-foreground">
          <p>
            Revalidating will re-audit all statutory deductions, tax slabs (Section 192),
            attendance thresholds, and CTC structures for run{" "}
            <strong className="text-foreground font-mono">{runId}</strong>.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isValidating}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirm}
            disabled={isValidating}
            className="text-xs gap-1.5"
          >
            {isValidating ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileCheck className="h-3.5 w-3.5" />
            )}
            <span>Execute Validation</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { FileCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";