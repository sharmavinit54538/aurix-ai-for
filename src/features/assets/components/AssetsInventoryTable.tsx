import { Search, Package, QrCode, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATUSES, getAssetStatusBadge } from "../constants";
import type { Asset } from "../types";

interface AssetsInventoryTableProps {
  q: string;
  setQ: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedAssets: Asset[];
  employees: { id: string; fullName: string; department?: string }[];
  onSelectAsset: (asset: Asset) => void;
  onOpenQr: (asset: Asset) => void;
  onAssignOpen: (asset: Asset) => void;
  onReturnAsset: (asset: Asset) => void;
  onTransferOpen: (asset: Asset) => void;
  onRepairOpen: (asset: Asset) => void;
  onEditOpen: (asset: Asset) => void;
  onDeleteOpen: (asset: Asset) => void;
}

export function AssetsInventoryTable({
  q,
  setQ,
  statusFilter,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedAssets,
  employees,
  onSelectAsset,
  onOpenQr,
  onAssignOpen,
  onReturnAsset,
  onTransferOpen,
  onRepairOpen,
  onEditOpen,
  onDeleteOpen,
}: AssetsInventoryTableProps) {
  const filterTabs = [
    { id: "all", label: "All Assets" },
    { id: "available", label: "Available" },
    { id: "assigned", label: "Assigned" },
    { id: "under-repair", label: "In Repair" },
    { id: "lost", label: "Lost" },
    { id: "retired", label: "Decommissioned" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card">
      {/* Search / Filter pill row */}
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={e => {
              setQ(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ID, name, brand, employee..."
            className="h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      {paginatedAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground">
            <Package className="h-6 w-6" />
          </div>
          <p className="font-semibold text-foreground">No assets found</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            No records match the current filters. Adjust your search or register a new asset.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px] border-collapse">
            <TableHeader className="bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4 py-3 w-[80px] text-center">QR Code</TableHead>
                <TableHead className="px-4 py-3">Asset ID / Tag</TableHead>
                <TableHead className="px-4 py-3">Asset Name</TableHead>
                <TableHead className="px-4 py-3">Category</TableHead>
                <TableHead className="px-4 py-3">Brand & Model</TableHead>
                <TableHead className="px-4 py-3">Serial Number</TableHead>
                <TableHead className="px-4 py-3">Assigned To</TableHead>
                <TableHead className="px-4 py-3">Department</TableHead>
                <TableHead className="px-4 py-3">Warranty Expiry</TableHead>
                <TableHead className="px-4 py-3 text-center">Status</TableHead>
                <TableHead className="px-4 py-3 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAssets.map(asset => {
                const statusInfo = STATUSES.find(s => s.value === asset.status) || STATUSES[0];
                const isWSoon =
                  asset.warrantyUntil &&
                  new Date(asset.warrantyUntil).getTime() <=
                    new Date("2026-06-28").getTime() + 30 * 24 * 60 * 60 * 1000;

                return (
                  <TableRow
                    key={asset.id}
                    className="group border-t border-border transition-colors hover:bg-accent/20 cursor-pointer"
                    onClick={() => onSelectAsset(asset)}
                  >
                    {/* QR Code Col */}
                    <TableCell
                      className="px-4 py-2 text-center"
                      onClick={e => {
                        e.stopPropagation();
                        onOpenQr(asset);
                      }}
                    >
                      <div
                        className="grid place-items-center h-8 w-8 rounded border border-border bg-muted cursor-pointer hover:scale-105 transition-transform"
                        title="Click to view full sticker"
                      >
                        <QrCode className="h-5 w-5 text-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-semibold font-mono text-xs text-foreground/90">
                      {asset.tag}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="font-semibold text-foreground truncate max-w-[150px]">{asset.name}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-xs text-muted-foreground capitalize">{asset.category}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-foreground/80">
                      {asset.brand} <span className="text-muted-foreground">({asset.model || "—"})</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {asset.serial}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs font-semibold text-foreground/90">
                      {asset.assignedTo || <span className="text-muted-foreground/40 font-normal italic">Unassigned</span>}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                      {asset.assignedTo
                        ? employees.find(x => x.fullName === asset.assignedTo)?.department || "Operations"
                        : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs">
                      <span className={isWSoon ? "text-foreground font-semibold" : "text-muted-foreground"}>
                        {asset.warrantyUntil || "—"}
                      </span>
                    </TableCell>
                    {/* Status Badge */}
                    <TableCell className="px-4 py-3 text-center">
                      <Badge className={`${getAssetStatusBadge(asset.status)} border shadow-none text-xs font-semibold capitalize`}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    {/* Action Row */}
                    <TableCell className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100">
                        {asset.status === "available" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAssignOpen(asset)}
                            className="h-7 text-[10px] px-2 border-border cursor-pointer hover:bg-accent/65"
                          >
                            Assign
                          </Button>
                        )}
                        {asset.status === "assigned" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onReturnAsset(asset)}
                              className="h-7 text-[10px] px-2 text-emerald-600 dark:text-emerald-400 border-border cursor-pointer"
                            >
                              Return
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onTransferOpen(asset)}
                              className="h-7 text-[10px] px-2 border-border cursor-pointer"
                            >
                              Transfer
                            </Button>
                          </>
                        )}
                        {asset.status !== "under-repair" && asset.status !== "retired" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRepairOpen(asset)}
                            className="h-7 text-[10px] px-2 border-border cursor-pointer"
                          >
                            Repair
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEditOpen(asset)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteOpen(asset)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Showing Page <strong className="font-semibold text-foreground">{currentPage}</strong> of{" "}
            <strong className="font-semibold text-foreground">{totalPages}</strong>
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
              className="h-8 border-border hover:bg-accent/60 cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
              className="h-8 border-border hover:bg-accent/60 cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
