import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { useAssetMutations } from "../../hooks/useAssetMutations";
import type { Asset } from "@/lib/hrms/types";

interface DeleteAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  mutations: ReturnType<typeof useAssetMutations>;
}

export function DeleteAssetDialog({ open, onOpenChange, asset, mutations }: DeleteAssetDialogProps) {
  const { deleteMutation } = mutations;

  const handleDelete = () => {
    if (!asset) return;
    deleteMutation.mutate(asset.id, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-rose-500">Delete Asset Record</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to permanently erase the record for asset{" "}
          <strong className="font-semibold text-foreground">
            {asset?.tag} ({asset?.name})
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
          <Button onClick={handleDelete} className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer">
            Delete Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
