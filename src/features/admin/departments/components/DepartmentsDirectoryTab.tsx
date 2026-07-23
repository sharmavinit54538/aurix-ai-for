import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  // Trash2,
  // CheckCircle,
  // XCircle,
  FileSpreadsheet,
  FileText,
  // UserCheck,
  // ArrowRightLeft,
  Building,
} from "lucide-react";
import { DepartmentStatsCards } from "./DepartmentStatsCards";
import { DepartmentsTable } from "./DepartmentsTable";
import type { Department, DepartmentFilters, SortDir, SortField } from "../types";
import { OFFICES, STATUS_OPTIONS, EMPLOYEE_COUNT_RANGES } from "../constants";
import type { useManagersList } from "../../managers/hooks/useManagersList";

interface DepartmentsDirectoryTabProps {
  allDeptsForStats: Department[];
  loading: boolean;
  departments: Department[];
  processedDepartments: Department[];
  paginatedDepartments: Department[];
  searchQuery: string;
  filters: DepartmentFilters;
  showAdvancedFilters: boolean;
  // selectedIds: string[];
  sortField: SortField;
  sortDir: SortDir;
  currentPage: number;
  perPage: number;
  totalPages: number;
  managers: ReturnType<typeof useManagersList>;
  onSearchChange: (value: string) => void;
  onToggleAdvancedFilters: () => void;
  onClearFilters: () => void;
  onFiltersChange: (filters: DepartmentFilters) => void;
  // onBulkStatusChange: (status: Department["status"]) => void;
  // onBulkAssignManagerClick: () => void;
  // onBulkTransferClick: () => void;
  // onBulkDeleteClick: () => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  // onSelectAll: (checked: boolean) => void;
  // onSelectRow: (id: string, checked: boolean) => void;
  onView: (dept: Department) => void;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
  onSort: (field: SortField) => void;
  onPerPageChange: (perPage: number) => void;
  onPageChange: (page: number) => void;
  onAddClick: () => void;
}

