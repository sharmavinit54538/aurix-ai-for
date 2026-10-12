"use client";

import React from "react";
import { format, subDays, startOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Calendar, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DateRangePreset = "today" | "week" | "month" | "last30" | "custom";

export interface AttendanceAnalyticsFilters {
  dateRange: DateRangePreset;
  customStartDate?: Date;
  customEndDate?: Date;
  departmentId?: string;
  shiftId?: string;
  locationId?: string;
  viewMode: "week" | "month";
}

export interface FilterOptions {
  departments: Array<{ id: string; name: string }>;
  shifts: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string }>;
}

interface AttendanceAnalyticsFiltersProps {
  filters: AttendanceAnalyticsFilters;
  options: FilterOptions;
  onFiltersChange: (filters: Partial<AttendanceAnalyticsFilters>) => void;
  loading?: boolean;
}

export function getDefaultDateRange(preset: DateRangePreset): { start: Date; end: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case "today":
      return { start: today, end: today };
    case "week": {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return { start: weekStart, end: weekEnd };
    }
    case "month": {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      return { start: monthStart, end: monthEnd };
    }
    case "last30": {
      return { start: subDays(today, 29), end: today };
    }
    default:
      return { start: today, end: today };
  }
}

function formatDateRange(start: Date, end: Date): string {
  if (format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")) {
    return format(start, "MMM d, yyyy");
  }
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

const DATE_RANGE_PRESETS: Array<{ value: DateRangePreset; label: string }> = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "last30", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
];

export function AttendanceAnalyticsFiltersComponent({
  filters,
  options,
  onFiltersChange,
  loading,
}: AttendanceAnalyticsFiltersProps) {
  const [customStartDate, setCustomStartDate] = React.useState<Date | undefined>(
    filters.customStartDate
  );
  const [customEndDate, setCustomEndDate] = React.useState<Date | undefined>(
    filters.customEndDate
  );
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const handlePresetChange = (preset: DateRangePreset) => {
    if (preset === "custom") {
      setPopoverOpen(true);
      return;
    }

    const { start, end } = getDefaultDateRange(preset);
    onFiltersChange({
      dateRange: preset,
      customStartDate: undefined,
      customEndDate: undefined,
    });
  };

  const handleCustomDateConfirm = () => {
    if (customStartDate && customEndDate) {
      onFiltersChange({
        dateRange: "custom",
        customStartDate,
        customEndDate,
      });
      setPopoverOpen(false);
    }
  };

  const currentRange = filters.dateRange === "custom"
    ? filters.customStartDate && filters.customEndDate
      ? `${format(filters.customStartDate, "MMM d")} – ${format(filters.customEndDate, "MMM d, yyyy")}`
      : "Custom Range"
    : (() => {
        const range = getDefaultDateRange(filters.dateRange);
        return formatDateRange(range.start, range.end);
      })();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[280px] justify-start gap-2"
          >
            <Calendar className="h-4 w-4" />
            <span className="truncate">{currentRange}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" sideOffset={5}>
          <div className="p-3 space-y-3">
            <div className="space-y-1">
              {DATE_RANGE_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant={filters.dateRange === preset.value ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handlePresetChange(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {filters.dateRange === "custom" && (
              <div className="border-t border-border pt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Start Date
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {}}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {customStartDate
                        ? format(customStartDate, "MMM d, yyyy")
                        : "Select date"}
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      End Date
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {}}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {customEndDate
                        ? format(customEndDate, "MMM d, yyyy")
                        : "Select date"}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCustomDateConfirm}
                    disabled={!customStartDate || !customEndDate}
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1"
                    onClick={() => {
                      setCustomStartDate(undefined);
                      setCustomEndDate(undefined);
                      onFiltersChange({
                        dateRange: "today",
                        customStartDate: undefined,
                        customEndDate: undefined,
                      });
                      setPopoverOpen(false);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {options.departments.length > 0 && (
        <Select
          value={filters.departmentId || "all"}
          onValueChange={(value) =>
            onFiltersChange({ departmentId: value === "all" ? undefined : value })
          }
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {options.departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {options.shifts.length > 0 && (
        <Select
          value={filters.shiftId || "all"}
          onValueChange={(value) =>
            onFiltersChange({ shiftId: value === "all" ? undefined : value })
          }
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Shifts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            {options.shifts.map((shift) => (
              <SelectItem key={shift.id} value={shift.id}>
                {shift.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {options.locations.length > 0 && (
        <Select
          value={filters.locationId || "all"}
          onValueChange={(value) =>
            onFiltersChange({ locationId: value === "all" ? undefined : value })
          }
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {options.locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex items-center gap-2 border-l border-border pl-3 ml-2">
        <span className="text-xs text-muted-foreground">View:</span>
        <Select
          value={filters.viewMode}
          onValueChange={(value) =>
            onFiltersChange({ viewMode: value as "week" | "month" })
          }
          disabled={loading}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(filters.departmentId || filters.shiftId || filters.locationId || filters.dateRange === "custom") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onFiltersChange({
              dateRange: "today",
              customStartDate: undefined,
              customEndDate: undefined,
              departmentId: undefined,
              shiftId: undefined,
              locationId: undefined,
            })
          }
          className="h-8 px-2"
        >
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Clear Filters</span>
        </Button>
      )}
    </div>
  );
}