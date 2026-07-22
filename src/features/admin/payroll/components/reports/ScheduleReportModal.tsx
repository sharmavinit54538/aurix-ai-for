import React, { useState } from "react";
import { CalendarClock, Mail, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (config: any) => void;
  isScheduling?: boolean;
}

export const ScheduleReportModal: React.FC<ScheduleReportModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  isScheduling = false,
}) => {
  const [frequency, setFrequency] = useState("MONTHLY");
  const [reportType, setReportType] = useState("Salary Register");
  const [email, setEmail] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border/60 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-blue-400">
            <CalendarClock className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">Schedule Automated Report</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure recurring report delivery to selected email recipients.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Report Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Report Template</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="h-9 text-xs bg-background/50 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Salary Register">Salary Register</SelectItem>
                <SelectItem value="TDS Report">TDS Report</SelectItem>
                <SelectItem value="PF ECR Statement">PF ECR Statement</SelectItem>
                <SelectItem value="Department Cost Analysis">Department Cost Analysis</SelectItem>
                <SelectItem value="Payroll Summary">Payroll Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Frequency</label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="h-9 text-xs bg-background/50 border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Recipients */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email Recipients</label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="cfo@company.com, finance@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-9 text-xs bg-background/50 border-border/60"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-xl border border-border/40 bg-muted/20 text-xs space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Schedule Summary:
            </div>
            <p className="text-muted-foreground">
              <strong>{reportType}</strong> will be delivered <strong>{frequency.toLowerCase()}</strong>
              {email && <> to <strong>{email}</strong></>}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isScheduling} className="h-8 text-xs">
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onSchedule({ report_type: reportType, frequency, recipients: email })}
            disabled={isScheduling}
            className="h-8 px-4 text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white gap-1.5"
          >
            <CalendarClock className={`h-3.5 w-3.5 ${isScheduling ? "animate-spin" : ""}`} />
            {isScheduling ? "Scheduling..." : "Create Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
