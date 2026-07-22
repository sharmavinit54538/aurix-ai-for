import { Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buildAssetScanUrl } from "../../utils";
import type { useAssetMutations } from "../../hooks/useAssetsMutations";
import type { Asset } from "@/lib/hrms/types";

interface QrStickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  mutations: ReturnType<typeof useAssetMutations>;
}

export function QrStickerDialog({ open, onOpenChange, asset, mutations }: QrStickerDialogProps) {
  const { appendNoteMutation } = mutations;

  const handleRegenerate = () => {
    if (!asset) return;
    appendNoteMutation.mutate({
      id: asset.id,
      existingNotes: asset.notes || "",
      note: "Regenerated unique QR signature check.",
    });
    onOpenChange(false);
  };

  const handlePrint = () => {
    toast.success("Sticker sent to printer queue.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs bg-background border-border text-center">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-center">Asset QR Sticker Label</DialogTitle>
        </DialogHeader>
        {asset && (
          <div className="space-y-4 pt-3 flex flex-col items-center">
            <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-md w-[220px] flex flex-col items-center select-none text-slate-800">
              <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">AURIX HRMS ASSET</div>
              <div className="font-mono text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-1.5 w-full text-center">
                {asset.tag}
              </div>

              <div className="my-3 p-1.5 border border-slate-100 bg-white rounded shadow-inner flex flex-col items-center justify-center">
                <QRCodeSVG value={buildAssetScanUrl(asset)} size={130} level="M" />
                <div className="font-mono text-[10px] text-slate-500 mt-1.5">{asset.serial ?? asset.id}</div>
              </div>

              <div className="text-[10px] font-semibold text-slate-700 truncate max-w-full">{asset.name}</div>
              <div className="text-[8px] text-slate-400 italic break-all px-2">{buildAssetScanUrl(asset)}</div>
            </div>

            <div className="flex gap-2 w-full pt-2">
              <Button variant="outline" onClick={handleRegenerate} className="flex-1 h-9 text-xs border-border bg-transparent cursor-pointer">
                Regenerate
              </Button>
              <Button onClick={handlePrint} className="flex-1 h-9 text-xs bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer gap-1.5">
                <Printer className="h-3.5 w-3.5" />
                Print Label
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
