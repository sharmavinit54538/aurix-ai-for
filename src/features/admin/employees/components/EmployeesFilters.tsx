import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DepartmentSelectContent } from "./DepartmentSelectContent";

interface EmployeesFiltersProps {
  search: string;
  department: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
}

export function EmployeesFilters({
  search,
  department,
  onSearchChange,
  onDepartmentChange,
}: EmployeesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or ID"
          className="h-9 pl-9"
        />
      </div>
      <Select value={department} onValueChange={onDepartmentChange}>
        <SelectTrigger className="h-9 w-48">
          <SelectValue placeholder="All departments" />
        </SelectTrigger>
        <DepartmentSelectContent includeAllOption />
      </Select>
    </div>
  );
}
