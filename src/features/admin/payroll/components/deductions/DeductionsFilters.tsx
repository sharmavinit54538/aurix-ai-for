import React from "react";
import { Search, RotateCcw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeductionsFilters as FilterType } from "./deductionsTypes";
import { DEDUCTION_CATEGORY_GROUPS } from "@/services/deductionsApi";

interface DeductionsFiltersProps {
  filters: FilterType;
  onChange: (updated: Partial<FilterType>) => void;
  onReset: () => void;
}

export const DeductionsFilters: React.FC<DeductionsFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/60 border border-white/5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search deductions by code, rule name, category, formula expression, or compliance type..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="pl-9 bg-slate-950/60 border-white/10 text-xs text-white placeholder:text-slate-500 h-9"
          />
        </div>

        {/* Saved Views & Reset */}
        <div className="flex items-center gap-2">
          <Select
            value="default"
            onValueChange={(val) => {
              if (val === "statutory") {
                onChange({ categoryGroup: "STATUTORY" });
              } else if (val === "recoveries") {
                onChange({ categoryGroup: "RECOVERY" });
              } else if (val === "active") {
                onChange({ status: "ACTIVE" });
              }
            }}
          >
            <SelectTrigger className="w-40 bg-slate-950/60 border-white/10 text-xs h-9 text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Bookmark className="w-3.5 h-3.5 text-rose-400" />
                <SelectValue placeholder="Saved Views" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
              <SelectItem value="default">All Deductions View</SelectItem>
              <SelectItem value="statutory">Mandatory Statutory (EPF/ESI/PT)</SelectItem>
              <SelectItem value="recoveries">Loan & Advance Recoveries</SelectItem>
              <SelectItem value="active">Active Rules Only</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-white/10 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white h-9 text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-2 border-t border-white/5 text-xs">
        {/* Category Group Filter */}
        <Select
          value={filters.categoryGroup || "all"}
          onValueChange={(val) => onChange({ categoryGroup: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Category Group" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Categories</SelectItem>
            {DEDUCTION_CATEGORY_GROUPS.map((grp) => (
              <SelectItem key={grp} value={grp}>
                {grp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status || "ALL"}
          onValueChange={(val) => onChange({ status: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Department Filter */}
        <Select
          value={filters.department || "all"}
          onValueChange={(val) => onChange({ department: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Department Scope" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Depts (Global)</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Sales & BD">Sales & BD</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
          </SelectContent>
        </Select>

        {/* Payroll Cycle Filter */}
        <Select
          value={filters.payrollCycle || "JULY-2026"}
          onValueChange={(val) => onChange({ payrollCycle: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Pay Cycle" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="JULY-2026">July 2026 Pay Run</SelectItem>
            <SelectItem value="AUGUST-2026">August 2026 Pay Run</SelectItem>
          </SelectContent>
        </Select>

        {/* Financial Year Filter */}
        <Select
          value={filters.financialYear || "FY26-27"}
          onValueChange={(val) => onChange({ financialYear: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Fin Year" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="FY26-27">FY 2026-2027</SelectItem>
            <SelectItem value="FY25-26">FY 2025-2026</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
