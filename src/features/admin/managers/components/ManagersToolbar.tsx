import {
  CheckCircle,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Manager, ManagerFilters, ManagerStatus } from "../types";

interface ManagersToolbarProps {
  searchQuery: string;
  filters: ManagerFilters;
  showAdvancedFilters: boolean;
  selectedCount: number;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onBulkStatusChange: (status: ManagerStatus) => void;
  onBulkDelete: () => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export function ManagersToolbar({
  searchQuery,
  filters,
  showAdvancedFilters,
  selectedCount,
  onSearchChange,
  onToggleFilters,
  onClearFilters,
  onBulkStatusChange,
  onBulkDelete,
  onExportCSV,
  onExportExcel,
  onExportPDF,
}: ManagersToolbarProps) {
  const hasActiveFilters = searchQuery || Object.values(filters).some((v) => v && v !== "all");

  return (
    <div className="flex min-w-0 flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, employee ID, phone or department..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        {/* <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className={`h-9 gap-1.5 ${showAdvancedFilters ? "bg-muted" : ""}`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
        </Button>
        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 px-2 text-rose-500 hover:bg-rose-500/10"
          >
            Clear
          </Button>
        ) : null} */}
      </div>

      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        {selectedCount > 0 ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">{selectedCount} selected</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Modify Status
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onBulkStatusChange("active")}
                  className="flex cursor-pointer items-center gap-1.5 py-1.5 text-xs"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  Activate Managers
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onBulkStatusChange("inactive")}
                  className="flex cursor-pointer items-center gap-1.5 py-1.5 text-xs"
                >
                  <XCircle className="h-3.5 w-3.5 text-rose-500" />
                  Deactivate Managers
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem
                  onClick={onBulkDelete}
                  className="flex cursor-pointer items-center gap-1.5 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 focus:text-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Download Options
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={onExportCSV} className="flex cursor-pointer items-center gap-2 py-2 text-xs">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportExcel} className="flex cursor-pointer items-center gap-2 py-2 text-xs">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPDF} className="flex cursor-pointer items-center gap-2 py-2 text-xs">
              <FileText className="h-3.5 w-3.5 text-rose-500" />
              Export PDF Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
