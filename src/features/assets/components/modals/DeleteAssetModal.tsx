import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Asset } from "../../types";

interface DeleteAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  targetAsset: Asset | null;
}

export function DeleteAssetModal({
  open,
  onOpenChange,
  onConfirm,
  targetAsset,
}: DeleteAssetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-destructive">
            Delete Asset Record
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to permanently erase the record for asset{" "}
          <strong className="font-semibold text-foreground">
            {targetAsset?.tag} ({targetAsset?.name})
          </strong>
          ? This will clear all historical timelines.
        </p>
        <DialogFooter className="pt-2 border-t border-border gap-1">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="h-9 cursor-pointer"
          >
            Delete Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