export function DepartmentsDirectoryTab({
  allDeptsForStats,
  loading,
  departments,
  processedDepartments,
  paginatedDepartments,
  searchQuery,
  filters,
  showAdvancedFilters,
  // selectedIds,
  sortField,
  sortDir,
  currentPage,
  perPage,
  totalPages,
  managers,
  onSearchChange,
  onToggleAdvancedFilters,
  onClearFilters,
  onFiltersChange,
  // onBulkStatusChange,
  // onBulkAssignManagerClick,
  // onBulkTransferClick,
  // onBulkDeleteClick,
  onExportCSV,
  onExportExcel,
  onExportPDF,
  // onSelectAll,
  // onSelectRow,
  onView,
  onEdit,
  onDelete,
  onSort,
  onPerPageChange,
  onPageChange,
  onAddClick,
}: DepartmentsDirectoryTabProps) {
  const hasActiveFilters = searchQuery || Object.values(filters).some((v) => v && v !== "all");

  return (
    <div className="space-y-6">
      <DepartmentStatsCards departments={allDeptsForStats} />

      <div className="rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm backdrop-blur-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="flex flex-1 items-center gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by department name, code, head, manager or office..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-4 rounded-xl border-border/80 bg-background/50 h-9 text-xs focus-visible:ring-brand"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAdvancedFilters}
              className={`rounded-xl border-border/80 h-9 gap-1.5 text-xs font-medium cursor-pointer ${
                showAdvancedFilters ? "bg-muted text-foreground" : "bg-background/40 hover:bg-muted/40"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer h-9 px-2 rounded-xl"
              >
                Reset
              </Button>
            ) : null}
          </div>

          <div className="flex items-center gap-2 justify-end">
            {/* Bulk actions disabled */}
            {/* {selectedIds.length > 0 ? (
              <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="text-xs text-muted-foreground mr-1">{selectedIds.length} selected:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-border/80 h-9 text-xs bg-background/40 hover:bg-muted/40 font-semibold cursor-pointer"
                    >
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
                    <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Modify Status
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => onBulkStatusChange("active")}
                      className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      Activate Departments
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onBulkStatusChange("inactive")}
                      className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5 text-rose-500" />
                      Deactivate Departments
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/60" />
                    <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Management Scope
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={onBulkAssignManagerClick}
                      className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                    >
                      <UserCheck className="h-3.5 w-3.5 text-blue-500" />
                      Assign Head Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onBulkTransferClick}
                      className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5 text-purple-500" />
                      Transfer Employees
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/60" />
                    <DropdownMenuItem
                      onClick={onBulkDeleteClick}
                      className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : null} */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border/80 h-9 gap-1.5 text-xs bg-background/40 hover:bg-muted/40 font-semibold cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
                <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Download Options
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={onExportCSV} className="text-xs flex items-center gap-2 cursor-pointer py-2">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportExcel} className="text-xs flex items-center gap-2 cursor-pointer py-2">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                  Export Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportPDF} className="text-xs flex items-center gap-2 cursor-pointer py-2">
                  <FileText className="h-3.5 w-3.5 text-rose-500" />
                  Export PDF / Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {showAdvancedFilters ? (
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/40 bg-muted/10 p-4 md:grid-cols-3 lg:grid-cols-5 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(val) => onFiltersChange({ ...filters, status: val })}
              >
                <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Office Location</Label>
              <Select
                value={filters.office}
                onValueChange={(val) => onFiltersChange({ ...filters, office: val })}
              >
                <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Array.from(new Set([...OFFICES, ...allDeptsForStats.map(d => d.office), ...departments.map(d => d.office)].filter(Boolean))).sort().map((off) => (
                    <SelectItem key={off} value={off}>
                      {off}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Employee Count</Label>
              <Select
                value={filters.employeeCountRange}
                onValueChange={(val) => onFiltersChange({ ...filters, employeeCountRange: val })}
              >
                <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                  <SelectValue placeholder="Any Size" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_COUNT_RANGES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Department Head</Label>
              <Select
                value={filters.managerId}
                onValueChange={(val) => onFiltersChange({ ...filters, managerId: val })}
              >
                <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                  <SelectValue placeholder="All Managers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Managers</SelectItem>
                  {managers.map((mgr) => (
                    <SelectItem key={mgr.id} value={mgr.id}>
                      {mgr.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Created Since</Label>
              <Input
                type="date"
                value={filters.createdDateFrom}
                onChange={(e) => onFiltersChange({ ...filters, createdDateFrom: e.target.value })}
                className="h-8 rounded-lg text-xs bg-background px-2 py-0 border-border/80"
              />
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-4 py-6 text-left">
            <div className="h-6 w-full rounded bg-muted/65 animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 flex-1 rounded bg-muted/50 animate-pulse" />
                <div className="h-10 flex-1 rounded bg-muted/50 animate-pulse" />
                <div className="h-10 flex-1 rounded bg-muted/50 animate-pulse" />
                <div className="h-10 flex-1 rounded bg-muted/50 animate-pulse" />
              </div>
            ))}
          </div>
        ) : processedDepartments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/10 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/60 text-muted-foreground shadow-sm">
              <Building className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-lg text-foreground">No Departments Found</h4>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              {departments.length === 0
                ? "Create your first department division to organize your corporate directory hierarchy."
                : "No corporate divisions match your search query. Try clearing filters."}
            </p>
            <Button
              onClick={departments.length === 0 ? onAddClick : onClearFilters}
              className="mt-5 rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 font-semibold text-xs h-9 px-4 cursor-pointer"
            >
              {departments.length === 0 ? "Create Department" : "Reset Filters"}
            </Button>
          </div>
        ) : (
          <>
            <DepartmentsTable
              departments={paginatedDepartments}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              sortField={sortField}
              sortDir={sortDir}
              onSort={onSort}
            />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  Showing {Math.min(processedDepartments.length, (currentPage - 1) * perPage + 1)} to{" "}
                  {Math.min(processedDepartments.length, currentPage * perPage)} of {processedDepartments.length}{" "}
                  entries
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Per Page:</span>
                  <Select value={String(perPage)} onValueChange={(val) => onPerPageChange(Number(val))}>
                    <SelectTrigger className="h-7 w-[60px] rounded-lg text-xs bg-background px-1 py-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-lg border-border/80 bg-background/50 hover:bg-muted disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <Button
                      key={pNum}
                      variant={currentPage === pNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => onPageChange(pNum)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold cursor-pointer ${
                        currentPage === pNum
                          ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
                          : "border-border/80 bg-background/50 hover:bg-muted"
                      }`}
                    >
                      {pNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded-lg border-border/80 bg-background/50 hover:bg-muted disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
