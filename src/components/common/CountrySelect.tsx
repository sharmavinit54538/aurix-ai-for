import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { COUNTRIES, CountryOption, findMatchingCountry } from "@/lib/country-timezone-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  value?: string;
  onChange: (countryName: string, countryOption?: CountryOption) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
}

export function CountrySelect({
  value,
  onChange,
  disabled = false,
  className,
  id,
  placeholder = "Country...",
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [open]);

  const selectedCountry = useMemo(() => {
    if (!value || value.toLowerCase() === "country...") return null;
    return findMatchingCountry(value);
  }, [value]);

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRIES;

    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.aliases?.some((a) => a.toLowerCase().includes(q))
    );
  }, [search]);

  useEffect(() => {
    setActiveIndex(0);
  }, [search, open]);

  function handleSelect(c: CountryOption) {
    onChange(c.name, c);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredCountries.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? filteredCountries.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCountries[activeIndex]) {
        handleSelect(filteredCountries[activeIndex]);
      } else if (search.trim()) {
        onChange(search.trim());
        setOpen(false);
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
          {selectedCountry ? (
            <div className="flex items-center gap-1.5 overflow-hidden text-left min-w-0 flex-1">
              <span className="font-normal text-sm text-foreground truncate">
                {selectedCountry.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground shrink-0">
                ({selectedCountry.code})
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
        className="w-[var(--radix-popover-trigger-width)] min-w-[240px] max-h-[340px] p-0 shadow-lg border border-border bg-popover text-popover-foreground rounded-md z-50 overflow-hidden flex flex-col"
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
              placeholder="Search country..."
              className="h-8 w-full rounded-md border border-input bg-background/90 pl-8 pr-3 text-xs outline-hidden focus:border-ring focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Country list rows */}
        <div className="flex-1 overflow-y-auto max-h-[280px] p-1 space-y-0.5 overflow-x-hidden">
          {filteredCountries.length === 0 ? (
            <div className="py-6 px-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                No country matching &quot;{search}&quot;
              </p>
              {search.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(search.trim());
                    setOpen(false);
                  }}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Use &quot;{search.trim()}&quot; as custom country
                </button>
              )}
            </div>
          ) : (
            filteredCountries.map((c, index) => {
              const isSelected = selectedCountry?.code === c.code || value?.toLowerCase() === c.name.toLowerCase();
              const isHighlighted = activeIndex === index;

              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-2.5 py-1.5 rounded-sm text-left transition-colors text-sm cursor-pointer",
                    isSelected
                      ? "bg-accent font-medium text-accent-foreground"
                      : isHighlighted
                      ? "bg-accent/60 text-foreground"
                      : "hover:bg-accent/40 text-foreground"
                  )}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                    <span className="truncate">{c.name}</span>
                    <span className="font-mono text-xs text-muted-foreground shrink-0">
                      ({c.code})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs text-muted-foreground">
                      {c.currency}
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
