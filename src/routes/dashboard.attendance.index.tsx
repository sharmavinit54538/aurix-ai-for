import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  CalendarDays, Check, Clock, X, LayoutDashboard, Fingerprint, History as HistoryIcon,
  CalendarRange, Timer, FileEdit, Coffee, FileBarChart, ShieldCheck, Download,
  MapPin, AlertCircle, Info, RefreshCw, Send, AlertTriangle
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAurix } from "@/lib/aurix-store";
import { CheckInPage } from "./dashboard.attendance.checkin";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/attendance/")({
  head: () => ({ meta: [{ title: "Attendance — Aurix" }] }),
  component: AttendancePage,
});

interface AttendanceTab {
  id: string;
  label: string;
  icon: any;
}

const MOCK_REGULARIZATIONS: any[] = [];

function AttendancePage() {
  const ws = useAurix();
  const userRole = (ws.user?.role || "employee") as string;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const [activeTab, setActiveTab] = useState(userRole === "employee" ? "dashboard" : "overview");

  // State for forms
  const [regDate, setRegDate] = useState("");
  const [regType, setRegType] = useState("Forgot Check-Out");
  const [regReason, setRegReason] = useState("");
  const [regLogs, setRegLogs] = useState<any[]>(MOCK_REGULARIZATIONS);

  // attendance stats from real store data - all start at 0
  const presentDays = 0;
  const lateCheckins = 0;
  const approvedLeave = 0;
  const halfDays = 0;

  // history & breaks are empty until real API is wired
  const historyLogs: any[] = [];
  const breakLogs: any[] = [];

  // Generate deterministic mock status from each employee id
  function statusFor(id: string): "present" | "late" | "absent" | "leave" {
    const x = id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % 10;
    if (x < 7) return "present";
    if (x < 8) return "late";
    if (x < 9) return "leave";
    return "absent";
  }

  const employeeTabs: AttendanceTab[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "checkin", label: "Check In / Check Out", icon: Fingerprint },
    { id: "history", label: "Attendance History", icon: HistoryIcon },
    { id: "calendar", label: "Monthly Calendar", icon: CalendarRange },
    { id: "shifts", label: "Shift Details", icon: Clock },
    { id: "overtime", label: "Overtime", icon: Timer },
    { id: "regularization", label: "Regularization", icon: FileEdit },
    { id: "breaks", label: "Break Time", icon: Coffee },
    { id: "reports", label: "Attendance Reports", icon: FileBarChart },
  ];

  const handleRegularizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regDate) {
      toast.error("Please select a date.");
      return;
    }
    if (!regReason.trim()) {
      toast.error("Please provide a reason for regularization.");
      return;
    }
    const newReg = {
      id: "reg-" + Date.now(),
      date: regDate,
      type: regType,
      reason: regReason,
      status: "pending",
      approvedBy: ""
    };
    setRegLogs([newReg, ...regLogs]);
    toast.success("Regularization request submitted successfully!");
    setRegDate("");
    setRegReason("");
  };

  // If user is employee, render consolidated tabbed page
  if (userRole === "employee") {
    return (
      <>
        <PageHeader
          title="Attendance & Timing Portal"
          description="Manage your check-ins, view shift calendars, log breaks, and check timing reports."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-1">
            {employeeTabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active 
                      ? "bg-accent text-foreground" 
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </aside>

          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="text-base font-semibold">Attendance Overview</h3>
                    <p className="text-xs text-muted-foreground">Today's Date: {today}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Card className="bg-background/40">
                    <CardHeader className="p-4 pb-2">
                      <CardDescription className="text-xs uppercase font-semibold">Present Days</CardDescription>
                      <CardTitle className="text-2xl mt-1 text-emerald-500 font-bold">{presentDays}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-background/40">
                    <CardHeader className="p-4 pb-2">
                      <CardDescription className="text-xs uppercase font-semibold">Late Check-ins</CardDescription>
                      <CardTitle className="text-2xl mt-1 text-amber-500 font-bold">{lateCheckins}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-background/40">
                    <CardHeader className="p-4 pb-2">
                      <CardDescription className="text-xs uppercase font-semibold">Approved Leave</CardDescription>
                      <CardTitle className="text-2xl mt-1 text-indigo-500 font-bold">{approvedLeave}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-background/40">
                    <CardHeader className="p-4 pb-2">
                      <CardDescription className="text-xs uppercase font-semibold">Half Days</CardDescription>
                      <CardTitle className="text-2xl mt-1 text-sky-500 font-bold">{halfDays}</CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <Card className="bg-background/30 border border-border/80">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      Shift & Weekly Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Weekly Required Hours</span>
                        <span className="font-semibold text-foreground text-sm">—</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Completed This Week</span>
                        <span className="font-semibold text-emerald-500 text-sm">—</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Average Daily Hours</span>
                        <span className="font-semibold text-indigo-400 text-sm">—</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "checkin" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b border-border pb-2">Clock In / Clock Out</h3>
                <CheckInPage />
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="text-base font-semibold">Attendance Log History</h3>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
                    <Download className="h-3.5 w-3.5" /> Export Logs
                  </Button>
                </div>
                {historyLogs.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                    No attendance history records found for this period.
                  </div>
                ) : (
                  <Card className="border border-border bg-card/50 backdrop-blur-md overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/20">
                        <TableRow>
                          <TableHead className="pl-6 py-4">Date</TableHead>
                          <TableHead className="py-4">Check In</TableHead>
                          <TableHead className="py-4">Check Out</TableHead>
                          <TableHead className="py-4 text-center">Total Breaks</TableHead>
                          <TableHead className="py-4">Working Hours</TableHead>
                          <TableHead className="py-4">Location</TableHead>
                          <TableHead className="pr-6 py-4">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historyLogs.map((item, i) => (
                          <TableRow key={i} className="border-b border-border/80 hover:bg-muted/5 transition-all text-xs">
                            <TableCell className="pl-6 py-4 font-semibold text-foreground">{item.date}</TableCell>
                            <TableCell className="py-4 font-mono">{item.in}</TableCell>
                            <TableCell className="py-4 font-mono">{item.out}</TableCell>
                            <TableCell className="py-4 text-center text-muted-foreground">{item.break}</TableCell>
                            <TableCell className="py-4 font-semibold text-foreground">{item.hours}</TableCell>
                            <TableCell className="py-4 text-muted-foreground">{item.loc}</TableCell>
                            <TableCell className="pr-6 py-4">
                              <Badge
                                variant={item.status === "present" ? "secondary" : item.status === "late" ? "outline" : "destructive"}
                                className={`text-[10px] uppercase font-bold ${
                                  item.status === "late" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                  item.status === "leave" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : ""
                                }`}
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "calendar" && (() => {
              const todayDate = new Date();
              const currentYear = todayDate.getFullYear();
              const currentMonth = todayDate.getMonth();
              const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
              const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
              
              const monthName = todayDate.toLocaleString("en-US", { month: "long", year: "numeric" });
              const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
              const cells: (number | null)[] = Array(firstDayIndex).fill(null);
              for (let i = 1; i <= daysInMonth; i++) cells.push(i);

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-base font-semibold">Monthly Calendar - {monthName}</h3>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 max-w-lg mx-auto">
                    {dayLabels.map(d => (
                      <div key={d} className="text-center font-bold text-xs text-muted-foreground py-1">{d}</div>
                    ))}
                    {cells.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} className="h-12" />;
                      }
                      
                      const cellDate = new Date(currentYear, currentMonth, day);
                      const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
                      const isToday = day === todayDate.getDate() && currentMonth === todayDate.getMonth() && currentYear === todayDate.getFullYear();

                      return (
                        <div
                          key={`day-${day}`}
                          className={`h-12 border border-border/40 rounded-xl p-2 flex flex-col justify-between text-left transition-colors ${
                            isToday
                              ? "ring-2 ring-indigo-500 bg-indigo-500/10"
                              : isWeekend
                              ? "bg-muted/20 text-muted-foreground/50"
                              : "bg-card/25 hover:bg-card/45"
                          }`}
                        >
                          <span className="text-[10px] font-bold text-muted-foreground">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {activeTab === "shifts" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-base font-semibold border-b border-border pb-2">Active Shift Details</h3>
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No shift details assigned yet. Contact your HR administrator.
                </div>
              </div>
            )}

            {activeTab === "overtime" && (
              <div className="space-y-6">
                <h3 className="text-base font-semibold border-b border-border pb-2">Overtime Records</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-background/40">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs uppercase">Accumulated Overtime</CardDescription>
                      <CardTitle className="text-2xl mt-1 font-bold text-emerald-500">0h 00m</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-background/40">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs uppercase">Pending Overtime Claims</CardDescription>
                      <CardTitle className="text-2xl mt-1 font-bold text-amber-500">0h 00m</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "regularization" && (
              <div className="grid gap-6 md:grid-cols-2">
                <form onSubmit={handleRegularizeSubmit} className="space-y-4">
                  <h3 className="text-base font-semibold border-b border-border pb-2">Raise Regularization Request</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Date to Regularize</Label>
                    <Input
                      type="date"
                      required
                      value={regDate}
                      onChange={(e) => setRegDate(e.target.value)}
                      className="bg-background/50 border border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Regularization Type</Label>
                    <select
                      value={regType}
                      onChange={(e) => setRegType(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                    >
                      <option value="Forgot Check-Out">Forgot Check-Out</option>
                      <option value="Forgot Check-In">Forgot Check-In</option>
                      <option value="Biometric Failure">Biometric Failure</option>
                      <option value="Incorrect Clock timings">Incorrect Clock timings</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Reason / Justification</Label>
                    <textarea
                      required
                      value={regReason}
                      onChange={(e) => setRegReason(e.target.value)}
                      placeholder="Explain why you require regularization..."
                      className="w-full min-h-[90px] bg-background/50 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                    Submit Request
                  </Button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold border-b border-border pb-2">Regularization History</h3>
                  {regLogs.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                      No regularization requests submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[350px] overflow-y-auto">
                      {regLogs.map((log) => (
                        <div key={log.id} className="border border-border bg-card/30 rounded-xl p-3 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold">{log.type}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">Date: {log.date}</div>
                            {log.approvedBy && (
                              <div className="text-[9px] text-emerald-500 font-semibold mt-0.5">Approved by {log.approvedBy}</div>
                            )}
                          </div>
                          <Badge
                            variant={log.status === "approved" ? "secondary" : "outline"}
                            className="text-[10px] capitalize"
                          >
                            {log.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "breaks" && (
              <div className="space-y-6">
                <h3 className="text-base font-semibold border-b border-border pb-2">Logged Breaks</h3>
                {breakLogs.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                    No break logs recorded for today.
                  </div>
                ) : (
                  <div className="space-y-3 max-w-md text-xs">
                    {breakLogs.map((b: any, i: number) => (
                      <div key={i} className="border border-border bg-card/30 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm">{b.name}</div>
                          <div className="text-muted-foreground mt-0.5">Duration: {b.duration}</div>
                        </div>
                        <Badge variant="outline">Recorded</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6 max-w-md">
                <h3 className="text-base font-semibold border-b border-border pb-2">Download Attendance Reports</h3>
                <div className="space-y-3">
                  <div className="border border-border bg-card/30 rounded-xl p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-sm">Monthly Attendance Summary (PDF)</div>
                      <div className="text-muted-foreground mt-0.5">Summary of total hours worked this month.</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Downloading report...")}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border border-border bg-card/30 rounded-xl p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-sm">Punch Log Details (CSV)</div>
                      <div className="text-muted-foreground mt-0.5">Exact check-in / check-out timestamps list.</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Downloading punch logs...")}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }


  // Original Admin Dashboard view
  const stats = { present: 0, late: 0, absent: ws.employees.length, leave: 0 };
  const cards = [
    { key: "present", label: "Present", color: "text-emerald-500", icon: Check },
    { key: "late", label: "Late", color: "text-amber-500", icon: Clock },
    { key: "leave", label: "On leave", color: "text-blue-500", icon: CalendarDays },
    { key: "absent", label: "Absent", color: "text-destructive", icon: X },
  ] as const;

  const adminTabs = [
    { id: "overview", label: "Today's Attendance", icon: LayoutDashboard },
    { id: "shifts", label: "Work Shifts", icon: Clock },
    { id: "rosters", label: "Rosters & Schedules", icon: FileEdit },
    { id: "holidays", label: "Holidays & Calendar", icon: CalendarDays },
  ];

  return (
    <>
      <PageHeader
        title="Attendance Management"
        description="Track employee check-ins, configure shift schedules, manage rosters, and define holiday calendars."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {adminTabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active 
                    ? "bg-accent text-foreground" 
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </aside>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {cards.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.key} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</span>
                        <Icon className={`h-4 w-4 ${c.color}`} />
                      </div>
                      <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{stats[c.key]}</div>
                    </div>
                  );
                })}
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
                <div className="border-b border-border px-4 py-3"><h3 className="font-medium">Today's attendance</h3></div>
                {ws.employees.length === 0 ? (
                  <div className="p-12 text-center text-sm text-muted-foreground">No employees to display.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Check-in</th><th className="px-4 py-3">Status</th></tr>
                      </thead>
                      <tbody>
                        {ws.employees.map((e) => {
                          return (
                            <tr key={e.id} className="border-t border-border">
                              <td className="px-4 py-3 font-medium">{e.fullName}</td>
                              <td className="px-4 py-3 text-muted-foreground">{e.department || "—"}</td>
                              <td className="px-4 py-3 text-muted-foreground">—</td>
                              <td className="px-4 py-3">
                                <Badge variant="destructive" className="capitalize">absent</Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "shifts" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b border-border pb-2">Shift Management</h3>
              <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                No custom shift templates defined yet. Default general shift (9:00 AM - 6:00 PM) is assigned to all employees.
              </div>
            </div>
          )}

          {activeTab === "rosters" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b border-border pb-2">Rosters & Schedules</h3>
              <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                No active weekly rosters generated yet. General shifts are automatically scheduled.
              </div>
            </div>
          )}

          {activeTab === "holidays" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b border-border pb-2">Holiday Calendar</h3>
              <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                No public holidays configured for the current calendar period.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
