import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES } from "../../constants";
import type { AssetCategory } from "../../types";

interface AddAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  assetName: string;
  setAssetName: (val: string) => void;
  assetCategory: AssetCategory;
  setAssetCategory: (val: AssetCategory) => void;
  brand: string;
  setBrand: (val: string) => void;
  model: string;
  setModel: (val: string) => void;
  serial: string;
  setSerial: (val: string) => void;
  purchaseDate: string;
  setPurchaseDate: (val: string) => void;
  purchaseCost: string;
  setPurchaseCost: (val: string) => void;
  vendor: string;
  setVendor: (val: string) => void;
  warrantyUntil: string;
  setWarrantyUntil: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
}

export function AddAssetModal({
  open,
  onOpenChange,
  onSubmit,
  assetName,
  setAssetName,
  assetCategory,
  setAssetCategory,
  brand,
  setBrand,
  model,
  setModel,
  serial,
  setSerial,
  purchaseDate,
  setPurchaseDate,
  purchaseCost,
  setPurchaseCost,
  vendor,
  setVendor,
  warrantyUntil,
  setWarrantyUntil,
  location,
  setLocation,
  notes,
  setNotes,
}: AddAssetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-lg">Register New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground">Asset Name</Label>
              <Input
                value={assetName}
                onChange={e => setAssetName(e.target.value)}
                placeholder="e.g. MacBook Pro M3"
                className="bg-background/50 border-border"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
              <Select value={assetCategory} onValueChange={(val: AssetCategory) => setAssetCategory(val)}>
                <SelectTrigger className="bg-background/50 border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Serial Number</Label>
              <Input
                value={serial}
                onChange={e => setSerial(e.target.value)}
                placeholder="C02XJ192"
                className="bg-background/50 border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Brand</Label>
              <Input
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="e.g. Apple"
                className="bg-background/50 border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Model Specification</Label>
              <Input
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="e.g. Pro 14 M3 16GB"
                className="bg-background/50 border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Vendor</Label>
              <Input
                value={vendor}
                onChange={e => setVendor(e.target.value)}
                placeholder="e.g. Apple Authorized Reseller"
                className="bg-background/50 border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Purchase Cost ($)</Label>
              <Input
                type="number"
                value={purchaseCost}
                onChange={e => setPurchaseCost(e.target.value)}
                placeholder="0.00"
                className="bg-background/50 border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Purchase Date</Label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="bg-background/50 border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Warranty Expiry (Optional)</Label>
              <Input
                type="date"
                value={warrantyUntil}
                onChange={e => setWarrantyUntil(e.target.value)}
                className="bg-background/50 border-border text-xs"
              />
              <p className="text-[10px] text-muted-foreground">Leave blank if no warranty applies</p>
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground">Current Location / Room</Label>
              <Input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Bangalore Floor 3 Store Room"
                className="bg-background/50 border-border text-xs"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground">Description Notes</Label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Condition, initial checks, setup requirements..."
                className="min-h-[60px] bg-background/50 border-border text-xs"
              />
            </div>

            {/* Asset Image upload */}
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground">Asset Image Upload</Label>
              <div className="flex items-center justify-center border border-dashed border-border bg-background/30 rounded-xl p-4 text-center text-[10px] text-muted-foreground">
                Click or Drag asset photograph to upload (Optional)
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-9 cursor-pointer">
              Generate ID & Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
