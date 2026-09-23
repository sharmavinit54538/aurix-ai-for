import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  CalendarDays,
  History,
  Info,
  Send,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Calendar,
  Sun,
  Moon,
  Zap,
  ArrowRight,
  Coffee,
  ShieldCheck,
  Building2,
  RefreshCw,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  attendanceApi,
  EmployeeShiftScheduleData,
  EmployeeShiftInfo,
  UpcomingShiftItem,
  ShiftHistoryItem,
} from "@/services/attendanceApi";

interface EmployeeShiftsViewProps {
  employeeId?: string;
}

export function EmployeeShiftsView({ employeeId }: EmployeeShiftsViewProps) {
  const [data, setData] = useState<EmployeeShiftScheduleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("today");

  // Details Modal
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedShiftForDetails, setSelectedShiftForDetails] = useState<EmployeeShiftInfo | null>(null);

  // Request Shift Change Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestedShift, setRequestedShift] = useState("Morning Shift");
  const [effectiveDate, setEffectiveDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [changeReason, setChangeReason] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const loadShiftData = async (showNotice = false) => {
    setLoading(true);
    setError(null);
    try {
      const schedule = await attendanceApi.getMyShiftSchedule(employeeId);
      setData(schedule);
      if (showNotice) {
        toast.success("Shift schedule refreshed from server");
      }
    } catch (err: any) {
      console.error("Failed to load shift schedule:", err);
      const msg = err?.message || "Unable to load your schedule. Please try again.";
      setError(msg);
      if (showNotice) toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShiftData();
  }, [employeeId]);

  const handleRequestChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeReason.trim()) {
      toast.error("Please provide a reason for the shift change request.");
      return;
    }

    setSubmittingRequest(true);
    try {
      const result = await attendanceApi.requestScheduleChange({
        type: "shift",
        requestedShift,
        effectiveDate,
        reason: changeReason.trim(),
      });
      toast.success(result.message || "Shift change request submitted successfully.");
      setRequestModalOpen(false);
      setChangeReason("");
    } catch (err: any) {
      console.error("Shift change request error:", err);
      toast.error(err?.message || "Failed to submit shift change request. Please try again.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const getShiftTypeBadge = (type: "Regular" | "Night" | "Flexible") => {
    switch (type) {
      case "Night":
        return (
          <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1 font-medium">
            <Moon className="h-3 w-3" /> Night
          </Badge>
        );
      case "Flexible":
        return (
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1 font-medium">
            <Zap className="h-3 w-3" /> Flexible
          </Badge>
        );
      default:
        return (
          <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 gap-1 font-medium">
            <Sun className="h-3 w-3" /> Regular
          </Badge>
        );
    }
  };

  // ── Loading State ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <div>
          <h3 className="text-base font-semibold text-foreground">Loading your shifts...</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Retrieving authenticated schedule and shift records from backend.
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
          onClick={() => loadShiftData(true)}
          className="mt-5 gap-2 border-border"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  // ── Empty State: No Shift Assigned ─────────────────────────
  if (!data || !data.hasAssignedShift || !data.currentShift) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
              My Shifts
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              View your assigned work timings, shift specifications, and schedule history.
            </p>
          </div>
        </div>

        {/* Empty State Banner */}
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="rounded-2xl bg-muted/40 p-4 mb-4 border border-border">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">No Shift Assigned</h2>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-md leading-relaxed">
            You currently do not have a working shift assigned to your employee profile.
            Your assigned schedule will appear here once configured by your manager or HR administrator.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/30 border border-border/50">
              <Building2 className="h-3.5 w-3.5" /> {data?.branch || "Company Headquarters"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/30 border border-border/50">
              <ShieldCheck className="h-3.5 w-3.5" /> Employee Self-Service
            </span>
          </div>
        </div>
      </div>
    );
  }

  const shift = data.currentShift;
  const today = data.todayShift;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">
              My Shifts
            </h1>
            {getShiftTypeBadge(shift.shiftType)}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your personal assigned schedule, daily work timings, and upcoming work calendar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedShiftForDetails(shift);
              setDetailsOpen(true);
            }}
            className="h-9 gap-1.5 border-border bg-card/60 hover:bg-accent/60"
          >
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Shift</span> Details
          </Button>

          <Button
            size="sm"
            onClick={() => setRequestModalOpen(true)}
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            Request Shift Change
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => loadShiftData(true)}
            className="h-9 w-9 border-border bg-card/60 hover:bg-accent/60"
            title="Refresh shift data"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* ── Primary Shift Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Assigned Shift */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Current Shift
            </span>
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-display text-foreground">
              {shift.shiftName}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <span>{shift.startTime} – {shift.endTime}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium text-foreground">{shift.shiftType}</span>
          </div>
        </div>

        {/* Working Hours */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Working Hours
            </span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-display text-foreground">
              {shift.totalWorkingHours} Hours / Day
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {shift.workingDays.join(", ")}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Weekly Target</span>
            <span className="font-medium text-foreground">{shift.totalWorkingHours * shift.workingDays.length}h / week</span>
          </div>
        </div>

        {/* Break Duration */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Break Window
            </span>
            <Coffee className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-display text-foreground">
              {shift.breakDuration}
            </div>
            <div className="text-xs text-muted-foreground mt-1 truncate" title={shift.breakWindow}>
              {shift.breakWindow}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Grace Period</span>
            <span className="font-medium text-foreground">{shift.gracePeriodMinutes} mins</span>
          </div>
        </div>

        {/* Night Differential Premium */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Shift Policy
            </span>
            <Moon className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-display text-foreground">
              {shift.nightPremiumPercent > 0 ? `+${shift.nightPremiumPercent}% Premium` : "Standard Policy"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {shift.shiftType === "Night" ? "Night Shift Allowance Applicable" : "Regular Business Hours"}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Shift Sections: Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card/60 border border-border p-1">
          <TabsTrigger value="today" className="gap-1.5 text-xs">
            <Sun className="h-3.5 w-3.5" /> Today's Shift
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1.5 text-xs">
            <CalendarDays className="h-3.5 w-3.5" /> Upcoming Shifts ({data.upcomingShifts.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-xs">
            <History className="h-3.5 w-3.5" /> Shift History ({data.shiftHistory.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Today's Shift ── */}
        <TabsContent value="today" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Schedule for Today
                  </span>
                  {today?.isOffDay && (
                    <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                      Scheduled Off Day / Holiday
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold font-display text-foreground mt-1">
                  {today?.day}, {today?.date}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {today?.isOffDay
                    ? "No regular work shift scheduled for today."
                    : `Assigned to ${shift.shiftName} (${shift.startTime} – ${shift.endTime}).`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedShiftForDetails(shift);
                    setDetailsOpen(true);
                  }}
                  className="gap-1.5 text-xs border-border"
                >
                  <Info className="h-3.5 w-3.5" /> View Timing Policy
                </Button>
              </div>
            </div>

            {/* Today's Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Core Shift Timing
                </span>
                <div className="text-lg font-bold text-foreground mt-1">
                  {shift.startTime} – {shift.endTime}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Break: {shift.breakWindow}
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Today's Punch Status
                </span>
                <div className="text-lg font-bold text-foreground mt-1 flex items-center gap-1.5">
                  {today?.checkedIn ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Checked In ({today.checkInTime})
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Not Punched Yet</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {today?.checkedOut ? `Checked Out: ${today.checkOutTime}` : "Active working day"}
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Shift Working Hours
                </span>
                <div className="text-lg font-bold text-foreground mt-1">
                  {shift.totalWorkingHours} Hours
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Net productive duration
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 2: Upcoming Shifts ── */}
        <TabsContent value="upcoming" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Upcoming Assigned Shifts
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upcoming planned working shifts for the next 14 business days.
                </p>
              </div>
              <Badge variant="outline" className="text-xs border-border">
                {data.upcomingShifts.length} Scheduled
              </Badge>
            </div>

            {data.upcomingShifts.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No upcoming shifts found in schedule.
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {data.upcomingShifts.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/15 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-2.5 text-center min-w-[54px] shrink-0">
                        <span className="text-[10px] font-semibold uppercase text-indigo-400 block">
                          {item.day.slice(0, 3)}
                        </span>
                        <span className="text-base font-bold text-foreground block leading-tight">
                          {item.date.split("-")[2]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {item.shiftName}
                          </span>
                          {getShiftTypeBadge(item.shiftType)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {item.startTime} – {item.endTime}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Coffee className="h-3 w-3" /> Break: {item.breakDuration}
                          </span>
                          <span>•</span>
                          <span>Working Hours: {item.workingHours}h</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                        Scheduled
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedShiftForDetails(shift);
                          setDetailsOpen(true);
                        }}
                        className="h-8 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Tab 3: Shift History ── */}
        <TabsContent value="history" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Shift Attendance History
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Logged shifts and verified check-in history from the backend database.
                </p>
              </div>
              <Badge variant="outline" className="text-xs border-border">
                {data.shiftHistory.length} Logged Entries
              </Badge>
            </div>

            {data.shiftHistory.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No past shift logs recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {data.shiftHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/15 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-muted/40 border border-border p-2.5 text-center min-w-[54px] shrink-0">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                          {item.day.slice(0, 3)}
                        </span>
                        <span className="text-base font-bold text-foreground block leading-tight">
                          {item.date.split("-")[2]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {item.shiftName}
                          </span>
                          <span className="text-xs text-muted-foreground">({item.date})</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                          <span>
                            Check-In: <span className="text-foreground font-medium">{item.checkInTime || "—"}</span>
                          </span>
                          <span>•</span>
                          <span>
                            Check-Out: <span className="text-foreground font-medium">{item.checkOutTime || "—"}</span>
                          </span>
                          <span>•</span>
                          <span>
                            Hours: <span className="text-foreground font-medium">{item.workingHours ? `${item.workingHours}h` : "—"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="self-end sm:self-center shrink-0">
                      <Badge
                        className={
                          item.status === "Present"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs"
                            : "bg-muted/40 text-muted-foreground border-border text-xs"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Modal 1: Shift Details (Read-Only) ── */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg border-border bg-card">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg font-bold font-display text-foreground">
                {selectedShiftForDetails?.shiftName || "Shift Details"}
              </DialogTitle>
              {selectedShiftForDetails && getShiftTypeBadge(selectedShiftForDetails.shiftType)}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Official shift timing specifications and company scheduling parameters.
            </DialogDescription>
          </DialogHeader>

          {selectedShiftForDetails && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Start Time</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {selectedShiftForDetails.startTime}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">End Time</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {selectedShiftForDetails.endTime}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Break Duration</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {selectedShiftForDetails.breakDuration}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Total Working Hours</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {selectedShiftForDetails.totalWorkingHours} Hours
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Designated Meal Break:</span>
                  <span className="font-medium text-foreground">{selectedShiftForDetails.breakWindow}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Grace Period Allowance:</span>
                  <span className="font-medium text-foreground">{selectedShiftForDetails.gracePeriodMinutes} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Night Shift Premium:</span>
                  <span className="font-medium text-foreground">
                    {selectedShiftForDetails.nightPremiumPercent > 0
                      ? `${selectedShiftForDetails.nightPremiumPercent}% Differential`
                      : "Standard"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Work Days:</span>
                  <span className="font-medium text-foreground">{selectedShiftForDetails.workingDays.join(", ")}</span>
                </div>
              </div>

              {selectedShiftForDetails.description && (
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-muted-foreground leading-relaxed">
                  {selectedShiftForDetails.description}
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

      {/* ── Modal 2: Request Shift Change ── */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-display text-foreground">
              Request Shift Change
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit a formal request to HR and your manager to modify your assigned work shift.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestChangeSubmit} className="space-y-4 py-2">
            <div>
              <Label className="text-xs text-muted-foreground">Current Shift</Label>
              <Input
                value={`${shift.shiftName} (${shift.startTime} – ${shift.endTime})`}
                disabled
                className="mt-1 bg-muted/40 text-xs border-border"
              />
            </div>

            <div>
              <Label htmlFor="requested-shift" className="text-xs text-foreground">
                Desired Shift
              </Label>
              <select
                id="requested-shift"
                value={requestedShift}
                onChange={(e) => setRequestedShift(e.target.value)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Morning Shift">Morning Shift (09:00 AM – 06:00 PM)</option>
                <option value="Evening Shift">Evening Shift (02:00 PM – 11:00 PM)</option>
                <option value="Night Shift">Night Shift (10:00 PM – 07:00 AM)</option>
                <option value="Flexible Shift">Flexible Shift (10:00 AM – 07:00 PM)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="effective-date" className="text-xs text-foreground">
                Requested Effective Date
              </Label>
              <Input
                id="effective-date"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="mt-1 text-xs border-border"
                required
              />
            </div>

            <div>
              <Label htmlFor="change-reason" className="text-xs text-foreground">
                Reason / Justification
              </Label>
              <Textarea
                id="change-reason"
                rows={3}
                placeholder="Please state the reason for requesting this shift adjustment..."
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
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
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

export default EmployeeShiftsView;
