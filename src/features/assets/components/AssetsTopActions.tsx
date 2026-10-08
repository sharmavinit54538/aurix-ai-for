import { QrCode as QrIcon, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportAssetsCsv } from "../utils/assetUtils";
import type { Asset } from "../types";

interface AssetsTopActionsProps {
  assets: Asset[];
  onOpenScan: () => void;
  onOpenAdd: () => void;
}

export function AssetsTopActions({ assets, onOpenScan, onOpenAdd }: AssetsTopActionsProps) {
  return (
    <div className="flex justify-end gap-2 mb-6">
      <Button
        variant="outline"
        onClick={onOpenScan}
        className="h-9 gap-2 cursor-pointer"
      >
        <QrIcon className="h-4 w-4" />
        Scan QR Code
      </Button>
      <Button
        variant="outline"
        onClick={() => exportAssetsCsv(assets)}
        className="h-9 gap-2 cursor-pointer"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
      <Button
        onClick={onOpenAdd}
        className="h-9 gap-2 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Add Asset
      </Button>
    </div>
  );
}
