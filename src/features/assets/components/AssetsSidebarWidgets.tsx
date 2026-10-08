import { QrCode } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Asset, AssetAlert } from "../types";

interface AssetsSidebarWidgetsProps {
  assets: Asset[];
  scannedAssetTag: string;
  setScannedAssetTag: (tag: string) => void;
  onScanSimulation: () => void;
  notifications?: AssetAlert[];
  onSelectAsset?: (asset: Asset) => void;
}

export function AssetsSidebarWidgets({
  assets,
  scannedAssetTag,
  setScannedAssetTag,
  onScanSimulation,
}: AssetsSidebarWidgetsProps) {
  return (
    <div className="space-y-6 lg:col-span-1">
      {/* Scan simulation Widget */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <QrCode className="h-4 w-4 text-primary" />
            Mobile QR Scanner
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Simulate scanning asset labels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Type or select an asset ID/Tag, then simulate scanning using a mobile device layout.
          </p>
          <div className="flex gap-2">
            <Select value={scannedAssetTag} onValueChange={setScannedAssetTag}>
              <SelectTrigger className="h-8 text-xs bg-background/50 border-border">
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map(a => (
                  <SelectItem key={a.id} value={a.tag}>
                    {a.tag} ({a.brand})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={onScanSimulation}
              disabled={!scannedAssetTag}
              className="h-8 px-3 text-xs cursor-pointer"
            >
              Scan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
