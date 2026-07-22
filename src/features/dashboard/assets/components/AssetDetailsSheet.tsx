import { ShieldCheck, User } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AssetAssignmentHistoryTable } from "./AssetAssignmentHistoryTable";
import { AssetDetailFooterActions } from "./AssetDetailFooterActions";
import { AssetMaintenanceHistoryTable } from "./AssetMaintenceHistoryTable";
import { AssetTimelineLog } from "./AssetTimelineLog";
import { STATUSES } from "../constants";
import { buildAssetScanUrl, isWarrantyExpired } from "../utils";
import type { useAssetMutations } from "../hooks/useAssetsMutations";
import type { Asset } from "@/lib/hrms/types";

interface EmployeeLike {
  first_name: string;
  last_name: string;
  department?: string;
}

interface AssetDetailsSheetProps {
  asset: Asset | null;
  onClose: () => void;
  employees: EmployeeLike[];
  mutations: ReturnType<typeof useAssetMutations>;
  onAssign: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
  onTransfer: (asset: Asset) => void;
  onRepair: (asset: Asset) => void;
  onRetire: (asset: Asset) => void;
  onMarkLost: (asset: Asset) => void;
  onQr: (asset: Asset) => void;
  onPrintSticker: (asset: Asset) => void;
}

export function AssetDetailsSheet({
  asset,
  onClose,
  employees,
  mutations,
  onAssign,
  onReturn,
  onTransfer,
  onRepair,
  onRetire,
  onMarkLost,
  onQr,
  onPrintSticker,
}: AssetDetailsSheetProps) {
  const { appendNoteMutation } = mutations;

  const handleRegenerateQr = () => {
    if (!asset) return;
    appendNoteMutation.mutate({
      id: asset.id,
      existingNotes: asset.notes || "",
      note: "QR checksum regenerated.",
    });
  };

  return (
    <Sheet open={!!asset} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
        {asset && (
          <>
            <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-border">
                  {asset.category}
                </Badge>
                {STATUSES.filter((s) => s.value === asset.status).map((stat) => (
                  <Badge key={stat.value} className={`${stat.bg} ${stat.color} border-none shadow-none text-xs font-bold capitalize`}>
                    {stat.label}
                  </Badge>
                ))}
              </div>
              <SheetTitle className="font-display text-base font-bold text-foreground mt-2 truncate text-left" title={asset.name}>
                {asset.tag} &bull; {asset.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
                Serial Number: {asset.serial} &bull; Warranty Expiration: {asset.warrantyUntil || "None"}
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="flex-1 p-5 min-h-0">
              <div className="space-y-6">
                {/* QR Sticker Widget */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Asset QR Sticker Identification</Label>
                  <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="rounded bg-white p-2 border border-slate-200 flex flex-col items-center justify-center">
                      <QRCodeSVG value={buildAssetScanUrl(asset)} size={110} level="M" />
                      <div className="font-mono text-[10px] text-slate-500 mt-1">{asset.serial ?? asset.id}</div>
                    </div>
                    <div className="text-xs text-left space-y-2 flex-1">
                      <p className="font-semibold text-foreground">Scannable QR Label</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Scan this label with any mobile device to open the asset record page.
                      </p>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPrintSticker(asset)}
                          className="h-8 text-[10px] border-border bg-transparent cursor-pointer"
                        >
                          Print Sticker
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRegenerateQr}
                          className="h-8 text-[10px] border-border bg-transparent cursor-pointer"
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specification grid */}
                <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hardware Specifications</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Brand / Manufacturer</span>
                      <strong className="text-foreground mt-0.5 block">{asset.brand || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Model Specification</span>
                      <strong className="text-foreground mt-0.5 block">{asset.model || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Purchase Cost</span>
                      <strong className="text-foreground mt-0.5 block">${asset.purchaseCost || 0}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Current Location Room</span>
                      <strong className="text-foreground mt-0.5 block">{asset.location || "General HQ"}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block text-[10px]">Vendor Info</span>
                      <strong className="text-foreground mt-0.5 block">{asset.vendor}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block text-[10px]">Warranty Status</span>
                      <strong className="text-foreground mt-0.5 block">
                        {asset.warrantyUntil ? (
                          isWarrantyExpired(asset.warrantyUntil) ? (
                            <span className="text-rose-500">Warranty Expired ({asset.warrantyUntil})</span>
                          ) : (
                            <span className="text-emerald-500">Warranty Active (Expires: {asset.warrantyUntil})</span>
                          )
                        ) : (
                          "No Warranty Data"
                        )}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Active assignee card */}
                {asset.status === "assigned" && (
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left">
                    <div className="flex items-center gap-1.5 font-bold">
                      <User className="h-4 w-4" />
                      Current Assignment:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] leading-relaxed pt-1">
                      <p>
                        <strong>Employee:</strong> {asset.assignedTo}
                      </p>
                      <p>
                        <strong>Dept:</strong>{" "}
                        {employees.find((x) => `${x.first_name} ${x.last_name}` === asset.assignedTo)?.department || "Operations"}
                      </p>
                      <p className="col-span-2">
                        <strong>Assigned At:</strong> {asset.assignedAt ? new Date(asset.assignedAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>
                )}

                <AssetTimelineLog timeline={asset.timeline || []} />
                <AssetAssignmentHistoryTable history={asset.assignmentHistory || []} />
                <AssetMaintenanceHistoryTable history={asset.maintenanceHistory || []} />

                <div className="rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left">
                  <h5 className="font-bold flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                    Decommissioning & Auditing Protocols
                  </h5>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">
                    Asset tag tracks automatic check-ins linked directly with offboarding exit task structures. Supports
                    mobile barcode scanner simulation natively.
                  </p>
                </div>
              </div>
            </ScrollArea>

            <AssetDetailFooterActions
              asset={asset}
              onAssign={onAssign}
              onReturn={onReturn}
              onTransfer={onTransfer}
              onRepair={onRepair}
              onRetire={onRetire}
              onMarkLost={onMarkLost}
              onQr={onQr}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
