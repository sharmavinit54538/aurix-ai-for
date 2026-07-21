import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OnboardingFilters } from "../../hooks/useAdminOnboarding";

interface OnboardingFiltersBarProps {
  filters: OnboardingFilters;
  departments: string[];
  currentSteps: string[];
  onChange: (next: OnboardingFilters) => void;
}

export function OnboardingFiltersBar({
  filters,
  departments,
  currentSteps,
  onChange,
}: OnboardingFiltersBarProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl md:grid-cols-2 xl:grid-cols-5">
      <div className="relative xl:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search employees..."
          className="pl-9"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(status) => onChange({ ...filters, status })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="IN_PROGRESS">In progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.department}
        onValueChange={(department) => onChange({ ...filters, department })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All departments</SelectItem>
          {departments.map((department) => (
            <SelectItem key={department} value={department}>
              {department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.currentStep}
        onValueChange={(currentStep) => onChange({ ...filters, currentStep })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Current step" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All steps</SelectItem>
          {currentSteps.map((step) => (
            <SelectItem key={step} value={step}>
              {step}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        min={0}
        max={100}
        value={filters.minCompletion}
        onChange={(event) => onChange({ ...filters, minCompletion: event.target.value })}
        placeholder="Min completion %"
        className="xl:col-span-1"
      />
    </div>
  );
}
