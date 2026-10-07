import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PayrollFiltersProps {
  searchQuery: string;
  selectedDept: string;
  selectedValidation: string;
  availableDepartments: string[];
  pageSize: number;
  onSearchChange: (query: string) => void;
  onDeptChange: (dept: string) => void;
  onValidationChange: (validation: string) => void;
  onPageSizeChange: (size: number) => void;
  onClearSearch: () => void;
}

export function PayrollFilters({
  searchQuery,
  selectedDept,
  selectedValidation,
  availableDepartments,
  pageSize,
  onSearchChange,
  onDeptChange,
  onValidationChange,
  onPageSizeChange,
  onClearSearch,
}: PayrollFiltersProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name or ID…"
            className="h-8 pl-8 text-xs bg-background/50"
          />
          {searchQuery ? (
            <button onClick={onClearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          ) : null}
        </div>

        {availableDepartments.length > 0 ? (
          <Select value={selectedDept} onValueChange={onDeptChange}>
            <SelectTrigger className="h-8 w-36 text-xs bg-background/50">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {availableDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <Select value={selectedValidation} onValueChange={onValidationChange}>
          <SelectTrigger className="h-8 w-36 text-xs bg-background/50">
            <SelectValue placeholder="Validation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="valid">Valid Only</SelectItem>
            <SelectItem value="warning">Warnings</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Rows:</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger className="h-8 w-20 text-xs bg-background/50">
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
  );
}