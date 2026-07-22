import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { useAssetMutations } from "../../hooks/useAssetMutations";
import type { Asset } from "@/lib/hrms/types";

interface RepairAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  mutations: ReturnType<typeof useAssetMutations>;
}

export function RepairAssetDialog({ open, onOpenChange, asset, mutations }: RepairAssetDialogProps) {
  const [vendor, setVendor] = useState("");
  const [cost, setCost] = useState("150");
  const [notes, setNotes] = useState("");
  const { repairMutation } = mutations;

  useEffect(() => {
    if (open) {
      setVendor("");
      setCost("150");
      setNotes("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset) return;

    repairMutation.mutate(
      {
        id: asset.id,
        payload: {
          vendor: vendor || "Authorized Service Partner",
          cost: parseFloat(cost) || 0,
          notes,
        },
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">Log Repair Request: {asset?.tag}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Service Vendor / Shop Name</Label>
            <Input
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. Dell Authorized Service Center"
              className="bg-background/50 border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Estimated Repair Cost ($)</Label>
            <Input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="bg-background/50 border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Fault Description / Service Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
            <Button type="submit" className="h-9 bg-amber-600 text-white hover:bg-amber-700 cursor-pointer">
              Log to Maintenance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
