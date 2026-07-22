import React from "react";
import { Search, RotateCcw, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReimbursementsFilters as FilterType } from "./reimbursementsTypes";
import { EXPENSE_CATEGORIES_LIST } from "@/services/reimbursementsApi";

interface ReimbursementsFiltersProps {
  filters: FilterType;
  onChange: (updated: Partial<FilterType>) => void;
  onReset: () => void;
}

export const ReimbursementsFilters: React.FC<ReimbursementsFiltersProps> = ({
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
            placeholder="Search claims by claim ID, employee name, ID, department, or business purpose..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="pl-9 bg-slate-950/60 border-white/10 text-xs text-white placeholder:text-slate-500 h-9"
          />
        </div>

        {/* Saved Preset Views */}
        <div className="flex items-center gap-2">
          <Select
            value="default"
            onValueChange={(val) => {
              if (val === "pending_fin") {
                onChange({ claimStatus: "SUBMITTED" });
              } else if (val === "travel") {
                onChange({ expenseCategory: "Travel" });
              } else if (val === "high_value") {
                onChange({ minAmount: 20000 });
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
              <SelectItem value="default">All Claims View</SelectItem>
              <SelectItem value="pending_fin">Pending Approvals</SelectItem>
              <SelectItem value="travel">Travel Claims Only</SelectItem>
              <SelectItem value="high_value">High Value (&gt; ₹20k)</SelectItem>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 pt-2 border-t border-white/5 text-xs">
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

        {/* Expense Category Filter */}
        <Select
          value={filters.expenseCategory || "all"}
          onValueChange={(val) => onChange({ expenseCategory: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Expense Category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Categories</SelectItem>
            {EXPENSE_CATEGORIES_LIST.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Claim Approval Status Filter */}
        <Select
          value={filters.claimStatus || "ALL"}
          onValueChange={(val) => onChange({ claimStatus: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Approval Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="ALL">All Approvals</SelectItem>
            <SelectItem value="SUBMITTED">Pending Manager</SelectItem>
            <SelectItem value="FINANCE_APPROVED">Finance Approved</SelectItem>
            <SelectItem value="PAYROLL_APPROVED">Payroll Approved</SelectItem>
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

        {/* Month Filter */}
        <Select
          value={filters.month || "all"}
          onValueChange={(val) => onChange({ month: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Months</SelectItem>
            <SelectItem value="July 2026">July 2026</SelectItem>
            <SelectItem value="June 2026">June 2026</SelectItem>
            <SelectItem value="May 2026">May 2026</SelectItem>
          </SelectContent>
        </Select>

        {/* Min Amount Input */}
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
