import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Asset } from "@/lib/hrms/types";

interface ScanQrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: Asset[];
  scannedAssetTag: string;
  onScannedAssetTagChange: (tag: string) => void;
  onConfirmScan: () => void;
}

export function ScanQrDialog({
  open,
  onOpenChange,
  assets,
  scannedAssetTag,
  onScannedAssetTagChange,
  onConfirmScan,
}: ScanQrDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">QR / Barcode Scanner</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Simulate scanning a physical QR code label on a laptop/device using a mobile phone. Select an asset
            sticker from the checklist.
          </p>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Select Sticker to Scan</Label>
            <Select value={scannedAssetTag} onValueChange={onScannedAssetTagChange}>
              <SelectTrigger className="w-full bg-background/50 border-border">
                <SelectValue placeholder="Choose asset tag" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((a) => (
                  <SelectItem key={a.id} value={a.tag}>
                    {a.tag} &bull; {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 border-border bg-transparent cursor-pointer">
            Cancel
          </Button>
          <Button
            onClick={onConfirmScan}
            disabled={!scannedAssetTag}
            className="h-9 bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer"
          >
            Confirm Mock Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
