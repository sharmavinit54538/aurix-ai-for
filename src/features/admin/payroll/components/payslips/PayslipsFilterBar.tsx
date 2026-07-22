import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw, Download, Filter } from "lucide-react";
import { AdminPayslipsFilterParams } from "@/services/payslipsApi";

interface PayslipsFilterBarProps {
  filters: AdminPayslipsFilterParams;
  onChange: (updated: Partial<AdminPayslipsFilterParams>) => void;
  onReset: () => void;
  onExportCsv: () => void;
}

export const PayslipsFilterBar: React.FC<PayslipsFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  onExportCsv,
}) => {
  const months = [
    { value: 0, label: "All Months" },
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = [2024, 2025, 2026, 2027];

  return (
    <div className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-md p-4 mb-6 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-brand" />
          Filter & Search Payslips
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="h-8 text-xs font-medium gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employee name, code, or payslip #..."
            value={filters.search || ""}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            className="pl-9 text-xs h-9 bg-background/50"
          />
        </div>

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

        {/* Month */}
        <Select
          value={filters.month ? String(filters.month) : "0"}
          onValueChange={(val) => onChange({ month: Number(val), page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={String(m.value)}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select
          value={filters.year ? String(filters.year) : "2026"}
          onValueChange={(val) => onChange({ year: Number(val), page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status || "all"}
          onValueChange={(val) => onChange({ status: val, page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Generation Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Generation Status</SelectItem>
            <SelectItem value="GENERATED">Generated</SelectItem>
            <SelectItem value="PENDING">Pending Generation</SelectItem>
            <SelectItem value="SENT">Sent / Emailed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
        {/* Payment Status */}
        <Select
          value={filters.payment_status || "all"}
          onValueChange={(val) => onChange({ payment_status: val, page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Payment Payout Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Statuses</SelectItem>
            <SelectItem value="PENDING">Pending Payout</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="HOLD">On Hold</SelectItem>
            <SelectItem value="FAILED">Payout Failed</SelectItem>
          </SelectContent>
        </Select>

        {/* Designation */}
        <Select
          value={filters.designation || "all"}
          onValueChange={(val) => onChange({ designation: val, page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Designation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designations</SelectItem>
            <SelectItem value="Developer">Developer</SelectItem>
            <SelectItem value="Chief Executive Officer (CEO)">Chief Executive Officer (CEO)</SelectItem>
            <SelectItem value="Company Owner">Company Owner</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="manjor">Manager</SelectItem>
            <SelectItem value="Software Engineer">Software Engineer</SelectItem>
            <SelectItem value="Tech Lead">Tech Lead</SelectItem>
            <SelectItem value="HR Specialist">HR Specialist</SelectItem>
          </SelectContent>
        </Select>

        {/* Location */}
        <Select
          value={filters.location || "all"}
          onValueChange={(val) => onChange({ location: val, page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Headquarters">Headquarters</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="San Francisco">San Francisco</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="London">London</SelectItem>
          </SelectContent>
        </Select>

        {/* Employment Type */}
        <Select
          value={filters.employment_type || "all"}
          onValueChange={(val) => onChange({ employment_type: val, page: 1 })}
        >
          <SelectTrigger className="h-9 text-xs bg-background/50">
            <SelectValue placeholder="Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employment Types</SelectItem>
            <SelectItem value="Full-time">Full-Time</SelectItem>
            <SelectItem value="Part-time">Part-Time</SelectItem>
            <SelectItem value="Contractor">Contractor</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
