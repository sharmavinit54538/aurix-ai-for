import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RejectExitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  setRejectionReason: (val: string) => void;
  onConfirm: () => void;
}

export function RejectExitModal({
  open,
  onOpenChange,
  rejectionReason,
  setRejectionReason,
  onConfirm,
}: RejectExitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-destructive">
            Cancel/Reject Resignation
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-xs text-muted-foreground">
            Please state the reason for rejecting or cancelling this exit request.
          </p>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Agreement signed, key personnel retention, resignation withdrawn..."
            className="min-h-[100px] border-border text-xs"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 border-border bg-transparent cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
