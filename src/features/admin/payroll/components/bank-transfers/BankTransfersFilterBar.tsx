import React from "react";
import { Search, RotateCcw, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BankTransferFilterParams } from "@/services/bankTransfersApi";

interface BankTransfersFilterBarProps {
  filters: BankTransferFilterParams;
  onFilterChange: (updated: Partial<BankTransferFilterParams>) => void;
  onReset: () => void;
}

export const BankTransfersFilterBar: React.FC<BankTransfersFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employee or ID..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="pl-9 h-9 text-xs bg-background/50 border-border/60"
          />
        </div>

        {/* Month */}
        <Select
          value={filters.month?.toString() || "7"}
          onValueChange={(val) => onFilterChange({ month: Number(val), page: 1 })}
        >
          <SelectTrigger className="h-9 w-32 text-xs bg-background/50 border-border/60">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">July (07)</SelectItem>
            <SelectItem value="8">August (08)</SelectItem>
            <SelectItem value="6">June (06)</SelectItem>
          </SelectContent>
        </Select>

        {/* Year */}
        <Select
          value={filters.year?.toString() || "2026"}
          onValueChange={(val) => onFilterChange({ year: Number(val), page: 1 })}
        >
          <SelectTrigger className="h-9 w-28 text-xs bg-background/50 border-border/60">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>

        {/* Department */}
        <Select
          value={filters.department || "ALL"}
          onValueChange={(val) => onFilterChange({ department: val === "ALL" ? undefined : val, page: 1 })}
        >
          <SelectTrigger className="h-9 w-40 text-xs bg-background/50 border-border/60">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Executive Management">Executive Mgmt</SelectItem>
            <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="Management">Management</SelectItem>
          </SelectContent>
        </Select>

        {/* Bank */}
        <Select
          value={filters.bank || "ALL"}
          onValueChange={(val) => onFilterChange({ bank: val === "ALL" ? undefined : val, page: 1 })}
        >
          <SelectTrigger className="h-9 w-40 text-xs bg-background/50 border-border/60">
            <SelectValue placeholder="Bank Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Corporate Banks</SelectItem>
            <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
            <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
            <SelectItem value="State Bank of India">State Bank of India</SelectItem>
            <SelectItem value="Axis Bank">Axis Bank</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status */}
        <Select
          value={filters.payment_status || "ALL"}
          onValueChange={(val) => onFilterChange({ payment_status: val === "ALL" ? undefined : val, page: 1 })}
        >
          <SelectTrigger className="h-9 w-36 text-xs bg-background/50 border-border/60">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
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
