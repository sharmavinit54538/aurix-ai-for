import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Download,
  Plus,
  Laptop,
  ShieldCheck,
  Server,
  Lock,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  UserX,
  UserCheck,
  Mail,
  RotateCcw,
  Sparkles,
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
  DropdownMenuSeparator,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

export function ItAdminPage() {
  const dispatch = useAppDispatch();
  const { employees, loading, submitting } = useAppSelector((state) => state.employees);

  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "Information Technology",
    designation: "Senior Systems Administrator",
    joiningDate: new Date().toISOString().slice(0, 10),
    employeeId: "",
    shift: "General",
  });

  const [deleteAdmin, setDeleteAdmin] = useState<Employee | null>(null);
  const [deactivateAdmin, setDeactivateAdmin] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Filter employees for IT Admins
  const itAdmins = useMemo(() => {
    return employees.filter((emp) => {
      const isRoleMatch = emp.role === "it_admin";
      const deptLower = (emp.department || "").toLowerCase();
      const desigLower = (emp.designation || "").toLowerCase();
      const isDeptOrDesigMatch =
        deptLower.includes("it") ||
        deptLower.includes("information technology") ||
        deptLower.includes("infrastructure") ||
        deptLower.includes("devops") ||
        deptLower.includes("security") ||
        desigLower.includes("systems administrator") ||
        desigLower.includes("it admin") ||
        desigLower.includes("devops") ||
        desigLower.includes("network engineer");

      const matchesRole = isRoleMatch || isDeptOrDesigMatch;
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
      if (d.includes("it") || d.includes("tech") || d.includes("infra") || d.includes("security")) {
        set.add(e.department);
      }
    });
    set.add("Information Technology");
    set.add("Cloud & Infrastructure");
    set.add("Cyber Security");
    return Array.from(set);
  }, [employees]);

  const activeCount = itAdmins.filter((a) => a.status === "ACTIVE" || a.status === "CONFIRMED").length;
  const pendingCount = itAdmins.filter((a) => a.status === "INVITED" || a.status === "PROBATION").length;

  function openCreate() {
    setEditingAdmin(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      department: "Information Technology",
      designation: "Senior Systems Administrator",
      joiningDate: new Date().toISOString().slice(0, 10),
      employeeId: `IT-${Math.floor(100000 + Math.random() * 900000)}`,
      shift: "General",
    });
    setDialogOpen(true);
  }

  function openEdit(admin: Employee) {
    setEditingAdmin(admin);
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone || "",
      department: admin.department || "Information Technology",
      designation: admin.designation || "Senior Systems Administrator",
      joiningDate: admin.joiningDate || new Date().toISOString().slice(0, 10),
      employeeId: admin.employeeId || "",
      shift: admin.shift || "General",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      return toast.error("Full name and email are required");
    }

    const names = formData.fullName.trim().split(/\s+/);
    const first_name = names[0] || "";
    const last_name = names.slice(1).join(" ") || " ";

    if (editingAdmin) {
      const result = await dispatch(
        updateEmployee({
          id: editingAdmin.id,
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
        toast.success("IT Administrator updated successfully");
        setDialogOpen(false);
        dispatch(fetchEmployees());
      } else {
        toast.error(getRejectMessage(result.payload, "Failed to update IT administrator"));
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
          employee_id: formData.employeeId || `IT-${Math.floor(100000 + Math.random() * 900000)}`,
          employment_type: "FULL_TIME",
          employment_status: "PROBATION",
          role: "it_admin",
          shift: formData.shift,
        })
      );
      if (createEmployee.fulfilled.match(result)) {
        toast.success("IT Administrator created and invitation sent");
        setDialogOpen(false);
        dispatch(fetchEmployees());
      } else {
        toast.error(getRejectMessage(result.payload, "Failed to create IT administrator"));
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
    if (!confirm("Send temporary password reset instructions to this administrator?")) return;
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
      toast.success("IT Administrator account activated");
      dispatch(fetchEmployees());
    } else {
      toast.error(getRejectMessage(res.payload, "Failed to activate"));
    }
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="IT Administrators"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportEmployeesCsv(itAdmins)}
              disabled={itAdmins.length === 0}
              className="gap-1.5 text-xs h-9 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button
              size="sm"
              onClick={openCreate}
              className="gap-1.5 text-xs h-9 bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add IT Admin
            </Button>
          </div>
        }
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-cyan-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Total IT Admins</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Laptop className="h-4 w-4" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold mt-2 text-foreground">{itAdmins.length}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Configured Technical Leads</p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Active & Confirmed</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold mt-2 text-emerald-400">{activeCount}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Active Operational Access</p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Pending Setup</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold mt-2 text-amber-400">{pendingCount}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Invited / Onboarding Status</p>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Security & Systems</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Lock className="h-4 w-4" />
            </div>
          </div>
          <h3 className="font-display text-2xl font-bold mt-2 text-foreground">{departments.length}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Active Technical Units</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search IT admin by name, email, employee ID..."
            className="pl-9 h-8 text-xs bg-muted/20 border-border/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground cursor-pointer"
          >
            <option value="all">All Departments</option>
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
        {loading && itAdmins.length === 0 ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : itAdmins.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto">
              <Laptop className="h-6 w-6" />
            </div>
            <h4 className="font-display text-base font-semibold text-foreground">No IT Administrators Found</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No technical staff match your query. Add your organization's IT specialists and systems engineers.
            </p>
            <Button size="sm" onClick={openCreate} className="mt-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add First IT Admin
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/80 bg-accent/20 text-muted-foreground font-semibold">
                  <th className="px-4 py-3">Administrator</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Department & Designation</th>
                  <th className="px-4 py-3">Access Level</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {itAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          {admin.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{admin.fullName}</p>
                          <p className="text-[11px] text-muted-foreground">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-muted-foreground">
                      {admin.employeeId}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{admin.designation || "Systems Administrator"}</p>
                      <p className="text-[11px] text-muted-foreground">{admin.department || "IT"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] font-semibold">
                        System Admin
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          admin.status === "ACTIVE" || admin.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }
                      >
                        {admin.status || "INVITED"}
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
                          <DropdownMenuItem onClick={() => openEdit(admin)} className="gap-2 cursor-pointer">
                            <Edit2 className="h-3.5 w-3.5" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResendInvite(admin.id)} className="gap-2 cursor-pointer">
                            <Mail className="h-3.5 w-3.5" /> Resend Invitation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(admin.id)} className="gap-2 cursor-pointer">
                            <RotateCcw className="h-3.5 w-3.5" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActivate(admin.id)} className="gap-2 cursor-pointer">
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
              <Laptop className="h-4 w-4 text-cyan-400" />
              {editingAdmin ? "Edit IT Administrator" : "Add IT Administrator"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure technical credentials and system administration access for this staff member.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-[11px] font-semibold text-muted-foreground">Full Name *</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Alex Morgan"
                className="mt-1 h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[11px] font-semibold text-muted-foreground">Email Address *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. alex.morgan@company.com"
                className="mt-1 h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0192"
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Employee ID</Label>
                <Input
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="IT-102934"
                  className="mt-1 h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Information Technology"
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Designation</Label>
                <Input
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Senior Systems Administrator"
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Joining Date</Label>
                <Input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground">Work Shift</Label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground cursor-pointer"
                >
                  <option value="General">General (9AM - 6PM)</option>
                  <option value="Morning">Morning Shift</option>
                  <option value="Night">Night On-Call</option>
                </select>
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
              className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
            >
              {submitting ? "Saving..." : editingAdmin ? "Update Administrator" : "Create & Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ItAdminPage;
