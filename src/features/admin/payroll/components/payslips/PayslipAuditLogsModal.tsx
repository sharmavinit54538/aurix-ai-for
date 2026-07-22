import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AuditLogItem } from "@/services/payslipsApi";
import { History, Shield, Clock, Laptop, User } from "lucide-react";

interface PayslipAuditLogsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslipNumber?: string;
  logs: AuditLogItem[];
  isLoading?: boolean;
}

export const PayslipAuditLogsModal: React.FC<PayslipAuditLogsModalProps> = ({
  open,
  onOpenChange,
  payslipNumber,
  logs,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg text-xs">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <History className="h-4 w-4 text-indigo-500" />
            Audit Trail — {payslipNumber || "Payslip Record"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">
            Loading security audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No audit activity recorded yet.
          </div>
        ) : (
          <div className="space-y-3 py-2 max-h-[400px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border border-border/50 rounded-lg p-3 bg-card/60 backdrop-blur-sm space-y-1.5 hover:border-indigo-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-[10px] font-semibold gap-1">
                    <Shield className="h-3 w-3" /> {log.activity}
                  </Badge>
                  <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-foreground font-medium">{log.details}</p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30 font-mono">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {log.performed_by} ({log.role})
                  </span>
                  <span className="flex items-center gap-1">
                    <Laptop className="h-3 w-3" /> IP: {log.ip_address}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
