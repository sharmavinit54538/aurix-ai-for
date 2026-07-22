import { Package, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetFiltersBar } from "./AssetFilterBar";
import { AssetRowActions } from "./AssetRowActions";
import { AssetPagination } from "./AssetPaginations";
import { STATUSES } from "../constants";
import { isWarrantyExpiringSoon } from "../utils";
import type { Asset } from "@/lib/hrms/types";

interface EmployeeLike {
  first_name: string;
  last_name: string;
  department?: string;
  fullName?: string;
}

interface AssetsTableProps {
  assets: Asset[];
  employees: EmployeeLike[];
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick: (asset: Asset) => void;
  onQrClick: (asset: Asset) => void;
  onAssign: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
  onTransfer: (asset: Asset) => void;
  onRepair: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDeleteRequest: (asset: Asset) => void;
}

export function AssetsTable({
  assets,
  employees,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  onRowClick,
  onQrClick,
  onAssign,
  onReturn,
  onTransfer,
  onRepair,
  onEdit,
  onDeleteRequest,
}: AssetsTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
      <AssetFiltersBar
        query={query}
        onQueryChange={onQueryChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />

      {assets.length === 0 ? (
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
              {assets.map((asset) => {
                const statusInfo = STATUSES.find((s) => s.value === asset.status) || STATUSES[0];
                const isWSoon = isWarrantyExpiringSoon(asset.warrantyUntil);

                return (
                  <TableRow
                    key={asset.id}
                    className="group border-t border-border transition-colors hover:bg-accent/20 cursor-pointer"
                    onClick={() => onRowClick(asset)}
                  >
                    <TableCell
                      className="px-4 py-2 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQrClick(asset);
                      }}
                    >
                      <div
                        className="grid place-items-center h-8 w-8 rounded border border-border bg-white cursor-pointer hover:scale-105 transition-transform"
                        title="Click to view full sticker"
                      >
                        <QrCode className="h-5 w-5 text-slate-800" />
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
                      {asset.assignedTo || (
                        <span className="text-muted-foreground/40 font-normal italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                      {asset.assignedTo
                        ? employees.find((x) => x.fullName === asset.assignedTo)?.department || "Operations"
                        : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs">
                      <span className={isWSoon ? "text-purple-500 font-semibold" : "text-muted-foreground"}>
                        {asset.warrantyUntil || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Badge
                        className={`${statusInfo.bg} ${statusInfo.color} border-none shadow-none text-xs font-semibold capitalize`}
                      >
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <AssetRowActions
                        asset={asset}
                        onAssign={onAssign}
                        onReturn={onReturn}
                        onTransfer={onTransfer}
                        onRepair={onRepair}
                        onEdit={onEdit}
                        onDeleteRequest={onDeleteRequest}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AssetPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
