import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssetFormFields } from "../../components/AssetsFormFields";
import { useAssetForm } from "../../hooks/useAssetForm";
import { generateAssetTag } from "../../utils";
import type { useAssetMutations } from "../../hooks/useAssetsMutations";

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mutations: ReturnType<typeof useAssetMutations>;
  /** Called with the newly created asset right after a successful save — used to auto-open the QR sticker. */
  onCreated?: (asset: any) => void;
}

export function AddAssetDialog({ open, onOpenChange, mutations, onCreated }: AddAssetDialogProps) {
  const { values, setField, reset } = useAssetForm();
  const [assetImage, setAssetImage] = useState<File | null>(null);
  const { createMutation, uploadImage } = mutations;

  const closeAndReset = () => {
    reset();
    setAssetImage(null);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.assetName || !values.serial || !values.brand) {
      toast.error("Please fill in Asset Name, Brand, and Serial Number.");
      return;
    }

    const assetTag = generateAssetTag(values.assetCategory);
    const costNum = parseFloat(values.purchaseCost) || 0;
    let imageUrl = "";

    try {
      imageUrl = await uploadImage(assetImage);
    } catch {
      toast.error("Image upload failed");
      return;
    }

    createMutation.mutate(
      {
        tag: assetTag,
        name: values.assetName,
        category: values.assetCategory,
        serial: values.serial,
        vendor: values.vendor || "Unknown Vendor",
        purchase_date: values.purchaseDate,
        warranty_until:
          values.warrantyUntil ||
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        brand: values.brand,
        model: values.model,
        purchase_cost: costNum,
        location: values.location || "HQ IT Desk",
        notes: values.notes,
        image_url: imageUrl,
      },
      {
        onSuccess: (res: any) => {
          closeAndReset();
          onCreated?.(res?.data);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : closeAndReset())}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-border shadow-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-lg">Register New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AssetFormFields values={values} onChange={setField} />

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Asset Image Upload</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setAssetImage(e.target.files[0]);
                }
              }}
            />
            {assetImage && (
              <>
                <p className="text-xs text-green-600">Selected File: {assetImage.name}</p>
                <div className="mt-3 space-y-2">
                  <img
                    src={URL.createObjectURL(assetImage)}
                    alt="Asset Preview"
                    className="w-full max-w-[220px] h-auto aspect-square object-cover rounded-lg border"
                  />
                  <Button type="button" variant="outline" onClick={() => setAssetImage(null)}>
                    Remove Image
                  </Button>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border">
            <Button className="w-full sm:w-auto" type="button" variant="outline" onClick={closeAndReset}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer"
            >
              Generate ID & Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
