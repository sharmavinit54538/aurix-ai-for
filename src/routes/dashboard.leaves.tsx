import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  FileText, Check, X, Calendar, Sparkles, Plus, AlertCircle,
  TrendingUp, Clock, CheckCircle2, XCircle, Info, RefreshCw, Briefcase,
  HelpCircle, ShieldCheck, Users, Search, UserCheck
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

export function LeavesPage() {
  const ws = useAurix();
  const userRole = ws.user?.role || "employee"; // "admin", "manager", "employee"
  const employeesList = ws.employees || [];

  // Tabs routing based on role
  // Default tab is 'my-leaves'
  const [activeTab, setActiveTab] = useState<string>("my-leaves");

  // Balances of logged-in employee
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  // History of logged-in employee
  const [history, setHistory] = useState<LeaveRequest[]>([]);
  
  // Pending approvals (visible to Admin/Manager)
  const [approvals, setApprovals] = useState<LeaveRequest[]>([]);

  // Search & employee balances (visible to Admin)
  const [adminSearch, setAdminSearch] = useState("");
  const [selectedAdminEmp, setSelectedAdminEmp] = useState<any | null>(null);
  const [selectedEmpBalances, setSelectedEmpBalances] = useState<LeaveBalance[]>([]);
  const [empBalancesLoading, setEmpBalancesLoading] = useState(false);

  // Apply Leave Modal
  const [applyOpen, setApplyOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // Rejection Dialog states
  const [rejectOpen, setRejectOpen] = useState(false);
  const [targetLeave, setTargetLeave] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Helper date string formatter
  const formatDateStr = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Calculate calendar days
  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = e.getTime() - s.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }, [startDate, endDate]);

  // Load current user balances
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

  // Load current user history
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

  // Load team pending requests
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

  // Load details for admin view of specific employee
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

  // Filter employees list for admin
  const filteredEmployees = useMemo(() => {
    if (!adminSearch) return employeesList;
    return employeesList.filter(e => 
      e.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (e.department || "").toLowerCase().includes(adminSearch.toLowerCase())
    );
  }, [employeesList, adminSearch]);

  // Sync state triggers
  useEffect(() => {
    if (activeTab === "my-leaves") {
      loadBalances();
      loadHistory();
    } else if (activeTab === "approvals") {
      loadPendingApprovals();
    }
  }, [activeTab]);

  // Initial load
  useEffect(() => {
    loadBalances();
    loadHistory();
    if (userRole === "admin" || userRole === "manager") {
      loadPendingApprovals();
    }
  }, [userRole]);

  // Submit apply form
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
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to apply leave. Ensure you have enough remaining balance.");
    } finally {
      setLoading(false);
    }
  };

  // Approve action
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

  // Reject action
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
        {/* Tab 1: My Leaves (Visible to everyone, default tab) */}
        {activeTab === "my-leaves" && (
          <motion.div
            key="my-leaves"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Balance Cards Deck */}
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

            {/* History Table */}
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

        {/* Tab 2: Review Requests (Visible to Admin/Manager) */}
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

        {/* Tab 3: Employee Balances (Visible to Admin/HR only) */}
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
              {/* Left Column: List of Employees */}
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

              {/* Right Column: Selected Employee Balances */}
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

      {/* Apply Leave Dialog */}
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

      {/* Reject Reason input dialog */}
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
