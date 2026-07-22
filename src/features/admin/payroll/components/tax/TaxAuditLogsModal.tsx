import React from "react";
import { ShieldCheck, Clock, User, Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TaxAuditLogItem } from "@/services/taxApi";

interface TaxAuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName?: string;
  logs: TaxAuditLogItem[];
  isLoading?: boolean;
}

export const TaxAuditLogsModal: React.FC<TaxAuditLogsModalProps> = ({
  isOpen,
  onClose,
  employeeName,
  logs,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border/60 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">Tax Compliance Audit Trail</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Audit trail of declaration filings, proof verifications, and TDS recalculations for{" "}
            <strong className="text-foreground">{employeeName || "Employee"}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
              Loading audit logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No audit logs recorded for this employee yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5" />
                    {log.action.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">{log.details}</p>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  Actor: <strong className="text-foreground">{log.actor}</strong>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 px-4 text-xs">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
