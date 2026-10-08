import { User, Package, QrCode as QrIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { newId } from "@/lib/hrms/types";
import { STATUSES, getAssetStatusBadge } from "../../constants";
import type { Asset } from "../../types";

interface AssetDetailSheetProps {
  detailAsset: Asset | null;
  setDetailAsset: React.Dispatch<React.SetStateAction<Asset | null>>;
  employees: { id: string; fullName: string; employeeId?: string; department?: string }[];
  currentUserFullName?: string;
  onOpenQr: (asset: Asset) => void;
  onAssignOpen: (asset: Asset) => void;
  onReturnAsset: (asset: Asset) => void;
  onTransferOpen: (asset: Asset) => void;
  onRepairOpen: (asset: Asset) => void;
  onMarkRetired: (asset: Asset) => void;
  onMarkLost: (asset: Asset) => void;
  onUpdateNotes: (assetId: string, notes: string) => void;
}

export function AssetDetailSheet({
  detailAsset,
  setDetailAsset,
  employees,
  currentUserFullName,
  onOpenQr,
  onAssignOpen,
  onReturnAsset,
  onTransferOpen,
  onRepairOpen,
  onMarkRetired,
  onMarkLost,
  onUpdateNotes,
}: AssetDetailSheetProps) {
  if (!detailAsset) return null;

  const currentStatusObj = STATUSES.find(stat => stat.value === detailAsset.status);

  return (
    <Sheet open={!!detailAsset} onOpenChange={open => !open && setDetailAsset(null)}>
      <SheetContent className="sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
        <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-border">
              {detailAsset.category}
            </Badge>
            {currentStatusObj && (
              <Badge className={`${getAssetStatusBadge(currentStatusObj.value)} border shadow-none text-xs font-bold capitalize`}>
                {currentStatusObj.label}
              </Badge>
            )}
          </div>
          <SheetTitle className="font-display text-base font-bold text-foreground mt-2 truncate text-left" title={detailAsset.name}>
            {detailAsset.tag} &bull; {detailAsset.name}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
            Serial Number: {detailAsset.serial} &bull; Warranty Expiration: {detailAsset.warrantyUntil || "None"}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable details panel */}
        <ScrollArea className="flex-1 p-5 min-h-0">
          <div className="space-y-6">
            {/* QR Sticker Widget */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Asset QR Sticker Identification</Label>
              <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="rounded bg-card p-2 border border-border flex flex-col items-center justify-center">
                  {(detailAsset as any).qrCodeData ? (
                    <img src={(detailAsset as any).qrCodeData} width={110} height={110} className="w-[110px] h-[110px]" alt="Asset QR Code" />
                  ) : (
                    <div className="w-[110px] h-[110px] flex items-center justify-center bg-muted text-[10px] text-muted-foreground">Generating QR...</div>
                  )}
                  <div className="font-mono text-[10px] text-muted-foreground mt-1">{detailAsset.serial ?? detailAsset.id}</div>
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
                      onClick={() => onOpenQr(detailAsset)}
                      className="h-8 text-[10px] border-border bg-transparent cursor-pointer"
                    >
                      Print Sticker
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toast.success("Regenerating QR parameters...");
                        const updated: Asset = {
                          ...detailAsset,
                          timeline: [
                            ...(detailAsset.timeline || []),
                            {
                              id: newId("tl"),
                              event: "Created" as const,
                              performedBy: currentUserFullName || "HR",
                              timestamp: new Date().toISOString(),
                              notes: "QR checksum regenerated.",
                            },
                          ],
                        };
                        onUpdateNotes(detailAsset.id, (detailAsset.notes || "") + "\nQR checksum regenerated.");
                        setDetailAsset(updated);
                      }}
                      className="h-8 text-[10px] border-border bg-transparent cursor-pointer"
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* SPECIFICATION GRID */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hardware Specifications</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Brand / Manufacturer</span>
                  <strong className="text-foreground mt-0.5 block">{detailAsset.brand || "—"}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Model Specification</span>
                  <strong className="text-foreground mt-0.5 block">{detailAsset.model || "—"}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Purchase Cost</span>
                  <strong className="text-foreground mt-0.5 block">${detailAsset.purchaseCost || 0}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Current Location Room</span>
                  <strong className="text-foreground mt-0.5 block">{detailAsset.location || "General HQ"}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[10px]">Vendor Info</span>
                  <strong className="text-foreground mt-0.5 block">{detailAsset.vendor}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[10px]">Warranty Status</span>
                  <strong className="text-foreground mt-0.5 block">
                    {detailAsset.warrantyUntil ? (
                      new Date(detailAsset.warrantyUntil).getTime() < new Date("2026-06-28").getTime() ? (
                        <span className="text-destructive font-medium">Warranty Expired ({detailAsset.warrantyUntil})</span>
                      ) : (
                        <span className="text-foreground font-medium">Warranty Active (Expires: {detailAsset.warrantyUntil})</span>
                      )
                    ) : (
                      "No Warranty Data"
                    )}
                  </strong>
                </div>
              </div>
            </div>

            {/* ACTIVE ASSIGNEE WARNING */}
            {detailAsset.status === "assigned" && (
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1 text-left">
                <div className="flex items-center gap-1.5 font-bold">
                  <User className="h-4 w-4" />
                  Current Assignment:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] leading-relaxed pt-1">
                  <p><strong>Employee:</strong> {detailAsset.assignedTo}</p>
                  <p><strong>Dept:</strong> {employees.find(x => (detailAsset as any).assignedToId ? (x.id === (detailAsset as any).assignedToId || x.employeeId === (detailAsset as any).assignedToId) : x.fullName === detailAsset.assignedTo)?.department || "Operations"}</p>
                  <p className="col-span-2"><strong>Assigned At:</strong> {detailAsset.assignedAt ? new Date(detailAsset.assignedAt).toLocaleDateString() : "—"}</p>
                </div>
              </div>
            )}

            {/* TIMELINE EVENTS OF ASSET */}
            <div className="space-y-2 text-left">
              <Label className="text-xs font-semibold text-muted-foreground">Asset Timeline Audit Logs</Label>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3.5">
                {(detailAsset.timeline || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No timelines logged for this asset.</p>
                ) : (
                  (detailAsset.timeline || []).map((tl, idx) => (
                    <div key={tl.id} className={`flex gap-3 text-xs relative ${idx < (detailAsset.timeline || []).length - 1 ? 'before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3' : ''}`}>
                      <span className="grid h-4 w-4 place-items-center rounded-full shrink-0 bg-primary/10 text-primary">
                        <Package className="h-2 w-2" />
                      </span>
                      <div>
                        <p className="font-bold text-foreground capitalize">{tl.event}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          By {tl.performedBy} on {new Date(tl.timestamp).toLocaleString()}
                        </p>
                        {tl.notes && <p className="text-[10px] text-foreground/80 mt-1">{tl.notes}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ASSIGNMENT HISTORY LIST */}
            <div className="space-y-2 text-left">
              <Label className="text-xs font-semibold text-muted-foreground">Assignment History Logs</Label>
              <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
                <Table className="text-[11px] border-collapse">
                  <TableHeader className="bg-muted/10 border-b border-border">
                    <TableRow>
                      <TableHead className="px-3 py-2 w-[120px]">Employee</TableHead>
                      <TableHead className="px-3 py-2">Department</TableHead>
                      <TableHead className="px-3 py-2">Assign Date</TableHead>
                      <TableHead className="px-3 py-2">Return Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(detailAsset.assignmentHistory || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground italic">
                          No allocation logs recorded.
                        </TableCell>
                      </TableRow>
                    ) : (
                      (detailAsset.assignmentHistory || []).map(hist => (
                        <TableRow key={hist.id} className="border-t border-border">
                          <TableCell className="px-3 py-2 font-semibold">{hist.employee}</TableCell>
                          <TableCell className="px-3 py-2 text-muted-foreground">{hist.department}</TableCell>
                          <TableCell className="px-3 py-2 text-muted-foreground">{hist.assignDate}</TableCell>
                          <TableCell className="px-3 py-2">
                            {hist.actualReturnDate ? (
                              <span>{hist.actualReturnDate}</span>
                            ) : (
                              <span className="text-foreground font-semibold">Active</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* MAINTENANCE LOGS LIST */}
            <div className="space-y-2 text-left">
              <Label className="text-xs font-semibold text-muted-foreground">Maintenance Repair logs</Label>
              <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
                <Table className="text-[11px] border-collapse">
                  <TableHeader className="bg-muted/10 border-b border-border">
                    <TableRow>
                      <TableHead className="px-3 py-2 w-[100px]">Service Date</TableHead>
                      <TableHead className="px-3 py-2">Vendor Partner</TableHead>
                      <TableHead className="px-3 py-2 text-right">Cost</TableHead>
                      <TableHead className="px-3 py-2">Issues / Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(detailAsset.maintenanceHistory || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground italic">
                          No maintenance history logs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      (detailAsset.maintenanceHistory || []).map(mr => (
                        <TableRow key={mr.id} className="border-t border-border">
                          <TableCell className="px-3 py-2 font-mono">{mr.serviceDate}</TableCell>
                          <TableCell className="px-3 py-2 text-muted-foreground">{mr.vendor}</TableCell>
                          <TableCell className="px-3 py-2 text-right text-foreground font-semibold">${mr.cost}</TableCell>
                          <TableCell className="px-3 py-2 text-muted-foreground truncate max-w-[120px]" title={mr.notes}>
                            {mr.notes || "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* FUTURE COMPLIANCE PLACEHOLDER */}
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1 text-left">
              <h5 className="font-bold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Decommissioning & Auditing Protocols
              </h5>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Asset tag tracks automatic check-ins linked directly with offboarding exit task structures. Supports mobile barcode scanner simulation natively.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Sheet Actions footer */}
        <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
          {detailAsset.status === "available" && (
            <Button
              onClick={() => onAssignOpen(detailAsset)}
              className="h-9 text-xs cursor-pointer"
            >
              Assign Asset
            </Button>
          )}
          {detailAsset.status === "assigned" && (
            <>
              <Button
                variant="outline"
                onClick={() => onReturnAsset(detailAsset)}
                className="h-9 text-xs border-border cursor-pointer text-emerald-600 dark:text-emerald-400"
              >
                Return Asset
              </Button>
              <Button
                variant="outline"
                onClick={() => onTransferOpen(detailAsset)}
                className="h-9 text-xs border-border cursor-pointer"
              >
                Transfer
              </Button>
            </>
          )}
          {detailAsset.status !== "under-repair" && detailAsset.status !== "retired" && (
            <Button
              variant="outline"
              onClick={() => onRepairOpen(detailAsset)}
              className="h-9 text-xs border-border cursor-pointer"
            >
              Log Fault
            </Button>
          )}
          {detailAsset.status !== "retired" && (
            <Button
              variant="outline"
              onClick={() => onMarkRetired(detailAsset)}
              className="h-9 text-xs border-border cursor-pointer"
            >
              Decommission
            </Button>
          )}
          {detailAsset.status !== "lost" && (
            <Button
              variant="outline"
              onClick={() => onMarkLost(detailAsset)}
              className="h-9 text-xs border-destructive/30 text-destructive cursor-pointer"
            >
              Flag Lost
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenQr(detailAsset)}
            className="h-9 text-xs border-border cursor-pointer gap-1.5"
          >
            <QrIcon className="h-3.5 w-3.5" />
            QR Sticker
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
