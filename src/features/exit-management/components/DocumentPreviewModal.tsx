import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentPreviewModalProps {
  text: string | null;
  onClose: () => void;
}

export function DocumentPreviewModal({ text, onClose }: DocumentPreviewModalProps) {
  return (
    <Dialog open={!!text} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Official Documentation Preview
          </DialogTitle>
        </DialogHeader>
        <div className="bg-muted/30 rounded-xl border border-border p-5 text-foreground font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-none min-h-[300px]">
          {text}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 border-border bg-transparent cursor-pointer"
          >
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
