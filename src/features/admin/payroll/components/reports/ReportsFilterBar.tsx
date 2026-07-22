import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ReportsFilterState {
  fy?: string;
  month?: number;
  department?: string;
  search?: string;
}

interface ReportsFilterBarProps {
  filters: ReportsFilterState;
  onFilterChange: (updated: Partial<ReportsFilterState>) => void;
  onReset: () => void;
}

export const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports or employees..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-9 h-9 text-xs bg-background/50 border-border/60"
          />
        </div>

        {/* Financial Year */}
        <Select
          value={filters.fy || "2026-27"}
          onValueChange={(val) => onFilterChange({ fy: val })}
        >
          <SelectTrigger className="h-9 w-32 text-xs bg-background/50 border-border/60">
            <SelectValue placeholder="FY" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026-27">FY 2026-27</SelectItem>
            <SelectItem value="2025-26">FY 2025-26</SelectItem>
            <SelectItem value="2024-25">FY 2024-25</SelectItem>
          </SelectContent>
        </Select>

        {/* Month */}
        <Select
          value={filters.month?.toString() || "7"}
          onValueChange={(val) => onFilterChange({ month: Number(val) })}
        >
          <SelectTrigger className="h-9 w-32 text-xs bg-background/50 border-border/60">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">July (07)</SelectItem>
            <SelectItem value="6">June (06)</SelectItem>
            <SelectItem value="5">May (05)</SelectItem>
            <SelectItem value="4">April (04)</SelectItem>
            <SelectItem value="3">March (03)</SelectItem>
            <SelectItem value="2">February (02)</SelectItem>
          </SelectContent>
        </Select>

        {/* Department */}
        <Select
          value={filters.department || "ALL"}
          onValueChange={(val) => onFilterChange({ department: val === "ALL" ? undefined : val })}
        >
          <SelectTrigger className="h-9 w-40 text-xs bg-background/50 border-border/60">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
            <SelectItem value="Executive Mgmt">Executive Mgmt</SelectItem>
            <SelectItem value="IT & Infra">IT & Infra</SelectItem>
            <SelectItem value="HR & Admin">HR & Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground gap-1.5"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
};
