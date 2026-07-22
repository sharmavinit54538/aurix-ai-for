import React from "react";
import { Banknote, Landmark, ShieldCheck, Download, Clock, User, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BankTransferItem } from "@/services/bankTransfersApi";

interface TransferDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: BankTransferItem | null;
}

export const TransferDetailsDrawer: React.FC<TransferDetailsDrawerProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!item) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg bg-card border-border/60 backdrop-blur-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2 text-cyan-400">
            <Banknote className="h-5 w-5" />
            <SheetTitle className="text-lg font-bold">Salary Disbursement Details</SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Transaction record reference {item.reference_number} for {item.employee_name}.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4 text-xs">
          {/* Employee & Payout Summary */}
          <div className="p-4 rounded-xl border border-border/50 bg-background/40 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-foreground">{item.employee_name}</div>
              <div className="text-[11px] text-muted-foreground">{item.employee_id} • {item.department}</div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-emerald-400">₹{item.net_salary.toLocaleString("en-IN")}</div>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                {item.payment_status}
              </Badge>
            </div>
          </div>

          {/* Banking Details */}
          <div className="p-4 rounded-xl border border-border/50 bg-background/30 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-bold border-b border-border/40 pb-2">
              <Landmark className="h-4 w-4 text-cyan-400" />
              Corporate Banking Transfer Details
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground text-[10px]">Bank Name</span>
                <div className="font-semibold text-foreground">{item.bank_name}</div>
              </div>
              <div>
                <span className="text-muted-foreground text-[10px]">Account Holder</span>
                <div className="font-semibold text-foreground">{item.account_holder}</div>
              </div>
              <div>
                <span className="text-muted-foreground text-[10px]">Masked Account Number</span>
                <div className="font-mono font-semibold text-foreground">{item.masked_account_number}</div>
              </div>
              <div>
                <span className="text-muted-foreground text-[10px]">IFSC Code</span>
                <div className="font-mono font-semibold text-foreground">{item.ifsc}</div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="p-4 rounded-xl border border-border/50 bg-background/30 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-bold border-b border-border/40 pb-2">
              <Clock className="h-4 w-4 text-amber-400" />
              Disbursement Audit Timeline
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-background/50 border border-border/30">
                <span className="text-foreground font-medium">1. Payroll Run Approved</span>
                <span className="text-[10px] text-muted-foreground">Jul 28, 10:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-background/50 border border-border/30">
                <span className="text-foreground font-medium">2. Batch Code Generated</span>
                <span className="text-[10px] text-muted-foreground">{item.batch_code}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-background/50 border border-border/30">
                <span className="text-foreground font-medium">3. Bank Gateway Transfer</span>
                <span className="text-[10px] text-emerald-400 font-bold">{item.bank_status}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
