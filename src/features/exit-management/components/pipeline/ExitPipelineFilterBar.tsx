import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { STAGE_FILTERS } from "../../constants";

interface ExitPipelineFilterBarProps {
  q: string;
  setQ: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  onPageReset: () => void;
}

export function ExitPipelineFilterBar({
  q,
  setQ,
  activeFilter,
  setActiveFilter,
  onPageReset,
}: ExitPipelineFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            onPageReset();
          }}
          placeholder="Search employee, ID, designation..."
          className="h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {STAGE_FILTERS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveFilter(tab.id);
              onPageReset();
            }}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
              activeFilter === tab.id
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
