import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Clock, Plus, Search, Users, Moon, Sun, Edit, Trash2, UserPlus,
  CheckCircle2, AlertCircle, RefreshCw, ChevronLeft, Calendar,
  SlidersHorizontal, Check, Sparkles, Loader2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import apiInstance from "@/api/apiInstance";
import {
  attendanceApi,
  Shift,
  ShiftCreatePayload,
  ShiftAssignPayload,
} from "@/services/attendanceApi";

export const Route = createFileRoute("/dashboard/attendance/shifts")({
  head: () => ({ meta: [{ title: "Shifts Management — Aurix" }] }),
  component: ShiftsPage,
});

interface SimpleEmployee {
  id: string;
  name: string;
  department: string;
  designation?: string;
  email?: string;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "day" | "night">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formStartTime, setFormStartTime] = useState("09:00");
  const [formEndTime, setFormEndTime] = useState("18:00");
  const [formGrace, setFormGrace] = useState(15);
  const [formBreak, setFormBreak] = useState(60);
  const [formNightShift, setFormNightShift] = useState(false);
  const [formNightPremium, setFormNightPremium] = useState(0);
  const [formDays, setFormDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Assign Modal State
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedShiftForAssign, setSelectedShiftForAssign] = useState<Shift | null>(null);
  const [employees, setEmployees] = useState<SimpleEmployee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [assignNotes, setAssignNotes] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Delete Confirm Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load shifts from backend
  const loadShifts = async (showNotice = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceApi.getShifts();
      setShifts(data);
      if (showNotice) toast.success("Shifts refreshed from backend");
    } catch (err: any) {
      const msg = err?.message || "Failed to load shifts from server";
      setError(msg);
      if (showNotice) toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Load employee directory for assignment
  const loadEmployees = async () => {
    if (employees.length > 0) return;
    setEmployeesLoading(true);
    try {
      const res = await apiInstance.get("/employees?limit=200");
      const data = res.data?.data;
      const rawList = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      const parsed: SimpleEmployee[] = rawList.map((e: any) => ({
        id: e.id || e.employee_id,
        name: e.full_name || `${e.first_name || ""} ${e.last_name || ""}`.trim() || e.name || "Employee",
        department: e.department || "General",
        designation: e.designation || e.role,
        email: e.email,
      }));
      setEmployees(parsed);
    } catch (err) {
      console.warn("Could not load employees from /employees endpoint:", err);
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  // Filtered shifts
  const filteredShifts = useMemo(() => {
    return shifts.filter((s) => {
      if (search && !`${s.name} ${s.code} ${s.description}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (typeFilter === "night" && !s.nightShift) return false;
      if (typeFilter === "day" && s.nightShift) return false;
      if (statusFilter === "active" && !s.isActive) return false;
      if (statusFilter === "inactive" && s.isActive) return false;
      return true;
    });
  }, [shifts, search, typeFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = shifts.length;
    const active = shifts.filter((s) => s.isActive).length;
    const night = shifts.filter((s) => s.nightShift).length;
    const assigned = shifts.reduce((sum, s) => sum + (s.assignedEmployeesCount || 0), 0);
    return { total, active, night, assigned };
  }, [shifts]);

  // Open Create Dialog
  const openCreateDialog = () => {
    setEditingShiftId(null);
    setFormName("");
    setFormCode("");
    setFormStartTime("09:00");
    setFormEndTime("18:00");
    setFormGrace(15);
    setFormBreak(60);
    setFormNightShift(false);
    setFormNightPremium(0);
    setFormDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    setFormDescription("");
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  // Open Edit Dialog
  const openEditDialog = (s: Shift) => {
    setEditingShiftId(s.id);
    setFormName(s.name);
    setFormCode(s.code);
    setFormStartTime(s.startTime);
    setFormEndTime(s.endTime);
    setFormGrace(s.gracePeriodMinutes);
    setFormBreak(s.breakDurationMinutes);
    setFormNightShift(s.nightShift);
    setFormNightPremium(s.nightPremiumPercent);
    setFormDays(s.workingDays);
    setFormDescription(s.description || "");
    setFormIsActive(s.isActive);
    setIsModalOpen(true);
  };

  // Save Shift (Create or Update)
  const handleSaveShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Shift name is required");
      return;
    }
    if (!formCode.trim()) {
      toast.error("Shift code is required");
      return;
    }

    setSubmitting(true);
    const payload: ShiftCreatePayload = {
      name: formName.trim(),
      code: formCode.trim().toUpperCase(),
      startTime: formStartTime,
      endTime: formEndTime,
      gracePeriodMinutes: Number(formGrace),
      breakDurationMinutes: Number(formBreak),
      nightShift: formNightShift,
      nightPremiumPercent: formNightShift ? Number(formNightPremium) : 0,
      workingDays: formDays,
      description: formDescription,
      isActive: formIsActive,
    };

    try {
      if (editingShiftId) {
        const updated = await attendanceApi.updateShift(editingShiftId, payload);
        setShifts((prev) => prev.map((item) => (item.id === editingShiftId ? updated : item)));
        toast.success(`Shift "${updated.name}" updated successfully`);
      } else {
        const created = await attendanceApi.createShift(payload);
        setShifts((prev) => [created, ...prev]);
        toast.success(`Shift "${created.name}" created successfully`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save shift to backend");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Assign Modal
  const openAssignModal = (s: Shift) => {
    setSelectedShiftForAssign(s);
    setSelectedEmpIds([]);
    setEffectiveDate(new Date().toISOString().split("T")[0]);
    setAssignNotes("");
    setIsAssignOpen(true);
    loadEmployees();
  };

  // Submit Shift Assignment
  const handleAssignShift = async () => {
    if (!selectedShiftForAssign) return;
    if (selectedEmpIds.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    setAssigning(true);
    try {
      const res = await attendanceApi.assignShift(selectedShiftForAssign.id, {
        employeeIds: selectedEmpIds,
        effectiveDate,
        notes: assignNotes || undefined,
      });

      // Update local count
      setShifts((prev) =>
        prev.map((s) =>
          s.id === selectedShiftForAssign.id
            ? { ...s, assignedEmployeesCount: (s.assignedEmployeesCount || 0) + res.assignedCount }
            : s
        )
      );

      toast.success(`Assigned ${res.assignedCount} employees to ${selectedShiftForAssign.name}`);
      setIsAssignOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to assign shift");
    } finally {
      setAssigning(false);
    }
  };

  // Delete Shift
  const confirmDelete = async () => {
    if (!shiftToDelete) return;
    setDeleting(true);
    try {
      await attendanceApi.deleteShift(shiftToDelete.id);
      setShifts((prev) => prev.filter((s) => s.id !== shiftToDelete.id));
      toast.success(`Deleted shift "${shiftToDelete.name}"`);
      setIsDeleteOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete shift from backend");
    } finally {
      setDeleting(false);
    }
  };

  const toggleDay = (d: string) => {
    setFormDays((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ── Top Navigation / Back ── */}
      <div className="text-left">
        <Link
          to="/dashboard/attendance"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back"
        >
          <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
          Back to Attendance Hub
        </Link>
      </div>

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumb className="mb-1">
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard/attendance">Attendance</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">Shifts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
              <Clock className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Shift Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-left">
            Define organizational schedules, grace periods, night differentials, and assign shifts across teams.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => loadShifts(true)}
            className="h-9 gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={openCreateDialog}
            className="h-9 gap-1.5 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            Create Shift
          </Button>
        </div>
      </div>

      {/* ── Backend Notice / Error Banner ── */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive text-left">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <div>
              <span className="font-semibold">Backend Notice:</span> {error}
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Shifts API (GET /api/v1/attendance/shifts) requires active backend routes.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadShifts(true)}
            className="h-7 text-xs border-destructive/40 hover:bg-destructive/15"
          >
            Retry
          </Button>
        </div>
      )}

      {/* ── Metrics Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-left">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Shifts</span>
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{loading ? "..." : stats.total}</div>
          <span className="text-[11px] text-muted-foreground">Configured shift profiles</span>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active Shifts</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{loading ? "..." : stats.active}</div>
          <span className="text-[11px] text-muted-foreground">Currently in rotation</span>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Night Shifts</span>
            <Moon className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{loading ? "..." : stats.night}</div>
          <span className="text-[11px] text-muted-foreground">With night differential</span>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Allocations</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{loading ? "..." : stats.assigned}</div>
          <span className="text-[11px] text-muted-foreground">Employees mapped</span>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card/50 border border-border/80 p-3 rounded-xl backdrop-blur-md">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shift name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center bg-muted/40 rounded-lg p-0.5 border border-border/60">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${typeFilter === "all" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter("day")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${typeFilter === "day" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`}
            >
              Day
            </button>
            <button
              onClick={() => setTypeFilter("night")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${typeFilter === "night" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`}
            >
              Night
            </button>
          </div>

          <div className="flex items-center bg-muted/40 rounded-lg p-0.5 border border-border/60">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${statusFilter === "all" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${statusFilter === "active" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${statusFilter === "inactive" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* ── Shift List / Cards ── */}
      {loading && shifts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-border rounded-2xl bg-card/30 gap-3 text-muted-foreground text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading shift templates from backend...</span>
        </div>
      ) : filteredShifts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-border rounded-2xl bg-card/20 gap-3 text-center">
          <Clock className="h-10 w-10 text-muted-foreground/50" />
          <h3 className="font-semibold text-sm">No Shifts Found</h3>
          <p className="text-xs text-muted-foreground max-w-md">
            {shifts.length === 0
              ? "No work shifts have been created yet. Click 'Create Shift' to configure the first company schedule."
              : "No shifts match your search and filter criteria."}
          </p>
          {shifts.length === 0 && (
            <Button size="sm" onClick={openCreateDialog} className="mt-2 text-xs gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Create First Shift
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredShifts.map((s) => (
            <div
              key={s.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 text-left"
            >
              <div>
                {/* Header: Name, Code & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-foreground text-base">
                        {s.name}
                      </span>
                      <Badge variant="outline" className="font-mono text-[10px] tracking-wider uppercase">
                        {s.code}
                      </Badge>
                    </div>
                    {s.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={s.isActive ? "secondary" : "outline"}
                    className={`text-[10px] ${s.isActive ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : ""}`}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Timing Strip */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 border border-border/50 p-3">
                  <div className="flex items-center gap-2.5">
                    {s.nightShift ? (
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/15 text-purple-400">
                        <Moon className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
                        <Sun className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <div className="font-mono text-sm font-semibold tracking-tight text-foreground">
                        {s.startTime} – {s.endTime}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {s.workHours}h total shift
                      </span>
                    </div>
                  </div>

                  {s.nightShift && s.nightPremiumPercent > 0 && (
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                      +{s.nightPremiumPercent}% Night Diff
                    </Badge>
                  )}
                </div>

                {/* Rules Pills */}
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-md bg-background/80 border border-border/60 px-2 py-1">
                    <Clock className="h-3 w-3 text-amber-500" />
                    {s.gracePeriodMinutes}m grace
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-background/80 border border-border/60 px-2 py-1">
                    <Clock className="h-3 w-3 text-sky-500" />
                    {s.breakDurationMinutes}m break
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-background/80 border border-border/60 px-2 py-1">
                    <Users className="h-3 w-3 text-emerald-500" />
                    {s.assignedEmployeesCount || 0} assigned
                  </span>
                </div>

                {/* Working Days */}
                <div className="mt-3 flex items-center gap-1">
                  {WEEK_DAYS.map((d) => {
                    const isWorkDay = s.workingDays.includes(d);
                    return (
                      <span
                        key={d}
                        className={`grid h-6 w-6 place-items-center rounded text-[9px] font-semibold transition-colors ${
                          isWorkDay
                            ? "bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30"
                            : "bg-muted/30 text-muted-foreground/40"
                        }`}
                      >
                        {d[0]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAssignModal(s)}
                  className="h-8 gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/40"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Assign Team
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(s)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    title="Edit Shift"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShiftToDelete(s);
                      setIsDeleteOpen(true);
                    }}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    title="Delete Shift"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Shift Dialog ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingShiftId ? "Edit Shift Schedule" : "Create New Shift"}</DialogTitle>
            <DialogDescription>
              Configure timing, grace periods, night differentials, and working days for this shift profile.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveShift} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Shift Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Morning Shift"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Shift Code *
                </label>
                <Input
                  required
                  placeholder="e.g. MS-01"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="mt-1 h-9 text-xs uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Start Time *
                </label>
                <Input
                  required
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  End Time *
                </label>
                <Input
                  required
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Grace Period (minutes)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={formGrace}
                  onChange={(e) => setFormGrace(Number(e.target.value))}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Break Duration (minutes)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={180}
                  value={formBreak}
                  onChange={(e) => setFormBreak(Number(e.target.value))}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            {/* Night Shift Toggle & Premium */}
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-purple-400" />
                  <div>
                    <div className="text-xs font-semibold">Night Shift Schedule</div>
                    <p className="text-[11px] text-muted-foreground">Applies night shift policy and differential pay.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formNightShift}
                  onChange={(e) => setFormNightShift(e.target.checked)}
                  className="h-4 w-4 rounded cursor-pointer"
                />
              </div>

              {formNightShift && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Night Shift Differential Premium (%)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formNightPremium}
                    onChange={(e) => setFormNightPremium(Number(e.target.value))}
                    className="mt-1 h-8 text-xs w-32"
                  />
                </div>
              )}
            </div>

            {/* Working Days */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Working Days
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {WEEK_DAYS.map((d) => {
                  const selected = formDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selected
                          ? "bg-indigo-600 text-white font-semibold shadow-xs"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Description / Notes
              </label>
              <Textarea
                rows={2}
                placeholder="Optional notes or eligibility requirements..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="mt-1 resize-none text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="shift-active"
                type="checkbox"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                className="h-4 w-4 rounded cursor-pointer"
              />
              <label htmlFor="shift-active" className="text-xs font-medium cursor-pointer">
                Active Shift (available for scheduling and roster assignment)
              </label>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="gap-1.5">
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {editingShiftId ? "Update Shift" : "Save Shift"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Assign Shift Modal ── */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Shift to Employees</DialogTitle>
            <DialogDescription>
              Assign <strong className="text-foreground">{selectedShiftForAssign?.name}</strong> ({selectedShiftForAssign?.startTime} – {selectedShiftForAssign?.endTime}) to selected team members.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-left">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Effective Start Date *
              </label>
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Select Team Members ({selectedEmpIds.length} selected)
                </label>
                {employees.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedEmpIds.length === employees.length) setSelectedEmpIds([]);
                      else setSelectedEmpIds(employees.map((e) => e.id));
                    }}
                    className="text-[11px] font-semibold text-indigo-400 hover:underline cursor-pointer"
                  >
                    {selectedEmpIds.length === employees.length ? "Deselect All" : "Select All"}
                  </button>
                )}
              </div>

              <div className="max-h-56 overflow-y-auto rounded-xl border border-border bg-card/40 p-2 space-y-1">
                {employeesLoading ? (
                  <div className="p-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading employees...
                  </div>
                ) : employees.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    No employees found from backend directory.
                  </div>
                ) : (
                  employees.map((emp) => {
                    const checked = selectedEmpIds.includes(emp.id);
                    return (
                      <label
                        key={emp.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          checked ? "bg-indigo-500/10 border border-indigo-500/30" : "hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedEmpIds((prev) => [...prev, emp.id]);
                              else setSelectedEmpIds((prev) => prev.filter((id) => id !== emp.id));
                            }}
                            className="h-3.5 w-3.5 rounded"
                          />
                          <div>
                            <div className="text-xs font-medium text-foreground">{emp.name}</div>
                            <div className="text-[10px] text-muted-foreground">{emp.department} {emp.designation ? `· ${emp.designation}` : ""}</div>
                          </div>
                        </div>
                        {checked && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Assignment Notes
              </label>
              <Textarea
                rows={2}
                placeholder="Optional assignment instructions..."
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                className="mt-1 resize-none text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsAssignOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={assigning || selectedEmpIds.length === 0}
              onClick={handleAssignShift}
              className="gap-1.5"
            >
              {assigning && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Assign Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Shift Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong className="text-foreground">{shiftToDelete?.name}</strong>?
              Employees currently assigned will need to be reallocated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleting}
              onClick={confirmDelete}
              className="gap-1.5"
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ShiftsPage;
