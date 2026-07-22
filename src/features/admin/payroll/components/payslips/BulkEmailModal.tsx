import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, RefreshCw, CheckCircle2 } from "lucide-react";

interface BulkEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onSendEmail: (customNote?: string) => Promise<void>;
}

export const BulkEmailModal: React.FC<BulkEmailModalProps> = ({
  open,
  onOpenChange,
  selectedCount,
  onSendEmail,
}) => {
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await onSendEmail(note);
      setIsDone(true);
      setTimeout(() => {
        setIsSending(false);
        setIsDone(false);
        onOpenChange(false);
      }, 1000);
    } catch {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-xs">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Mail className="h-4 w-4 text-blue-500" />
            Distribute Payslips via Email
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSend} className="space-y-4 py-2">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-blue-600 dark:text-blue-400 font-medium">
            Ready to dispatch digital payslips to <span className="font-bold">{selectedCount}</span> selected employees.
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Email Subject</Label>
            <Input
              value="Official Monthly Payslip Issued — Aurix HRMS"
              readOnly
              className="h-9 text-xs bg-muted/40 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Custom Note / Announcement (Optional)</Label>
            <Textarea
              placeholder="e.g. Please find attached your encrypted monthly payslip. For payroll queries, contact hr@aurix.ai..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-xs min-h-[90px]"
            />
          </div>

          {isDone && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
              <CheckCircle2 className="h-4 w-4" /> Email dispatch completed successfully!
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-border/40 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSending}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSending ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Dispatching...
                </>
              ) : (
                <>
                  <Mail className="h-3.5 w-3.5" /> Send Emails ({selectedCount})
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
