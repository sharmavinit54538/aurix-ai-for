import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import {
  TIMEZONES,
  TimezoneOption,
  getTimezoneLiveInfo,
  findTimezoneRecord,
  getTimezonesForCountry,
  normalizeTimezoneId,
} from "@/lib/country-timezone-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimezoneSelectProps {
  value?: string;
  onChange: (tzId: string) => void;
  country?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
}

export function TimezoneSelect({
  value,
  onChange,
  country,
  disabled = false,
  className,
  id,
  placeholder = "Timezone...",
}: TimezoneSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tick, setTick] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Live ticking clock: updates every 2 seconds for fresh digital time
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 10000);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Selected timezone record
  const selectedTz = useMemo(() => {
    if (!value || value.toLowerCase() === "timezone...") return null;
    return (
      findTimezoneRecord(value) ||
      findTimezoneRecord(normalizeTimezoneId(value))
    );
  }, [value]);

  // Live offset & time for selected timezone
  const selectedLive = useMemo(() => {
    if (!selectedTz) return { offset: "UTC+00:00", currentTime: "" };
    return getTimezoneLiveInfo(selectedTz.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTz?.id, tick]);

  const countryMatches = useMemo(() => {
    if (!country) return [];
    return getTimezonesForCountry(country);
  }, [country]);

  // Filtered timezone list based on user search
  const filteredTimezones = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TIMEZONES;

    return TIMEZONES.filter((t) => {
      const live = getTimezoneLiveInfo(t.id);
      return (
        t.country.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.label.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        live.offset.toLowerCase().includes(q) ||
        t.aliases?.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [search]);

  // Flat list for keyboard navigation
  const allSelectableItems = useMemo(() => {
    if (search.trim()) return filteredTimezones;
    const matchIds = new Set(countryMatches.map((m) => m.id));
    const others = filteredTimezones.filter((t) => !matchIds.has(t.id));
    return [...countryMatches, ...others];
  }, [search, filteredTimezones, countryMatches]);

  useEffect(() => {
    setActiveIndex(0);
  }, [search, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [open]);

  function handleSelect(tzId: string) {
    onChange(tzId);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, allSelectableItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? allSelectableItems.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allSelectableItems[activeIndex]) {
        handleSelect(allSelectableItems[activeIndex].id);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors cursor-pointer",
            "hover:bg-accent/30 focus:outline-hidden focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          {selectedTz ? (
            <div className="flex items-center gap-1.5 overflow-hidden text-left min-w-0 flex-1">
              <span className="truncate font-normal text-sm text-foreground">
                {selectedTz.city.split(",")[0]}
              </span>
              <span className="shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                {selectedLive.offset}
              </span>
              <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-foreground ml-auto mr-1">
                {selectedLive.currentTime}
              </span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}

          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[280px] max-h-[340px] p-0 shadow-lg border border-border bg-popover text-popover-foreground rounded-md z-50 overflow-hidden flex flex-col"
      >
        {/* Compact search header */}
        <div className="p-2 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search timezone, city, UTC..."
              className="h-8 w-full rounded-md border border-input bg-background/90 pl-8 pr-3 text-xs outline-hidden focus:border-ring focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Scrollable timezones list */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto max-h-[280px] p-1 space-y-0.5 overflow-x-hidden"
        >
          {/* 1. Country recommendation if matched */}
          {!search && countryMatches.length > 0 && (
            <div className="mb-1 space-y-0.5">
              <div className="px-2.5 py-1 text-[10px] uppercase font-semibold text-primary tracking-wider">
                Matching {country}
              </div>

              {countryMatches.map((t, idx) => {
                const live = getTimezoneLiveInfo(t.id);
                const isSelected = selectedTz?.id === t.id;
                const isHighlighted = activeIndex === idx;

                return (
                  <button
                    key={`rec-${t.id}`}
                    type="button"
                    onClick={() => handleSelect(t.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-2.5 py-1.5 rounded-sm text-left transition-colors text-sm cursor-pointer",
                      isSelected
                        ? "bg-accent font-medium text-accent-foreground"
                        : isHighlighted
                        ? "bg-accent/60 text-foreground"
                        : "hover:bg-accent/40 text-foreground"
                    )}
                  >
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="font-medium text-xs text-foreground truncate">
                        {t.city}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground truncate">
                        {t.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="rounded bg-emerald-500/15 px-1 py-0.5 font-mono text-[9px] font-bold text-emerald-400 border border-emerald-500/25">
                        {live.offset}
                      </span>
                      <span className="font-mono text-xs font-semibold tabular-nums text-foreground min-w-[50px] text-right">
                        {live.currentTime}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </div>
                  </button>
                );
              })}

              <div className="my-1 border-t border-border/40" />
            </div>
          )}

          {/* 2. All World Timezones */}
          <div className="px-2.5 py-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
            {search ? `Results (${filteredTimezones.length})` : "All Timezones"}
          </div>

          {filteredTimezones.length === 0 ? (
            <div className="py-6 px-4 text-center text-xs text-muted-foreground">
              No timezones matching &quot;{search}&quot;
            </div>
          ) : (
            filteredTimezones.map((t, index) => {
              const live = getTimezoneLiveInfo(t.id);
              const isSelected = selectedTz?.id === t.id;
              const globalIndex = search
                ? index
                : countryMatches.length +
                  filteredTimezones
                    .filter((item) => !countryMatches.some((cm) => cm.id === item.id))
                    .findIndex((item) => item.id === t.id);
              const isHighlighted = activeIndex === globalIndex;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelect(t.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-2.5 py-1.5 rounded-sm text-left transition-colors text-sm cursor-pointer",
                    isSelected
                      ? "bg-accent font-medium text-accent-foreground"
                      : isHighlighted
                      ? "bg-accent/60 text-foreground"
                      : "hover:bg-accent/40 text-foreground"
                  )}
                >
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="font-medium text-xs text-foreground truncate">
                      {t.city}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground truncate">
                      {t.id}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="rounded bg-muted/70 px-1 py-0.5 font-mono text-[9px] font-medium text-muted-foreground border border-border/50">
                      {live.offset}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-foreground min-w-[50px] text-right">
                      {live.currentTime}
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
