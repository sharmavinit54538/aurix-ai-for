import React from "react";
import { Search, RotateCcw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancesFilters as FilterType } from "./advancesTypes";
import { ADVANCE_TYPES_LIST } from "@/services/advancesApi";

interface AdvancesFiltersProps {
  filters: FilterType;
  onChange: (updated: Partial<FilterType>) => void;
  onReset: () => void;
}

export const AdvancesFilters: React.FC<AdvancesFiltersProps> = ({
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
            placeholder="Search advances by code, employee name, ID, department, advance type, or reason..."
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
              if (val === "pending") {
                onChange({ approvalStatus: "PENDING_FINANCE" });
              } else if (val === "medical") {
                onChange({ advanceType: "Medical" });
              } else if (val === "recovering") {
                onChange({ recoveryStatus: "RECOVERING" });
              }
            }}
          >
            <SelectTrigger className="w-40 bg-slate-950/60 border-white/10 text-xs h-9 text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                <SelectValue placeholder="Saved Views" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
              <SelectItem value="default">All Advances View</SelectItem>
              <SelectItem value="pending">Pending Finance Sign-off</SelectItem>
              <SelectItem value="medical">Medical Emergency Advances</SelectItem>
              <SelectItem value="recovering">Active Payroll Recoveries</SelectItem>
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
        {/* Advance Type Filter */}
        <Select
          value={filters.advanceType || "all"}
          onValueChange={(val) => onChange({ advanceType: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Advance Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Types</SelectItem>
            {ADVANCE_TYPES_LIST.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Department Filter */}
        <Select
          value={filters.department || "all"}
          onValueChange={(val) => onChange({ department: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Depts</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Sales & BD">Sales & BD</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
          </SelectContent>
        </Select>

        {/* Approval Status Filter */}
        <Select
          value={filters.approvalStatus || "ALL"}
          onValueChange={(val) => onChange({ approvalStatus: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Approval Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING_MANAGER">Pending Manager</SelectItem>
            <SelectItem value="PENDING_FINANCE">Pending Finance</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Recovery Status Filter */}
        <Select
          value={filters.recoveryStatus || "ALL"}
          onValueChange={(val) => onChange({ recoveryStatus: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Recovery Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="ALL">All Recovery Status</SelectItem>
            <SelectItem value="NOT_STARTED">Not Started</SelectItem>
            <SelectItem value="RECOVERING">Recovering (Active EMI)</SelectItem>
            <SelectItem value="PAUSED">Paused</SelectItem>
            <SelectItem value="RECOVERED">Fully Recovered</SelectItem>
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
