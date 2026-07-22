import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AssetFormFields } from "../AssetsFormFields";
import { useAssetForm } from "../../hooks/useAssetForm";
import type { useAssetMutations } from "../../hooks/useAssetsMutations";
import type { Asset } from "@/lib/hrms/types";

interface EditAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  mutations: ReturnType<typeof useAssetMutations>;
}

export function EditAssetDialog({ open, onOpenChange, asset, mutations }: EditAssetDialogProps) {
  const { values, setField, loadFromAsset } = useAssetForm();
  const { editMutation } = mutations;

  useEffect(() => {
    if (asset && open) loadFromAsset(asset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset) return;

    editMutation.mutate(
      {
        id: asset.id,
        payload: {
          name: values.assetName,
          category: values.assetCategory,
          brand: values.brand,
          model: values.model,
          serial: values.serial,
          purchase_date: values.purchaseDate,
          purchase_cost: parseFloat(values.purchaseCost) || 0,
          vendor: values.vendor,
          warranty_until: values.warrantyUntil,
          location: values.location,
          notes: values.notes,
        },
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-border shadow-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-lg">Edit Asset Specifications</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AssetFormFields values={values} onChange={setField} />

          <DialogFooter className="flex flex-col-reverse lg:flex-row gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full lg:w-auto h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full lg:w-auto h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
