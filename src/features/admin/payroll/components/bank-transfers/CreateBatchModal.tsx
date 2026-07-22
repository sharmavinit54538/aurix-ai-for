import React from "react";
import { Plus, CheckCircle2, FileCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCreate: () => void;
  isCreating?: boolean;
}

export const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isOpen,
  onClose,
  onConfirmCreate,
  isCreating = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/60 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-cyan-400">
            <Plus className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">Create Salary Disbursement Batch</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Generate corporate NEFT/ACH bank advice payment batch for approved July 2026 payroll.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-xl border border-border/40 bg-muted/20 space-y-2 text-xs">
          <div className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Batch Preview Summary:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1">
            <div>
              <span>Employees Count:</span>
              <div className="font-bold text-foreground">140 Employees</div>
            </div>
            <div>
              <span>Total Payable Pool:</span>
              <div className="font-bold text-emerald-400">₹69,50,000.00</div>
            </div>
            <div>
              <span>Bank Format:</span>
              <div className="font-bold text-foreground">HDFC Corporate NEFT</div>
            </div>
            <div>
              <span>Execution Date:</span>
              <div className="font-bold text-foreground">July 31, 2026</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isCreating} className="h-8 px-4 text-xs">
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirmCreate}
            disabled={isCreating}
            className="h-8 px-4 text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white gap-1.5"
          >
            <FileCode className={`h-3.5 w-3.5 ${isCreating ? "animate-spin" : ""}`} />
            {isCreating ? "Creating Batch..." : "Create & Generate Advice"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
