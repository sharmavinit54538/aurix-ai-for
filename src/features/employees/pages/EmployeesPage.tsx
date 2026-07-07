import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Plus,
  Search,
  Trash2,
  Users,
  Loader2,
  MoreVertical,
  Mail,
  Link2,
  UserMinus,
  UserCheck,
  Key,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  activateEmployee,
  createEmployee,
  deactivateEmployee,
  deleteEmployee,
  fetchEmployees,
  resendEmployeeInvite,
  resetEmployeePassword,
  updateEmployee,
} from "../employeesThunk";
import type { Employee } from "../employeesTypes";
import { toast } from "sonner";

export function EmployeesPage() {
  const dispatch = useAppDispatch();
  const { employees: mappedEmployees, loading, submitting, error } = useAppSelector(
    (state) => state.employees,
  );
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees({ search: q, department: dept }));
  }, [dispatch, q, dept]);

  const departments = useMemo(
    () => Array.from(new Set(mappedEmployees.map((e) => e.department).filter(Boolean))),
    [mappedEmployees],
  );

  function refetch() {
    dispatch(fetchEmployees({ search: q, department: dept }));
  }

  async function resendInvite(id: string) {
    const result = await dispatch(resendEmployeeInvite(id));
    if (resendEmployeeInvite.fulfilled.match(result)) {
      toast.success("Invitation email resent successfully");
    } else {
      toast.error(result.payload ?? "Failed to resend invitation");
    }
  }

  async function deactivateEmployeeAction(id: string) {
    if (!confirm("Are you sure you want to deactivate this employee account? They will lose access to the portal.")) {
      return;
    }
    const result = await dispatch(deactivateEmployee(id));
    if (deactivateEmployee.fulfilled.match(result)) {
      toast.success("Employee account deactivated successfully");
      refetch();
    } else {
      toast.error(result.payload ?? "Failed to deactivate employee");
    }
  }

  async function activateEmployeeAction(id: string) {
    const result = await dispatch(activateEmployee(id));
    if (activateEmployee.fulfilled.match(result)) {
      toast.success("Employee account activated successfully");
      refetch();
    } else {
      toast.error(result.payload ?? "Failed to activate employee");
    }
  }

  async function resetPassword(id: string) {
    if (!confirm("Are you sure you want to reset this employee's password? A temporary password will be sent to their email.")) {
      return;
    }
    const result = await dispatch(resetEmployeePassword(id));
    if (resetEmployeePassword.fulfilled.match(result)) {
      toast.success("Employee password reset email sent successfully");
    } else {
      toast.error(result.payload ?? "Failed to reset password");
    }
  }

  function getStatusDetails(emp: Employee) {
    const status = emp.status?.toUpperCase() || "INVITED";
    if ((status === "INVITED" || status === "CREATED") && emp.activationTokenExpiresAt) {
      const expires = new Date(emp.activationTokenExpiresAt);
      if (new Date() > expires) {
        return { text: "EXPIRED", variant: "destructive" as const, isExpired: true };
      }
    }

    switch (status) {
      case "ACTIVE":
        return { text: "ACTIVE", variant: "default" as const, isExpired: false };
      case "PENDING":
        return { text: "PENDING", variant: "secondary" as const, isExpired: false };
      case "DISABLED":
      case "INACTIVE":
        return { text: "DISABLED", variant: "destructive" as const, isExpired: false };
      case "INVITED":
      case "CREATED":
      default:
        return { text: "INVITED", variant: "secondary" as const, isExpired: false };
    }
  }

  function openNew() {
    setDraft({
      id: "",
      employeeId: "",
      fullName: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      joiningDate: "",
      managerName: "",
      shift: "General",
    });
    setOpen(true);
  }

  function openEdit(e: Employee) {
    setDraft(e);
    setOpen(true);
  }

  async function save() {
    if (!draft) return;
    if (!draft.fullName || !draft.email) return toast.error("Name and email required");

    const names = draft.fullName.trim().split(/\s+/);
    const first_name = names[0] || "";
    const last_name = names.slice(1).join(" ") || " ";

    const isEdit = draft.id !== "";

    if (isEdit) {
      const result = await dispatch(
        updateEmployee({
          id: draft.id,
          payload: {
            first_name,
            last_name,
            personal_email: draft.email,
            phone: draft.phone || undefined,
            department: draft.department,
            designation: draft.designation,
            joining_date: draft.joiningDate || undefined,
            shift: draft.shift,
          },
        }),
      );
      if (updateEmployee.fulfilled.match(result)) {
        toast.success("Employee updated successfully");
        setOpen(false);
        refetch();
      } else {
        toast.error(result.payload ?? "Failed to update employee");
      }
    } else {
      const result = await dispatch(
        createEmployee({
          first_name,
          last_name,
          personal_email: draft.email,
          company_email: draft.email,
          phone: draft.phone || "9876543210",
          department: draft.department || "Engineering",
          designation: draft.designation || "Engineer",
          joining_date: draft.joiningDate,
          employee_id: draft.employeeId || `EMP-${Math.floor(100000 + Math.random() * 900000)}`,
          employment_type: "FULL_TIME",
          employment_status: "PROBATION",
          role: "employee",
          shift: draft.shift || "General",
        }),
      );
      if (createEmployee.fulfilled.match(result)) {
        toast.success("Employee added successfully");
        setOpen(false);
        refetch();
      } else {
        toast.error(result.payload ?? "Failed to add employee");
      }
    }
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to remove this employee?")) return;

    const result = await dispatch(deleteEmployee(id));
    if (deleteEmployee.fulfilled.match(result)) {
      toast.success("Employee removed successfully");
    } else {
      toast.error(result.payload ?? "Failed to remove employee");
    }
  }

  function exportCsv() {
    const headers = ["Employee ID", "Full Name", "Email", "Phone", "Department", "Designation", "Joining Date", "Shift"];
    const rows = mappedEmployees.map((e) =>
      [e.employeeId, e.fullName, e.email, e.phone, e.department, e.designation, e.joiningDate, e.shift]
        .map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        title="Employees"
        description={`${mappedEmployees.length} people across ${departments.length || 0} departments`}
        actions={
          <>
            <Button variant="outline" onClick={exportCsv} disabled={mappedEmployees.length === 0}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> Add employee
            </Button>
          </>
        }
      />

      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, or ID"
              className="h-9 pl-9"
            />
          </div>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="h-9 w-48">
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading employees...
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted/30 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-destructive font-medium">Failed to load employees</p>
            <p className="text-sm text-muted-foreground mt-1">Please verify backend connection details.</p>
            <Button onClick={refetch} className="mt-4">
              Retry
            </Button>
          </div>
        ) : mappedEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
              <Users className="h-5 w-5" />
            </div>
            <p className="font-medium">No employees found</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Register your first employee or import records to populate your workforce dashboard.
            </p>
            <Button onClick={openNew} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add employee
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Shift</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {mappedEmployees.map((e) => (
                  <tr key={e.id} className="border-t border-border transition-colors hover:bg-accent/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                          {e.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="font-medium">{e.fullName}</div>
                          <div className="text-xs text-muted-foreground">{e.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{e.department || "—"}</td>
                    <td className="px-4 py-3">{e.designation || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.joiningDate || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{e.shift}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const details = getStatusDetails(e);
                        return (
                          <Badge
                            variant={details.variant}
                            className={
                              details.text === "ACTIVE"
                                ? "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                : details.text === "PENDING"
                                  ? "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                  : undefined
                            }
                          >
                            {details.text}
                          </Badge>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
                          <DropdownMenuItem onClick={() => openEdit(e)} className="cursor-pointer gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>View / Edit Profile</span>
                          </DropdownMenuItem>

                          {(() => {
                            const details = getStatusDetails(e);
                            const isInvited = details.text === "INVITED" || details.text === "EXPIRED";
                            const isActive = details.text === "ACTIVE";
                            const isDisabled = details.text === "DISABLED";
                            return (
                              <>
                                {isInvited && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => resendInvite(e.id)}
                                      className="cursor-pointer gap-2"
                                    >
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                      <span>Resend Invitation</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        const link =
                                          window.location.origin + "/onboarding?token=" + (e.activationToken || "");
                                        navigator.clipboard.writeText(link);
                                        toast.success("Invitation link copied to clipboard");
                                      }}
                                      className="cursor-pointer gap-2"
                                    >
                                      <Link2 className="h-4 w-4 text-muted-foreground" />
                                      <span>Copy Invite Link</span>
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {isActive && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => resetPassword(e.id)}
                                      className="cursor-pointer gap-2"
                                    >
                                      <Key className="h-4 w-4 text-muted-foreground" />
                                      <span>Reset Password</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deactivateEmployeeAction(e.id)}
                                      className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                                    >
                                      <UserMinus className="h-4 w-4" />
                                      <span>Deactivate Employee</span>
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {isDisabled && (
                                  <DropdownMenuItem
                                    onClick={() => activateEmployeeAction(e.id)}
                                    className="cursor-pointer gap-2 text-emerald-500 focus:text-emerald-500"
                                  >
                                    <UserCheck className="h-4 w-4" />
                                    <span>Activate Employee</span>
                                  </DropdownMenuItem>
                                )}
                              </>
                            );
                          })()}

                          <DropdownMenuSeparator className="border-t border-border" />
                          <DropdownMenuItem
                            onClick={() => remove(e.id)}
                            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Employee</span>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft && draft.id !== "" ? "Edit employee" : "Add employee"}</DialogTitle>
          </DialogHeader>
          {draft ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Lbl label="Employee ID">
                <Input value={draft.employeeId} onChange={(e) => setDraft({ ...draft, employeeId: e.target.value })} />
              </Lbl>
              <Lbl label="Shift">
                <Select value={draft.shift} onValueChange={(v) => setDraft({ ...draft, shift: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["General", "Morning", "Evening", "Night"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Lbl>
              <Lbl label="Full name" wide>
                <Input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} />
              </Lbl>
              <Lbl label="Email">
                <Input
                  type="email"
                  value={draft.email}
                  // disabled={draft.id !== ""}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
              </Lbl>
              <Lbl label="Phone">
                <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
              </Lbl>
              <Lbl label="Department">
                <Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
              </Lbl>
              <Lbl label="Designation">
                <Input value={draft.designation} onChange={(e) => setDraft({ ...draft, designation: e.target.value })} />
              </Lbl>
              <Lbl label="Joining date">
                <Input type="date" value={draft.joiningDate} onChange={(e) => setDraft({ ...draft, joiningDate: e.target.value })} 
                className="!text-red"
                />
              </Lbl>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Lbl({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
