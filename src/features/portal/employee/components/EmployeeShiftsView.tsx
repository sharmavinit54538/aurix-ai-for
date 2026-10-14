"use client";

import { useState, useMemo } from "react";
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
  ChevronDown,
  ChevronRight,
  X,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMyScheduleQuery, useShiftOptionsQuery, useCreateChangeRequest, useMyChangeRequestsQuery, useReviewChangeRequest } from "@/features/attendance/shifts/hooks/useShifts";
import { formatInstant, formatHHmmTo12h, weekdayShort } from "@/lib/datetime";

export function EmployeeShiftsView() {
  const [activeTab, setActiveTab] = useState<string>("today");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedShiftForDetails, setSelectedShiftForDetails] = useState<{
    shiftName: string;
    shiftType: string;
    startTime: string;
    endTime: string;
    breakDuration: string;
    breakWindow: string;
    totalWorkingHours: number;
    gracePeriodMinutes: number;
    nightPremiumPercent: number;
    workingDays: string[];
    description?: string;
  } | null>(null);

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestedShift, setRequestedShift] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [changeReason, setChangeReason] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Fetch data from real backend
  const { data: schedule, isLoading, isError, error, refetch } = useMyScheduleQuery();
  const { data: shiftOptions } = useShiftOptionsQuery();
  const { data: myRequests } = useMyChangeRequestsQuery();

  // Mutations
  const createChangeRequest = useCreateChangeRequest({
    onSuccess: () => {
      toast.success("Shift change request submitted successfully");
      setRequestModalOpen(false);
      setChangeReason("");
      refetch();
    },
    onError: (err) => {
      if (err?.response?.data?.detail?.code === "CHANGE_REQUEST_INVALID_STATE") {
        toast.error("You already have a pending shift change request");
      } else {
        toast.error(err.message || "Failed to submit shift change request");
      }
    },
  });

  const reviewMutation = useReviewChangeRequest({
    onSuccess: () => {
      toast.success("Request updated");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  // ── Loading State ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <div>
          <h3 className="text-base font-semibold text-foreground">Loading your shifts...</h3>
          <p className="text-xs text-muted-foreground mt-1">Retrieving authenticated schedule from backend.</p>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Unable to load your schedule</h3>
        <p className="text-xs text-muted-foreground mt-1.5 max-w-md">{error?.message || "Unknown error"}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-5 gap-2 border-border">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      </div>
    );
  }

  // ── Empty State: No Shift Assigned ─────────────────────────
  if (!schedule?.has_assigned_shift || !schedule?.current_shift) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">My Shifts</h1>
            <p className="text-xs text-muted-foreground mt-0.5">View your assigned work timings, shift specifications, and schedule history.</p>
          </div>
        </div>

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
              <Building2 className="h-3.5 w-3.5" /> {schedule?.employee?.branch || "Company Headquarters"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/30 border border-border/50">
              <ShieldCheck className="h-3.5 w-3.5" /> Employee Self-Service
            </span>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Timezone: <strong>{schedule?.timezone || "UTC"}</strong>
          </div>
        </div>
      </div>
    );
  }

  const shift = schedule!.current_shift;
  const today = schedule!.today;
  const upcoming = schedule!.upcoming;
  const history = schedule!.history;
  const timezone = schedule!.timezone;
  const employee = schedule!.employee;

  const getShiftTypeBadge = (type: string) => {
    const isNight = type === "Night" || shift.night_shift;
    const isOvernight = shift.is_overnight;
    if (isNight || isOvernight) {
      return (
        <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1 font-medium">
          <Moon className="h-3 w-3" /> Night
        </Badge>
      );
    }
    return (
      <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 gap-1 font-medium">
        <Sun className="h-3 w-3" /> Regular
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, string> = {
      Present: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      Late: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      "Half Day": "bg-blue-500/15 text-blue-400 border-blue-500/30",
      Absent: "bg-destructive/15 text-destructive border-destructive/30",
      "On Leave": "bg-blue-500/15 text-blue-400 border-blue-500/30",
      Off: "bg-muted/40 text-muted-foreground border-border",
      Holiday: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      "Auto Closed": "bg-muted/40 text-muted-foreground border-border",
    };
    return (
      <Badge variant="outline" className={configs[status] || "bg-muted/40 text-muted-foreground border-border text-xs"}>
        {status}
      </Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    const configs: Record<string, string> = {
      roster: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      assignment: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      company_default: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      fallback: "bg-destructive/15 text-destructive border-destructive/30",
    };
    return (
      <Badge variant="outline" className={configs[source] || "bg-muted/40 text-muted-foreground border-border text-[10px]"} asChild>
        {source.charAt(0).toUpperCase() + source.slice(1).replace("_", " ")}
      </Badge>
    );
  };

  const handleRequestChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeReason.trim()) {
      toast.error("Please provide a reason for the shift change request.");
      return;
    }
    if (!requestedShift) {
      toast.error("Please select a desired shift.");
      return;
    }

    setSubmittingRequest(true);
    try {
      await createChangeRequest.mutateAsync({
        requested_shift_id: requestedShift,
        effective_date: effectiveDate,
        reason: changeReason.trim(),
      });
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleCancelRequest = (requestId: string) => {
    reviewMutation.mutate({ id: requestId, action: "cancel" });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight font-display text-foreground">My Shifts</h1>
            {getShiftTypeBadge(shift.shiftType || "Regular")}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your personal assigned schedule, daily work timings, and upcoming work calendar.
            <span className="ml-2 text-muted-foreground/70">Times shown in {timezone}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedShiftForDetails({
                shiftName: shift.name,
                shiftType: shift.shiftType || "Regular",
                startTime: formatHHmmTo12h(shift.start_time),
                endTime: formatHHmmTo12h(shift.end_time),
                breakDuration: `${shift.break_duration_mins} min`,
                breakWindow: "Scheduled break",
                totalWorkingHours: Math.round((parseTimeToMinutes(shift.end_time) - parseTimeToMinutes(shift.start_time) + (shift.is_overnight ? 1440 : 0) - shift.break_duration_mins) / 60),
                gracePeriodMinutes: shift.grace_period_mins,
                nightPremiumPercent: shift.night_premium_percent,
                workingDays: shift.working_days,
                description: `Source: ${shift.source}`,
              });
              setDetailsOpen(true);
            }}
            className="h-9 gap-1.5 border-border bg-card/60 hover:bg-accent/60"
          >
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Shift</span> Details
          </Button>

          <Button size="sm" onClick={() => setRequestModalOpen(true)} className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            <Send className="h-3.5 w-3.5" /> Request Shift Change
          </Button>

          <Button variant="outline" size="icon" onClick={() => refetch()} className="h-9 w-9 border-border bg-card/60 hover:bg-accent/60" title="Refresh shift data">
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* ── Primary Shift Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Current Shift</span>
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-display text-foreground">{shift.name}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <span>{formatHHmmTo12h(shift.start_time)} – {formatHHmmTo12h(shift.end_time)}</span>
              {shift.is_overnight && <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/30">Overnight</Badge>}
              {getSourceBadge(shift.source)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium text-foreground">{shift.night_shift ? "Night" : shift.is_overnight ? "Overnight" : "Regular"}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Working Hours</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-display text-foreground">
              {Math.round((parseTimeToMinutes(shift.end_time) - parseTimeToMinutes(shift.start_time) + (shift.is_overnight ? 1440 : 0) - shift.break_duration_mins) / 60)} Hours / Day
            </div>
            <div className="text-xs text-muted-foreground mt-1">{shift.working_days.join(", ")}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Weekly Target</span>
            <span className="font-medium text-foreground">{Math.round((parseTimeToMinutes(shift.end_time) - parseTimeToMinutes(shift.start_time) + (shift.is_overnight ? 1440 : 0) - shift.break_duration_mins) / 60) * shift.working_days.length}h / week</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Break Window</span>
            <Coffee className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-display text-foreground">{shift.break_duration_mins} min</div>
            <div className="text-xs text-muted-foreground mt-1 truncate">Scheduled break</div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Grace Period</span>
            <span className="font-medium text-foreground">{shift.grace_period_mins} mins</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shift Policy</span>
            <Moon className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold font-display text-foreground">
              {shift.night_premium_percent > 0 ? `+${shift.night_premium_percent}% Premium` : "Standard Policy"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {shift.night_shift ? "Night Shift Allowance Applicable" : shift.is_overnight ? "Overnight shift" : "Regular Business Hours"}
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

      {/* ── Fallback Alert ── */}
      {shift.source === "fallback" && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="text-sm text-amber-500">
            <strong>No shift assigned — default schedule applied.</strong> Contact HR to get a proper shift assignment.
          </div>
        </div>
      )}

      {/* ── Shift Sections: Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card/60 border border-border p-1">
          <TabsTrigger value="today" className="gap-1.5 text-xs">
            <Sun className="h-3.5 w-3.5" /> Today's Shift
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1.5 text-xs">
            <CalendarDays className="h-3.5 w-3.5" /> Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-xs">
            <History className="h-3.5 w-3.5" /> History ({history.length})
          </TabsTrigger>
          {myRequests && myRequests.length > 0 && (
            <TabsTrigger value="requests" className="gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" /> My Requests ({myRequests.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* ── Tab 1: Today's Shift ── */}
        <TabsContent value="today" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Schedule for Today</span>
                  {today?.is_off && (
                    <Badge variant="outline" className="text-amber-400 border-amber-500/30">Scheduled Off Day</Badge>
                  )}
                  {today?.is_holiday && (
                    <Badge variant="outline" className="text-purple-400 border-purple-500/30">Holiday: {today.holiday_name}</Badge>
                  )}
                  {today?.source === "fallback" && (
                    <Badge variant="outline" className="text-destructive border-destructive/30">Fallback</Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold font-display text-foreground mt-1">{today?.day}, {today?.date}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {today?.is_off ? "No regular work shift scheduled for today." : `Assigned to ${shift.name} (${formatHHmmTo12h(shift.start_time)} – ${formatHHmmTo12h(shift.end_time)}).`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSelectedShiftForDetails({ shiftName: shift.name, shiftType: shift.shiftType || "Regular", startTime: formatHHmmTo12h(shift.start_time), endTime: formatHHmmTo12h(shift.end_time), breakDuration: `${shift.break_duration_mins} min`, breakWindow: "Scheduled break", totalWorkingHours: Math.round((parseTimeToMinutes(shift.end_time) - parseTimeToMinutes(shift.start_time) + (shift.is_overnight ? 1440 : 0) - shift.break_duration_mins) / 60), gracePeriodMinutes: shift.grace_period_mins, nightPremiumPercent: shift.night_premium_percent, workingDays: shift.working_days, description: `Source: ${shift.source}` }); setDetailsOpen(true); }} className="gap-1.5 text-xs border-border">
                  <Info className="h-3.5 w-3.5" /> View Timing Policy
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Core Shift Timing</span>
                <div className="text-lg font-bold text-foreground mt-1">{formatHHmmTo12h(shift.start_time)} – {formatHHmmTo12h(shift.end_time)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Break: {shift.break_duration_mins} min</div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Today's Punch Status</span>
                <div className="text-lg font-bold text-foreground mt-1 flex items-center gap-1.5">
                  {today?.checked_in ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Checked In {today.check_in_time && `(${formatInstant(today.check_in_time, timezone)})`}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Not Punched Yet</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {today?.checked_out ? `Checked Out: ${today.check_out_time && formatInstant(today.check_out_time, timezone)}` : "Active working day"}
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Shift Working Hours</span>
                <div className="text-lg font-bold text-foreground mt-1">
                  {Math.round((parseTimeToMinutes(shift.end_time) - parseTimeToMinutes(shift.start_time) + (shift.is_overnight ? 1440 : 0) - shift.break_duration_mins) / 60)} Hours
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Net productive duration</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 2: Upcoming Shifts ── */}
        <TabsContent value="upcoming" className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">Upcoming Assigned Shifts</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Upcoming planned working shifts.</p>
              </div>
              <Badge variant="outline" className="text-xs border-border">{upcoming.length} Scheduled</Badge>
            </div>

            {upcoming.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">No upcoming shifts found in schedule.</div>
            ) : (
              <div className="divide-y divide-border/40">
                {upcoming.map((item) => (
                  <div key={`upcoming-${item.date}`} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/15 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-2.5 text-center min-w-[54px] shrink-0">
                        <span className="text-[10px] font-semibold uppercase text-indigo-400 block">{weekdayShort(item.date)}</span>
                        <span className="text-base font-bold text-foreground block leading-tight">{item.date.split("-")[2]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{item.shift_name}</span>
                          {item.is_overnight && <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs">Overnight</Badge>}
                          {getSourceBadge(item.source)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {formatHHmmTo12h(item.start_time)} – {formatHHmmTo12h(item.end_time)}</span>
                          <span>•</span>
                          <span>Working Hours: {item.working_hours != null ? `${item.working_hours}h` : "—"}</span>
                          {item.is_off && <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-xs">Off Day</Badge>}
                          {item.is_holiday && <Badge variant="outline" className="text-purple-400 border-purple-500/30 text-xs">Holiday</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Scheduled</Badge>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedShiftForDetails({ shiftName: shift.name, shiftType: shift.shiftType || "Regular", startTime: formatHHmmTo12h(shift.start_time), endTime: formatHHmmTo12h(shift.end_time), breakDuration: `${shift.break_duration_mins} min`, breakWindow: "Scheduled break", totalWorkingHours: Math.round((parseTimeToMinutes(shift.end_time) - parseTimeToMinutes(shift.start_time) + (shift.is_overnight ? 1440 : 0) - shift.break_duration_mins) / 60), gracePeriodMinutes: shift.grace_period_mins, nightPremiumPercent: shift.night_premium_percent, workingDays: shift.working_days, description: `Source: ${shift.source}` }); setDetailsOpen(true); }} className="h-8 text-xs text-muted-foreground hover:text-foreground">Details</Button>
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
                <h3 className="font-display text-base font-semibold text-foreground">Shift Attendance History</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Logged shifts and verified check-in history from backend.</p>
              </div>
              <Badge variant="outline" className="text-xs border-border">{history.length} Entries</Badge>
            </div>

            {history.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">No past shift logs recorded yet.</div>
            ) : (
              <div className="divide-y divide-border/40">
                {history.map((item) => (
                  <div key={item.attendance_id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/15 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-muted/40 border border-border p-2.5 text-center min-w-[54px] shrink-0">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground block">{weekdayShort(item.date)}</span>
                        <span className="text-base font-bold text-foreground block leading-tight">{item.date.split("-")[2]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{item.shift_name}</span>
                          <span className="text-xs text-muted-foreground">({item.date})</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                          <span>Check-In: <span className="text-foreground font-medium">{item.check_in_time ? formatInstant(item.check_in_time, timezone) : "—"}</span></span>
                          <span>•</span>
                          <span>Check-Out: <span className="text-foreground font-medium">{item.check_out_time ? formatInstant(item.check_out_time, timezone) : "—"}</span></span>
                          <span>•</span>
                          <span>Hours: <span className="text-foreground font-medium">{item.working_hours ? `${item.working_hours}h` : "—"}</span></span>
                          {item.overtime_hours && item.overtime_hours > 0 && (
                            <>
                              <span>•</span>
                              <span>OT: <span className="text-primary font-medium">{item.overtime_hours}h</span></span>
                            </>
                          )}
                          {item.is_late && <span>• Late: <span className="text-amber-400 font-medium">{item.late_minutes}min</span></span>}
                          {item.is_early_checkout && <span>• Early: <span className="text-amber-400 font-medium">{item.early_minutes}min</span></span>}
                          {item.auto_closed && <Badge variant="outline" className="text-xs text-destructive border-destructive/30">Auto Closed</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="self-end sm:self-center shrink-0">{getStatusBadge(item.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Tab 4: My Requests ── */}
        {myRequests && myRequests.length > 0 && (
          <TabsContent value="requests" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border/50">
                <h3 className="font-display text-base font-semibold text-foreground">My Shift Change Requests</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Track the status of your submitted requests.</p>
              </div>
              <div className="divide-y divide-border/40">
                {myRequests.map((req) => (
                  <div key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/15 transition-colors">
                    <div className="flex items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{req.requested_shift_name}</span>
                          <Badge variant="outline" className={STATUS_BADGES[req.status] || "bg-muted/40 text-muted-foreground border-border text-xs"}>{req.status}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                          <span>Current: {req.current_shift_name || "—"}</span>
                          <span>•</span>
                          <span>Effective: {req.effective_date}</span>
                          <span>•</span>
                          <span>Submitted: {formatInstant(req.created_at, timezone)}</span>
                        </div>
                        {req.review_note && <div className="text-xs text-muted-foreground mt-1">Reviewer note: {req.review_note}</div>}
                      </div>
                    </div>
                    <div className="self-end sm:self-center shrink-0 flex items-center gap-2">
                      {req.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => handleCancelRequest(req.id)} className="h-8 text-xs text-destructive border-destructive/40 hover:bg-destructive/10" disabled={reviewMutation.isPending}>
                          <X className="h-3.5 w-3.5" /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* ── Modal 1: Shift Details (Read-Only) ── */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg border-border bg-card">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg font-bold font-display text-foreground">{selectedShiftForDetails?.shiftName || "Shift Details"}</DialogTitle>
              {selectedShiftForDetails && (
                <Badge variant="outline" className={selectedShiftForDetails.shiftType === "Night" ? "bg-purple-500/15 text-purple-400 border-purple-500/30" : "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"}>
                  {selectedShiftForDetails.shiftType}
                </Badge>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">Official shift timing specifications and company scheduling parameters.</DialogDescription>
          </DialogHeader>

          {selectedShiftForDetails && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50"><span className="text-muted-foreground block text-[11px]">Start Time</span><span className="text-sm font-semibold text-foreground mt-0.5 block">{selectedShiftForDetails.startTime}</span></div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50"><span className="text-muted-foreground block text-[11px]">End Time</span><span className="text-sm font-semibold text-foreground mt-0.5 block">{selectedShiftForDetails.endTime}</span></div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50"><span className="text-muted-foreground block text-[11px]">Break Duration</span><span className="text-sm font-semibold text-foreground mt-0.5 block">{selectedShiftForDetails.breakDuration}</span></div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50"><span className="text-muted-foreground block text-[11px]">Total Working Hours</span><span className="text-sm font-semibold text-foreground mt-0.5 block">{selectedShiftForDetails.totalWorkingHours} Hours</span></div>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50 space-y-2">
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Designated Meal Break:</span><span className="font-medium text-foreground">{selectedShiftForDetails.breakWindow}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Grace Period Allowance:</span><span className="font-medium text-foreground">{selectedShiftForDetails.gracePeriodMinutes} minutes</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Night Shift Premium:</span><span className="font-medium text-foreground">{selectedShiftForDetails.nightPremiumPercent > 0 ? `${selectedShiftForDetails.nightPremiumPercent}% Differential` : "Standard"}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Active Work Days:</span><span className="font-medium text-foreground">{selectedShiftForDetails.workingDays.join(", ")}</span></div>
              </div>

              {selectedShiftForDetails.description && (
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-muted-foreground leading-relaxed">{selectedShiftForDetails.description}</div>
              )}
            </div>
          )}

          <DialogFooter className="border-t border-border/50 pt-3">
            <Button variant="outline" size="sm" onClick={() => setDetailsOpen(false)} className="text-xs border-border">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal 2: Request Shift Change ── */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-display text-foreground">Request Shift Change</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Submit a formal request to HR and your manager to modify your assigned work shift.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestChangeSubmit} className="space-y-4 py-2">
            <div>
              <Label className="text-xs text-muted-foreground">Current Shift</Label>
              <Input value={`${shift.name} (${formatHHmmTo12h(shift.start_time)} – ${formatHHmmTo12h(shift.end_time)})`} disabled className="mt-1 bg-muted/40 text-xs border-border" />
            </div>

            <div>
              <Label htmlFor="requested-shift" className="text-xs text-foreground">Desired Shift</Label>
              <Select value={requestedShift} onValueChange={setRequestedShift}>
                <SelectTrigger id="requested-shift" className="w-full">
                  <SelectValue placeholder="Select desired shift" />
                </SelectTrigger>
                <SelectContent>
                  {shiftOptions?.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name} ({formatHHmmTo12h(opt.start_time)} – {formatHHmmTo12h(opt.end_time)}) {opt.is_overnight ? "(Overnight)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="effective-date" className="text-xs text-foreground">Requested Effective Date</Label>
              <Input id="effective-date" type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="mt-1 text-xs border-border" required min={new Date().toISOString().split("T")[0]} />
            </div>

            <div>
              <Label htmlFor="change-reason" className="text-xs text-foreground">Reason / Justification</Label>
              <Textarea id="change-reason" rows={3} placeholder="Please state the reason for requesting this shift adjustment..." value={changeReason} onChange={(e) => setChangeReason(e.target.value)} className="mt-1 text-xs border-border" required />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">{changeReason.length}/500 characters</p>
            </div>

            <DialogFooter className="border-t border-border/50 pt-3 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRequestModalOpen(false)} className="text-xs border-border" disabled={submittingRequest}>Cancel</Button>
              <Button type="submit" size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" disabled={submittingRequest}>
                {submittingRequest ? (<><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Submitting...</>) : (<><Send className="h-3.5 w-3.5 mr-1.5" /> Submit Request</>)}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const STATUS_BADGES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  cancelled: "bg-muted/40 text-muted-foreground border-border",
};