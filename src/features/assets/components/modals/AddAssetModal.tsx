import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
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
  imageUrl?: string;
  setImageUrl?: (val: string) => void;
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
  imageUrl,
  setImageUrl,
}: AddAssetModalProps) {
  const [localImage, setLocalImage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeImage = imageUrl !== undefined ? imageUrl : localImage;

  const handleApplyImage = (dataUrl: string, name: string = "") => {
    if (setImageUrl) {
      setImageUrl(dataUrl);
    }
    setLocalImage(dataUrl);
    setFileName(name);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        handleApplyImage(res, file.name);
        toast.success("Asset photograph selected.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    handleApplyImage("", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col bg-background border-border shadow-2xl p-6">
        <DialogHeader className="shrink-0">
          <DialogTitle className="font-display font-bold text-lg">Register New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden space-y-4">
          <div className="overflow-y-auto pr-1.5 space-y-4 flex-1">
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {activeImage ? (
                  <div className="flex items-center justify-between border border-border bg-background/40 rounded-xl p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={activeImage}
                        alt="Asset preview"
                        className="h-12 w-12 rounded-lg object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate max-w-[200px]">
                          {fileName || "Asset Photograph"}
                        </p>
                        <p className="text-[10px] text-emerald-500 font-medium">Image attached</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 text-xs px-2.5 cursor-pointer"
                      >
                        Change
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex items-center justify-center gap-2 border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-border/80 bg-background/30 hover:bg-background/50 text-muted-foreground"
                    }`}
                  >
                    <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-[11px] font-medium">
                      Click or Drag asset photograph to upload (Optional)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border shrink-0">
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
