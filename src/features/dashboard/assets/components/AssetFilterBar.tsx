import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { STATUS_TABS } from "../constants";

interface AssetFiltersBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function AssetFiltersBar({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
}: AssetFiltersBarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by ID, name, brand, employee..."
          className="h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onStatusFilterChange(tab.id)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
              statusFilter === tab.id
                ? "bg-foreground text-background border-foreground"
                : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
