import { Button } from "@/components/ui/button";

interface ShiftFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: "all" | "day" | "night";
  onTypeFilterChange: (value: "all" | "day" | "night") => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
}

export function ShiftFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: ShiftFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card/50 border border-border/80 p-3 rounded-xl backdrop-blur-md">
      <div className="relative flex-1 max-w-sm">
        <svg className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search shift name or code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center bg-muted/40 rounded-lg p-0.5 border border-border/60">
          <button
            onClick={() => onTypeFilterChange("all")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              typeFilter === "all" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => onTypeFilterChange("day")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              typeFilter === "day" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => onTypeFilterChange("night")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              typeFilter === "night" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
            }`}
          >
            Night
          </button>
        </div>

        <div className="flex items-center bg-muted/40 rounded-lg p-0.5 border border-border/60">
          <button
            onClick={() => onStatusFilterChange("all")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === "all" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => onStatusFilterChange("active")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === "active" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => onStatusFilterChange("inactive")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === "inactive" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>
    </div>
  );
}