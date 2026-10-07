import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ValidationFiltersProps } from "../types/payrollValidation.types";

export function ValidationFilters({
  searchQuery,
  selectedSeverity,
  selectedCategory,
  selectedDepartment,
  selectedStatus,
  selectedBlocking,
  pageSize,
  availableCategories,
  availableDepartments,
  hasStatusInfo,
  hasBlockingInfo,
  onSearchChange,
  onSeverityChange,
  onCategoryChange,
  onDepartmentChange,
  onStatusChange,
  onBlockingChange,
  onPageSizeChange,
  onClearSearch,
}: ValidationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search Box */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by employee name, ID, issue, rule code, department…"
          className="h-9 pl-9 text-xs bg-background/50"
        />
        {searchQuery ? (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Severity Filter */}
        <Select value={selectedSeverity} onValueChange={onSeverityChange}>
          <SelectTrigger className="h-9 w-32 text-xs bg-background/50">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="error">Errors Only</SelectItem>
            <SelectItem value="warning">Warnings Only</SelectItem>
            <SelectItem value="info">Info Only</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        {availableCategories.length > 0 ? (
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-9 w-36 text-xs bg-background/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {/* Department Filter (Only if department data is provided) */}
        {availableDepartments.length > 0 ? (
          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="h-9 w-36 text-xs bg-background/50">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {availableDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {/* Status Filter (Only if status/resolved data exists) */}
        {hasStatusInfo ? (
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 w-32 text-xs bg-background/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        ) : null}

        {/* Blocking Status Filter (Only if backend provides blocking flags) */}
        {hasBlockingInfo ? (
          <Select value={selectedBlocking} onValueChange={onBlockingChange}>
            <SelectTrigger className="h-9 w-36 text-xs bg-background/50">
              <SelectValue placeholder="Impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Impact</SelectItem>
              <SelectItem value="blocking">Blocking Only</SelectItem>
              <SelectItem value="non_blocking">Non-Blocking Only</SelectItem>
            </SelectContent>
          </Select>
        ) : null}

        {/* Page Size */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto sm:ml-0">
          <span>Rows:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v));
            }}
          >
            <SelectTrigger className="h-9 w-18 text-xs bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}