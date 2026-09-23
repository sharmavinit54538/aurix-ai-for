import { useState, useEffect, useMemo } from "react";
import {
  ScrollText,
  CalendarDays,
  List,
  Calendar as CalendarIcon,
  Clock,
  Send,
  Info,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Coffee,
  Palmtree,
  Moon,
  Sun,
  ShieldCheck,
  Building2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  attendanceApi,
  RosterDayItem,
  ScheduleChangeRequestPayload,
} from "@/services/attendanceApi";

interface EmployeeRostersViewProps {
  employeeId?: string;
}

type FilterScope = "month" | "today" | "week" | "upcoming" | "history";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function EmployeeRostersView({ employeeId }: EmployeeRostersViewProps) {
  const [entries, setEntries] = useState<RosterDayItem[]>([]);
  const [hasRoster, setHasRoster] = useState<boolean>(false);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [shiftName, setShiftName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calendar navigation state
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-indexed

  // View state
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filterScope, setFilterScope] = useState<FilterScope>("month");

  // Details Modal
  const [selectedEntry, setSelectedEntry] = useState<RosterDayItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Request Change Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestedShift, setRequestedShift] = useState("Morning Shift");
  const [effectiveDate, setEffectiveDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [changeReason, setChangeReason] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const loadRoster = async (showNotice = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceApi.getMyRoster(selectedMonth, selectedYear, employeeId);
      setEntries(data.entries);
      setHasRoster(data.hasRoster);
      setEmployeeName(data.employeeName);
      setShiftName(data.shiftName);
      if (showNotice) {
        toast.success("Roster refreshed from server");
      }
    } catch (err: any) {
      console.error("Failed to load roster:", err);
      const msg = err?.message || "Unable to load your schedule. Please try again.";
      setError(msg);
      if (showNotice) toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoster();
  }, [selectedMonth, selectedYear, employeeId]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleRequestChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeReason.trim()) {
      toast.error("Please provide a reason for the roster schedule adjustment.");
      return;
    }

    setSubmittingRequest(true);
    try {
      const result = await attendanceApi.requestScheduleChange({
        type: "roster",
        requestedShift,
        effectiveDate,
        reason: changeReason.trim(),
      });
      toast.success(result.message || "Roster schedule change request submitted successfully.");
      setRequestModalOpen(false);
      setChangeReason("");
    } catch (err: any) {
      console.error("Roster request error:", err);
      toast.error(err?.message || "Failed to submit roster change request. Please try again.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Filter entries based on scope
  const filteredEntries = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date();

    if (filterScope === "today") {
      return entries.filter((e) => e.date === todayStr);
    }

    if (filterScope === "week") {
      const currentDay = now.getDay();
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(now);
      monday.setDate(now.getDate() + distanceToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const monStr = monday.toISOString().split("T")[0];
      const sunStr = sunday.toISOString().split("T")[0];

      return entries.filter((e) => e.date >= monStr && e.date <= sunStr);
    }

    if (filterScope === "upcoming") {
      return entries.filter((e) => e.date >= todayStr);
    }

    if (filterScope === "history") {
      return entries.filter((e) => e.date < todayStr);
    }

    // Default: this entire month
    return entries;
  }, [entries, filterScope]);

  // Build calendar matrix (padded with blank days)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    // Sunday is 0, convert Monday to 0
    let startDayIndex = firstDay.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6;

    const daysCount = new Date(selectedYear, selectedMonth, 0).getDate();
    const cells: (RosterDayItem | null)[] = [];

    // Leading empty slots
    for (let i = 0; i < startDayIndex; i++) {
      cells.push(null);
    }

    // Actual month days
    for (let day = 1; day <= daysCount; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const entry = entries.find((e) => e.date === dateStr);
      if (entry) {
        cells.push(entry);
      } else {
        const dObj = new Date(selectedYear, selectedMonth - 1, day);
        cells.push({
          id: `empty-${dateStr}`,
          date: dateStr,
          day: dObj.toLocaleDateString("en-US", { weekday: "long" }),
          shiftName: "—",
          startTime: "—",
          endTime: "—",
          workingHours: 0,
          status: "Weekly Off",
        });
      }
    }

    return cells;
  }, [entries, selectedMonth, selectedYear]);

  const getStatusBadge = (status: RosterDayItem["status"]) => {
    switch (status) {
      case "Working":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 gap-1 font-medium text-[11px]">
            <Clock className="h-3 w-3" /> Working
          </Badge>
        );
      case "Weekly Off":
        return (
          <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 gap-1 font-medium text-[11px]">
            <Coffee className="h-3 w-3" /> Weekly Off
          </Badge>
        );
      case "Holiday":
        return (
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1 font-medium text-[11px]">
            <Palmtree className="h-3 w-3" /> Holiday
          </Badge>
        );
      case "Leave":
        return (
          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 gap-1 font-medium text-[11px]">
            <CalendarDays className="h-3 w-3" /> Leave
          </Badge>
        );
      case "Rest Day":
        return (
          <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1 font-medium text-[11px]">
            <Moon className="h-3 w-3" /> Rest Day
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px]">
            {status}
          </Badge>
        );
    }
  };

  // ── Loading State ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <div>
          <h3 className="text-base font-semibold text-foreground">Loading your roster...</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Retrieving planned schedule and duty assignments from backend.
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
          onClick={() => loadRoster(true)}
          className="mt-5 gap-2 border-border"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  // ── Empty State: No Roster Available ───────────────────────
  if (!hasRoster || entries.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
              My Roster
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your personal planned work schedule and shift assignment calendar.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="rounded-2xl bg-muted/40 p-4 mb-4 border border-border">
            <ScrollText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">No Roster Available</h2>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-md leading-relaxed">
            Your work schedule will appear here once it is assigned.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/30 border border-border/50">
              <ShieldCheck className="h-3.5 w-3.5" /> Employee Self-Service
            </span>
          </div>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
              My Roster
            </h1>
            <Badge variant="outline" className="text-xs border-border bg-card/40">
              {shiftName}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your personal planned work schedule, scheduled working days, and rest days.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setRequestModalOpen(true)}
            className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            Request Schedule Change
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => loadRoster(true)}
            className="h-9 w-9 border-border bg-card/60 hover:bg-accent/60"
            title="Refresh roster"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* ── Filter Controls & Navigation Bar ── */}
      <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className="h-8 w-8 border-border bg-card"
              title="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="h-8 w-8 border-border bg-card"
              title="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-base font-bold font-display text-foreground min-w-[150px]">
            {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </span>
        </div>

        {/* Filter Scope Tabs */}
        <Tabs value={filterScope} onValueChange={(v) => setFilterScope(v as FilterScope)} className="w-auto">
          <TabsList className="bg-muted/40 border border-border/60 p-1">
            <TabsTrigger value="month" className="text-xs">
              This Month
            </TabsTrigger>
            <TabsTrigger value="today" className="text-xs">
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs">
              This Week
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              History
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* View Switcher (Calendar vs List) */}
        <div className="flex items-center border border-border rounded-xl p-1 bg-muted/40 self-start md:self-auto">
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            className={`h-7 px-3 text-xs gap-1.5 ${
              viewMode === "calendar" ? "bg-emerald-600 text-white shadow-xs" : "text-muted-foreground"
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" /> Calendar
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={`h-7 px-3 text-xs gap-1.5 ${
              viewMode === "list" ? "bg-emerald-600 text-white shadow-xs" : "text-muted-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" /> List
          </Button>
        </div>
      </div>

      {/* ── View 1: Calendar View ── */}
      {viewMode === "calendar" && (
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden p-5">
          {/* Calendar Weekday Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="text-xs font-bold text-muted-foreground py-2 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((entry, idx) => {
              if (!entry) {
                return (
                  <div
                    key={`blank-${idx}`}
                    className="min-h-[105px] rounded-xl border border-transparent bg-muted/5 p-2.5 opacity-30 pointer-events-none"
                  />
                );
              }

              const isToday = entry.date === todayStr;
              const isWorking = entry.status === "Working";
              const isHoliday = entry.status === "Holiday";
              const isOff = entry.status === "Weekly Off";

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    setSelectedEntry(entry);
                    setDetailsOpen(true);
                  }}
                  className={`min-h-[105px] rounded-xl p-2.5 border transition-all cursor-pointer flex flex-col justify-between group ${
                    isToday
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                      : isWorking
                      ? "border-border/60 bg-card hover:border-emerald-500/40 hover:bg-accent/40"
                      : isHoliday
                      ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50"
                      : "border-border/40 bg-muted/10 hover:border-border/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? "rounded-full bg-emerald-500 text-white h-5 w-5 flex items-center justify-center text-[10px]"
                          : "text-foreground"
                      }`}
                    >
                      {entry.date.split("-")[2]}
                    </span>
                    <span className="text-[10px] text-muted-foreground hidden sm:inline">
                      {entry.day.slice(0, 3)}
                    </span>
                  </div>

                  <div className="my-1">
                    <div className="text-xs font-semibold text-foreground truncate" title={entry.shiftName}>
                      {entry.shiftName}
                    </div>
                    {isWorking && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {entry.startTime} – {entry.endTime}
                      </div>
                    )}
                    {isHoliday && (
                      <div className="text-[10px] text-amber-400 truncate mt-0.5">
                        Public Holiday
                      </div>
                    )}
                  </div>

                  <div className="pt-1">
                    {getStatusBadge(entry.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── View 2: List View ── */}
      {viewMode === "list" && (
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border/50 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">
                Roster Entries ({filteredEntries.length})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Detailed day-by-day roster table for the selected scope.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </span>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              No roster entries matching the selected filter scope.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {filteredEntries.map((item) => {
                const isToday = item.date === todayStr;
                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isToday ? "bg-emerald-500/5 border-l-2 border-l-emerald-500" : "hover:bg-muted/15"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-muted/40 border border-border p-2.5 text-center min-w-[58px] shrink-0">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                          {item.day.slice(0, 3)}
                        </span>
                        <span className="text-base font-bold text-foreground block leading-tight">
                          {item.date.split("-")[2]}
                        </span>
                        <span className="text-[9px] text-muted-foreground block">
                          {MONTH_NAMES[selectedMonth - 1].slice(0, 3)}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {item.shiftName}
                          </span>
                          {isToday && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                              Today
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                          {item.status === "Working" ? (
                            <>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {item.startTime} – {item.endTime}
                              </span>
                              <span>•</span>
                              <span>Working Hours: {item.workingHours}h</span>
                            </>
                          ) : item.status === "Holiday" ? (
                            <span className="text-amber-400 flex items-center gap-1">
                              <Palmtree className="h-3 w-3" /> Company / National Holiday
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Scheduled Off Day
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {getStatusBadge(item.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEntry(item);
                          setDetailsOpen(true);
                        }}
                        className="h-8 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Modal 1: Roster Entry Details (Read-Only) ── */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold font-display text-foreground">
                Roster Details
              </DialogTitle>
              {selectedEntry && getStatusBadge(selectedEntry.status)}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Planned schedule details for {selectedEntry?.day}, {selectedEntry?.date}.
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assigned Employee:</span>
                  <span className="font-semibold text-foreground">{employeeName || "Current Employee"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium text-foreground">{selectedEntry.date} ({selectedEntry.day})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shift:</span>
                  <span className="font-medium text-foreground">{selectedEntry.shiftName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Schedule Timing:</span>
                  <span className="font-medium text-foreground">
                    {selectedEntry.startTime} – {selectedEntry.endTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Productive Hours:</span>
                  <span className="font-medium text-foreground">{selectedEntry.workingHours} Hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Schedule Status:</span>
                  <span className="font-medium text-foreground">{selectedEntry.status}</span>
                </div>
              </div>

              {selectedEntry.notes && (
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-muted-foreground">
                  <span className="font-semibold text-foreground block mb-0.5">Notes:</span>
                  {selectedEntry.notes}
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

      {/* ── Modal 2: Request Roster / Shift Change ── */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-display text-foreground">
              Request Schedule Change
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit a formal request to your supervisor to modify your planned roster schedule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestChangeSubmit} className="space-y-4 py-2">
            <div>
              <Label htmlFor="req-shift" className="text-xs text-foreground">
                Desired Shift / Roster Assignment
              </Label>
              <select
                id="req-shift"
                value={requestedShift}
                onChange={(e) => setRequestedShift(e.target.value)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Morning Shift">Morning Shift (09:00 AM – 06:00 PM)</option>
                <option value="Evening Shift">Evening Shift (02:00 PM – 11:00 PM)</option>
                <option value="Night Shift">Night Shift (10:00 PM – 07:00 AM)</option>
                <option value="Flexible Shift">Flexible Shift (10:00 AM – 07:00 PM)</option>
                <option value="Off Day Swap">Rest Day / Off Day Swap</option>
              </select>
            </div>

            <div>
              <Label htmlFor="roster-effective-date" className="text-xs text-foreground">
                Requested Effective Date
              </Label>
              <Input
                id="roster-effective-date"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="mt-1 text-xs border-border"
                required
              />
            </div>

            <div>
              <Label htmlFor="roster-change-reason" className="text-xs text-foreground">
                Reason / Justification
              </Label>
              <Textarea
                id="roster-change-reason"
                rows={3}
                placeholder="Describe your request and the reason for the schedule adjustment..."
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                className="mt-1 text-xs border-border"
                required
              />
            </div>

            <DialogFooter className="border-t border-border/50 pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRequestModalOpen(false)}
                className="text-xs border-border"
                disabled={submittingRequest}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={submittingRequest}
              >
                {submittingRequest ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1.5" /> Submit Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeRostersView;
