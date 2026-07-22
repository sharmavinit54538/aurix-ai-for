import React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminTaxFilterParams } from "@/services/taxApi";

interface TaxFilterBarProps {
  filters: AdminTaxFilterParams;
  onChange: (updated: Partial<AdminTaxFilterParams>) => void;
  onReset: () => void;
}

export const TaxFilterBar: React.FC<TaxFilterBarProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  return (
    <div className="p-4 rounded-xl bg-card/60 border border-border/50 backdrop-blur-md space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filter & Search Tax Profiles
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search employee name, code, or PAN..."
            value={filters.search || ""}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            className="pl-9 h-9 text-xs bg-background/50 border-border/60"
          />
        </div>

        {/* Financial Year */}
        <Select
          value={filters.financial_year || "2026-2027"}
          onValueChange={(val) => onChange({ financial_year: val, page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Financial Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026-2027">FY 2026-2027</SelectItem>
            <SelectItem value="2025-2026">FY 2025-2026</SelectItem>
            <SelectItem value="2024-2025">FY 2024-2025</SelectItem>
          </SelectContent>
        </Select>

        {/* Tax Regime */}
        <Select
          value={filters.tax_regime || "all"}
          onValueChange={(val) => onChange({ tax_regime: val, page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Tax Regime" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tax Regimes</SelectItem>
            <SelectItem value="OLD">Old Tax Regime</SelectItem>
            <SelectItem value="NEW">New Tax Regime</SelectItem>
          </SelectContent>
        </Select>

        {/* Declaration Status */}
        <Select
          value={filters.status || "all"}
          onValueChange={(val) => onChange({ status: val, page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Declaration Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending Proofs</SelectItem>
            <SelectItem value="APPROVED">Approved / Filed</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Department */}
        <Select
          value={filters.department || "all"}
          onValueChange={(val) => onChange({ department: val, page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="Management">Management</SelectItem>
            <SelectItem value="Executive Management">Executive Management</SelectItem>
            <SelectItem value="Sales&Marketing">Sales & Marketing</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
