import React from "react";
import {
  X,
  Timer,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  Building,
  Calendar,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OvertimeRecord } from "./overtimeTypes";

interface OvertimeDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  record: OvertimeRecord | null;
  onApprove: (record: OvertimeRecord) => void;
  onReject: (record: OvertimeRecord) => void;
  onAddPayrollEntry: (record: OvertimeRecord) => void;
}

export const OvertimeDetailsDrawer: React.FC<OvertimeDetailsDrawerProps> = ({
  open,
  onClose,
  record,
  onApprove,
  onReject,
  onAddPayrollEntry,
}) => {
  if (!record) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#070B17] border-l border-white/10 text-white p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div>
            <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-400" />
              Overtime Claim Details: <span className="font-mono text-blue-300">{record.requestCode}</span>
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">Date: {record.date} • Shift: {record.shift}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Employee & Financial Summary */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Employee Profile</span>
              <h4 className="text-sm font-bold text-white">{record.employeeName}</h4>
              <p className="text-xs text-slate-300">{record.department} — {record.designation}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-[10px]">
                  {record.category}
                </Badge>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Calculated OT Payout</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                ₹{record.overtimeAmount.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-slate-400">Base Rate: ₹{record.hourlyRate}/hr × {record.multiplier}x</p>
              <div className="text-xs font-bold font-mono text-amber-300 mt-1">
                OT Hours: {record.overtimeHours} hrs
              </div>
            </div>
          </div>

          {/* Biometric Attendance Punch Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Biometric Punch & Work Breakdown</h4>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 grid grid-cols-4 gap-2 text-xs text-center">
              <div className="p-2 rounded bg-slate-900 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Clock In</span>
                <span className="font-mono font-bold text-emerald-400">{record.clockIn}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Clock Out</span>
                <span className="font-mono font-bold text-rose-400">{record.clockOut}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Worked Hours</span>
                <span className="font-mono font-bold text-white">{record.workedHours} hrs</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-white/5">
                <span className="text-[10px] text-slate-400 block">Approved OT</span>
                <span className="font-mono font-bold text-amber-300">{record.overtimeHours} hrs</span>
              </div>
            </div>
          </div>

          {/* 5-Stage Governance Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">5-Stage Approval Sign-off Governance</h4>
            <div className="space-y-2">
              {record.approvalWorkflow.map((step) => {
                const isApproved = step.status === "APPROVED";
                const isPending = step.status === "PENDING";
                const isRejected = step.status === "REJECTED";

                return (
                  <div key={step.role} className="p-3 rounded-lg bg-slate-950/40 border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {isApproved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {isPending && <Clock className="w-4 h-4 text-amber-400" />}
                      {isRejected && <XCircle className="w-4 h-4 text-rose-400" />}
                      <div>
                        <span className="font-semibold text-white">{step.role}</span>
                        <p className="text-[10px] text-slate-400">{step.name} • {step.timestamp || "Pending sign-off"}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={isApproved ? "text-emerald-400 border-emerald-500/30" : "text-amber-400 border-amber-500/30"}>
                      {step.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-900 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 bg-slate-950 text-slate-300 text-xs">
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(record)}
              className="border-rose-500/30 text-rose-400 hover:bg-rose-950 text-xs"
            >
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => onAddPayrollEntry(record)}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" /> Add to Payroll
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(record)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve OT
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
