import { Button } from "@/components/ui/button";
import { QrCode as QrIcon } from "lucide-react";
import type { Asset } from "@/lib/hrms/types";

interface AssetDetailFooterActionsProps {
  asset: Asset;
  onAssign: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
  onTransfer: (asset: Asset) => void;
  onRepair: (asset: Asset) => void;
  onRetire: (asset: Asset) => void;
  onMarkLost: (asset: Asset) => void;
  onQr: (asset: Asset) => void;
}

export function AssetDetailFooterActions({
  asset,
  onAssign,
  onReturn,
  onTransfer,
  onRepair,
  onRetire,
  onMarkLost,
  onQr,
}: AssetDetailFooterActionsProps) {
  return (
    <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
      {asset.status === "available" && (
        <Button onClick={() => onAssign(asset)} className="h-9 text-xs bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer">
          Assign Asset
        </Button>
      )}
      {asset.status === "assigned" && (
        <>
          <Button
            variant="outline"
            onClick={() => onReturn(asset)}
            className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-emerald-600"
          >
            Return Asset
          </Button>
          <Button
            variant="outline"
            onClick={() => onTransfer(asset)}
            className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-indigo-500"
          >
            Transfer
          </Button>
        </>
      )}
      {asset.status !== "under-repair" && asset.status !== "retired" && (
        <Button
          variant="outline"
          onClick={() => onRepair(asset)}
          className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-amber-600"
        >
          Log Fault
        </Button>
      )}
      {asset.status !== "retired" && (
        <Button
          variant="outline"
          onClick={() => onRetire(asset)}
          className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-purple-600"
        >
          Decommission
        </Button>
      )}
      {asset.status !== "lost" && (
        <Button
          variant="outline"
          onClick={() => onMarkLost(asset)}
          className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-rose-500"
        >
          Flag Lost
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => onQr(asset)}
        className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer gap-1.5"
      >
        <QrIcon className="h-3.5 w-3.5" />
        QR Sticker
      </Button>
    </div>
  );
}
