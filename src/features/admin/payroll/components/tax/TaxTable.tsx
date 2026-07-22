import React, { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  ShieldAlert,
  ArrowUpDown,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminTaxItem } from "@/services/taxApi";

interface TaxTableProps {
  items: AdminTaxItem[];
  isLoading: boolean;
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAllToggle: (ids: string[]) => void;
  onViewProfile: (item: AdminTaxItem) => void;
  onApprove: (item: AdminTaxItem) => void;
  onReject: (item: AdminTaxItem) => void;
  onViewAuditLogs: (item: AdminTaxItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSortChange?: (field: string) => void;
}

export const TaxTable: React.FC<TaxTableProps> = ({
  items,
  isLoading,
  selectedIds,
  onSelectToggle,
  onSelectAllToggle,
  onViewProfile,
  onApprove,
  onReject,
  onViewAuditLogs,
  page,
  totalPages,
  onPageChange,
  sortBy = "name",
  sortDir = "asc",
  onSortChange,
}) => {
  const [columnVisibility, setColumnVisibility] = useState({
    employee_id: true,
    department: true,
    tax_regime: true,
    taxable_income: true,
    deductions: true,
    tds: true,
    net_tax: true,
    status: true,
    last_updated: true,
  });

  const allIds = items.map((i) => i.employee_id);
  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-medium hover:bg-emerald-500/20">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 font-medium hover:bg-rose-500/20">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 font-medium hover:bg-amber-500/20">
            Pending Proofs
          </Badge>
        );
    }
  };

  const getRegimeBadge = (regime: string) => {
    return regime.toUpperCase() === "NEW" ? (
      <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-medium">
        New Regime
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 font-medium">
        Old Regime
      </Badge>
    );
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-border/50 flex flex-wrap items-center justify-between gap-3 bg-muted/20">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">
            Selected: <strong className="text-foreground">{selectedIds.length}</strong> of {items.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs bg-background/50 gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {Object.keys(columnVisibility).map((col) => (
              <DropdownMenuItem
                key={col}
                onClick={() =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    [col]: !prev[col as keyof typeof columnVisibility],
                  }))
                }
                className="text-xs capitalize flex items-center justify-between"
              >
                {col.replace("_", " ")}
                {columnVisibility[col as keyof typeof columnVisibility] && (
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border/50 uppercase text-[10px] tracking-wider text-muted-foreground font-semibold sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="py-3 px-4 w-10">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={() => onSelectAllToggle(allIds)}
                  aria-label="Select all"
                />
              </th>
              <th className="py-3 px-4">
                <button
                  onClick={() => onSortChange?.("name")}
                  className="flex items-center gap-1 hover:text-foreground font-semibold"
                >
                  Employee <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              {columnVisibility.employee_id && <th className="py-3 px-4">ID</th>}
              {columnVisibility.department && <th className="py-3 px-4">Dept & Designation</th>}
              {columnVisibility.tax_regime && <th className="py-3 px-4">Regime</th>}
              {columnVisibility.taxable_income && (
                <th className="py-3 px-4 text-right">
                  <button
                    onClick={() => onSortChange?.("taxable_income")}
                    className="flex items-center justify-end gap-1 hover:text-foreground w-full font-semibold"
                  >
                    Taxable Salary <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              )}
              {columnVisibility.deductions && <th className="py-3 px-4 text-right">Deductions</th>}
              {columnVisibility.tds && <th className="py-3 px-4 text-right">Monthly TDS</th>}
              {columnVisibility.net_tax && (
                <th className="py-3 px-4 text-right">
                  <button
                    onClick={() => onSortChange?.("net_tax")}
                    className="flex items-center justify-end gap-1 hover:text-foreground w-full font-semibold"
                  >
                    Net Tax <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              )}
              {columnVisibility.status && <th className="py-3 px-4">Status</th>}
              {columnVisibility.last_updated && <th className="py-3 px-4">Updated</th>}
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td colSpan={12} className="py-4 px-4">
                    <div className="h-4 bg-muted/40 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">No tax records found</p>
                  <p className="text-xs text-muted-foreground">Try adjusting your search or filters.</p>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.employee_id);
                return (
                  <tr
                    key={item.employee_id}
                    className={`hover:bg-muted/30 transition-colors ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelectToggle(item.employee_id)}
                        aria-label={`Select ${item.employee_name}`}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 border border-border/50">
                          <AvatarImage src={item.avatar || undefined} />
                          <AvatarFallback className="text-xs bg-amber-500/20 text-amber-300 font-semibold">
                            {item.employee_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">{item.employee_name}</div>
                          <div className="text-[11px] text-muted-foreground">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    {columnVisibility.employee_id && (
                      <td className="py-3 px-4 font-mono text-amber-400/90 font-medium">
                        {item.employee_code}
                      </td>
                    )}
                    {columnVisibility.department && (
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground">{item.department}</div>
                        <div className="text-[11px] text-muted-foreground">{item.designation}</div>
                      </td>
                    )}
                    {columnVisibility.tax_regime && (
                      <td className="py-3 px-4">{getRegimeBadge(item.tax_regime)}</td>
                    )}
                    {columnVisibility.taxable_income && (
                      <td className="py-3 px-4 text-right font-medium text-foreground">
                        {formatCurrency(item.taxable_income)}
                      </td>
                    )}
                    {columnVisibility.deductions && (
                      <td className="py-3 px-4 text-right font-medium text-emerald-400">
                        {formatCurrency(item.deductions)}
                      </td>
                    )}
                    {columnVisibility.tds && (
                      <td className="py-3 px-4 text-right font-medium text-amber-400">
                        {formatCurrency(item.tds)}
                      </td>
                    )}
                    {columnVisibility.net_tax && (
                      <td className="py-3 px-4 text-right font-bold text-foreground">
                        {formatCurrency(item.net_tax)}
                      </td>
                    )}
                    {columnVisibility.status && (
                      <td className="py-3 px-4">{getStatusBadge(item.declaration_status)}</td>
                    )}
                    {columnVisibility.last_updated && (
                      <td className="py-3 px-4 text-muted-foreground text-[11px]">
                        {new Date(item.last_updated).toLocaleDateString()}
                      </td>
                    )}
                    <td className="py-3 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onViewProfile(item)} className="text-xs gap-2">
                            <Eye className="h-3.5 w-3.5 text-blue-400" />
                            View Tax Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onApprove(item)} className="text-xs gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            Approve Declaration
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReject(item)} className="text-xs gap-2">
                            <XCircle className="h-3.5 w-3.5 text-rose-400" />
                            Reject Declaration
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onViewAuditLogs(item)} className="text-xs gap-2">
                            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                            View Audit Logs
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>
          Page <strong className="text-foreground">{page}</strong> of{" "}
          <strong className="text-foreground">{totalPages || 1}</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 px-3 text-xs"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="h-8 px-3 text-xs"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
