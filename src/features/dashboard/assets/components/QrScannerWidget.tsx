import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Asset } from "@/lib/hrms/types";

interface QrScannerWidgetProps {
  assets: Asset[];
  scannedAssetTag: string;
  onScannedAssetTagChange: (tag: string) => void;
  onScan: () => void;
}

export function QrScannerWidget({ assets, scannedAssetTag, onScannedAssetTagChange, onScan }: QrScannerWidgetProps) {
  return (
    <Card className="border-border bg-card/40 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <QrCode className="h-4 w-4 text-indigo-500" />
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
          <Select value={scannedAssetTag} onValueChange={onScannedAssetTagChange}>
            <SelectTrigger className="h-8 text-xs bg-background/50 border-border">
              <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent>
              {assets.map((a) => (
                <SelectItem key={a.id} value={a.tag}>
                  {a.tag} ({a.brand})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={onScan}
            disabled={!scannedAssetTag}
            className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            Scan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
