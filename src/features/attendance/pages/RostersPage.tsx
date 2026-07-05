import { useState, useMemo } from "react";
import {
  ScrollText,
  Plus,
  Sparkles,
  Upload,
  Download,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  List,
  MapPin,
  Building2,
  User,
  Layers,
  CheckCircle,
  Copy,
  Trash2,
  Edit,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface RosterEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  date: string; // YYYY-MM-DD
  shift: "Morning" | "Evening" | "Night" | "Off Day" | "Leave" | "Holiday" | "Training" | "WFH" | "Overtime";
  startTime: string;
  endTime: string;
  workingHours: number;
  breakTime: string;
  location: string;
  manager: string;
  status: "Approved" | "Pending" | "Rejected";
}

const DEFAULT_EMPLOYEES: { id: string; name: string; code: string; dept: string; role: string; mgr: string }[] = [];

const INITIAL_ROSTERS: RosterEntry[] = [];

const SHIFT_TYPES = ["Morning", "Evening", "Night", "Off Day", "Leave", "Holiday", "Training", "WFH", "Overtime"] as const;

export default function RostersPage() {
  const [rosters, setRosters] = useState<RosterEntry[]>(INITIAL_ROSTERS);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [calendarView, setCalendarView] = useState<"Day" | "Week" | "Month" | "Timeline">("Week");

  // Filters
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Auto-Save simulation status
  const [autoSaveStatus, setAutoSaveStatus] = useState("All changes auto-saved");

  // Selection & Details Drawers
  const [selectedEntry, setSelectedEntry] = useState<RosterEntry | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Forms state
  const [formEmployeeId, setFormEmployeeId] = useState("AUR-1042");
  const [formShift, setFormShift] = useState<RosterEntry["shift"]>("Morning");
  const [formDate, setFormDate] = useState("2026-06-25");
  const [formStartTime, setFormStartTime] = useState("08:00");
  const [formEndTime, setFormEndTime] = useState("16:00");
  const [formBreak, setFormBreak] = useState("45 mins");
  const [formLocation, setFormLocation] = useState("San Francisco HQ");
  const [formStatus, setFormStatus] = useState<RosterEntry["status"]>("Approved");
  const [formRecurring, setFormRecurring] = useState(false);

  // Create Roster form
  const [createRosterName, setCreateRosterName] = useState("");
  const [createRosterDept, setCreateRosterDept] = useState("Engineering");
  const [createRosterStart, setCreateRosterStart] = useState("2026-06-22");
  const [createRosterEnd, setCreateRosterEnd] = useState("2026-06-28");

  // Confirm delete flow
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<RosterEntry | null>(null);

  // Drag and drop mock swap / reassign helper state
  const [draggingEntryId, setDraggingEntryId] = useState<string | null>(null);

  // Static week days (no Date.now() during render)
  const currentWeekDays = [
    { dayName: "Mon", dateStr: "2026-06-22", label: "22 Jun" },
    { dayName: "Tue", dateStr: "2026-06-23", label: "23 Jun" },
    { dayName: "Wed", dateStr: "2026-06-24", label: "24 Jun" },
    { dayName: "Thu", dateStr: "2026-06-25", label: "25 Jun" }, // Today
    { dayName: "Fri", dateStr: "2026-06-26", label: "26 Jun" },
    { dayName: "Sat", dateStr: "2026-06-27", label: "27 Jun" },
    { dayName: "Sun", dateStr: "2026-06-28", label: "28 Jun" },
  ];

  // Auto-Save Trigger
  const triggerAutoSave = () => {
    setAutoSaveStatus("Saving changes...");
    setTimeout(() => {
      setAutoSaveStatus("Saved a few seconds ago");
    }, 800);
  };

  const handleResetFilters = () => {
    setSearch("");
    setDeptFilter("all");
    setShiftFilter("all");
    setLocationFilter("all");
    setManagerFilter("all");
    setStatusFilter("all");
    toast.success("Filters reset successfully");
  };

  // Filtered Roster Entries
  const filteredRosters = useMemo(() => {
    return rosters.filter((r) => {
      if (search && !`${r.employeeName} ${r.department} ${r.shift}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (deptFilter !== "all" && r.department.toLowerCase() !== deptFilter.toLowerCase()) return false;
      if (shiftFilter !== "all" && r.shift.toLowerCase() !== shiftFilter.toLowerCase()) return false;
      if (locationFilter !== "all" && r.location.toLowerCase() !== locationFilter.toLowerCase()) return false;
      if (managerFilter !== "all" && r.manager.toLowerCase() !== managerFilter.toLowerCase()) return false;
      if (statusFilter !== "all" && r.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      return true;
    });
  }, [rosters, search, deptFilter, shiftFilter, locationFilter, managerFilter, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const assignedCount = new Set(filteredRosters.map((r) => r.employeeId)).size;
    const openShifts = filteredRosters.filter((r) => r.shift === "Off Day").length;
    const overtimeHours = filteredRosters.filter((r) => r.shift === "Overtime").reduce((sum, r) => sum + r.workingHours, 0);
    const pendingCount = filteredRosters.filter((r) => r.status === "Pending").length;

    let conflicts = 0;
    const doubleShiftTracker = new Set<string>();
    filteredRosters.forEach((r) => {
      const key = `${r.employeeId}-${r.date}`;
      if (doubleShiftTracker.has(key)) {
        conflicts++;
      } else {
        doubleShiftTracker.add(key);
      }
      if (r.shift === "Overtime") conflicts++;
      if (r.shift === "Leave" && r.workingHours > 0) conflicts++;
    });

    return {
      activeRosters: 3,
      employeesAssigned: assignedCount || DEFAULT_EMPLOYEES.length,
      openShifts: openShifts || 5,
      coverage: "94.2%",
      overtime: overtimeHours || 16,
      pending: pendingCount,
      conflicts,
    };
  }, [filteredRosters]);

  // Conflict Warnings & Smart Suggestions
  const conflictList = useMemo(() => {
    const list: { id: string; employeeName: string; type: string; date: string; message: string }[] = [];

    const dayMap = new Map<string, RosterEntry[]>();
    rosters.forEach((r) => {
      const key = `${r.employeeId}-${r.date}`;
      const existing = dayMap.get(key) || [];
      existing.push(r);
      dayMap.set(key, existing);
    });

    dayMap.forEach((entries, key) => {
      const empName = entries[0].employeeName;
      const date = key.slice(key.indexOf("-") + 1); // everything after first dash
      if (entries.length > 1) {
        list.push({
          id: `ds-${key}`,
          employeeName: empName,
          type: "Double Shift Detected",
          date,
          message: `${empName} has multiple shifts scheduled on ${date}.`
        });
      }
    });

    rosters.forEach((r) => {
      if (r.shift === "Leave" && r.status === "Approved") {
        list.push({
          id: `l-${r.id}`,
          employeeName: r.employeeName,
          type: "Leave Overlap",
          date: r.date,
          message: `${r.employeeName} is on leave on ${r.date} but has a schedule.`
        });
      }
      if (r.shift === "Holiday" && r.workingHours > 0) {
        list.push({
          id: `h-${r.id}`,
          employeeName: r.employeeName,
          type: "Holiday Conflict",
          date: r.date,
          message: `${r.employeeName} has a working shift scheduled on ${r.date} (Public Holiday).`
        });
      }
    });

    return list;
  }, [rosters]);

  // Handle Roster Actions — Math.random() only in event handlers (safe, client-only)
  const handleAssignShift = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = DEFAULT_EMPLOYEES.find((item) => item.code === formEmployeeId);
    if (!emp) return;

    const newRoster: RosterEntry = {
      id: "r_" + (rosters.length + 1) + "_" + Math.random().toString(36).substr(2, 4),
      employeeId: emp.code,
      employeeName: emp.name,
      department: emp.dept,
      designation: emp.role,
      date: formDate,
      shift: formShift,
      startTime: formStartTime,
      endTime: formEndTime,
      workingHours: formShift === "Off Day" || formShift === "Leave" || formShift === "Holiday" ? 0 : 8,
      breakTime: formBreak,
      location: formLocation,
      manager: emp.mgr,
      status: formStatus
    };

    setRosters((prev) => [newRoster, ...prev]);
    setIsAssignModalOpen(false);
    toast.success(`Assigned shift "${formShift}" to ${emp.name} on ${formDate}`);
    triggerAutoSave();
  };

  const handleCreateRoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createRosterName.trim()) {
      toast.error("Roster name is required");
      return;
    }
    setIsCreateModalOpen(false);
    toast.success(`Roster planner "${createRosterName}" generated for department "${createRosterDept}"`);
    triggerAutoSave();
  };

  const handleQuickFixConflicts = () => {
    setRosters((prev) => {
      const doubleShiftTracker = new Set<string>();
      return prev.map((r) => {
        const key = `${r.employeeId}-${r.date}`;
        if (doubleShiftTracker.has(key)) {
          return { ...r, shift: "Off Day", workingHours: 0, startTime: "—", endTime: "—" };
        } else {
          doubleShiftTracker.add(key);
          return r;
        }
      });
    });
    toast.success("AI resolved all schedule conflicts by re-assigning off days!");
    triggerAutoSave();
  };

  const handleAction = (action: string, entry: RosterEntry) => {
    if (action === "Approve") {
      setRosters((prev) =>
        prev.map((r) => (r.id === entry.id ? { ...r, status: "Approved" } : r))
      );
      toast.success(`Roster entry approved for ${entry.employeeName}`);
      triggerAutoSave();
    } else if (action === "Reject") {
      setRosters((prev) =>
        prev.map((r) => (r.id === entry.id ? { ...r, status: "Rejected" } : r))
      );
      toast.success(`Roster entry rejected for ${entry.employeeName}`);
      triggerAutoSave();
    } else if (action === "Delete") {
      setEntryToDelete(entry);
      setIsDeleteConfirmOpen(true);
    } else if (action === "Duplicate") {
      // Math.random() is safe here — only runs in event handler on client
      const dup: RosterEntry = {
        ...entry,
        id: "dup_" + entry.id + "_" + Math.random().toString(36).substr(2, 4),
        status: "Pending"
      };
      setRosters((prev) => [dup, ...prev]);
      toast.success(`Duplicated schedule row for ${entry.employeeName}`);
      triggerAutoSave();
    } else if (action === "Assign") {
      setFormEmployeeId(entry.employeeId);
      setFormShift(entry.shift);
      setFormDate(entry.date);
      setFormStartTime(entry.startTime);
      setFormEndTime(entry.endTime);
      setFormBreak(entry.breakTime);
      setFormLocation(entry.location);
      setFormStatus(entry.status);
      setIsAssignModalOpen(true);
    }
  };

  const confirmDeleteEntry = () => {
    if (!entryToDelete) return;
    setRosters((prev) => prev.filter((r) => r.id !== entryToDelete.id));
    setIsDeleteConfirmOpen(false);
    toast.success(`Deleted schedule for ${entryToDelete.employeeName}`, {
      action: {
        label: "Undo",
        onClick: () => {
          setRosters((prev) => [entryToDelete, ...prev]);
          toast.success(`Restored schedule for ${entryToDelete.employeeName}`);
        }
      }
    });
    triggerAutoSave();
  };

  const handleDragStart = (id: string) => {
    setDraggingEntryId(id);
  };

  const handleDropCell = (employeeId: string, dateStr: string) => {
    if (!draggingEntryId) return;
    const entryToMove = rosters.find((r) => r.id === draggingEntryId);
    if (!entryToMove) return;

    const targetEmployee = DEFAULT_EMPLOYEES.find((item) => item.code === employeeId);
    if (!targetEmployee) return;

    setRosters((prev) =>
      prev.map((r) => {
        if (r.id === draggingEntryId) {
          return {
            ...r,
            employeeId: targetEmployee.code,
            employeeName: targetEmployee.name,
            department: targetEmployee.dept,
            designation: targetEmployee.role,
            date: dateStr,
            manager: targetEmployee.mgr,
          };
        }
        return r;
      })
    );

    toast.success(`Moved ${entryToMove.employeeName}'s shift to ${targetEmployee.name} on ${dateStr}`);
    setDraggingEntryId(null);
    triggerAutoSave();
  };

  const highlightText = (text: string, searchStr: string) => {
    if (!searchStr) return text;
    const parts = text.split(new RegExp(`(${searchStr})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === searchStr.toLowerCase() ? (
            <mark key={i} className="bg-amber-500/35 text-amber-200 px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const getShiftBadgeStyle = (shift: RosterEntry["shift"]) => {
    switch (shift) {
      case "Morning": return "bg-blue-500/10 text-blue-400 border-blue-500/25";
      case "Evening": return "bg-amber-500/10 text-amber-400 border-amber-500/25";
      case "Night": return "bg-purple-500/10 text-purple-400 border-purple-500/25";
      case "Off Day": return "bg-muted/30 text-muted-foreground border-border";
      case "Leave": return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      case "Holiday": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";
      case "Training": return "bg-teal-500/10 text-teal-400 border-teal-500/25";
      case "WFH": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "Overtime": return "bg-orange-500/10 text-orange-400 border-orange-500/25";
      default: return "";
    }
  };

  // Suppress unused selectedEntry warning
  void selectedEntry;

  return (
    <div className="space-y-6">
      {/* Header section with top actions */}
      <PageHeader
        title="Roster Planner"
        description="Plan employee shifts, weekly schedules, monthly rosters, and workforce allocation."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border/80 bg-card/30 rounded-lg px-2.5 py-1.5">
              <CheckCircle className="h-3 w-3 text-emerald-500" />
              {autoSaveStatus}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.promise(
                  new Promise((resolve) => setTimeout(resolve, 1500)),
                  {
                    loading: "AI generating optimal shift coverage...",
                    success: "Optimal shift schedule generated with 0 conflicts!",
                    error: "AI generation failed.",
                  }
                );
              }}
              className="h-9 border-border bg-card/40 text-xs hover:bg-accent/60 text-blue-400"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5 text-blue-400" />
              Generate AI Roster
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Import schedule simulation active")}
              className="h-9 border-border bg-card/40 text-xs hover:bg-accent/60"
            >
              <Upload className="mr-2 h-3.5 w-3.5" />
              Import Schedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Export started")}
              className="h-9 border-border bg-card/40 text-xs hover:bg-accent/60"
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-9 bg-primary text-xs text-primary-foreground shadow-glow hover:bg-primary/95"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create Roster
            </Button>
          </div>
        }
      />

      {/* Dashboard Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        {[
          { label: "Active Rosters", value: stats.activeRosters, color: "text-blue-500 bg-blue-500/10", prog: 60, sub: "+2 this week" },
          { label: "Employees Assigned", value: stats.employeesAssigned, color: "text-emerald-500 bg-emerald-500/10", prog: 85, sub: "92% of staff" },
          { label: "Open Shifts", value: stats.openShifts, color: "text-amber-500 bg-amber-500/10", prog: 40, sub: "5 unassigned" },
          { label: "Weekly Coverage", value: stats.coverage, color: "text-indigo-500 bg-indigo-500/10", prog: 94, sub: "Target 95%" },
          { label: "Monthly Coverage", value: "92.8%", color: "text-purple-500 bg-purple-500/10", prog: 92, sub: "Stable" },
          { label: "Overtime Hours", value: `${stats.overtime}h`, color: "text-orange-500 bg-orange-500/10", prog: 15, sub: "1.2h avg/emp" },
          { label: "Pending Approvals", value: stats.pending, color: "text-teal-500 bg-teal-500/10", prog: stats.pending > 0 ? 80 : 0, sub: "Requires action" },
          { label: "Conflicts Detected", value: stats.conflicts, color: stats.conflicts > 0 ? "text-destructive bg-destructive/15 animate-pulse" : "text-emerald-500 bg-emerald-500/10", prog: stats.conflicts * 10, sub: stats.conflicts > 0 ? `${stats.conflicts} warnings` : "Clear" }
        ].map((c, i) => {
          return (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-border bg-card/40 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:bg-card/75"
            >
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                {c.label}
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  {c.value}
                </span>
                <span className="text-[9px] text-muted-foreground">{c.sub}</span>
              </div>
              <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    c.color.includes("text-destructive") ? "bg-destructive" : c.color.includes("text-emerald") ? "bg-emerald-500" : "bg-primary"
                  }`}
                  style={{ width: `${c.prog}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Filters Panel */}
      <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative min-w-[200px] flex-1 md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee, dept, shift…"
                className="h-9 pl-9 border-border text-xs focus:ring-1 focus:ring-ring focus:border-border"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span>Dept:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-transparent font-medium text-foreground outline-none cursor-pointer"
              >
                <option value="all" className="bg-background">All Departments</option>
                <option value="engineering" className="bg-background">Engineering</option>
                <option value="sales" className="bg-background">Sales</option>
                <option value="hr" className="bg-background">HR & Ops</option>
                <option value="finance" className="bg-background">Finance</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Shift Type:</span>
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="bg-transparent font-medium text-foreground outline-none cursor-pointer text-xs"
              >
                <option value="all" className="bg-background">All Shifts</option>
                {SHIFT_TYPES.map((st) => (
                  <option key={st} value={st.toLowerCase()} className="bg-background">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Location:</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-transparent font-medium text-foreground outline-none cursor-pointer"
              >
                <option value="all" className="bg-background">All Locations</option>
                <option value="san francisco hq" className="bg-background">San Francisco HQ</option>
                <option value="remote" className="bg-background">Remote</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>Manager:</span>
              <select
                value={managerFilter}
                onChange={(e) => setManagerFilter(e.target.value)}
                className="bg-transparent font-medium text-foreground outline-none cursor-pointer"
              >
                <option value="all" className="bg-background">All Managers</option>
                <option value="maya chen" className="bg-background">Maya Chen</option>
                <option value="priya nair" className="bg-background">Priya Nair</option>
                <option value="michael scott" className="bg-background">Michael Scott</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium text-foreground outline-none cursor-pointer"
              >
                <option value="all" className="bg-background">All Statuses</option>
                <option value="approved" className="bg-background">Approved</option>
                <option value="pending" className="bg-background">Pending</option>
                <option value="rejected" className="bg-background">Rejected</option>
              </select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <RefreshCw className="mr-1.5 h-3 w-3" />
              Reset Filters
            </Button>
          </div>

          {/* View switcher */}
          <div className="flex border border-border rounded-lg bg-card/80 p-0.5 overflow-hidden">
            <button
              onClick={() => setViewMode("calendar")}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "calendar"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Scheduler calendar view"
            >
              <Calendar className="h-3.5 w-3.5" />
              Scheduler
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="List view table"
            >
              <List className="h-3.5 w-3.5" />
              List Table
            </button>
          </div>
        </div>
      </div>

      {/* Main content split panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left main area (3/4 width) */}
        <div className="lg:col-span-3 space-y-6">
          {viewMode === "calendar" ? (
            /* Interactive Drag-and-Drop Scheduler Grid */
            <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-elegant">
              {/* Controls */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-muted/20">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
                    Weekly Shift Planner
                  </h3>
                  <span className="text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md font-mono">
                    22 Jun 2026 - 28 Jun 2026
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex border border-border rounded-lg p-0.5 bg-card/85 text-[11px]">
                    {["Day", "Week", "Month", "Timeline"].map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setCalendarView(v as any);
                          toast.info(`Switched view to ${v} (Demo Mode)`);
                        }}
                        className={`px-2.5 py-1 rounded ${
                          calendarView === v ? "bg-muted font-bold text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <button
                      onClick={() => toast.info("Previous week")}
                      className="rounded border border-border p-1 hover:bg-accent"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toast.info("Next week")}
                      className="rounded border border-border p-1 hover:bg-accent"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Roster Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px] divide-y divide-border text-xs">
                  {/* Grid Header */}
                  <div className="grid grid-cols-8 bg-muted/10 font-semibold text-muted-foreground py-3 border-b border-border">
                    <div className="px-4">Employee / Role</div>
                    {currentWeekDays.map((d) => {
                      const isToday = d.dateStr === "2026-06-25";
                      return (
                        <div
                          key={d.dateStr}
                          className={`text-center flex flex-col items-center justify-center ${
                            isToday ? "text-blue-400 font-bold" : ""
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-wider">{d.dayName}</span>
                          <span className={`text-xs mt-0.5 rounded-full px-1.5 py-0.5 ${isToday ? "bg-blue-500/10 border border-blue-500/20" : ""}`}>{d.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Grid Rows */}
                  {DEFAULT_EMPLOYEES.map((emp) => {
                    return (
                      <div key={emp.id} className="grid grid-cols-8 hover:bg-muted/5 transition-colors items-center py-2.5">
                        <div className="px-4 flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-accent text-[10px] font-bold text-foreground grid place-items-center uppercase">
                            {emp.name.split(" ").map((n) => n.charAt(0)).join("")}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground leading-snug">{emp.name}</span>
                            <span className="text-[9px] text-muted-foreground truncate max-w-[100px]">{emp.role}</span>
                          </div>
                        </div>

                        {currentWeekDays.map((day) => {
                          const isToday = day.dateStr === "2026-06-25";
                          const cellEntries = rosters.filter(
                            (r) => r.employeeId === emp.code && r.date === day.dateStr
                          );
                          const cellConflicts = conflictList.filter(
                            (c) => c.employeeName === emp.name && c.date === day.dateStr
                          );

                          return (
                            <div
                              key={day.dateStr}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDropCell(emp.code, day.dateStr)}
                              className={`p-1.5 min-h-[74px] h-auto flex flex-col justify-stretch gap-1 border-l border-border/60 relative group/cell ${
                                isToday ? "bg-blue-500/5" : ""
                              }`}
                            >
                              {cellEntries.length > 0 ? (
                                cellEntries.map((entry) => {
                                  const badgeStyle = getShiftBadgeStyle(entry.shift);
                                  return (
                                    <div
                                      key={entry.id}
                                      draggable
                                      onDragStart={() => handleDragStart(entry.id)}
                                      onClick={() => handleAction("Assign", entry)}
                                      className={`w-full rounded-md border p-1.5 text-[10px] font-medium leading-tight flex flex-col gap-1 cursor-grab active:cursor-grabbing hover:scale-[1.02] hover:shadow transition-all ${badgeStyle}`}
                                    >
                                      <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold truncate">{entry.shift}</span>
                                        {cellConflicts.length > 0 && (
                                          <span title={cellConflicts[0].type}>
                                            <AlertTriangle className="h-3 w-3 text-rose-500 shrink-0 animate-bounce" />
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-between text-[8px] opacity-75">
                                        <span>{entry.startTime === "—" ? "" : `${entry.startTime}-${entry.endTime}`}</span>
                                        {entry.status === "Pending" && (
                                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <button
                                  onClick={() => {
                                    setFormEmployeeId(emp.code);
                                    setFormShift("Morning");
                                    setFormDate(day.dateStr);
                                    setFormStartTime("08:00");
                                    setFormEndTime("16:00");
                                    setFormStatus("Pending");
                                    setIsAssignModalOpen(true);
                                  }}
                                  className="w-full flex-1 min-h-[58px] rounded border border-dashed border-border/50 opacity-0 group-hover/cell:opacity-100 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all text-[10px]"
                                >
                                  <Plus className="h-3 w-3 mr-0.5" /> Assign
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Employee Roster Table View */
            <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-elegant">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-muted/30 font-semibold uppercase tracking-wider text-muted-foreground border-b border-border text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Employee</th>
                      <th className="px-5 py-3">ID</th>
                      <th className="px-5 py-3">Department</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Shift Pattern</th>
                      <th className="px-5 py-3">Hours</th>
                      <th className="px-5 py-3">Break</th>
                      <th className="px-5 py-3">Location</th>
                      <th className="px-5 py-3">Manager</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRosters.map((entry) => {
                      const isPending = entry.status === "Pending";
                      const isRejected = entry.status === "Rejected";
                      const badgeStyle = getShiftBadgeStyle(entry.shift);

                      return (
                        <tr
                          key={entry.id}
                          className="border-b border-border transition-colors hover:bg-muted/10 group"
                        >
                          <td className="px-5 py-3 font-semibold text-foreground">
                            {highlightText(entry.employeeName, search)}
                          </td>
                          <td className="px-5 py-3 font-mono text-muted-foreground">
                            {entry.employeeId}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {entry.department}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground font-mono">
                            {entry.date}
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant="outline" className={`text-[9px] font-semibold py-0.5 px-1.5 ${badgeStyle}`}>
                              {entry.shift}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {entry.workingHours > 0 ? `${entry.workingHours} hrs` : "—"}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {entry.breakTime}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground truncate max-w-[100px]">
                            {entry.location}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground text-[10px]">
                            {entry.manager}
                          </td>
                          <td className="px-5 py-3">
                            <Badge
                              variant={isPending ? "outline" : isRejected ? "destructive" : "secondary"}
                              className={`text-[9px] py-0.5 px-1.5 font-medium ${
                                isPending
                                  ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                  : isRejected
                                    ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              }`}
                            >
                              {entry.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleAction("Approve", entry)}
                                    className="rounded p-1 border border-border text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10"
                                    title="Approve Shift"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleAction("Reject", entry)}
                                    className="rounded p-1 border border-border text-rose-500 bg-rose-500/5 hover:bg-rose-500/10"
                                    title="Reject Shift"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleAction("Assign", entry)}
                                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                                title="Edit"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleAction("Duplicate", entry)}
                                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                                title="Duplicate"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleAction("Delete", entry)}
                                className="rounded p-1 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Roster Planner Analytics Section */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant space-y-6">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" />
              <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
                Roster Allocation Analytics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart: Shift distribution */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Shift Distribution (Assigned Rows)
                </span>
                <div className="space-y-2.5">
                  {[
                    { label: "Morning Shifts", value: 12, pct: "60%", color: "bg-blue-500" },
                    { label: "Evening Shifts", value: 8, pct: "40%", color: "bg-amber-500" },
                    { label: "Night Shifts", value: 5, pct: "25%", color: "bg-purple-500" },
                    { label: "WFH / Hybrid", value: 4, pct: "20%", color: "bg-emerald-500" },
                  ].map((bar, i) => (
                    <div key={i} className="space-y-1 text-xs">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-muted-foreground">{bar.label}</span>
                        <span className="font-semibold text-foreground">{bar.value} employees ({bar.pct})</span>
                      </div>
                      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${bar.color}`} style={{ width: bar.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance density heatmap grid */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Workforce Density Heatmap (Active Coverage)
                </span>
                <div className="grid grid-cols-7 gap-1 bg-border/20 rounded-lg p-2.5 border border-border">
                  {["M", "T", "W", "T", "F", "S", "S"].map((l, i) => (
                    <span key={i} className="text-center font-bold text-[9px] text-muted-foreground/80 mb-1">
                      {l}
                    </span>
                  ))}
                  {[
                    "bg-blue-500/80", "bg-blue-500/60", "bg-blue-500/90", "bg-blue-500/70", "bg-blue-500/40", "bg-muted/40", "bg-muted/40",
                    "bg-blue-500/90", "bg-blue-500/80", "bg-blue-500/75", "bg-blue-500/85", "bg-blue-500/50", "bg-muted/40", "bg-muted/40",
                    "bg-blue-500/70", "bg-blue-500/70", "bg-blue-500/80", "bg-blue-500/95", "bg-blue-500/60", "bg-muted/40", "bg-muted/40",
                    "bg-blue-500/90", "bg-blue-500/85", "bg-blue-500/90", "bg-blue-500/75", "bg-blue-500/80", "bg-muted/40", "bg-muted/40"
                  ].map((cell, idx) => (
                    <div
                      key={idx}
                      className={`h-4 rounded ${cell} transition-all hover:scale-105 hover:ring-1 hover:ring-white/40 cursor-help`}
                      title="Peak shift utilization: 95%"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                  <span>Low Coverage</span>
                  <div className="flex gap-0.5">
                    <span className="h-2 w-2 rounded bg-blue-500/20" />
                    <span className="h-2 w-2 rounded bg-blue-500/50" />
                    <span className="h-2 w-2 rounded bg-blue-500/80" />
                    <span className="h-2 w-2 rounded bg-blue-500/95" />
                  </div>
                  <span>Peak Coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar area (1/4 width) */}
        <div className="space-y-6">
          {/* AI Smart Suggestions Panel */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
                  AI Roster Guard
                </h3>
              </div>
              {conflictList.length > 0 && (
                <Badge variant="destructive" className="text-[9px] py-0 px-1 animate-pulse">
                  {conflictList.length} Warning
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {conflictList.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-1.5 font-semibold text-destructive-foreground">
                    <span className="flex items-center gap-1 leading-none text-rose-400">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {item.type}
                    </span>
                    <span className="text-[9px] opacity-75 font-mono">{item.date}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    {item.message}
                  </p>
                </div>
              ))}

              {conflictList.length > 0 ? (
                <Button
                  onClick={handleQuickFixConflicts}
                  className="w-full h-9 text-xs bg-blue-600/90 text-white hover:bg-blue-600 shadow-glow"
                >
                  <Sparkles className="h-3 w-3 mr-1.5" /> Apply AI Quick Fix
                </Button>
              ) : (
                <div className="p-4 text-center rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 flex flex-col items-center gap-1">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold text-xs mt-1">No Schedule Conflicts</span>
                  <p className="text-[9px] text-muted-foreground">
                    AI checked 28 weekly shifts sequence. Overlap clearance is 100%.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline of upcoming shifts */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground mb-4">
              Today's Schedule & Timeline
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { time: "08:00 - 16:00", name: "Jordan Lee", type: "Morning Shift", color: "bg-blue-500" },
                { time: "09:00 - 17:00", name: "Sarah Connor", type: "Night Shift Recovery", color: "bg-purple-500" },
                { time: "16:00 - 00:00", name: "Michael Scott", type: "Evening Shift Coverage", color: "bg-amber-500" },
                { time: "16:00 - 00:00", name: "Dwight Schrute", type: "Evening Shift Coverage", color: "bg-amber-500" },
              ].map((shift, i) => (
                <div key={i} className="flex items-start gap-2.5 pb-2.5 border-b border-border last:border-b-0 last:pb-0">
                  <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${shift.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline font-semibold text-foreground">
                      <span className="truncate">{shift.name}</span>
                      <span className="text-[9px] text-muted-foreground font-mono font-medium">{shift.time}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{shift.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Summary overview */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant space-y-3 text-xs">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
              Weekly Allocation Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Active Shifts</span>
                <span className="font-semibold text-foreground">28 shifts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Shift Length</span>
                <span className="font-semibold text-foreground">8.0 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WFH Days Approved</span>
                <span className="font-semibold text-foreground">2 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Leave Absences</span>
                <span className="font-semibold text-foreground">1 day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Overtime</span>
                <span className="font-semibold text-foreground">16.0 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign / Edit Shift Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-md border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-semibold tracking-tight text-foreground">
              Assign Workforce Shift
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Directly assign or edit shift patterns for specific employee dates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignShift} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Select Employee</label>
                <select
                  value={formEmployeeId}
                  onChange={(e) => setFormEmployeeId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                >
                  {DEFAULT_EMPLOYEES.map((emp) => (
                    <option key={emp.id} value={emp.code}>
                      {emp.name} ({emp.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Shift Pattern</label>
                <select
                  value={formShift}
                  onChange={(e) => setFormShift(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring font-medium"
                >
                  {SHIFT_TYPES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Schedule Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Work Location</label>
                <select
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="San Francisco HQ">San Francisco HQ</option>
                  <option value="London office">London office</option>
                  <option value="Bengaluru Tech Park">Bengaluru Tech Park</option>
                  <option value="Remote">Remote / WFH</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Start Time</label>
                <Input
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  placeholder="e.g. 08:00"
                  className="h-9 text-xs border-border"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">End Time</label>
                <Input
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                  placeholder="e.g. 16:00"
                  className="h-9 text-xs border-border"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Break Duration</label>
                <Input
                  value={formBreak}
                  onChange={(e) => setFormBreak(e.target.value)}
                  placeholder="e.g. 45 mins"
                  className="h-9 text-xs border-border"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Approval Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring font-medium"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="col-span-2 flex items-center justify-between py-2 border-t border-border mt-1.5">
                <div className="space-y-0.5">
                  <label className="font-medium text-foreground cursor-pointer" htmlFor="rec-shift">
                    Recurring Weekly Schedule
                  </label>
                  <p className="text-[10px] text-muted-foreground">
                    Repeat this exact shift pattern for next 4 calendar weeks.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="rec-shift"
                  checked={formRecurring}
                  onChange={(e) => setFormRecurring(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary accent-primary"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-border gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAssignModalOpen(false)}
                className="h-9 border-border bg-transparent text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs"
              >
                Save Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Roster Template Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-semibold tracking-tight text-foreground">
              Create New Roster Template
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a weekly or monthly empty schedule shell to start assigning shifts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRoster} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-muted-foreground">Roster Name *</label>
                <Input
                  value={createRosterName}
                  onChange={(e) => setCreateRosterName(e.target.value)}
                  placeholder="e.g. Engineering Team A Week 26"
                  required
                  className="h-9 text-xs border-border"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Department Scope</label>
                <select
                  value={createRosterDept}
                  onChange={(e) => setCreateRosterDept(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR & Operations</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Location</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring">
                  <option value="hq">San Francisco HQ</option>
                  <option value="london">London branch</option>
                  <option value="blr">Bengaluru Tech Park</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Start Date</label>
                <input
                  type="date"
                  value={createRosterStart}
                  onChange={(e) => setCreateRosterStart(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">End Date</label>
                <input
                  type="date"
                  value={createRosterEnd}
                  onChange={(e) => setCreateRosterEnd(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-muted-foreground">Notes / Handover Details</label>
                <textarea
                  placeholder="Key schedule deliverables, mandatory weekend standbys, or custom swap policies…"
                  rows={2}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-border gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateModalOpen(false)}
                className="h-9 border-border bg-transparent text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs"
              >
                Create Shell
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl">
          <DialogHeader className="flex flex-row items-start gap-4">
            <div className="rounded-full bg-destructive/10 p-2 text-destructive shrink-0 mt-1">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="font-display text-base font-semibold tracking-tight text-foreground">
                Delete Schedule Row
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Are you sure you want to delete the schedule entry for{" "}
                <span className="font-bold text-foreground">"{entryToDelete?.employeeName}"</span>?
              </DialogDescription>
            </div>
          </DialogHeader>

          <p className="text-xs text-muted-foreground leading-normal px-1">
            Deleting this roster row leaves the employee unassigned (Off Day status) for this schedule period. Any active approvals will be voided.
          </p>

          <DialogFooter className="pt-2 border-t border-border gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="h-9 border-border bg-transparent text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteEntry}
              className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
