import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Briefcase,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSignature,
  Filter,
  GraduationCap,
  LogOut as LogOutIcon,
  PartyPopper,
  Plane,
  Plus,
  Printer,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserCog,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiInstance } from "@/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHrms } from "@/lib/hrms/store";

export type TimelineKind =
  | "joining"
  | "promotion"
  | "department-change"
  | "salary-revision"
  | "attendance"
  | "leave"
  | "performance"
  | "training"
  | "certification"
  | "award"
  | "warning"
  | "project"
  | "exit";

export interface TimelineEventItem {
  id: string;
  kind: TimelineKind;
  title: string;
  employeeName: string;
  employeeId?: string;
  department?: string;
  date: string;
  description?: string;
  performedBy?: string;
  accentColor?: string;
}

const KIND_META: Record<
  TimelineKind,
  {
    icon: any;
    tone: "emerald" | "blue" | "violet" | "amber" | "rose" | "cyan" | "primary" | "muted" | "destructive" | string;
    label: string;
    gradient: string;
    bg: string;
  }
> = {
  joining: {
    icon: UserCheck,
    tone: "primary",
    label: "Joining & Onboarding",
    gradient: "",
    bg: "bg-primary/10 text-primary border-primary/20",
  },
  promotion: {
    icon: TrendingUp,
    tone: "primary",
    label: "Promotion & Rank",
    gradient: "",
    bg: "bg-primary/10 text-primary border-primary/20",
  },
  "department-change": {
    icon: UserCog,
    tone: "primary",
    label: "Department Transfer",
    gradient: "",
    bg: "bg-primary/10 text-primary border-primary/20",
  },
  "salary-revision": {
    icon: Wallet,
    tone: "primary",
    label: "Salary & Compensation",
    gradient: "",
    bg: "bg-primary/10 text-primary border-primary/20",
  },
  attendance: {
    icon: CalendarCheck,
    tone: "primary",
    label: "Attendance & Shift",
    gradient: "",
    bg: "bg-primary/10 text-primary border-primary/20",
  },
  leave: {
    icon: Plane,
    tone: "muted",
    label: "Leave & Sabbatical",
    gradient: "",
    bg: "bg-muted text-muted-foreground border-border",
  },
  performance: {
    icon: Sparkles,
    tone: "primary",
    label: "Performance Review",
    gradient: "",
    bg: "bg-primary/10 text-primary border-primary/20",
  },
  training: {
    icon: GraduationCap,
    tone: "muted",
    label: "Training & Upskilling",
    gradient: "",
    bg: "bg-muted text-foreground border-border",
  },
  certification: {
    icon: FileSignature,
    tone: "primary",
    label: "Certification",
    gradient: "",
    bg: "bg-primary/10 text-primary border-primary/20",
  },
  award: {
    icon: Award,
    tone: "primary",
    label: "Award & Recognition",
    gradient: "",
    bg: "bg-primary/10 text-primary border-primary/20",
  },
  warning: {
    icon: ShieldAlert,
    tone: "destructive",
    label: "Compliance & Warning",
    gradient: "",
    bg: "bg-destructive/10 text-destructive border-destructive/20",
  },
  project: {
    icon: Briefcase,
    tone: "muted",
    label: "Project Assignment",
    gradient: "",
    bg: "bg-muted text-foreground border-border",
  },
  exit: {
    icon: LogOutIcon,
    tone: "destructive",
    label: "Exit & Offboarding",
    gradient: "",
    bg: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const ALL_KINDS = Object.keys(KIND_META) as TimelineKind[];

export function TimelinePage() {
  const storeTimeline = useHrms((s) => s.timeline);

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<TimelineEventItem[]>([]);
  const [query, setQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEmployee, setNewEmployee] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newKind, setNewKind] = useState<TimelineKind>("joining");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newDescription, setNewDescription] = useState("");
  const [newPerformedBy, setNewPerformedBy] = useState("HR Admin");

  const fetchLiveTimelineEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, intRes, deptsRes, exitsRes] = await Promise.allSettled([
        apiInstance.get("/employees"),
        apiInstance.get("/internal/dashboard"),
        apiInstance.get("/departments"),
        apiInstance.get("/exits"),
      ]);

      const liveList: TimelineEventItem[] = [];

      // 1. Live Employees
      if (empRes.status === "fulfilled" && empRes.value.data?.data) {
        const empItems = empRes.value.data.data.items ?? empRes.value.data.data ?? [];
        empItems.forEach((e: any, idx: number) => {
          const empName =
            [e.first_name, e.last_name].filter(Boolean).join(" ").trim() ||
            e.full_name ||
            e.name ||
            `Employee #${e.employee_id || idx + 1}`;
          const desig = e.designation || e.role || "Specialist";
          const dept = e.department || e.department_name || "General";
          const joinDate = e.joining_date
            ? String(e.joining_date).split("T")[0]
            : e.created_at
              ? String(e.created_at).split("T")[0]
              : "2026-07-21";

          liveList.push({
            id: `api_emp_join_${e.id ?? idx}`,
            kind: "joining",
            title: `Joined Enterprise as ${desig}`,
            employeeName: empName,
            employeeId: e.employee_id || `EMP-${1000 + idx}`,
            department: dept,
            date: joinDate,
            description: `Onboarding completed. System account active (${e.company_email || e.personal_email || "N/A"}).`,
            performedBy: "HR Automated Sync",
          });
        });
      }

      // 2. Live Departments
      if (deptsRes.status === "fulfilled" && deptsRes.value.data?.data) {
        const deptItems = deptsRes.value.data.data.items ?? deptsRes.value.data.data ?? [];
        deptItems.forEach((d: any, idx: number) => {
          liveList.push({
            id: `api_dept_${d.id ?? idx}`,
            kind: "department-change",
            title: `Department Established: ${d.department_name || d.name}`,
            employeeName: d.manager_name || d.departmentHeadName || "Department Head",
            department: d.department_name || d.name,
            date: d.created_at ? String(d.created_at).split("T")[0] : "2026-07-20",
            description: `Department code ${d.department_code || "DEP"} configured with location ${d.location || "Office"}.`,
            performedBy: "Enterprise Admin",
          });
        });
      }

      // 3. Live Internal Announcements & News
      if (intRes.status === "fulfilled" && intRes.value.data?.data) {
        const announcements =
          intRes.value.data.data.pinned_announcements ??
          intRes.value.data.data.recent_announcements ??
          [];
        announcements.forEach((a: any, idx: number) => {
          liveList.push({
            id: `api_ann_${a.id ?? idx}`,
            kind: "project",
            title: a.title ?? "Enterprise Milestone Event",
            employeeName: a.author_name ?? "Leadership Office",
            department: "Enterprise",
            date: a.created_at ? String(a.created_at).split("T")[0] : "2026-07-15",
            description:
              a.content ?? a.summary ?? "Official company announcement logged in timeline history.",
            performedBy: a.author_name ?? "Executive Team",
          });
        });
      }

      // 4. Live Exits
      if (exitsRes.status === "fulfilled" && exitsRes.value.data?.data) {
        const exitItems = exitsRes.value.data.data.items ?? exitsRes.value.data.data ?? [];
        exitItems.forEach((x: any, idx: number) => {
          liveList.push({
            id: `api_exit_${x.id ?? idx}`,
            kind: "exit",
            title: `Offboarding Initiated: ${x.employee_name || "Employee"}`,
            employeeName: x.employee_name || "Employee",
            department: x.department || "Operations",
            date: x.exit_date ? String(x.exit_date).split("T")[0] : "2026-07-01",
            description: `Reason: ${x.reason || "Resignation"}. Clearance workflow active.`,
            performedBy: "Offboarding Manager",
          });
        });
      }

      // Deduplicate by ID
      const uniqueMap = new Map<string, TimelineEventItem>();
      liveList.forEach((item) => uniqueMap.set(item.id, item));
      setEvents(Array.from(uniqueMap.values()));
    } catch (err) {
      console.error("Failed to load live timeline events", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveTimelineEvents();
  }, [fetchLiveTimelineEvents]);

  const allEmployees = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.employeeName))).sort();
  }, [events]);

  const allDepartments = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.department).filter(Boolean))).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => (selectedEmployee === "all" ? true : e.employeeName === selectedEmployee))
      .filter((e) => (selectedCategory === "all" ? true : e.kind === selectedCategory))
      .filter((e) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.employeeName.toLowerCase().includes(q) ||
          (e.department || "").toLowerCase().includes(q) ||
          (e.description || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, selectedEmployee, selectedCategory, query]);

  // Group events by Month Year
  const groupedEvents = useMemo(() => {
    const map = new Map<string, TimelineEventItem[]>();
    filteredEvents.forEach((evt) => {
      const d = new Date(evt.date);
      const groupKey = isNaN(d.getTime())
        ? "Recent Activity"
        : d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!map.has(groupKey)) {
        map.set(groupKey, []);
      }
      map.get(groupKey)!.push(evt);
    });
    return Array.from(map.entries());
  }, [filteredEvents]);

  // Metric Stats
  const totalEventsCount = events.length;
  const joiningCount = events.filter((e) => e.kind === "joining").length;
  const promotionCount = events.filter((e) => e.kind === "promotion" || e.kind === "award").length;
  const transferCount = events.filter(
    (e) => e.kind === "department-change" || e.kind === "salary-revision",
  ).length;

  function handleCreateEvent() {
    if (!newTitle.trim() || !newEmployee.trim()) {
      toast.error("Please enter event title and employee name.");
      return;
    }

    const created: TimelineEventItem = {
      id: `evt_user_${Date.now()}`,
      kind: newKind,
      title: newTitle.trim(),
      employeeName: newEmployee.trim(),
      department: newDepartment.trim() || "General",
      date: newDate || new Date().toISOString().split("T")[0],
      description: newDescription.trim(),
      performedBy: newPerformedBy.trim() || "HR Lead",
    };

    setEvents((prev) => [created, ...prev]);
    toast.success("Timeline event logged successfully!");
    setAddModalOpen(false);
    setNewTitle("");
    setNewEmployee("");
    setNewDepartment("");
    setNewDescription("");
  }

  function handleExportCSV() {
    const headers = "ID,Kind,Title,Employee,Department,Date,PerformedBy,Description\n";
    const rows = filteredEvents
      .map((e) =>
        [
          e.id,
          e.kind,
          `"${e.title.replace(/"/g, '""')}"`,
          `"${e.employeeName.replace(/"/g, '""')}"`,
          `"${(e.department || "").replace(/"/g, '""')}"`,
          e.date,
          `"${(e.performedBy || "").replace(/"/g, '""')}"`,
          `"${(e.description || "").replace(/"/g, '""')}"`,
        ].join(","),
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HR_Lifecycle_Timeline_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Timeline exported to CSV successfully.");
  }

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Events
              </span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 font-display text-2xl font-bold">{totalEventsCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Logged lifecycle records</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Onboarding & Joins
              </span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 font-display text-2xl font-bold">{joiningCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">New team members</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Promotions & Awards
              </span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 font-display text-2xl font-bold">{promotionCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Recognitions & rank ups</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Transfers & Salaries
              </span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 font-display text-2xl font-bold">{transferCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Internal role movements</div>
          </div>
        </motion.div>
      </div>

      {/* Ultra-Sleek Compact Filter Control Bar */}
      <div className="rounded-2xl border border-border bg-card p-3 space-y-2.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employee, title, department..."
              className="pl-8 h-8 text-xs bg-background/80"
            />
          </div>

          {/* Employee Filter */}
          <div className="w-[180px]">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="h-8 text-xs bg-background/80">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees ({allEmployees.length})</SelectItem>
                {allEmployees.map((emp) => (
                  <SelectItem key={emp} value={emp}>
                    {emp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter Dropdown */}
          <div className="w-[190px]">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-8 text-xs bg-background/80">
                <SelectValue placeholder="All Event Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {ALL_KINDS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {KIND_META[k].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {(query || selectedEmployee !== "all" || selectedCategory !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setSelectedEmployee("all");
                setSelectedCategory("all");
              }}
              className="h-8 text-xs px-2.5 text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-3 w-3" /> Reset
            </Button>
          )}

          {/* Action buttons */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-8 text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => setAddModalOpen(true)}
              className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> Log New Event
            </Button>
          </div>
        </div>



      </div>

      {/* Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted mx-auto text-muted-foreground mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold">No Timeline Events Found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Try resetting your search parameters or category filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery("");
              setSelectedEmployee("all");
              setSelectedCategory("all");
            }}
            className="mt-4 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedEvents.map(([groupName, groupItems]) => (
            <div key={groupName} className="space-y-4">
              {/* Group Header */}
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-semibold tracking-tight text-foreground">
                  {groupName}
                </span>
                <span className="h-px flex-1 bg-border/60" />
                <Badge variant="outline" className="text-[10px] rounded-full px-2">
                  {groupItems.length} {groupItems.length === 1 ? "event" : "events"}
                </Badge>
              </div>

              {/* Group Items */}
              <div className="relative ml-4 border-l-2 border-border/60 space-y-6 pl-6">
                {groupItems.map((evt, idx) => {
                  const meta = KIND_META[evt.kind] ?? KIND_META.joining;
                  const Icon = meta.icon;

                  return (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      className="relative group"
                    >
                      {/* Timeline Dot Node */}
                      <div
                        className="absolute -left-[35px] top-1.5 grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary shadow-sm ring-4 ring-background transition-transform group-hover:scale-110"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      {/* Event Card Content */}
                      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all group-hover:border-foreground/20 group-hover:shadow-md">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display text-sm font-semibold text-foreground">
                                {evt.title}
                              </h3>
                              <Badge variant="outline" className={`text-[10px] font-medium border ${meta.bg}`}>

                                {meta.label}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span className="font-medium text-foreground">
                                {evt.employeeName}
                              </span>
                              {evt.employeeId && (
                                <>
                                  <span>·</span>
                                  <span className="font-mono text-[11px]">{evt.employeeId}</span>
                                </>
                              )}
                              {evt.department && (
                                <>
                                  <span>·</span>
                                  <span>{evt.department}</span>
                                </>
                              )}
                              <span>·</span>
                              <span>
                                {new Date(evt.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>

                          {evt.performedBy && (
                            <span className="text-[11px] text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md border border-border/40">
                              Logged by:{" "}
                              <strong className="font-medium text-foreground">
                                {evt.performedBy}
                              </strong>
                            </span>
                          )}
                        </div>

                        {evt.description && (
                          <p className="mt-3 text-xs text-muted-foreground leading-relaxed bg-background/40 p-2.5 rounded-lg border border-border/30">
                            {evt.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Event Dialog Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Log Lifecycle & Activity Event
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record an official milestone event into the employee timeline history.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs">Employee Name *</Label>
              <Input
                value={newEmployee}
                onChange={(e) => setNewEmployee(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Event Type *</Label>
                <Select value={newKind} onValueChange={(val) => setNewKind(val as TimelineKind)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_KINDS.map((k) => (
                      <SelectItem key={k} value={k}>
                        {KIND_META[k].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Event Date *</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Title / Event Headline *</Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Promoted to Senior Lead"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Department</Label>
                <Input
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="e.g. Engineering"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description & Notes</Label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add event context or resolution details..."
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Logged By</Label>
              <Input
                value={newPerformedBy}
                onChange={(e) => setNewPerformedBy(e.target.value)}
                placeholder="e.g. HR Operations"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateEvent} className="text-xs">
              Save Event Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TimelinePage;
