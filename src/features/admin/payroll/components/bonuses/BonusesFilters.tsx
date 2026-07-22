import React from "react";
import { Search, RotateCcw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BonusesFilters as FilterType } from "./bonusesTypes";
import { BONUS_TYPES_LIST } from "@/services/bonusesApi";

interface BonusesFiltersProps {
  filters: FilterType;
  onChange: (updated: Partial<FilterType>) => void;
  onReset: () => void;
}

export const BonusesFilters: React.FC<BonusesFiltersProps> = ({
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
            placeholder="Search bonuses by code, employee name, ID, department, bonus type, or cycle..."
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
              if (val === "high_perf") {
                onChange({ performanceRating: "4.5_ABOVE" });
              } else if (val === "sales_inc") {
                onChange({ bonusType: "Sales Incentive" });
              } else if (val === "pending") {
                onChange({ approvalStatus: "PENDING_CFO" });
              }
            }}
          >
            <SelectTrigger className="w-40 bg-slate-950/60 border-white/10 text-xs h-9 text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <SelectValue placeholder="Saved Views" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
              <SelectItem value="default">All Bonuses View</SelectItem>
              <SelectItem value="high_perf">High Performers (&gt; 4.5)</SelectItem>
              <SelectItem value="sales_inc">Sales Incentives</SelectItem>
              <SelectItem value="pending">Pending CFO Sign-off</SelectItem>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-white/5 text-xs">
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
            <SelectItem value="HR">Human Resources</SelectItem>
          </SelectContent>
        </Select>

        {/* Bonus Type Filter */}
        <Select
          value={filters.bonusType || "all"}
          onValueChange={(val) => onChange({ bonusType: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Bonus Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Bonus Types</SelectItem>
            {BONUS_TYPES_LIST.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
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
            <SelectItem value="PENDING_HR">Pending HR</SelectItem>
            <SelectItem value="PENDING_CFO">Pending CFO</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status Filter */}
        <Select
          value={filters.paymentStatus || "ALL"}
          onValueChange={(val) => onChange({ paymentStatus: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="ALL">All Payment Status</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="SCHEDULED_PAYROLL">Scheduled in Salary</SelectItem>
            <SelectItem value="PAID">Disbursed (Paid)</SelectItem>
          </SelectContent>
        </Select>

        {/* Performance Rating Filter */}
        <Select
          value={filters.performanceRating || "ALL"}
          onValueChange={(val) => onChange({ performanceRating: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Performance Rating" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="ALL">All Ratings</SelectItem>
            <SelectItem value="4.5_ABOVE">⭐ 4.5 & Above (Exceptional)</SelectItem>
            <SelectItem value="4.0_ABOVE">⭐ 4.0 & Above (Exceeds)</SelectItem>
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

        {/* Min Amount */}
        <Input
          type="number"
          placeholder="Min Amount (₹)"
          value={filters.minAmount || ""}
          onChange={(e) => onChange({ minAmount: Number(e.target.value) || undefined })}
          className="bg-slate-950/40 border-white/10 text-xs h-8 text-white placeholder:text-slate-500 font-mono"
        />
      </div>
    </div>
  );
};
