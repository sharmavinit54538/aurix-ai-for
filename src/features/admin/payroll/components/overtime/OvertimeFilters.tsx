import React from "react";
import { Search, RotateCcw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OvertimeFilters as FilterType } from "./overtimeTypes";
import { OVERTIME_CATEGORIES_LIST } from "@/services/overtimeApi";

interface OvertimeFiltersProps {
  filters: FilterType;
  onChange: (updated: Partial<FilterType>) => void;
  onReset: () => void;
}

export const OvertimeFilters: React.FC<OvertimeFiltersProps> = ({
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
            placeholder="Search overtime by request code, employee name, ID, department, shift, or category..."
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
              } else if (val === "weekend") {
                onChange({ overtimeType: "Weekend Overtime" });
              } else if (val === "night") {
                onChange({ overtimeType: "Night Shift" });
              }
            }}
          >
            <SelectTrigger className="w-40 bg-slate-950/60 border-white/10 text-xs h-9 text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Bookmark className="w-3.5 h-3.5 text-blue-400" />
                <SelectValue placeholder="Saved Views" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
              <SelectItem value="default">All Overtime View</SelectItem>
              <SelectItem value="pending">Pending Finance Sign-off</SelectItem>
              <SelectItem value="weekend">Weekend Overtime (2.0x)</SelectItem>
              <SelectItem value="night">Night Shift Differentials</SelectItem>
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
        {/* Overtime Category Filter */}
        <Select
          value={filters.overtimeType || "all"}
          onValueChange={(val) => onChange({ overtimeType: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Overtime Category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All OT Categories</SelectItem>
            {OVERTIME_CATEGORIES_LIST.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
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

        {/* Shift Filter */}
        <Select
          value={filters.shift || "all"}
          onValueChange={(val) => onChange({ shift: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Shift Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="Morning Shift">Morning Shift</SelectItem>
            <SelectItem value="Evening Shift">Evening Shift</SelectItem>
            <SelectItem value="Night Shift">Night Shift</SelectItem>
            <SelectItem value="Rotational Shift">Rotational Shift</SelectItem>
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
      </div>
    </div>
  );
};
