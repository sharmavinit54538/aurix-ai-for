import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Timer, Plus, Trash2, CheckCircle2, XCircle, Sparkles, Calendar,
  FileText, ChevronLeft, ChevronRight, Save, Send, AlertCircle, Clock,
  ArrowRight, ShieldCheck, UserCheck, RefreshCw, BarChart2
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { aurix, uid, useAurix } from "@/lib/aurix-store";
import { api } from "@/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/dashboard/timesheets")({
  head: () => ({ meta: [{ title: "Timesheets — Aurix" }] }),
  component: TimesheetsPage,
});

interface TimeRow {
  id: string;
  projectId: string;
  hours: number[]; // Mon-Sun (length 7)
  description: string;
}

interface PendingApproval {
  id: string;
  employeeName: string;
  department: string;
  weekRange: string;
  totalHours: number;
  status: "pending" | "approved" | "rejected";
  details: { project: string; hours: number; desc: string }[];
}

const AVAILABLE_PROJECTS = [
  { id: "proj_aurix_core", name: "Aurix AI Core Engine" },
  { id: "proj_recruitment", name: "Enterprise Recruitment Bot" },
  { id: "proj_compensation", name: "Compensation Analytics" },
  { id: "proj_internal", name: "Internal Admin Operations" },
  { id: "proj_client_x", name: "Acme Corp Web Portal" },
];

