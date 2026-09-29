import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Download,
  Plus,
  Crown,
  Building2,
  DollarSign,
  Search,
  MoreVertical,
  Edit2,
  UserCheck,
  Mail,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  resendEmployeeInvite,
  resetEmployeePassword,
  activateEmployee,
} from "@/features/admin/employees/employeesThunk";
import type { Employee } from "@/features/admin/employees/employeesTypes";
import { getRejectMessage } from "@/api/utils";
import { exportEmployeesCsv } from "@/features/admin/employees/utils/employeeStatus";

const EXECUTIVE_TITLE_OPTIONS = [
  "Chief Executive Officer (CEO)",
  "Chief Technology Officer (CTO)",
  "Chief Financial Officer (CFO)",
  "Chief Information Officer (CIO)",
  "Chief Operating Officer (COO)",
  "Chief Marketing Officer (CMO)",
  "President & Managing Director",
  "Vice President of Engineering",
  "Vice President of Operations",
  "Executive Director",
];

export function ExecutivesPage() {
  const dispatch = useAppDispatch();
  const { employees, loading, submitting } = useAppSelector((state) => state.employees);

  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "Executive Board",
    designation: "Chief Executive Officer (CEO)",
    joiningDate: new Date().toISOString().slice(0, 10),
    employeeId: "",
    shift: "General",
  });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Filter employees for Executives (role === 'executive' or designation contains C-level titles)
  const executives = useMemo(() => {
    return employees.filter((emp) => {
      const isRoleMatch = emp.role === "executive";
      const desigLower = (emp.designation || "").toLowerCase();
      const deptLower = (emp.department || "").toLowerCase();

      const isCLevel =
        desigLower.includes("ceo") ||
        desigLower.includes("cto") ||
        desigLower.includes("cfo") ||
        desigLower.includes("cio") ||
        desigLower.includes("coo") ||
        desigLower.includes("cmo") ||
        desigLower.includes("chief") ||
        desigLower.includes("president") ||
        desigLower.includes("vice president") ||
        desigLower.includes("executive director") ||
        deptLower.includes("executive") ||
        deptLower.includes("leadership") ||
        deptLower.includes("board");

      const matchesRole = isRoleMatch || isCLevel;
      if (!matchesRole) return false;

      if (debouncedQ) {
        const query = debouncedQ.toLowerCase();
        const matchesQuery =
          emp.fullName.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.employeeId.toLowerCase().includes(query) ||
          emp.designation.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      if (selectedDept !== "all" && emp.department !== selectedDept) {
        return false;
      }

      if (selectedStatus !== "all" && emp.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [employees, debouncedQ, selectedDept, selectedStatus]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      const d = (e.department || "").toLowerCase();
      if (d.includes("exec") || d.includes("board") || d.includes("lead")) {
        set.add(e.department);
      }
    });
    set.add("Executive Board");
    set.add("Corporate Strategy");
    set.add("Office of the CEO");
    return Array.from(set);
  }, [employees]);

  const activeCount = executives.filter((e) => e.status === "ACTIVE" || e.status === "CONFIRMED").length;
  const cLevelCount = executives.filter((e) => {
    const d = (e.designation || "").toLowerCase();
    return d.includes("chief") || d.includes("ceo") || d.includes("cto") || d.includes("cfo") || d.includes("cio");
  }).length;

  function openCreate() {
    setEditingExecutive(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "Executive Board",
      designation: "Chief Executive Officer (CEO)",
      joiningDate: new Date().toISOString().slice(0, 10),
      employeeId: `EXEC-${Math.floor(100000 + Math.random() * 900000)}`,
      shift: "General",
    });
    setDialogOpen(true);
  }

  function openEdit(exec: Employee) {
    setEditingExecutive(exec);
    setFormData({
      fullName: exec.fullName,
      email: exec.email,
      phone: exec.phone || "",
      department: exec.department || "Executive Board",
      designation: exec.designation || "Chief Executive Officer (CEO)",
      joiningDate: exec.joiningDate || new Date().toISOString().slice(0, 10),
      employeeId: exec.employeeId || "",
      shift: exec.shift || "General",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      return toast.error("Full name and corporate email are required");
    }

    const names = formData.fullName.trim().split(/\s+/);
    const first_name = names[0] || "";
    const last_name = names.slice(1).join(" ") || " ";

    if (editingExecutive) {
      const result = await dispatch(
        updateEmployee({
          id: editingExecutive.id,
          payload: {
            first_name,
            last_name,
            personal_email: formData.email,
            company_email: formData.email,
            phone: formData.phone,
            department: formData.department,
            designation: formData.designation,
            joining_date: formData.joiningDate,
            shift: formData.shift,
          },
        })
      );
      if (updateEmployee.fulfilled.match(result)) {
        toast.success("Executive officer profile updated successfully");
        setDialogOpen(false);
        dispatch(fetchEmployees());
      } else {
        toast.error(getRejectMessage(result.payload, "Failed to update executive profile"));
      }
    } else {
      const result = await dispatch(
        createEmployee({
          first_name,
          last_name,
          personal_email: formData.email,
          company_email: formData.email,
          phone: formData.phone,
          department: formData.department,
          designation: formData.designation,
          joining_date: formData.joiningDate,
          employee_id: formData.employeeId || `EXEC-${Math.floor(100000 + Math.random() * 900000)}`,
          employment_type: "FULL_TIME",
          employment_status: "CONFIRMED",
          role: "executive",
          shift: formData.shift,
        })
      );
      if (createEmployee.fulfilled.match(result)) {
        toast.success("Executive leader record created and invitation sent");
        setDialogOpen(false);
        dispatch(fetchEmployees());
      } else {
        toast.error(getRejectMessage(result.payload, "Failed to create executive record"));
      }
    }
  }

  async function handleResendInvite(id: string) {
    const res = await dispatch(resendEmployeeInvite(id));
    if (resendEmployeeInvite.fulfilled.match(res)) {
      toast.success("Invitation email resent successfully");
    } else {
      toast.error(getRejectMessage(res.payload, "Failed to resend invite"));
    }
  }

  async function handleResetPassword(id: string) {
    if (!confirm("Send temporary password reset instructions to this executive?")) return;
    const res = await dispatch(resetEmployeePassword(id));
    if (resetEmployeePassword.fulfilled.match(res)) {
      toast.success("Password reset instructions sent");
    } else {
      toast.error(getRejectMessage(res.payload, "Failed to reset password"));
    }
  }

  async function handleActivate(id: string) {
    const res = await dispatch(activateEmployee(id));
    if (activateEmployee.fulfilled.match(res)) {
      toast.success("Executive account confirmed and active");
      dispatch(fetchEmployees());
    } else {
      toast.error(getRejectMessage(res.payload, "Failed to activate"));
    }
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Executive Leadership"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportEmployeesCsv(executives)}
              disabled={executives.length === 0}
              className="gap-1.5 text-xs h-9 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button
              size="sm"
              onClick={openCreate}
              className="gap-1.5 text-xs h-9 bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Executive
            </Button>
          </div>
        }
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-amber-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Total Executives</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold mt-2 text-foreground">{executives.length}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Board & Officer Records</p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Active & Confirmed</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold mt-2 text-emerald-400">{activeCount}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Active Strategic Mandate</p>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>C-Suite Chiefs</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold mt-2 text-purple-400">{cLevelCount}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">CEO / CTO / CFO / CIO / COO</p>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Corporate Units</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold mt-2 text-foreground">{departments.length}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Executive Divisions</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search executive by name, title, corporate email..."
            className="pl-9 h-8 text-xs bg-muted/20 border-border/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground cursor-pointer"
          >
            <option value="all">All Divisions</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="INVITED">Invited</option>
            <option value="PROBATION">Probation</option>
          </select>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        {loading && executives.length === 0 ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : executives.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-500/10 text-amber-400 mx-auto">
              <Crown className="h-6 w-6" />
            </div>
            <h4 className="font-display text-base font-semibold text-foreground">No Executives Found</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No executive leadership records match your query. Add your company's CEO, CTO, CFO and board members.
            </p>
            <Button size="sm" onClick={openCreate} className="mt-2 text-xs bg-amber-600 hover:bg-amber-500 text-white cursor-pointer">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add First Executive
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/80 bg-accent/20 text-muted-foreground font-semibold">
                  <th className="px-4 py-3">Executive Leader</th>
                  <th className="px-4 py-3">Corporate Title</th>
                  <th className="px-4 py-3">Division / Board</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {executives.map((exec) => (
                  <tr key={exec.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 font-bold border border-amber-500/30">
                          {exec.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{exec.fullName}</p>
                          <p className="text-[11px] text-muted-foreground">{exec.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-semibold">
                        {exec.designation || "Executive Officer"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{exec.department || "Executive Board"}</p>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-muted-foreground">
                      {exec.employeeId}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          exec.status === "ACTIVE" || exec.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }
                      >
                        {exec.status || "CONFIRMED"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem onClick={() => openEdit(exec)} className="gap-2 cursor-pointer">
                            <Edit2 className="h-3.5 w-3.5" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResendInvite(exec.id)} className="gap-2 cursor-pointer">
                            <Mail className="h-3.5 w-3.5" /> Resend Invitation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(exec.id)} className="gap-2 cursor-pointer">
                            <RotateCcw className="h-3.5 w-3.5" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActivate(exec.id)} className="gap-2 cursor-pointer">
                            <UserCheck className="h-3.5 w-3.5" /> Activate Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-400" />
              {editingExecutive ? "Edit Executive Profile" : "Add Executive Leader"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure C-suite corporate title, governance oversight, and leadership records.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-[11px] font-semibold text-muted-foreground">Full Name *</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Eleanor Vance"
                className="mt-1 h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-muted-foreground">Corporate Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. eleanor.vance@company.com"
                className="mt-1 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0811"
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Employee ID</Label>
                <Input
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="EXEC-902143"
                  className="mt-1 h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-muted-foreground">Corporate Title *</Label>
              <div className="mt-1 space-y-1.5">
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  {EXECUTIVE_TITLE_OPTIONS.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
                <Input
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Or type custom executive title"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Division / Board</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Executive Board"
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Joining Date</Label>
                <Input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="text-xs cursor-pointer">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={submitting}
              onClick={handleSave}
              className="text-xs bg-amber-600 hover:bg-amber-500 text-white cursor-pointer"
            >
              {submitting ? "Saving..." : editingExecutive ? "Update Executive Profile" : "Create & Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ExecutivesPage;
