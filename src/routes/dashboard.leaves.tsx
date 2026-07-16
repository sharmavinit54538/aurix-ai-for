import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  FileText, Check, X, Calendar, Sparkles, Plus, AlertCircle,
  TrendingUp, Clock, CheckCircle2, XCircle, Info, RefreshCw, Briefcase,
  HelpCircle, ShieldCheck, Users, Search, UserCheck,
  FilePlus2, Wallet, CalendarDays, CalendarCheck, Repeat, Laptop, Palmtree,
  History as HistoryIcon
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { aurix, uid, useAurix } from "@/lib/aurix-store";
import { api } from "@/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/dashboard/leaves")({
  head: () => ({ meta: [{ title: "Leaves — Aurix" }] }),
  component: LeavesPage,
});

interface LeaveBalance {
  leave_type: string;
  total_days: number;
  used_days: number;
  remaining_days: number;
}

interface LeaveRequest {
  id: string;
  employee_name?: string;
  department?: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  rejection_reason?: string;
}

const LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Vacation Leave"];

const COMPOFF_STORAGE_KEY = "aurix.employee.compoff.v1";
const WFH_STORAGE_KEY = "aurix.employee.wfh.v1";

interface CompOffRequest {
  id: string;
  workDate: string;
  hours: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface WfhRequest {
  id: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const defaultCompOffRequests: CompOffRequest[] = [
  { id: "co-1", workDate: "2026-06-14", hours: 8, reason: "Server infrastructure upgrade deployment support", status: "approved", createdAt: "2026-06-15" },
  { id: "co-2", workDate: "2026-07-05", hours: 4, reason: "Mid-year payroll audit reporting", status: "pending", createdAt: "2026-07-06" }
];

const defaultWfhRequests: WfhRequest[] = [
  { id: "wf-1", startDate: "2026-05-10", endDate: "2026-05-12", totalDays: 3, reason: "Plumbing maintenance at home", status: "approved", createdAt: "2026-05-08" },
  { id: "wf-2", startDate: "2026-07-20", endDate: "2026-07-22", totalDays: 3, reason: "Family visiting town", status: "pending", createdAt: "2026-07-14" }
];

const HOLIDAYS = [
  { name: "New Year's Day", date: "2026-01-01", type: "Paid Holiday" },
  { name: "Martin Luther King Jr. Day", date: "2026-01-19", type: "Paid Holiday" },
  { name: "Memorial Day", date: "2026-05-25", type: "Paid Holiday" },
  { name: "Independence Day", date: "2026-07-04", type: "National Holiday" },
  { name: "Labor Day", date: "2026-09-07", type: "Paid Holiday" },
  { name: "Thanksgiving Day", date: "2026-11-26", type: "Paid Holiday" },
  { name: "Christmas Day", date: "2026-12-25", type: "Paid Holiday" }
];

interface LeaveTab {
  id: string;
  label: string;
  icon: any;
  count?: number;
}

function LeavesPage() {
  const ws = useAurix();
  const userRole = (ws.user?.role || "employee") as string;
  const employeesList = ws.employees || [];

  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(userRole === "employee" ? "apply" : "my-leaves");
    }
  }, [userRole, activeTab]);

  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const [approvals, setApprovals] = useState<LeaveRequest[]>([]);

  const [adminSearch, setAdminSearch] = useState("");
  const [selectedAdminEmp, setSelectedAdminEmp] = useState<any | null>(null);
  const [selectedEmpBalances, setSelectedEmpBalances] = useState<LeaveBalance[]>([]);
  const [empBalancesLoading, setEmpBalancesLoading] = useState(false);

  const [applyOpen, setApplyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [rejectOpen, setRejectOpen] = useState(false);
  const [targetLeave, setTargetLeave] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [compOffs, setCompOffs] = useState<CompOffRequest[]>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(COMPOFF_STORAGE_KEY);
      if (raw) {
        try { return JSON.parse(raw); } catch {}
      }
    }
    return defaultCompOffRequests;
  });

  const [wfhs, setWfhs] = useState<WfhRequest[]>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(WFH_STORAGE_KEY);
      if (raw) {
        try { return JSON.parse(raw); } catch {}
      }
    }
    return defaultWfhRequests;
  });

  const [coDate, setCoDate] = useState("");
  const [coHours, setCoHours] = useState(8);
  const [coReason, setCoReason] = useState("");

  const [wfhStart, setWfhStart] = useState("");
  const [wfhEnd, setWfhEnd] = useState("");
  const [wfhReason, setWfhReason] = useState("");

  const formatDateStr = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = e.getTime() - s.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }, [startDate, endDate]);

  const calculatedWfhDays = useMemo(() => {
    if (!wfhStart || !wfhEnd) return 0;
    const s = new Date(wfhStart);
    const e = new Date(wfhEnd);
    const diffTime = e.getTime() - s.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [wfhStart, wfhEnd]);

  const loadBalances = async () => {
    try {
      const res = await api.get<any>("/leaves/balances");
      if (res?.success && res.data) {
        setBalances(res.data);
      }
    } catch (err) {
      console.error("Error loading leave balances", err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.get<any>("/leaves/history");
      if (res?.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error("Error loading leave history", err);
    }
  };

  const loadPendingApprovals = async () => {
    try {
      const res = await api.get<any>("/leaves/pending");
      if (res?.success && res.data) {
        setApprovals(res.data.map((l: any) => ({
          id: l.id,
          employee_name: l.employee?.fullName || "Employee",
          department: l.employee?.department || "Staff",
          leave_type: l.leave_type,
          start_date: l.start_date,
          end_date: l.end_date,
          total_days: parseFloat(l.total_days),
          reason: l.reason,
          status: l.status.toLowerCase()
        })));
      }
    } catch (err) {
      console.error("Error loading pending leaves", err);
    }
  };

  const handleViewEmployeeBalances = async (emp: any) => {
    setSelectedAdminEmp(emp);
    setEmpBalancesLoading(true);
    try {
      const res = await api.get<any>(`/leaves/balances/${emp.id}`);
      if (res?.success && res.data) {
        setSelectedEmpBalances(res.data);
      } else {
        setSelectedEmpBalances([]);
      }
    } catch (err) {
      console.error("Error fetching employee balances", err);
      toast.error("Failed to load balances for selected employee.");
      setSelectedEmpBalances([]);
    } finally {
      setEmpBalancesLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!adminSearch) return employeesList;
    return employeesList.filter(e => 
      e.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (e.department || "").toLowerCase().includes(adminSearch.toLowerCase())
    );
  }, [employeesList, adminSearch]);

  useEffect(() => {
    if (activeTab === "my-leaves" || activeTab === "apply" || activeTab === "balance" || activeTab === "history" || activeTab === "approvals") {
      loadBalances();
      loadHistory();
      if (userRole === "admin" || userRole === "manager") {
        loadPendingApprovals();
      }
    }
  }, [activeTab, userRole]);

  useEffect(() => {
    loadBalances();
    loadHistory();
    if (userRole === "admin" || userRole === "manager") {
      loadPendingApprovals();
    }
  }, [userRole]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatedDays <= 0) {
      toast.error("Invalid dates selected. Start date must be before or equal to End date.");
      return;
    }
    if (!reason.trim() || reason.length < 5) {
      toast.error("Please provide a valid reason (min 5 characters).");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        total_days: calculatedDays,
        reason: reason
      };
      
      const res = await api.post<any>("/leaves/apply", payload);
      if (res?.success) {
        toast.success("Leave request submitted successfully!");
        setApplyOpen(false);
        setStartDate("");
        setEndDate("");
        setReason("");
        loadBalances();
        loadHistory();
        setActiveTab("history");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to apply leave. Ensure you have enough remaining balance.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await api.post<any>(`/leaves/${id}/review`, { status: "APPROVED" });
      if (res?.success) {
        toast.success("Leave request approved.");
        loadPendingApprovals();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to approve leave request.");
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    try {
      const id = targetLeave?.id;
      const res = await api.post<any>(`/leaves/${id}/review`, { 
        status: "REJECTED", 
        rejection_reason: rejectionReason 
      });
      if (res?.success) {
        toast.info("Leave request sent back.");
        setRejectionReason("");
        setRejectOpen(false);
        setTargetLeave(null);
        loadPendingApprovals();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reject leave request.");
    }
  };

  const handleCompOffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coDate) {
      toast.error("Please select a work date.");
      return;
    }
    if (!coReason.trim()) {
      toast.error("Please provide a description/reason.");
      return;
    }
    const newReq: CompOffRequest = {
      id: uid("co"),
      workDate: coDate,
      hours: coHours,
      reason: coReason,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const next = [newReq, ...compOffs];
    setCompOffs(next);
    localStorage.setItem(COMPOFF_STORAGE_KEY, JSON.stringify(next));
    toast.success("Comp Off request submitted successfully!");
    setCoDate("");
    setCoReason("");
  };

  const handleWfhSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatedWfhDays <= 0) {
      toast.error("Invalid dates selected.");
      return;
    }
    if (!wfhReason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }
    const newReq: WfhRequest = {
      id: uid("wf"),
      startDate: wfhStart,
      endDate: wfhEnd,
      totalDays: calculatedWfhDays,
      reason: wfhReason,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const next = [newReq, ...wfhs];
    setWfhs(next);
    localStorage.setItem(WFH_STORAGE_KEY, JSON.stringify(next));
    toast.success("Work From Home request submitted successfully!");
    setWfhStart("");
    setWfhEnd("");
    setWfhReason("");
  };

  const employeeTabs: LeaveTab[] = useMemo(() => {
    const pendingCount = approvals.length;
    return [
      { id: "apply", label: "Apply Leave", icon: FilePlus2 },
      { id: "balance", label: "Leave Balance", icon: Wallet },
      { id: "calendar", label: "Leave Calendar", icon: CalendarDays },
      { id: "history", label: "Leave History", icon: HistoryIcon },
      { id: "holidays", label: "Holiday Calendar", icon: CalendarCheck },
      { id: "comp-off", label: "Comp Off", icon: Repeat },
      { id: "wfh", label: "Work From Home", icon: Laptop },
      { id: "approvals", label: "Leave Approvals", icon: CheckCircle2, count: pendingCount },
    ];
  }, [approvals.length]);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentMonthName = "July 2026";

  const renderCalendar = () => {
    const padding = Array.from({ length: 2 }, (_, i) => null);
    const allDays = [...padding, ...daysInMonth];

    const leavesByDay: Record<number, string[]> = {
      4: ["Independence Day (Holiday)"],
      14: ["Maya Chen (On Sick Leave)"],
      20: ["Alex Rivera (WFH)"],
      21: ["Alex Rivera (WFH)"],
      22: ["Alex Rivera (WFH)"],
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">{currentMonthName}</h3>
          <span className="text-xs text-muted-foreground">Team Attendance & Holidays</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground border-b border-border pb-2">
          <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {allDays.map((d, index) => {
            if (d === null) return <div key={`pad-${index}`} className="h-14"></div>;
            
            const isWeekend = (index % 7 === 5) || (index % 7 === 6);
            const marker = leavesByDay[d];
            
            return (
              <div key={d} className={`h-14 border border-border/40 rounded-lg p-1 text-left flex flex-col justify-between transition-colors hover:bg-muted/10 ${isWeekend ? "bg-muted/30" : "bg-background/20"}`}>
                <span className={`text-[10px] font-bold ${isWeekend ? "text-muted-foreground" : "text-foreground"}`}>{d}</span>
                {marker && (
                  <div className={`text-[8px] font-medium leading-none px-1 py-0.5 rounded truncate ${
                    marker[0].includes("Holiday") ? "bg-emerald-500/20 text-emerald-400" :
                    marker[0].includes("WFH") ? "bg-indigo-500/20 text-indigo-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {marker[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (userRole === "employee") {
    return (
      <>
        <PageHeader
          title="Leaves & Attendance"
          description="Submit leave requests, view remaining balances, holidays, and remote work logs."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-1">
            {employeeTabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" />{t.label}
                  {t.count && t.count > 0 ? (
                    <Badge className="ml-auto bg-amber-500/20 text-amber-500 border border-amber-500/30 font-semibold">{t.count}</Badge>
                  ) : null}
                </button>
              );
            })}
          </aside>

          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            {activeTab === "apply" ? (
              <form onSubmit={handleApplySubmit} className="space-y-4 max-w-md">
                <h3 className="text-base font-semibold border-b border-border pb-2">Apply for Leave</h3>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Leave Type</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger className="bg-background/50 border border-border">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date" className="text-xs font-semibold text-muted-foreground uppercase">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-background/50 border border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date" className="text-xs font-semibold text-muted-foreground uppercase">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-background/50 border border-border"
                    />
                  </div>
                </div>

                {calculatedDays > 0 && (
                  <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Days Claimed:</span>
                    <span className="font-bold text-indigo-500">{calculatedDays} {calculatedDays === 1 ? "day" : "days"}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reason-input" className="text-xs font-semibold text-muted-foreground uppercase">Reason for absence</Label>
                  <textarea
                    id="reason-input"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe why you need time off (min 5 characters)..."
                    className="w-full min-h-[90px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || calculatedDays <= 0}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            ) : null}

            {activeTab === "balance" ? (
              <div className="space-y-6">
                <h3 className="text-base font-semibold border-b border-border pb-2">Active Leave Balances</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {balances.map((b) => {
                    const color = b.leave_type.includes("Sick") 
                      ? "from-amber-500/10 to-orange-500/5 text-orange-500 border-orange-500/20"
                      : b.leave_type.includes("Casual")
                      ? "from-sky-500/10 to-blue-500/5 text-sky-500 border-sky-500/20"
                      : "from-emerald-500/10 to-teal-500/5 text-emerald-500 border-emerald-500/20";
                    
                    return (
                      <Card key={b.leave_type} className={`border bg-gradient-to-br backdrop-blur-xl transition-all duration-300 hover:shadow-md ${color}`}>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{b.leave_type}</CardDescription>
                          <CardTitle className="text-3xl font-display font-bold text-foreground mt-1 tabular-nums">
                            {b.remaining_days} <span className="text-sm font-normal text-muted-foreground">days left</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            Used: {b.used_days} / Total: {b.total_days} days
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {activeTab === "calendar" ? (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b border-border pb-2">Attendance Calendar</h3>
                {renderCalendar()}
              </div>
            ) : null}

            {activeTab === "history" ? (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b border-border pb-2">Leave Application History</h3>
                <Card className="border border-border bg-card/50 backdrop-blur-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 py-4">Leave Type</TableHead>
                        <TableHead className="py-4">Dates Range</TableHead>
                        <TableHead className="text-center py-4">Days Claimed</TableHead>
                        <TableHead className="py-4">Reason</TableHead>
                        <TableHead className="py-4">Status</TableHead>
                        <TableHead className="pr-6 py-4"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((rec) => (
                        <TableRow key={rec.id} className="border-b border-border/80 hover:bg-muted/5 transition-all">
                          <TableCell className="pl-6 py-4 font-semibold text-foreground">{rec.leave_type}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">
                            {formatDateStr(rec.start_date)} – {formatDateStr(rec.end_date)}
                          </TableCell>
                          <TableCell className="text-center py-4 font-semibold tabular-nums text-foreground">{rec.total_days} d</TableCell>
                          <TableCell className="py-4 text-muted-foreground max-w-[200px] truncate">{rec.reason}</TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant={rec.status === "approved" ? "secondary" : rec.status === "rejected" ? "destructive" : "outline"}
                              className={`text-xs capitalize ${
                                rec.status === "pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : ""
                              }`}
                            >
                              {rec.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 py-4 text-right">
                            {rec.status === "rejected" && rec.rejection_reason && (
                              <div className="text-xs text-rose-500 flex items-center gap-1.5 justify-end">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Reason: {rec.rejection_reason}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {history.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                            No leave applications logged yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            ) : null}

            {activeTab === "holidays" ? (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b border-border pb-2">Holiday Calendar</h3>
                <div className="grid gap-3">
                  {HOLIDAYS.map((h) => {
                    const daysRemaining = Math.ceil((new Date(h.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={h.name} className="flex items-center justify-between border border-border bg-card/30 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 grid place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            <CalendarCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{h.name}</div>
                            <div className="text-xs text-muted-foreground">{formatDateStr(h.date)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">{h.type}</Badge>
                          {daysRemaining > 0 ? (
                            <div className="text-[10px] text-muted-foreground mt-1">In {daysRemaining} days</div>
                          ) : (
                            <div className="text-[10px] text-muted-foreground mt-1">Passed</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {activeTab === "comp-off" ? (
              <div className="grid gap-6 md:grid-cols-2">
                <form onSubmit={handleCompOffSubmit} className="space-y-4">
                  <h3 className="text-base font-semibold border-b border-border pb-2">Request Comp Off</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Work Date</Label>
                    <Input
                      type="date"
                      required
                      value={coDate}
                      onChange={(e) => setCoDate(e.target.value)}
                      className="bg-background/50 border border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Hours Worked</Label>
                    <select
                      value={coHours}
                      onChange={(e) => setCoHours(Number(e.target.value))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value={8}>Full Day (8 Hours)</option>
                      <option value={4}>Half Day (4 Hours)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Work Description / Project</Label>
                    <textarea
                      required
                      value={coReason}
                      onChange={(e) => setCoReason(e.target.value)}
                      placeholder="e.g. Supported production database migration on Saturday..."
                      className="w-full min-h-[90px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                    Submit Request
                  </Button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold border-b border-border pb-2">Comp Off Logs</h3>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto">
                    {compOffs.map((co) => (
                      <div key={co.id} className="border border-border bg-card/30 rounded-xl p-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold">{co.reason}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Worked: {co.workDate} ({co.hours} hrs)</div>
                        </div>
                        <Badge
                          variant={co.status === "approved" ? "secondary" : co.status === "rejected" ? "destructive" : "outline"}
                          className="text-[10px] capitalize"
                        >
                          {co.status}
                        </Badge>
                      </div>
                    ))}
                    {compOffs.length === 0 && (
                      <div className="text-center text-xs text-muted-foreground py-10">No comp off filings logged.</div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "wfh" ? (
              <div className="grid gap-6 md:grid-cols-2">
                <form onSubmit={handleWfhSubmit} className="space-y-4">
                  <h3 className="text-base font-semibold border-b border-border pb-2">Request Work From Home</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase">Start Date</Label>
                      <Input
                        type="date"
                        required
                        value={wfhStart}
                        onChange={(e) => setWfhStart(e.target.value)}
                        className="bg-background/50 border border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase">End Date</Label>
                      <Input
                        type="date"
                        required
                        value={wfhEnd}
                        onChange={(e) => setWfhEnd(e.target.value)}
                        className="bg-background/50 border border-border"
                      />
                    </div>
                  </div>

                  {calculatedWfhDays > 0 && (
                    <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">WFH Period Days:</span>
                      <span className="font-bold text-indigo-500">{calculatedWfhDays} {calculatedWfhDays === 1 ? "day" : "days"}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Reason for WFH Request</Label>
                    <textarea
                      required
                      value={wfhReason}
                      onChange={(e) => setWfhReason(e.target.value)}
                      placeholder="e.g. Home logistics, out of town family, etc..."
                      className="w-full min-h-[90px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <Button type="submit" disabled={calculatedWfhDays <= 0} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                    Submit WFH Request
                  </Button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold border-b border-border pb-2">WFH Application Logs</h3>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto">
                    {wfhs.map((w) => (
                      <div key={w.id} className="border border-border bg-card/30 rounded-xl p-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold">{w.reason}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{w.startDate} to {w.endDate} ({w.totalDays} days)</div>
                        </div>
                        <Badge
                          variant={w.status === "approved" ? "secondary" : w.status === "rejected" ? "destructive" : "outline"}
                          className="text-[10px] capitalize"
                        >
                          {w.status}
                        </Badge>
                      </div>
                    ))}
                    {wfhs.length === 0 && (
                      <div className="text-center text-xs text-muted-foreground py-10">No remote work logs filed.</div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "approvals" ? (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b border-border pb-2">Approval Trackers</h3>
                <div className="space-y-4">
                  {history.filter(h => h.status === "pending").map((item) => (
                    <div key={item.id} className="border border-border bg-card/30 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="font-semibold text-sm">{item.leave_type}</span>
                          <span className="text-xs text-muted-foreground ml-2">({item.total_days} days)</span>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/30">Review Pending</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-4">Dates: {formatDateStr(item.start_date)} to {formatDateStr(item.end_date)}</div>
                      
                      <div className="relative pl-6 border-l-2 border-dashed border-border space-y-4 text-xs">
                        <div className="relative">
                          <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-emerald-500 border border-background flex items-center justify-center text-[10px] text-white">✓</div>
                          <div className="font-medium text-foreground">Leave Applied</div>
                          <div className="text-[10px] text-muted-foreground">Successfully logged in portal database.</div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-amber-500 border border-background flex items-center justify-center text-[10px] text-white">⌛</div>
                          <div className="font-medium text-foreground">Manager Approval</div>
                          <div className="text-[10px] text-muted-foreground">Pending review from department director.</div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-muted border border-background flex items-center justify-center text-[10px] text-muted-foreground">⌛</div>
                          <div className="font-medium text-muted-foreground">HR compliance validation</div>
                          <div className="text-[10px] text-muted-foreground">Triggered automatically upon manager signoff.</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {history.filter(h => h.status === "pending").length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
                      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground"><ShieldCheck className="h-5 w-5" /></div>
                      <p className="font-medium">No pending approvals</p>
                      <p className="mt-1 text-sm text-muted-foreground">All your submitted leaves have been approved or rejected.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={
          userRole === "admin" 
            ? "Enterprise Leave Dashboard" 
            : userRole === "manager" 
            ? "Team Leaves & Approvals" 
            : "My Leave Applications"
        } 
        description={
          userRole === "admin"
            ? "Track organizational leaves, adjust balances, and approve time-off requests company-wide."
            : userRole === "manager"
            ? "Approve your team's leaves and manage your own time-off records."
            : "Submit leave requests, view active balances, and track approvals history."
        }
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => setApplyOpen(true)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="h-4 w-4" /> Apply for Leave
            </Button>
          </div>
        }
      />

      {/* Tabs navigation - dynamically visible based on user role */}
      {userRole !== "employee" && (
        <div className="mb-6 flex border-b border-border bg-muted/20 p-1 rounded-xl max-w-md">
          <button
            onClick={() => setActiveTab("my-leaves")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "my-leaves"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Leaves
          </button>
          
          <button
            onClick={() => setActiveTab("approvals")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === "approvals"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Review Requests
            {approvals.length > 0 && (
              <Badge className="ml-2 bg-amber-500/20 text-amber-500 border border-amber-500/30">
                {approvals.length}
              </Badge>
            )}
          </button>

          {userRole === "admin" && (
            <button
              onClick={() => setActiveTab("employee-balances")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === "employee-balances"
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Balances
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === "my-leaves" && (
          <motion.div
            key="my-leaves"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {balances.map((b) => {
                const color = b.leave_type.includes("Sick") 
                  ? "from-amber-500/10 to-orange-500/5 text-orange-500 border-orange-500/20"
                  : b.leave_type.includes("Casual")
                  ? "from-sky-500/10 to-blue-500/5 text-sky-500 border-sky-500/20"
                  : "from-emerald-500/10 to-teal-500/5 text-emerald-500 border-emerald-500/20";
                
                return (
                  <Card key={b.leave_type} className={`border bg-gradient-to-br backdrop-blur-xl transition-all duration-300 hover:shadow-md ${color}`}>
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{b.leave_type}</CardDescription>
                      <CardTitle className="text-3xl font-display font-bold text-foreground mt-1 tabular-nums">
                        {b.remaining_days} <span className="text-sm font-normal text-muted-foreground">days left</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Used: {b.used_days} / Total: {b.total_days} days
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
              {balances.length === 0 && (
                <div className="col-span-3 text-center py-4 text-xs text-muted-foreground">
                  Initializing leave policies balances...
                </div>
              )}
            </div>

            <div>
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Leave Applications History</h3>
              </div>
              <Card className="border border-border bg-card/50 backdrop-blur-md overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="pl-6 py-4">Leave Type</TableHead>
                      <TableHead className="py-4">Dates Range</TableHead>
                      <TableHead className="text-center py-4">Days Claimed</TableHead>
                      <TableHead className="py-4">Reason</TableHead>
                      <TableHead className="py-4">Status</TableHead>
                      <TableHead className="pr-6 py-4"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((rec) => (
                      <TableRow key={rec.id} className="border-b border-border/80 hover:bg-muted/5 transition-all">
                        <TableCell className="pl-6 py-4 font-semibold text-foreground">{rec.leave_type}</TableCell>
                        <TableCell className="py-4 text-muted-foreground">
                          {formatDateStr(rec.start_date)} – {formatDateStr(rec.end_date)}
                        </TableCell>
                        <TableCell className="text-center py-4 font-semibold tabular-nums text-foreground">{rec.total_days} d</TableCell>
                        <TableCell className="py-4 text-muted-foreground max-w-[200px] truncate">{rec.reason}</TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant={rec.status === "approved" ? "secondary" : rec.status === "rejected" ? "destructive" : "outline"}
                            className={`text-xs capitalize ${
                              rec.status === "pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" : ""
                            }`}
                          >
                            {rec.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-6 py-4 text-right">
                          {rec.status === "rejected" && rec.rejection_reason && (
                            <div className="text-xs text-rose-500 flex items-center gap-1.5 justify-end">
                              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Reason: {rec.rejection_reason}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {history.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No leave applications logged yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === "approvals" && (userRole === "admin" || userRole === "manager") && (
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
                <h3 className="text-lg font-semibold text-foreground">Review Team Time-Off Requests</h3>
                <p className="text-sm text-muted-foreground">Approve leave filings or request revisions with feedback comments.</p>
              </div>
              <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/30">
                {approvals.length} Pending
              </Badge>
            </div>

            <div className="grid gap-4">
              {approvals.map((req) => (
                <Card key={req.id} className="border border-border bg-card/60 backdrop-blur-md overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white font-semibold">
                          {req.employee_name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            {req.employee_name}
                            <Badge variant="outline" className="text-[10px] uppercase font-normal">{req.department}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground font-semibold text-indigo-400 mt-1 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> {req.leave_type} ({req.total_days} days)
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-muted-foreground block">Requested Dates Range</span>
                        <span className="text-sm font-semibold text-foreground">
                          {formatDateStr(req.start_date)} to {formatDateStr(req.end_date)}
                        </span>
                      </div>

                      <div className="max-w-xs md:max-w-sm">
                        <span className="text-xs text-muted-foreground block">Reason for absence</span>
                        <p className="text-xs text-foreground mt-0.5 leading-relaxed truncate">{req.reason}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400"
                          onClick={() => handleApprove(req.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                          onClick={() => {
                            setTargetLeave(req);
                            setRejectOpen(true);
                          }}
                        >
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {approvals.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground"><ShieldCheck className="h-5 w-5" /></div>
                  <p className="font-medium">All caught up!</p>
                  <p className="mt-1 text-sm text-muted-foreground">There are no pending leave requests for your review.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "employee-balances" && userRole === "admin" && (
          <motion.div
            key="employee-balances"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Organizational Leave Allocations</h3>
                <p className="text-sm text-muted-foreground">Select any employee to view their detailed leave balances from database.</p>
              </div>
              <div className="relative w-full sm:w-[260px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="pl-9 bg-background/50 border border-border"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border border-border bg-card/50 backdrop-blur-md md:col-span-2 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="pl-6 py-4">Employee ID</TableHead>
                      <TableHead className="py-4">Name</TableHead>
                      <TableHead className="py-4">Department</TableHead>
                      <TableHead className="py-4">Designation</TableHead>
                      <TableHead className="pr-6 py-4 text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((emp) => (
                      <TableRow 
                        key={emp.id} 
                        className={`border-b border-border/80 hover:bg-muted/5 transition-all cursor-pointer ${
                          selectedAdminEmp?.id === emp.id ? "bg-indigo-500/5 hover:bg-indigo-500/5 border-l-2 border-l-indigo-500" : ""
                        }`}
                        onClick={() => handleViewEmployeeBalances(emp)}
                      >
                        <TableCell className="pl-6 py-4 font-mono text-xs">{emp.employeeId}</TableCell>
                        <TableCell className="py-4 font-semibold text-foreground">{emp.fullName}</TableCell>
                        <TableCell className="py-4 text-muted-foreground text-xs">{emp.department || "—"}</TableCell>
                        <TableCell className="py-4 text-muted-foreground text-xs">{emp.designation || "—"}</TableCell>
                        <TableCell className="pr-6 py-4 text-right">
                          <Button size="sm" variant="ghost" className="h-8 text-indigo-400">View Balances</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No employees match search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>

              <Card className="border border-border bg-card/40 backdrop-blur-xl h-fit">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-indigo-500" />
                    Detailed Balances
                  </CardTitle>
                  <CardDescription>
                    {selectedAdminEmp ? `Viewing logs for ${selectedAdminEmp.fullName}` : "Select an employee from the table"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAdminEmp ? (
                    empBalancesLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-2">
                        <RefreshCw className="h-5 w-5 animate-spin text-indigo-500" />
                        <span className="text-xs text-muted-foreground">Fetching records...</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedEmpBalances.map((b) => (
                          <div key={b.leave_type} className="border border-border/80 bg-background/50 rounded-lg p-3 space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-foreground">{b.leave_type}</span>
                              <Badge className="font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{b.remaining_days} remaining</Badge>
                            </div>
                            <div className="text-[10px] text-muted-foreground flex justify-between pt-1">
                              <span>Total: {b.total_days} days</span>
                              <span>Used: {b.used_days} days</span>
                            </div>
                          </div>
                        ))}
                        {selectedEmpBalances.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">No balances registered for this user.</p>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <Users className="h-8 w-8 mb-2 stroke-1" />
                      <p className="text-xs">Select an employee profile to query database balances.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-md border border-border bg-card/95 backdrop-blur-2xl text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Apply for Leave
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill in your leave details and submit to your manager for approval.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplySubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="bg-background/50 border border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {LEAVE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-xs font-semibold text-muted-foreground uppercase">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background/50 border border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-xs font-semibold text-muted-foreground uppercase">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-background/50 border border-border"
                />
              </div>
            </div>

            {calculatedDays > 0 && (
              <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Days Claimed:</span>
                <span className="font-bold text-indigo-500">{calculatedDays} {calculatedDays === 1 ? "day" : "days"}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason-input" className="text-xs font-semibold text-muted-foreground uppercase">Reason for absence</Label>
              <textarea
                id="reason-input"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe why you need time off (min 5 characters)..."
                className="w-full min-h-[90px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setApplyOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || calculatedDays <= 0}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-md border border-border bg-card/95 backdrop-blur-2xl text-foreground">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              Reason for Rejection
            </DialogTitle>
            <DialogDescription className="text-xs">
              Provide feedback on why this leave application is being rejected.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Label htmlFor="reject-textarea" className="sr-only">Rejection Reason</Label>
            <textarea
              id="reject-textarea"
              value={rejectionReason}
              placeholder="e.g. Project deliverable schedules are tight during these dates..."
              className="w-full min-h-[100px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-rose-500 focus:outline-none"
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setRejectOpen(false);
                setTargetLeave(null);
                setRejectionReason("");
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-500 text-white"
              onClick={handleRejectConfirm}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