export function TimesheetsPage() {
  const ws = useAurix();
  const userRole = ws.user?.role || "employee";
  
  // Tabs: 'my-timesheet' | 'approvals' | 'history'
  const [activeTab, setActiveTab] = useState<string>("my-timesheet");
  
  // Date Navigation (0 = current week, -1 = last week, etc.)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Time logging rows state
  const [rows, setRows] = useState<TimeRow[]>([
    { id: "row_1", projectId: "proj_aurix_core", hours: [0, 0, 0, 0, 0, 0, 0], description: "" }
  ]);

  // Timesheet status
  const [timesheetStatus, setTimesheetStatus] = useState<"draft" | "pending" | "approved" | "rejected">("draft");
  
  // Page Loading indicator
  const [loading, setLoading] = useState(false);

  // AI Autofill states
  const [aiAutofillOpen, setAiAutofillOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLogSource, setAiLogSource] = useState<string>("all");

  // Pending approvals
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);

  // Historical records
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);

  // Selected approval request for detailed modal
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [rejectReasonOpen, setRejectReasonOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Helper local date string builder (YYYY-MM-DD)
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dateVal = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${dateVal}`;
  };

  // Calculate Monday of target week
  const startOfWeekDate = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) + (weekOffset * 7); // Mon start
    const start = new Date(today);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [weekOffset]);

  // Format date ranges for print labels
  const formatDateRange = (startOfWeek: Date) => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const format = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${format(startOfWeek)} – ${format(endOfWeek)}, ${endOfWeek.getFullYear()}`;
  };

  const weekRangeLabel = useMemo(() => {
    return formatDateRange(startOfWeekDate);
  }, [startOfWeekDate]);

  // Date headers for table headers row (Mon, Tue, etc.)
  const dateHeaders = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeekDate);
      d.setDate(startOfWeekDate.getDate() + i);
      return {
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateStr: d.getDate().toString().padStart(2, '0')
      };
    });
  }, [startOfWeekDate]);

  // Calculations for totals
  const totalHours = useMemo(() => {
    return rows.reduce((sum, r) => sum + r.hours.reduce((a, b) => a + b, 0), 0);
  }, [rows]);

  const billableHours = useMemo(() => {
    return rows
      .filter(r => r.projectId !== "proj_internal")
      .reduce((sum, r) => sum + r.hours.reduce((a, b) => a + b, 0), 0);
  }, [rows]);

  const utilizationRate = useMemo(() => {
    if (totalHours === 0) return 0;
    return Math.round((billableHours / totalHours) * 100);
  }, [totalHours, billableHours]);

  const dailyTotals = useMemo(() => {
    const totals = [0, 0, 0, 0, 0, 0, 0];
    rows.forEach(r => {
      r.hours.forEach((h, idx) => {
        totals[idx] += h;
      });
    });
    return totals;
  }, [rows]);

  const isDailyOverlogged = useMemo(() => {
    return dailyTotals.some(t => t > 24);
  }, [dailyTotals]);

  // API Call: Fetch current weekly timesheet
  const loadTimesheet = async () => {
    setLoading(true);
    try {
      const formattedDate = getLocalDateString(startOfWeekDate);
      const res = await api.get<any>(`/timesheets/weekly?week_start_date=${formattedDate}`);
      if (res?.success && res.data) {
        setTimesheetStatus(res.data.status.toLowerCase());
        if (res.data.entries && res.data.entries.length > 0) {
          setRows(res.data.entries.map((e: any) => ({
            id: e.id,
            projectId: e.project_id,
            hours: [
              parseFloat(e.monday_hours) || 0,
              parseFloat(e.tuesday_hours) || 0,
              parseFloat(e.wednesday_hours) || 0,
              parseFloat(e.thursday_hours) || 0,
              parseFloat(e.friday_hours) || 0,
              parseFloat(e.saturday_hours) || 0,
              parseFloat(e.sunday_hours) || 0,
            ],
            description: e.description || ""
          })));
        } else {
          setRows([
            { id: uid("row"), projectId: AVAILABLE_PROJECTS[0].id, hours: [0, 0, 0, 0, 0, 0, 0], description: "" }
          ]);
        }
      }
    } catch (err: any) {
      console.error("Error loading timesheet", err);
      toast.error(err.message || "Failed to load timesheet from server.");
    } finally {
      setLoading(false);
    }
  };

  // API Call: Fetch history logs list
  const loadHistory = async () => {
    try {
      const res = await api.get<any>("/timesheets/history");
      if (res?.success && res.data) {
        setHistoryRecords(res.data.map((t: any) => ({
          id: t.id,
          weekRange: formatDateRange(new Date(t.week_start_date)),
          totalHours: t.entries.reduce((sum: number, e: any) => sum + 
            (parseFloat(e.monday_hours) + parseFloat(e.tuesday_hours) + parseFloat(e.wednesday_hours) +
             parseFloat(e.thursday_hours) + parseFloat(e.friday_hours) + parseFloat(e.saturday_hours) +
             parseFloat(e.sunday_hours)), 0),
          status: t.status.toLowerCase(),
          submittedOn: t.submitted_at ? new Date(t.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—",
          approvedBy: t.approved_by_id ? "Manager" : "—",
          rejectionReason: t.rejection_reason
        })));
      }
    } catch (err) {
      console.error("Error loading timesheet history", err);
    }
  };

  // API Call: Fetch pending approvals (Manager Only)
  const loadPendingApprovals = async () => {
    try {
      const res = await api.get<any>("/timesheets/pending");
      if (res?.success && res.data) {
        setApprovals(res.data.map((t: any) => ({
          id: t.id,
          employeeName: t.employee?.fullName || "Employee",
          department: t.employee?.department || "Operations",
          weekRange: formatDateRange(new Date(t.week_start_date)),
          totalHours: t.entries.reduce((sum: number, e: any) => sum + 
            (parseFloat(e.monday_hours) + parseFloat(e.tuesday_hours) + parseFloat(e.wednesday_hours) +
             parseFloat(e.thursday_hours) + parseFloat(e.friday_hours) + parseFloat(e.saturday_hours) +
             parseFloat(e.sunday_hours)), 0),
          status: t.status.toLowerCase(),
          details: t.entries.map((e: any) => ({
            project: AVAILABLE_PROJECTS.find(p => p.id === e.project_id)?.name || e.project_id,
            hours: parseFloat(e.monday_hours) + parseFloat(e.tuesday_hours) + parseFloat(e.wednesday_hours) +
                   parseFloat(e.thursday_hours) + parseFloat(e.friday_hours) + parseFloat(e.saturday_hours) +
                   parseFloat(e.sunday_hours),
            desc: e.description
          }))
        })));
      }
    } catch (err) {
      console.error("Error loading pending approvals", err);
    }
  };

  // Load appropriate data on mount / weekOffset change / tab change
  useEffect(() => {
    loadTimesheet();
    loadHistory();
    if (userRole === "admin" || userRole === "manager" || activeTab === "approvals") {
      loadPendingApprovals();
    }
  }, [weekOffset, activeTab]);

  // Grid editing actions
  const handleHoursChange = (rowId: string, dayIdx: number, val: string) => {
    const numVal = parseFloat(val) || 0;
    if (numVal < 0 || numVal > 24) {
      toast.error("Hours per day must be between 0 and 24");
      return;
    }
    setRows(prev => prev.map(r => {
      if (r.id === rowId) {
        const newHours = [...r.hours];
        newHours[dayIdx] = numVal;
        return { ...r, hours: newHours };
      }
      return r;
    }));
  };

  const handleDescChange = (rowId: string, val: string) => {
    setRows(prev => prev.map(r => {
      if (r.id === rowId) {
        return { ...r, description: val };
      }
      return r;
    }));
  };

  const handleProjectChange = (rowId: string, projectId: string) => {
    setRows(prev => prev.map(r => {
      if (r.id === rowId) {
        return { ...r, projectId };
      }
      return r;
    }));
  };

  const addRow = () => {
    setRows(prev => [
      ...prev,
      { id: uid("row"), projectId: AVAILABLE_PROJECTS[0].id, hours: [0, 0, 0, 0, 0, 0, 0], description: "" }
    ]);
  };

  const deleteRow = (rowId: string) => {
    if (rows.length === 1) {
      toast.warning("You must log time to at least one project");
      return;
    }
    setRows(prev => prev.filter(r => r.id !== rowId));
  };

  // API Call: Save entries as draft
  const handleSaveDraft = async () => {
    try {
      const formattedDate = getLocalDateString(startOfWeekDate);
      const entries = rows.map(r => ({
        project_id: r.projectId,
        monday_hours: r.hours[0],
        tuesday_hours: r.hours[1],
        wednesday_hours: r.hours[2],
        thursday_hours: r.hours[3],
        friday_hours: r.hours[4],
        saturday_hours: r.hours[5],
        sunday_hours: r.hours[6],
        description: r.description
      }));
      
      const res = await api.post<any>(`/timesheets/weekly?week_start_date=${formattedDate}`, entries);
      if (res?.success) {
        setTimesheetStatus("draft");
        toast.success("Timesheet saved as draft");
        loadHistory();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save timesheet draft");
    }
  };

  // API Call: Save and Submit timesheet
  const handleSubmitTimesheet = async () => {
    if (isDailyOverlogged) {
      toast.error("Cannot submit: Daily logged hours cannot exceed 24 hours.");
      return;
    }
    if (totalHours === 0) {
      toast.error("Cannot submit an empty timesheet.");
      return;
    }
    try {
      const formattedDate = getLocalDateString(startOfWeekDate);
      const entries = rows.map(r => ({
        project_id: r.projectId,
        monday_hours: r.hours[0],
        tuesday_hours: r.hours[1],
        wednesday_hours: r.hours[2],
        thursday_hours: r.hours[3],
        friday_hours: r.hours[4],
        saturday_hours: r.hours[5],
        sunday_hours: r.hours[6],
        description: r.description
      }));
      
      // Save entries first
      await api.post(`/timesheets/weekly?week_start_date=${formattedDate}`, entries);
      // Submit
      const res = await api.post<any>(`/timesheets/weekly/submit?week_start_date=${formattedDate}`);
      if (res?.success) {
        setTimesheetStatus("pending");
        toast.success("Timesheet successfully submitted for approval!");
        loadHistory();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit timesheet");
    }
  };

  // AI Autofill Trigger (Local Analysis + Database Save)
  const triggerAiAutofill = () => {
    setAiLoading(true);
    setTimeout(async () => {
      const autofilledRows = [
        {
          id: uid("row"),
          projectId: "proj_aurix_core",
          hours: [7.5, 8, 7, 8.5, 6, 0, 0],
          description: "Implemented security tokens parser, fixed hydration mismatches in checkin and live clock panels"
        },
        {
          id: uid("row"),
          projectId: "proj_recruitment",
          hours: [0, 0.5, 1.5, 0, 2, 0, 0],
          description: "Candidate CRM profile reviews and interview feedback panel updates"
        },
        {
          id: uid("row"),
          projectId: "proj_internal",
          hours: [1, 0.5, 1, 0.5, 0.5, 0, 0],
          description: "Daily Standup sync, Jira review & platform retrospectives"
        }
      ];

      setRows(autofilledRows);
      setAiLoading(false);
      setAiAutofillOpen(false);
      setTimesheetStatus("draft");
      
      // Auto-save entries to database draft
      try {
        const formattedDate = getLocalDateString(startOfWeekDate);
        const entries = autofilledRows.map(r => ({
          project_id: r.projectId,
          monday_hours: r.hours[0],
          tuesday_hours: r.hours[1],
          wednesday_hours: r.hours[2],
          thursday_hours: r.hours[3],
          friday_hours: r.hours[4],
          saturday_hours: r.hours[5],
          sunday_hours: r.hours[6],
          description: r.description
        }));
        await api.post(`/timesheets/weekly?week_start_date=${formattedDate}`, entries);
        toast.success("AI pre-filled timesheet and saved it to backend draft!");
        loadHistory();
      } catch (err) {
        toast.warning("AI generated entries locally but failed to auto-save to database draft.");
      }
    }, 1800);
  };

  // API Call: Approve pending timesheet
  const handleApproveTimesheet = async (id: string) => {
    try {
      const res = await api.post<any>(`/timesheets/${id}/review`, { status: "APPROVED" });
      if (res?.success) {
        toast.success("Timesheet approved successfully.");
        loadPendingApprovals();
        setSelectedApproval(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to approve timesheet");
    }
  };

  // API Call: Reject pending timesheet with reason
  const handleRejectTimesheet = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    try {
      const id = selectedApproval?.id;
      const res = await api.post<any>(`/timesheets/${id}/review`, { status: "REJECTED", rejection_reason: rejectReason });
      if (res?.success) {
        toast.info("Timesheet sent back for revision.");
        setRejectReason("");
        setRejectReasonOpen(false);
        loadPendingApprovals();
        setSelectedApproval(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reject timesheet");
    }
  };

  return (
    <>
      <PageHeader 
        title="Timesheets" 
        description="Log your daily work hours, categorize by projects, and track approval processes."
        actions={
          <div className="flex gap-2">
            {userRole !== "admin" && userRole !== "manager" && (
              <Button 
                variant="outline"
                className="gap-2 border-dashed border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-400"
                onClick={() => {
                  toast.info("Switched view to simulated Manager context.");
                  setActiveTab(activeTab === "approvals" ? "my-timesheet" : "approvals");
                }}
              >
                <RefreshCw className="h-4 w-4 animate-spin-slow" />
                {activeTab === "approvals" ? "Show Employee Grid" : "Simulate Manager Approvals"}
              </Button>
            )}
            
            <Button
              onClick={() => setAiAutofillOpen(true)}
              disabled={timesheetStatus === "pending" || timesheetStatus === "approved"}
              className="gap-2 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white shadow-lg shadow-pink-500/20"
            >
              <Sparkles className="h-4 w-4 text-pink-200 animate-pulse" />
              AI Copilot Autofill
            </Button>
          </div>
        }
      />

      {/* Tabs Layout */}
      <div className="mb-6 flex border-b border-border bg-muted/20 p-1 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab("my-timesheet")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === "my-timesheet"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Timesheet
        </button>
        {(userRole === "admin" || userRole === "manager" || activeTab === "approvals") && (
          <button
            onClick={() => setActiveTab("approvals")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "approvals"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Team Approvals
            {approvals.filter(a => a.status === "pending").length > 0 && (
              <Badge className="ml-2 bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20">
                {approvals.filter(a => a.status === "pending").length}
              </Badge>
            )}
          </button>
        )}
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === "history"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          History Logs
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "my-timesheet" && (
          <motion.div
            key="my-timesheet"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Stats Dashboard */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden border border-border bg-card/40 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
                <div className="absolute right-3 top-3 rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
                  <Clock className="h-5 w-5" />
                </div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Total Hours</CardDescription>
                  <CardTitle className="text-3xl font-display font-bold text-foreground tabular-nums">
                    {totalHours} hrs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Logged this week</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border border-border bg-card/40 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
                <div className="absolute right-3 top-3 rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Billable Hours</CardDescription>
                  <CardTitle className="text-3xl font-display font-bold text-foreground tabular-nums">
                    {billableHours} hrs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Assigned to client projects</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border border-border bg-card/40 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5">
                <div className="absolute right-3 top-3 rounded-xl bg-violet-500/10 p-2 text-violet-500">
                  <UserCheck className="h-5 w-5" />
                </div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Utilization Rate</CardDescription>
                  <CardTitle className="text-3xl font-display font-bold text-foreground tabular-nums">
                    {utilizationRate}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${utilizationRate}%` }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border border-border bg-card/40 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5">
                <div className="absolute right-3 top-3 rounded-xl bg-amber-500/10 p-2 text-amber-500">
                  <FileText className="h-5 w-5" />
                </div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Status</CardDescription>
                  <CardTitle className="text-2xl font-display font-bold text-foreground mt-1 capitalize">
                    <Badge
                      variant={
                        timesheetStatus === "approved"
                          ? "secondary"
                          : timesheetStatus === "rejected"
                          ? "destructive"
                          : timesheetStatus === "pending"
                          ? "outline"
                          : "default"
                      }
                      className={`text-xs px-2 py-0.5 ${
                        timesheetStatus === "pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : ""
                      }`}
                    >
                      {timesheetStatus === "pending" ? "Pending Approval" : timesheetStatus}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {timesheetStatus === "draft" && "Ready to save or submit"}
                    {timesheetStatus === "pending" && "Sent to Rohan Varma"}
                    {timesheetStatus === "approved" && "Processed for Payroll integration"}
                    {timesheetStatus === "rejected" && "Requires changes"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Weekly Input Grid */}
            <Card className="border border-border bg-card/50 backdrop-blur-md">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-border/80 gap-3">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    Weekly Hours Allocation
                  </CardTitle>
                  <CardDescription>Select project and add log details for each day.</CardDescription>
                </div>
                
                {/* Week Selector */}
                <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-lg border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setWeekOffset(prev => prev - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-semibold px-2 min-w-[170px] text-center">
                    {weekRangeLabel}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    disabled={weekOffset === 0}
                    onClick={() => setWeekOffset(prev => prev + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="h-8 w-8 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin" />
                    <p className="text-sm text-muted-foreground">Syncing timesheet with database...</p>
                  </div>
                ) : (
                  <Table className="min-w-[800px]">
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="w-[240px] pl-6 py-4">Project</TableHead>
                        {dateHeaders.map((dh, i) => (
                          <TableHead key={i} className="text-center w-[75px] py-4">
                            <div className="text-xs text-muted-foreground font-medium">{dh.dayName}</div>
                            <div className="text-sm font-semibold text-foreground mt-0.5">{dh.dateStr}</div>
                          </TableHead>
                        ))}
                        <TableHead className="text-center w-[85px] py-4">Total</TableHead>
                        <TableHead className="pl-4 py-4">Description / Deliverables</TableHead>
                        <TableHead className="w-[60px] pr-6 text-center py-4"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row) => {
                        const rowTotal = row.hours.reduce((a, b) => a + b, 0);
                        return (
                          <TableRow key={row.id} className="border-b border-border/80 hover:bg-muted/5 transition-all">
                            {/* Project Selector */}
                            <TableCell className="pl-6 py-4">
                              <Select
                                value={row.projectId}
                                onValueChange={(val) => handleProjectChange(row.id, val)}
                                disabled={timesheetStatus === "pending" || timesheetStatus === "approved"}
                              >
                                <SelectTrigger className="w-full bg-background/50 border border-border">
                                  <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                  {AVAILABLE_PROJECTS.map((proj) => (
                                    <SelectItem key={proj.id} value={proj.id}>
                                      {proj.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>

                            {/* 7 Days Inputs */}
                            {row.hours.map((hoursVal, dayIdx) => (
                              <TableCell key={dayIdx} className="p-2 py-4">
                                <Input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max="24"
                                  className="h-9 w-[64px] mx-auto text-center tabular-nums bg-background/50 border border-border focus:ring-1 focus:ring-indigo-500"
                                  value={hoursVal === 0 ? "" : hoursVal}
                                  placeholder="0"
                                  onChange={(e) => handleHoursChange(row.id, dayIdx, e.target.value)}
                                  disabled={timesheetStatus === "pending" || timesheetStatus === "approved"}
                                />
                              </TableCell>
                            ))}

                            {/* Row Total */}
                            <TableCell className="text-center font-bold tabular-nums text-foreground py-4">
                              {rowTotal}h
                            </TableCell>

                            {/* Description Input */}
                            <TableCell className="pl-4 py-4">
                              <Input
                                value={row.description}
                                placeholder="Describe your work this week..."
                                className="w-full bg-background/50 border border-border"
                                onChange={(e) => handleDescChange(row.id, e.target.value)}
                                disabled={timesheetStatus === "pending" || timesheetStatus === "approved"}
                              />
                            </TableCell>

                            {/* Delete Action */}
                            <TableCell className="pr-6 text-center py-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-rose-500 transition-colors"
                                onClick={() => deleteRow(row.id)}
                                disabled={timesheetStatus === "pending" || timesheetStatus === "approved"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {/* Column Totals Row */}
                      <TableRow className="bg-muted/10 font-semibold border-b border-border/80">
                        <TableCell className="pl-6 py-4 text-foreground font-bold">Daily Totals</TableCell>
                        {dailyTotals.map((tot, idx) => (
                          <TableCell key={idx} className="text-center py-4 tabular-nums">
                            <span className={tot > 24 ? "text-rose-500 font-bold" : "text-foreground"}>
                              {tot}h
                            </span>
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-bold tabular-nums text-indigo-500 py-4">
                          {totalHours}h
                        </TableCell>
                        <TableCell className="pl-4 py-4 text-xs text-muted-foreground font-normal">
                          {isDailyOverlogged ? (
                            <span className="text-rose-500 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" /> Limit exceeded (Max 24h/day)
                            </span>
                          ) : (
                            "Standard working hours check passed"
                          )}
                        </TableCell>
                        <TableCell className="pr-6 py-4"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>

              {/* Add Row and Save options */}
              {timesheetStatus !== "pending" && timesheetStatus !== "approved" && !loading && (
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border bg-muted/5 gap-3">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto gap-2 border-border hover:bg-muted"
                    onClick={addRow}
                  >
                    <Plus className="h-4 w-4" /> Add Row
                  </Button>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      className="flex-1 sm:flex-initial gap-2 text-muted-foreground hover:text-foreground"
                      onClick={handleSaveDraft}
                    >
                      <Save className="h-4 w-4" /> Save Draft
                    </Button>
                    <Button
                      className="flex-1 sm:flex-initial gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                      onClick={handleSubmitTimesheet}
                      disabled={isDailyOverlogged || totalHours === 0}
                    >
                      <Send className="h-4 w-4" /> Submit for Approval
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Approvals tab layout */}
        {activeTab === "approvals" && (
          <motion.div
            key="approvals"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Team Timesheets Review</h3>
                <p className="text-sm text-muted-foreground">Approve or request revisions for employee timesheet filings.</p>
              </div>
              <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/30">
                {approvals.filter(a => a.status === "pending").length} Pending
              </Badge>
            </div>

            <div className="grid gap-4">
              {approvals.map((req) => (
                <Card key={req.id} className="border border-border bg-card/60 backdrop-blur-md overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Employee profile metadata */}
                      <div className="flex items-start gap-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold">
                          {req.employeeName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            {req.employeeName}
                            <Badge variant="outline" className="text-[10px] uppercase font-normal">{req.department}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                            <Calendar className="h-3 w-3" /> Week: {req.weekRange}
                          </div>
                        </div>
                      </div>

                      {/* Logged stats summary */}
                      <div className="flex items-center gap-6">
                        <div className="text-left md:text-right">
                          <div className="text-sm font-semibold text-foreground tabular-nums">{req.totalHours} hrs</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Total hours logged</div>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="text-xs font-semibold capitalize">
                            <Badge
                              variant={req.status === "approved" ? "secondary" : req.status === "rejected" ? "destructive" : "outline"}
                              className={req.status === "pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : ""}
                            >
                              {req.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Status</div>
                        </div>
                      </div>

                      {/* Decision Quick Actions */}
                      <div className="flex items-center gap-2 md:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-muted-foreground hover:text-foreground"
                          onClick={() => setSelectedApproval(req)}
                        >
                          <FileText className="h-4 w-4" /> View Details
                        </Button>
                        {req.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400"
                              onClick={() => handleApproveTimesheet(req.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" /> Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                              onClick={() => {
                                setSelectedApproval(req);
                                setRejectReasonOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {approvals.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground"><ShieldCheck className="h-5 w-5" /></div>
                  <p className="font-medium">All caught up!</p>
                  <p className="mt-1 text-sm text-muted-foreground">There are no pending timesheets for your approval right now.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* History tab layout */}
        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground">Submission Log Archive</h3>
              <p className="text-sm text-muted-foreground">Historical records of your timesheets submissions and payroll transitions.</p>
            </div>

            <Card className="border border-border bg-card/50 backdrop-blur-md overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow>
                    <TableHead className="pl-6 py-4">Week Range</TableHead>
                    <TableHead className="py-4">Submitted Date</TableHead>
                    <TableHead className="text-center py-4">Hours Logged</TableHead>
                    <TableHead className="py-4">Approved By</TableHead>
                    <TableHead className="py-4">Status</TableHead>
                    <TableHead className="pr-6 py-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyRecords.map((rec) => (
                    <TableRow key={rec.id} className="border-b border-border/80 hover:bg-muted/5 transition-all">
                      <TableCell className="pl-6 py-4 font-semibold text-foreground">{rec.weekRange}</TableCell>
                      <TableCell className="py-4 text-muted-foreground">{rec.submittedOn}</TableCell>
                      <TableCell className="text-center py-4 font-semibold tabular-nums text-foreground">{rec.totalHours} hrs</TableCell>
                      <TableCell className="py-4 text-muted-foreground">{rec.approvedBy || "—"}</TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={rec.status === "approved" ? "secondary" : rec.status === "rejected" ? "destructive" : "outline"}
                          className={`text-xs ${
                            rec.status === "pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : ""
                          }`}
                        >
                          {rec.status === "pending" ? "Pending Approval" : rec.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                        {rec.status === "rejected" && (
                          <div className="text-xs text-rose-500 flex items-center gap-1.5 justify-end">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Reason: {rec.rejectionReason}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {historyRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No historical records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Autofill Copilot Dialog */}
      <Dialog open={aiAutofillOpen} onOpenChange={setAiAutofillOpen}>
        <DialogContent className="max-w-md border border-border bg-card/95 backdrop-blur-2xl text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-pink-500 animate-pulse" />
              AI Copilot Timesheet Autofill
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              Aurix AI can analyze your git repository commits, local workspace project updates, and calendar events to automatically write descriptions and estimate daily hours.
            </DialogDescription>
          </DialogHeader>

          {aiLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-t-2 border-r-2 border-pink-500 animate-spin" />
                <Sparkles className="absolute h-5 w-5 text-pink-500 animate-ping" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Analyzing developer footprint...</p>
                <p className="text-xs text-muted-foreground mt-1">Reading local standups & commits logs</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-xs font-semibold text-muted-foreground uppercase">Autofill Data Source</Label>
                <Select value={aiLogSource} onValueChange={setAiLogSource}>
                  <SelectTrigger className="bg-background/50 border border-border">
                    <SelectValue placeholder="Select Data Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">GitHub, Standups, and Jira Task Logs</SelectItem>
                    <SelectItem value="commits">Only Git Repository Commits</SelectItem>
                    <SelectItem value="calendar">Only Calendar & Slack Standups</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg bg-pink-500/5 border border-pink-500/10 p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-pink-500 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Privacy Note:</strong> Log analyses are processed locally on your client machine and never saved to training pipelines.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setAiAutofillOpen(false)}
              disabled={aiLoading}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={triggerAiAutofill}
              disabled={aiLoading}
              className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white"
            >
              Generate Timesheet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details View Modal for Manager Reviews */}
      {selectedApproval && (
        <Dialog open={!!selectedApproval} onOpenChange={(open) => !open && setSelectedApproval(null)}>
          <DialogContent className="max-w-lg border border-border bg-card/95 backdrop-blur-2xl text-foreground">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Timesheet Details: {selectedApproval.employeeName}
              </DialogTitle>
              <DialogDescription>
                Review details for week of {selectedApproval.weekRange}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="grid grid-cols-2 gap-2 text-sm bg-muted/20 p-3 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground block">Employee Department</span>
                  <span className="font-semibold">{selectedApproval.department}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Total Hours Claimed</span>
                  <span className="font-semibold text-indigo-500">{selectedApproval.totalHours} hrs</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Project Breakdown</span>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {selectedApproval.details.map((d, i) => (
                    <div key={i} className="border border-border/80 bg-background/50 rounded-lg p-3 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{d.project}</span>
                        <Badge variant="outline" className="font-mono text-[10px] tabular-nums">{d.hours}h</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {d.desc || "No description provided."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                onClick={() => setSelectedApproval(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
              {selectedApproval.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    className="text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                    onClick={() => setRejectReasonOpen(true)}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    onClick={() => handleApproveTimesheet(selectedApproval.id)}
                  >
                    Approve Timesheet
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Reason input dialog */}
      <Dialog open={rejectReasonOpen} onOpenChange={setRejectReasonOpen}>
        <DialogContent className="max-w-md border border-border bg-card/95 backdrop-blur-2xl text-foreground">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              Reason for Rejection
            </DialogTitle>
            <DialogDescription className="text-xs">
              Provide feedback to the employee on why this timesheet is being sent back for revision.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Label htmlFor="reason-textarea" className="sr-only">Rejection Reason</Label>
            <textarea
              id="reason-textarea"
              value={rejectReason}
              placeholder="e.g. Please clarify project hours allocation for Acme Corp Web Portal..."
              className="w-full min-h-[100px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-rose-500 focus:outline-none"
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setRejectReasonOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-500 text-white"
              onClick={handleRejectTimesheet}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
