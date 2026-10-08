import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import type { ProvisionSlip } from "../../types";

interface ProvisionSlipDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProvision: ProvisionSlip | null;
  currentUserName?: string;
  onDownload: (slip: ProvisionSlip) => void;
}

export const ProvisionSlipDetailModal: React.FC<ProvisionSlipDetailModalProps> = ({
  open,
  onOpenChange,
  selectedProvision,
  currentUserName,
  onDownload,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Provision Slip</DialogTitle>
          <DialogDescription>
            Provisional statement generated for audit and pre-disbursement verification.
          </DialogDescription>
        </DialogHeader>

        {selectedProvision && (
          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Provision Slip Number:</span>
                <span className="font-mono font-medium">
                  {selectedProvision.slipNumber ||
                    `PRV-${selectedProvision.id.slice(0, 8).toUpperCase()}`}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Pay Period:</span>
                <span className="font-medium">{selectedProvision.periodName || "—"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Employee Name:</span>
                <span>{selectedProvision.employeeName || currentUserName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Generated Date:</span>
                <span>
                  {selectedProvision.generatedAt
                    ? new Date(selectedProvision.generatedAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-amber-500/10 text-amber-500 text-[10px]">
                  {selectedProvision.status || "Provisional"}
                </Badge>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Provisioned Amount:</span>
                  <span className="text-amber-500">
                    {selectedProvision.provisionedAmount != null
                      ? `₹${selectedProvision.provisionedAmount.toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                onClick={() => onDownload(selectedProvision)}
                size="sm"
                className="gap-1.5 bg-primary text-primary-foreground"
              >
                <Download className="h-3.5 w-3.5" /> Download Slip
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
