import { Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { newId } from "@/lib/hrms/types";
import type { Asset } from "../../types";

interface QrStickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetAsset: Asset | null;
  currentUserFullName?: string;
  onRegenerateQr: (updatedAsset: Asset, notesAppend: string) => void;
}

export function QrStickerModal({
  open,
  onOpenChange,
  targetAsset,
  currentUserFullName,
  onRegenerateQr,
}: QrStickerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs bg-background border-border text-center">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-center">
            Asset QR Sticker Label
          </DialogTitle>
        </DialogHeader>
        {targetAsset && (
          <div className="space-y-4 pt-3 flex flex-col items-center">
            {/* Sticker frame */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm w-[220px] flex flex-col items-center select-none text-foreground">
              <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                OFC360 ASSET
              </div>
              <div className="font-mono text-sm font-extrabold text-foreground border-b border-border pb-1.5 w-full text-center">
                {targetAsset.tag}
              </div>

              {/* QR Canvas */}
              <div className="my-3 p-1.5 border border-border bg-muted/30 rounded shadow-inner flex flex-col items-center justify-center">
                {(targetAsset as any).qrCodeData ? (
                  <img
                    src={(targetAsset as any).qrCodeData}
                    width={130}
                    height={130}
                    className="w-[130px] h-[130px]"
                    alt="Asset QR Code"
                  />
                ) : (
                  <div className="w-[130px] h-[130px] flex items-center justify-center bg-muted text-[10px] text-muted-foreground">
                    Generating QR...
                  </div>
                )}
                <div className="font-mono text-[10px] text-muted-foreground mt-1.5">
                  {targetAsset.serial ?? targetAsset.id}
                </div>
              </div>

              <div className="text-[10px] font-semibold text-foreground truncate max-w-full">
                {targetAsset.name}
              </div>
              <div className="text-[8px] text-muted-foreground italic">Company: OFC360</div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast.success("Regenerated QR Code successfully.");
                  const updated: Asset = {
                    ...targetAsset,
                    timeline: [
                      ...(targetAsset.timeline || []),
                      {
                        id: newId("tl"),
                        event: "Created" as const,
                        performedBy: currentUserFullName || "HR",
                        timestamp: new Date().toISOString(),
                        notes: "Regenerated unique QR signature check.",
                      },
                    ],
                  };
                  onRegenerateQr(updated, "\nRegenerated unique QR signature check.");
                  onOpenChange(false);
                }}
                className="flex-1 h-9 text-xs border-border bg-transparent cursor-pointer"
              >
                Regenerate
              </Button>
              <Button
                onClick={() => {
                  toast.success(`Sticker sent to printer queue.`);
                  onOpenChange(false);
                }}
                className="flex-1 h-9 text-xs cursor-pointer gap-1.5"
              >
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
