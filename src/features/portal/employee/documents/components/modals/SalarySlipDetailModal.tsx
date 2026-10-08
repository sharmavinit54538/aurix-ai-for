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
import type { SalarySlipRecord } from "../../types";

interface SalarySlipDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlip: SalarySlipRecord | null;
  onDownload: (slip: SalarySlipRecord) => void;
}

export const SalarySlipDetailModal: React.FC<SalarySlipDetailModalProps> = ({
  open,
  onOpenChange,
  selectedSlip,
  onDownload,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Salary Slip — {selectedSlip?.periodName}</DialogTitle>
          <DialogDescription>
            Official payslip summary from the OFC360 Payroll Engine.
          </DialogDescription>
        </DialogHeader>

        {selectedSlip && (
          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Payslip Number:</span>
                <span className="font-mono font-medium">{selectedSlip.payslipNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Pay Period:</span>
                <span className="font-medium">{selectedSlip.periodName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Generated Date:</span>
                <span>
                  {selectedSlip.generatedDate
                    ? new Date(selectedSlip.generatedDate).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Status:</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px]">
                  {selectedSlip.status}
                </Badge>
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Gross Earnings:</span>
                  <span className="font-semibold">
                    {selectedSlip.grossSalary != null
                      ? `₹${selectedSlip.grossSalary.toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Total Deductions:</span>
                  <span className="font-semibold text-rose-400">
                    {selectedSlip.deductions != null
                      ? `₹${selectedSlip.deductions.toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-t border-border/50 pt-2">
                  <span>Net Disbursed Salary:</span>
                  <span className="text-emerald-500">
                    {selectedSlip.netSalary != null
                      ? `₹${selectedSlip.netSalary.toLocaleString("en-IN")}`
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
                onClick={() => onDownload(selectedSlip)}
                size="sm"
                className="gap-1.5 bg-primary text-primary-foreground"
              >
                <Download className="h-3.5 w-3.5" /> Download PDF
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
