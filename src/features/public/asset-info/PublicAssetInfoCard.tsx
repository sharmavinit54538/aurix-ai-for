import { Building2, Calendar, MapPin, Package, ShieldCheck, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicAssetInfo } from "./api";

interface PublicAssetInfoCardProps {
  asset: PublicAssetInfo;
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/60 last:border-b-0">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

export function PublicAssetInfoCard({ asset }: PublicAssetInfoCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center border-b border-border pb-4">
          <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Aurix HRMS Asset</div>
          <CardTitle className="text-xl font-display font-bold mt-1">{asset.name}</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="font-mono text-xs">
              {asset.tag}
            </Badge>
            <Badge className="text-xs capitalize">{asset.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <InfoRow icon={Tag} label="Category" value={asset.category} />
          <InfoRow icon={Package} label="Brand / Model" value={[asset.brand, asset.model].filter(Boolean).join(" · ") || undefined} />
          <InfoRow icon={Package} label="Serial Number" value={asset.serial} />
          <InfoRow icon={User} label="Assigned To" value={asset.assignedTo || "Unassigned"} />
          <InfoRow icon={Building2} label="Department" value={asset.department} />
          <InfoRow icon={MapPin} label="Location" value={asset.location} />
          <InfoRow icon={Calendar} label="Purchase Date" value={asset.purchaseDate} />
          <InfoRow icon={ShieldCheck} label="Warranty Until" value={asset.warrantyUntil} />

          {asset.notes && (
            <div className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Notes: </span>
              {asset.notes}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}