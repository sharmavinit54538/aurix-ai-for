import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPE_OPTIONS,
  OFFICES,
  STATUS_OPTIONS,
  TEAM_SIZE_FILTER_OPTIONS,
} from "../constants";
import type { ManagerFilters } from "../types";

interface ManagersAdvancedFiltersProps {
  filters: ManagerFilters;
  onChange: (filters: ManagerFilters) => void;
}

export function ManagersAdvancedFilters({ filters, onChange }: ManagersAdvancedFiltersProps) {
  function update<K extends keyof ManagerFilters>(key: K, value: ManagerFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-border bg-muted/10 p-4 md:grid-cols-3 lg:grid-cols-6">
      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Department</Label>
        <Select value={filters.department} onValueChange={(val) => update("department", val)}>
          <SelectTrigger className="h-8 rounded-lg bg-background text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Status</Label>
        <Select value={filters.status} onValueChange={(val) => update("status", val)}>
          <SelectTrigger className="h-8 rounded-lg bg-background text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Employment Type</Label>
        <Select value={filters.employmentType} onValueChange={(val) => update("employmentType", val)}>
          <SelectTrigger className="h-8 rounded-lg bg-background text-xs">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Office Location</Label>
        <Select value={filters.office} onValueChange={(val) => update("office", val)}>
          <SelectTrigger className="h-8 rounded-lg bg-background text-xs">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {OFFICES.map((off) => (
              <SelectItem key={off} value={off}>
                {off}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Team Size</Label>
        <Select value={filters.teamSize} onValueChange={(val) => update("teamSize", val)}>
          <SelectTrigger className="h-8 rounded-lg bg-background text-xs">
            <SelectValue placeholder="Any Size" />
          </SelectTrigger>
          <SelectContent>
            {TEAM_SIZE_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Joining From</Label>
        <Input
          type="date"
          value={filters.joiningFrom}
          onChange={(e) => update("joiningFrom", e.target.value)}
          className="h-8 rounded-lg border-border/80 bg-background px-2 py-0 text-xs"
        />
      </div>
    </div>
  );
}
