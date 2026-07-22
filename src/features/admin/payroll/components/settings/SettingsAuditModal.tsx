import React from "react";
import { ShieldCheck, Clock, User, Activity, ArrowRight, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SettingsAuditHistoryItem } from "@/services/payrollSettingsApi";

interface SettingsAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SettingsAuditHistoryItem[];
  isLoading?: boolean;
}

export const SettingsAuditModal: React.FC<SettingsAuditModalProps> = ({
  isOpen,
  onClose,
  history,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-white/[0.06] bg-[#0d1526]/98 sm:max-w-2xl backdrop-blur-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white/95">
                Configuration Audit Trail
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Immutable log of configuration modifications, rate updates, and policy overrides
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2 max-h-[420px] space-y-1 overflow-y-auto pr-1">
          {isLoading ? (
            /* Shimmer Loading State */
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="audit-timeline-item">
                  <div className="shimmer-loading h-24 rounded-xl border border-white/[0.04]" />
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                <Activity className="h-5 w-5 text-slate-500" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-400">No changes logged yet</p>
              <p className="mt-1 text-xs text-slate-500">Configuration changes will appear here</p>
            </div>
          ) : (
            <div className="py-2">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="audit-timeline-item mb-4 last:mb-0"
                >
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1] hover:bg-white/[0.03]">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
                        <Activity className="h-3.5 w-3.5" />
                        {item.action.replace(/_/g, " ")}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Clock className="h-3 w-3" />
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {/* Value Change */}
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/[0.04] bg-[#080e1a]/60 p-2.5 font-mono text-xs">
                      <span className="text-rose-400/80 line-through">{item.old_value}</span>
                      <ArrowRight className="h-3 w-3 flex-shrink-0 text-slate-600" />
                      <span className="font-semibold text-emerald-400">{item.new_value}</span>
                    </div>

                    {/* Footer Row */}
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3 w-3" />
                        Actor:{" "}
                        <strong className="text-slate-300">{item.actor}</strong>
                      </span>
                      <span className="font-mono">IP: {item.ip_address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.05] pt-4">
          <span className="text-[10px] text-slate-500">
            {history.length} audit {history.length === 1 ? "entry" : "entries"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 border-white/[0.08] bg-white/[0.03] px-5 text-xs text-slate-300 hover:bg-white/[0.06]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
