import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Asset } from "../../types";

interface RepairAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  targetAsset: Asset | null;
  repairVendor: string;
  setRepairVendor: (v: string) => void;
  repairCost: string;
  setRepairCost: (c: string) => void;
  repairNotes: string;
  setRepairNotes: (n: string) => void;
}

export function RepairAssetModal({
  open,
  onOpenChange,
  onSubmit,
  targetAsset,
  repairVendor,
  setRepairVendor,
  repairCost,
  setRepairCost,
  repairNotes,
  setRepairNotes,
}: RepairAssetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">
            Log Repair Request: {targetAsset?.tag}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Service Vendor / Shop Name</Label>
            <Input
              value={repairVendor}
              onChange={e => setRepairVendor(e.target.value)}
              placeholder="e.g. Dell Authorized Service Center"
              className="bg-background/50 border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Estimated Repair Cost ($)</Label>
            <Input
              type="number"
              value={repairCost}
              onChange={e => setRepairCost(e.target.value)}
              placeholder="0.00"
              className="bg-background/50 border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Fault Description / Service Notes</Label>
            <Textarea
              value={repairNotes}
              onChange={e => setRepairNotes(e.target.value)}
              placeholder="e.g. Sticky keyboard keys, battery swelling, screen flickering..."
              className="min-h-[80px] bg-background/50 border-border text-xs"
            />
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
              Log to Maintenance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
