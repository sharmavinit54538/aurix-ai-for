import React from "react";
import { Clock, ShieldCheck, CheckCircle2, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OvertimeRecord } from "./overtimeTypes";

interface AttendanceTimelineModalProps {
  open: boolean;
  onClose: () => void;
  record: OvertimeRecord | null;
}

export const AttendanceTimelineModal: React.FC<AttendanceTimelineModalProps> = ({ open, onClose, record }) => {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl bg-[#070B17] border-white/10 text-white p-6">
        <DialogHeader className="pb-3 border-b border-white/10">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Biometric Turnstile Punch Timeline: <span className="font-mono text-cyan-300">{record.employeeName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-slate-400">Shift Name:</span>
              <p className="font-bold text-white mt-0.5">{record.shift}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Overtime Category:</span>
              <p className="font-mono font-bold text-amber-300 mt-0.5">{record.category}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300 text-xs">Biometric Gate Punch Events ({record.date})</h4>

            <div className="relative pl-6 space-y-4 border-l border-white/10">
              {/* Event 1 */}
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -left-[31px] top-1 ring-4 ring-slate-950" />
                <div className="p-3 rounded-lg bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-bold font-mono">
                    <span>Gate Clock In: {record.clockIn}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">Turnstile #04 Verified</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">Bangalore Tech Park Main Entrance Biometric Gate.</p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-amber-500 absolute -left-[31px] top-1 ring-4 ring-slate-950" />
                <div className="p-3 rounded-lg bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-amber-300 font-bold font-mono">
                    <span>Shift End (Scheduled): 06:00 PM</span>
                    <span className="text-[11px] text-slate-400">8.0 Regular Hrs Complete</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Shift completed. Commenced approved overtime window.</p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-rose-500 absolute -left-[31px] top-1 ring-4 ring-slate-950" />
                <div className="p-3 rounded-lg bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-rose-400 font-bold font-mono">
                    <span>Gate Clock Out: {record.clockOut}</span>
                    <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px]">Turnstile #04 Verified</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">Logged {record.overtimeHours} approved overtime hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 bg-slate-900 text-xs">
            Close Timeline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
