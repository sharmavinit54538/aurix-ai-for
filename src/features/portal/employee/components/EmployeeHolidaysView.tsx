import { useState, useEffect, useMemo } from "react";
import {
  Palmtree,
  Calendar,
  CalendarDays,
  Search,
  Filter,
  RefreshCw,
  Info,
  MapPin,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Loader2,
  Globe,
  Clock,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { attendanceApi, HolidayRecord } from "@/services/attendanceApi";

interface EmployeeHolidaysViewProps {
  branch?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function EmployeeHolidaysView({ branch }: EmployeeHolidaysViewProps) {
  const [holidays, setHolidays] = useState<HolidayRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-indexed
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"month" | "year">("year");

  // Holiday Details Modal
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const loadHolidays = async (showNotice = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceApi.getHolidays({
        year: selectedYear,
        branch: regionFilter !== "all" ? regionFilter : branch || undefined,
      });
      setHolidays(data);
      if (showNotice) {
        toast.success("Holidays updated from server");
      }
    } catch (err: any) {
      console.error("Failed to load holidays:", err);
      const msg = err?.message || "Unable to load your schedule. Please try again.";
      setError(msg);
      if (showNotice) toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHolidays();
  }, [selectedYear, regionFilter]);

  // Unique regions extracted from holidays + current employee branch
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    if (branch && branch.trim()) set.add(branch.trim());
    holidays.forEach((h) => {
      if (h.office && h.office !== "All Offices" && h.office !== "all") {
        set.add(h.office);
      }
      if (h.state && h.state !== "All States") {
        set.add(h.state);
      }
    });
    return Array.from(set).sort();
  }, [holidays, branch]);

  // Normalize holiday type for display
  const normalizeHolidayType = (rawType: string): string => {
    const t = (rawType || "").toLowerCase();
    if (t.includes("nation") || t.includes("public")) return "National Holiday";
    if (t.includes("reg")) return "Regional Holiday";
    if (t.includes("opt")) return "Optional Holiday";
    return "Company Holiday";
  };

  const getHolidayTypeBadge = (rawType: string) => {
    const normalized = normalizeHolidayType(rawType);
    switch (normalized) {
      case "National Holiday":
        return (
          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 gap-1 font-medium text-[11px]">
            <Globe className="h-3 w-3" /> National Holiday
          </Badge>
        );
      case "Regional Holiday":
        return (
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1 font-medium text-[11px]">
            <MapPin className="h-3 w-3" /> Regional Holiday
          </Badge>
        );
      case "Optional Holiday":
        return (
          <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1 font-medium text-[11px]">
            <Tag className="h-3 w-3" /> Optional Holiday
          </Badge>
        );
      default:
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 gap-1 font-medium text-[11px]">
            <Building2 className="h-3 w-3" /> Company Holiday
          </Badge>
        );
    }
  };

  // Filtered holidays
  const filteredHolidays = useMemo(() => {
    return holidays.filter((h) => {
      // Search match
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = h.name.toLowerCase().includes(q);
        const matchDesc = h.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }

      // Region match
      if (regionFilter !== "all") {
        const rLower = regionFilter.toLowerCase();
        const matchOffice = h.office?.toLowerCase().includes(rLower);
        const matchState = h.state?.toLowerCase().includes(rLower);
        const isGlobal = !h.office || h.office === "All Offices" || h.applyToAll;
        if (!matchOffice && !matchState && !isGlobal) return false;
      }

      // Type match
      if (typeFilter !== "all") {
        const normalized = normalizeHolidayType(h.type);
        if (normalized.toLowerCase() !== typeFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [holidays, search, regionFilter, typeFilter]);

  // Upcoming holidays list (strictly from today onwards)
  const upcomingHolidays = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return filteredHolidays
      .filter((h) => h.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4);
  }, [filteredHolidays]);

  // Holidays grouped by month for Year View
  const holidaysByMonth = useMemo(() => {
    const map = new Map<number, HolidayRecord[]>();
    for (let m = 1; m <= 12; m++) map.set(m, []);

    filteredHolidays.forEach((h) => {
      const parts = h.date.split("-");
      const m = parseInt(parts[1], 10);
      if (map.has(m)) {
        map.get(m)!.push(h);
      }
    });

    for (let m = 1; m <= 12; m++) {
      map.get(m)!.sort((a, b) => a.date.localeCompare(b.date));
    }

    return map;
  }, [filteredHolidays]);

  // Month View calendar cells
  const monthCalendarCells = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    let startDayIndex = firstDay.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6; // Sunday to index 6

    const daysCount = new Date(selectedYear, selectedMonth, 0).getDate();
    const cells: {
      dayNum: number;
      dateStr: string;
      isToday: boolean;
      holidays: HolidayRecord[];
    }[] = [];

    // Leading pad
    for (let i = 0; i < startDayIndex; i++) {
      cells.push(null as any);
    }

    const todayStr = new Date().toISOString().split("T")[0];

    for (let d = 1; d <= daysCount; d++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const matching = filteredHolidays.filter((h) => h.date === dateStr);
      cells.push({
        dayNum: d,
        dateStr,
        isToday: dateStr === todayStr,
        holidays: matching,
      });
    }

    return cells;
  }, [selectedYear, selectedMonth, filteredHolidays]);

  const getWeekdayName = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", { weekday: "long" });
  };

  const formatDisplayDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ── Loading State ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <div>
          <h3 className="text-base font-semibold text-foreground">Loading holidays...</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Retrieving company and regional holiday calendar from backend database.
          </p>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Unable to load your schedule</h3>
        <p className="text-xs text-muted-foreground mt-1.5 max-w-md">
          {error}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadHolidays(true)}
          className="mt-5 gap-2 border-border"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
              Holidays
            </h1>
            <Badge variant="outline" className="text-xs border-border bg-card/40">
              {selectedYear} Official Calendar
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Applicable public, national, and company holiday schedule for your work location.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => loadHolidays(true)}
            className="h-9 w-9 border-border bg-card/60 hover:bg-accent/60"
            title="Refresh holidays"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* ── Upcoming Holidays Highlight Section ── */}
      {upcomingHolidays.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                Upcoming Holidays
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Next scheduled days off
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingHolidays.map((h) => {
              const weekday = getWeekdayName(h.date);
              const displayDate = formatDisplayDate(h.date);
              return (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedHoliday(h);
                    setDetailsOpen(true);
                  }}
                  className="rounded-xl border border-border/70 bg-card p-4 hover:border-amber-500/40 hover:bg-accent/40 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {weekday}
                      </span>
                      {getHolidayTypeBadge(h.type)}
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mt-2 line-clamp-1" title={h.name}>
                      {h.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {displayDate}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3" />
                      {h.office && h.office !== "All Offices" ? h.office : "Company-wide"}
                    </span>
                    <span className="text-indigo-400 font-medium">Details</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Selectors */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search holiday name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 text-xs border-border bg-background"
            />
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedYear((y) => y - 1)}
              className="h-9 w-9 border-border bg-background"
              title="Previous year"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-bold px-2 py-1.5 rounded-md border border-border bg-background">
              {selectedYear}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedYear((y) => y + 1)}
              className="h-9 w-9 border-border bg-background"
              title="Next year"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Region Filter */}
          {availableRegions.length > 0 && (
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Regions / Global</option>
              {availableRegions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}

          {/* Holiday Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Holiday Types</option>
            <option value="National Holiday">National Holiday</option>
            <option value="Company Holiday">Company Holiday</option>
            <option value="Regional Holiday">Regional Holiday</option>
            <option value="Optional Holiday">Optional Holiday</option>
          </select>
        </div>

        {/* View Mode Switcher (Month View vs Year View) */}
        <div className="flex items-center border border-border rounded-xl p-1 bg-muted/40 self-start lg:self-auto">
          <Button
            variant={viewMode === "year" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("year")}
            className={`h-7 px-3 text-xs gap-1.5 ${
              viewMode === "year" ? "bg-amber-600 text-white shadow-xs" : "text-muted-foreground"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" /> Year View
          </Button>
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("month")}
            className={`h-7 px-3 text-xs gap-1.5 ${
              viewMode === "month" ? "bg-amber-600 text-white shadow-xs" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" /> Month View
          </Button>
        </div>
      </div>

      {/* ── Empty State Check ── */}
      {filteredHolidays.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="rounded-2xl bg-muted/40 p-4 mb-4 border border-border">
            <Palmtree className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">No Holidays Available</h2>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-md leading-relaxed">
            There are no holidays configured for the selected calendar year or location filter.
          </p>
        </div>
      )}

      {/* ── View 1: Year View (Grouped by Month) ── */}
      {filteredHolidays.length > 0 && viewMode === "year" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {MONTH_NAMES.map((monthName, idx) => {
            const m = idx + 1;
            const monthHolidays = holidaysByMonth.get(m) || [];
            if (monthHolidays.length === 0) return null;

            return (
              <div
                key={monthName}
                className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm flex flex-col"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <span className="font-display font-bold text-base text-foreground">
                    {monthName}
                  </span>
                  <Badge variant="outline" className="text-[11px] border-border">
                    {monthHolidays.length} {monthHolidays.length === 1 ? "Holiday" : "Holidays"}
                  </Badge>
                </div>

                <div className="mt-3 space-y-3 flex-1">
                  {monthHolidays.map((h) => {
                    const weekday = getWeekdayName(h.date);
                    return (
                      <div
                        key={h.id}
                        onClick={() => {
                          setSelectedHoliday(h);
                          setDetailsOpen(true);
                        }}
                        className="rounded-xl p-3 border border-border/60 bg-muted/15 hover:border-amber-500/40 hover:bg-muted/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {h.name}
                          </span>
                          {getHolidayTypeBadge(h.type)}
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 font-medium text-foreground">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {h.date.split("-")[2]} {monthName.slice(0, 3)} ({weekday})
                          </span>
                          <span className="text-[11px]">
                            {h.office && h.office !== "All Offices" ? h.office : "Company-wide"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── View 2: Month View Calendar Grid ── */}
      {filteredHolidays.length > 0 && viewMode === "month" && (
        <div className="space-y-4">
          {/* Month Selector Bar */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear((y) => y - 1);
                } else {
                  setSelectedMonth((m) => m - 1);
                }
              }}
              className="h-8 gap-1 text-xs border-border"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </Button>
            <span className="font-display font-bold text-base text-foreground">
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedMonth === 12) {
                  setSelectedMonth(1);
                  setSelectedYear((y) => y + 1);
                } else {
                  setSelectedMonth((m) => m + 1);
                }
              }}
              className="h-8 gap-1 text-xs border-border"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Month Grid */}
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm p-5 overflow-hidden">
            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="text-xs font-bold text-muted-foreground py-1 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {monthCalendarCells.map((cell, idx) => {
                if (!cell) {
                  return (
                    <div
                      key={`month-blank-${idx}`}
                      className="min-h-[100px] rounded-xl border border-transparent bg-muted/5 p-2 opacity-30 pointer-events-none"
                    />
                  );
                }

                const hasHols = cell.holidays.length > 0;

                return (
                  <div
                    key={cell.dateStr}
                    className={`min-h-[100px] rounded-xl p-2 border transition-all flex flex-col justify-between ${
                      cell.isToday
                        ? "border-amber-500 bg-amber-500/10 shadow-xs"
                        : hasHols
                        ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500 hover:bg-amber-500/10 cursor-pointer"
                        : "border-border/40 bg-card/40"
                    }`}
                    onClick={() => {
                      if (hasHols) {
                        setSelectedHoliday(cell.holidays[0]);
                        setDetailsOpen(true);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          cell.isToday
                            ? "rounded-full bg-amber-500 text-white h-5 w-5 flex items-center justify-center text-[10px]"
                            : "text-foreground"
                        }`}
                      >
                        {cell.dayNum}
                      </span>
                    </div>

                    <div className="my-1 space-y-1">
                      {cell.holidays.map((h) => (
                        <div
                          key={h.id}
                          className="rounded-md bg-amber-500/20 border border-amber-500/30 px-1.5 py-1 text-[10px] font-semibold text-amber-300 truncate"
                          title={`${h.name} (${normalizeHolidayType(h.type)})`}
                        >
                          {h.name}
                        </div>
                      ))}
                    </div>

                    <div className="text-[9px] text-muted-foreground">
                      {hasHols ? `${cell.holidays.length} Off` : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Holiday Details Modal (Read-Only) ── */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold font-display text-foreground">
                Holiday Details
              </DialogTitle>
              {selectedHoliday && getHolidayTypeBadge(selectedHoliday.type)}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Official company holiday schedule specification.
            </DialogDescription>
          </DialogHeader>

          {selectedHoliday && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Holiday Name:</span>
                  <span className="font-bold text-sm text-foreground">{selectedHoliday.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold text-foreground">
                    {formatDisplayDate(selectedHoliday.date)} ({getWeekdayName(selectedHoliday.date)})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Category / Classification:</span>
                  <span className="font-medium text-foreground">{normalizeHolidayType(selectedHoliday.type)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Applicable Region:</span>
                  <span className="font-medium text-foreground">
                    {selectedHoliday.office && selectedHoliday.office !== "All Offices"
                      ? selectedHoliday.office
                      : "Company-wide / All Branches"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Recurring Status:</span>
                  <span className="font-medium text-foreground">
                    {selectedHoliday.recurring ? "Annual Recurring Holiday" : "One-Time Holiday"}
                  </span>
                </div>
              </div>

              {selectedHoliday.description && (
                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/40 text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground block mb-0.5">Description:</span>
                  {selectedHoliday.description}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="border-t border-border/50 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDetailsOpen(false)}
              className="text-xs border-border"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeHolidaysView;
