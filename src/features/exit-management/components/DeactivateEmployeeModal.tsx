import { PowerOff, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeactivateEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName?: string;
  onConfirm: () => void;
}

export function DeactivateEmployeeModal({
  open,
  onOpenChange,
  employeeName,
  onConfirm,
}: DeactivateEmployeeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border text-center">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-destructive flex items-center justify-center gap-1.5">
            <PowerOff className="h-5 w-5 animate-pulse" />
            Revoke Employee SSO Credentials
          </DialogTitle>
        </DialogHeader>
        <div className="py-3 space-y-2 text-xs text-muted-foreground text-left">
          <p>
            Confirming final offboarding completion for <strong>{employeeName}</strong> will automatically
            trigger:
          </p>
          <ul className="list-disc pl-5 space-y-1 bg-muted/30 p-2.5 rounded-lg border border-border">
            <li>Revoking SSO credentials & workspace account access.</li>
            <li>Revoking GitHub/Figma repository permissions.</li>
            <li>Closing active sessions.</li>
            <li>Deactivating employee profile and archiving data history.</li>
          </ul>
        </div>
        <DialogFooter className="pt-2 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer gap-1.5"
          >
            <Archive className="h-4 w-4" />
            Deactivate & Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
