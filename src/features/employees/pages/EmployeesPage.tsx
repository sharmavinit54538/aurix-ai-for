import { useEffect, useState } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
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
  Maximize2,
  Minimize2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
import type { ParsedError } from "@/api/utils";
import { apiInstance } from "@/api";


const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Legal",
  "Customer Success",
  "Data & Analytics",
  "IT Infrastructure",
];

const DESIGNATIONS = [
  "Technical Support Engineer",
  "Frontend Developer",
  "Backend Developer",
  "QA Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Sales Executive",
  "HR Manager",
  "Marketing Specialist",
  "Operations Executive",
  "Technical Support Specialist",
  "Customer Success Specialist",
];

const SHIFTS = ["General", "Morning", "Evening", "Night", "Flexible"];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "INVITED", label: "Invited" },
  { value: "DISABLED", label: "Disabled" },
  { value: "INACTIVE", label: "Inactive" },
];

export function EmployeesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;

  // Extract filters from URL or default
  const page = Number(searchParams.page ?? "1");
  const limit = Number(searchParams.limit ?? "10");
  const search = searchParams.search ?? "";
  const department = searchParams.department ?? "all";
  const designation = searchParams.designation ?? "all";
  const shift = searchParams.shift ?? "all";
  const status = searchParams.status ?? "all";
  const sort = searchParams.sort ?? "";
  const order = searchParams.order ?? "asc";

  const {
    employees: mappedEmployees,
    loading,
    submitting,
    error,
    total,
    pages,
    has_next,
    has_previous,
  } = useAppSelector((state) => state.employees);

  const [searchVal, setSearchVal] = useState(search);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Employee | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("employee-table-compact") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("employee-table-compact", String(isCompact));
  }, [isCompact]);

  // Sync internal search input with URL search param
  useEffect(() => {
    setSearchVal(search);
  }, [search]);

  // Debounced search sync to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchVal !== search) {
        updateFilters({ search: searchVal, page: 1 });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchVal]);

  // Fetch employees when parameters change
  useEffect(() => {
    dispatch(
      fetchEmployees({
        search,
        department,
        designation,
        shift,
        status,
        sort,
        order,
        page,
        limit,
      }),
    );
  }, [dispatch, search, department, designation, shift, status, sort, order, page, limit]);

  const updateFilters = (newParams: Record<string, any>) => {
    const next = { ...searchParams, ...newParams };
    Object.keys(next).forEach((key) => {
      if (next[key] === undefined || next[key] === "" || next[key] === "all") {
        delete next[key];
      }
    });
    navigate({
      search: next as any,
    });
  };

  const handleSort = (field: string) => {
    let nextOrder: "asc" | "desc" = "asc";
    if (sort === field && order === "asc") {
      nextOrder = "desc";
    }
    updateFilters({ sort: field, order: nextOrder, page: 1 });
  };

  function refetch() {
    dispatch(
      fetchEmployees({
        search,
        department,
        designation,
        shift,
        status,
        sort,
        order,
        page,
        limit,
      }),
    );
  }

  async function resendInvite(id: string) {
    const result = await dispatch(resendEmployeeInvite(id));
    if (resendEmployeeInvite.fulfilled.match(result)) {
      toast.success("Invitation email resent successfully");
      refetch();
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
      refetch();
    } else {
      toast.error(result.payload ?? "Failed to reset password");
    }
  }

  function getStatusDetails(emp: Employee) {
    const stat = emp.status?.toUpperCase() || "INVITED";
    if ((stat === "INVITED" || stat === "CREATED") && emp.activationTokenExpiresAt) {
      const expires = new Date(emp.activationTokenExpiresAt);
      if (new Date() > expires) {
        return { text: "EXPIRED", variant: "destructive" as const, isExpired: true };
      }
    }

    switch (stat) {
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
    setFormErrors({});
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

  async function openEdit(e: Employee) {
    setFormErrors({});
    setFetchingDetails(true);
    try {
      const response = await apiInstance.get(`/employees/${e.id}`);
      const data = response.data?.data;
      if (data) {
        setDraft({
          id: String(data.id ?? ""),
          employeeId: String(data.employee_id ?? ""),
          fullName: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          email: String(data.personal_email ?? data.company_email ?? ""),
          phone: String(data.phone ?? ""),
          department: String(data.department ?? ""),
          designation: String(data.designation ?? ""),
          joiningDate: String(data.joining_date ?? ""),
          managerName: "",
          shift: String(data.shift ?? "General"),
          status: String(data.status ?? "INVITED"),
        });
        setOpen(true);
      } else {
        toast.error("Failed to load employee details");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to load employee details");
    } finally {
      setFetchingDetails(false);
    }
  }

  async function save() {
    if (!draft) return;
    
    // Local validations
    const errs: Record<string, string> = {};
    if (!draft.fullName?.trim()) {
      errs.fullName = "Full name is required";
    }
    if (!draft.email?.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
      errs.email = "Invalid email format";
    }
    if (!draft.phone?.trim()) {
      errs.phone = "Phone number is required";
    } else if (draft.phone.trim().length < 7) {
      errs.phone = "Phone number must be at least 7 characters";
    }
    if (!draft.department?.trim()) {
      errs.department = "Department is required";
    }
    if (!draft.designation?.trim()) {
      errs.designation = "Designation is required";
    }
    if (!draft.joiningDate?.trim()) {
      errs.joiningDate = "Joining date is required";
    }
    if (!draft.employeeId?.trim()) {
      errs.employeeId = "Employee ID is required";
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      toast.error("Please resolve validation errors in the form.");
      return;
    }

    const names = draft.fullName.trim().split(/\s+/);
    const first_name = names[0] || "";
    const last_name = names.slice(1).join(" ") || " ";

    const isEdit = draft.id !== "";
    setFormErrors({});

    if (isEdit) {
      const result = await dispatch(
        updateEmployee({
          id: draft.id,
          payload: {
            first_name,
            last_name,
            personal_email: draft.email,
            company_email: draft.email,
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
        const errorVal = result.payload as ParsedError | undefined;
        const msg = errorVal?.message || "Failed to update employee";
        toast.error(msg);

        if (errorVal?.fieldErrors) {
          const mappedErrors: Record<string, string> = {};
          Object.entries(errorVal.fieldErrors).forEach(([k, v]) => {
            let key = k;
            if (k === "personal_email" || k === "company_email") key = "email";
            if (k === "employee_id") key = "employeeId";
            if (k === "joining_date") key = "joiningDate";
            mappedErrors[key] = String(v);
          });
          setFormErrors(mappedErrors);
        }
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
        const errorVal = result.payload as ParsedError | undefined;
        const msg = errorVal?.message || "Failed to add employee";
        toast.error(msg);

        if (errorVal?.fieldErrors) {
          const mappedErrors: Record<string, string> = {};
          Object.entries(errorVal.fieldErrors).forEach(([k, v]) => {
            let key = k;
            if (k === "personal_email" || k === "company_email") key = "email";
            if (k === "employee_id") key = "employeeId";
            if (k === "joining_date") key = "joiningDate";
            mappedErrors[key] = String(v);
          });
          setFormErrors(mappedErrors);
        }
      }
    }
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to remove this employee?")) return;

    const result = await dispatch(deleteEmployee(id));
    if (deleteEmployee.fulfilled.match(result)) {
      toast.success("Employee removed successfully");
      refetch();
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

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th
      className={`px-4 ${isCompact ? "py-1.5" : "py-3"} cursor-pointer hover:bg-muted/50 select-none transition-colors group`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        {sort === field ? (
          order === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-primary" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 text-primary" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
      </div>
    </th>
  );

  const SkeletonRow = () => (
    <tr className="border-t border-border animate-pulse">
      <td className={`px-4 ${isCompact ? "py-1.5" : "py-3"}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-full bg-muted/40 transition-all ${isCompact ? "h-7 w-7" : "h-9 w-9"}`} />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted/40 rounded" />
            <div className="h-3 w-32 bg-muted/40 rounded" />
          </div>
        </div>
      </td>
      <td className="px-4"><div className="h-4 w-16 bg-muted/40 rounded" /></td>
      <td className="px-4"><div className="h-4 w-24 bg-muted/40 rounded" /></td>
      <td className="px-4"><div className="h-4 w-20 bg-muted/40 rounded" /></td>
      <td className="px-4"><div className="h-5 w-16 bg-muted/40 rounded-full" /></td>
      <td className="px-4"><div className="h-5 w-16 bg-muted/40 rounded-full" /></td>
      <td className="px-4 text-right">
        <div className="inline-block h-8 w-8 bg-muted/40 rounded-md" />
      </td>
    </tr>
  );

  const MobileSkeletonCard = () => (
    <div className="p-4 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted/40 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted/40 rounded" />
            <div className="h-3 w-32 bg-muted/40 rounded" />
          </div>
        </div>
        <div className="h-8 w-8 bg-muted/40 rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1"><div className="h-2 w-10 bg-muted/40 rounded" /><div className="h-3 w-16 bg-muted/40 rounded" /></div>
        <div className="space-y-1"><div className="h-2 w-10 bg-muted/40 rounded" /><div className="h-3 w-20 bg-muted/40 rounded" /></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Employees"
        description={`${total || 0} people registered in workspace`}
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
        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search by name, email, or ID"
              className="h-9 pl-9"
            />
          </div>

          {/* Department Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Dept:</span>
            <Select value={department} onValueChange={(val) => updateFilters({ department: val, page: 1 })}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Designation Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Role:</span>
            <Select value={designation} onValueChange={(val) => updateFilters({ designation: val, page: 1 })}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="All designations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {DESIGNATIONS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shift Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Shift:</span>
            <Select value={shift} onValueChange={(val) => updateFilters({ shift: val, page: 1 })}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue placeholder="All shifts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                {SHIFTS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Status:</span>
            <Select value={status} onValueChange={(val) => updateFilters({ status: val, page: 1 })}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compact View Toggle */}
          <Button
            variant="outline"
            onClick={() => setIsCompact(!isCompact)}
            className="h-9 gap-2 px-3 text-xs ml-auto"
            title={isCompact ? "Comfortable View" : "Compact View"}
          >
            {isCompact ? (
              <Maximize2 className="h-3.5 w-3.5" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{isCompact ? "Comfortable" : "Compact"}</span>
          </Button>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <>
            {/* Desktop Table Skeletons */}
            <div className="hidden sm:block overflow-x-auto">
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
                  {Array.from({ length: limit }).map((_, idx) => (
                    <SkeletonRow key={`skel-row-${idx}`} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Skeletons */}
            <div className="sm:hidden divide-y divide-border">
              {Array.from({ length: limit }).map((_, idx) => (
                <MobileSkeletonCard key={`skel-card-${idx}`} />
              ))}
            </div>
          </>
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
              Adjust search, filters, or registers to view your workforce.
            </p>
            <Button onClick={openNew} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add employee
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <SortHeader field="name" label="Employee" />
                    <SortHeader field="department" label="Department" />
                    <SortHeader field="designation" label="Designation" />
                    <SortHeader field="joined_date" label="Joined" />
                    <SortHeader field="shift" label="Shift" />
                    <SortHeader field="status" label="Status" />
                    <th className="px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {mappedEmployees.map((e) => (
                    <tr key={e.id} className="border-t border-border transition-colors hover:bg-accent/30">
                      <td className={`px-4 ${isCompact ? "py-1.5" : "py-3"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`grid place-items-center rounded-full bg-foreground text-xs font-semibold text-background transition-all ${isCompact ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs"}`}>
                            {e.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <div className={`font-medium ${isCompact ? "text-xs" : "text-sm"}`}>{e.fullName}</div>
                            <div className={`${isCompact ? "text-[10px]" : "text-xs"} text-muted-foreground`}>{e.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 ${isCompact ? "py-1.5" : "py-3"} ${isCompact ? "text-xs" : "text-sm"}`}>{e.department || "—"}</td>
                      <td className={`px-4 ${isCompact ? "py-1.5" : "py-3"} ${isCompact ? "text-xs" : "text-sm"}`}>{e.designation || "—"}</td>
                      <td className={`px-4 ${isCompact ? "py-1.5" : "py-3"} ${isCompact ? "text-xs" : "text-sm"} text-muted-foreground`}>{e.joiningDate || "—"}</td>
                      <td className={`px-4 ${isCompact ? "py-1.5" : "py-3"}`}>
                        <Badge variant="secondary" className={isCompact ? "px-1.5 py-0 text-[10px]" : ""}>{e.shift}</Badge>
                      </td>
                      <td className={`px-4 ${isCompact ? "py-1.5" : "py-3"}`}>
                        {(() => {
                          const details = getStatusDetails(e);
                          return (
                            <Badge
                              variant={details.variant}
                              className={`${isCompact ? "px-1.5 py-0 text-[10px]" : ""} ${
                                details.text === "ACTIVE"
                                  ? "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                  : details.text === "PENDING"
                                    ? "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                    : ""
                              }`}
                            >
                              {details.text}
                            </Badge>
                          );
                        })()}
                      </td>
                      <td className={`px-4 ${isCompact ? "py-1.5" : "py-3"} text-right`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className={`${isCompact ? "h-6 w-6" : "h-8 w-8"} p-0`}>
                              <MoreVertical className={`${isCompact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
                            <DropdownMenuItem 
                              onClick={() => openEdit(e)} 
                              className="cursor-pointer gap-2"
                              disabled={fetchingDetails}
                            >
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

            {/* Mobile Card Layout */}
            <div className="sm:hidden divide-y divide-border">
              {mappedEmployees.map((e) => {
                const details = getStatusDetails(e);
                return (
                  <div key={e.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                          {e.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{e.fullName}</div>
                          <div className="text-xs text-muted-foreground">{e.email}</div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
                          <DropdownMenuItem 
                            onClick={() => openEdit(e)} 
                            className="cursor-pointer gap-2"
                            disabled={fetchingDetails}
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>View / Edit Profile</span>
                          </DropdownMenuItem>
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
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">Department</span>
                        <span className="font-medium text-foreground">{e.department || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">Designation</span>
                        <span className="font-medium text-foreground">{e.designation || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">Joined Date</span>
                        <span className="text-muted-foreground">{e.joiningDate || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">Shift</span>
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] mt-0.5">{e.shift}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-muted-foreground text-[10px] uppercase">Status</span>
                      <Badge
                        variant={details.variant}
                        className={`px-1.5 py-0 text-[10px] ${
                          details.text === "ACTIVE"
                            ? "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            : details.text === "PENDING"
                              ? "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                              : ""
                        }`}
                      >
                        {details.text}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border">
              {/* Showing X–Y of Z employees */}
              <div className="text-xs text-muted-foreground order-2 sm:order-1">
                Showing <span className="font-semibold text-foreground">{startItem}</span>–
                <span className="font-semibold text-foreground">{endItem}</span> of{" "}
                <span className="font-semibold text-foreground">{total}</span> employees
              </div>

              {/* Rows per page & page buttons */}
              <div className="flex flex-wrap items-center gap-4 order-1 sm:order-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground whitespace-nowrap">Rows per page:</span>
                  <Select
                    value={String(limit)}
                    onValueChange={(val) => updateFilters({ limit: Number(val), page: 1 })}
                  >
                    <SelectTrigger className="h-8 w-16">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 25, 50, 100].map((size) => (
                        <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => updateFilters({ page: page - 1 })}
                    disabled={!has_previous}
                  >
                    &lt; Previous
                  </Button>

                  {getPageNumbers().map((p, idx) => {
                    if (p === "...") {
                      return (
                        <span key={`dots-${idx}`} className="px-2 text-xs text-muted-foreground select-none">
                          ...
                        </span>
                      );
                    }
                    return (
                      <Button
                        key={`page-${p}`}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0 text-xs"
                        onClick={() => updateFilters({ page: p })}
                      >
                        {p}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => updateFilters({ page: page + 1 })}
                    disabled={!has_next}
                  >
                    Next &gt;
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft && draft.id !== "" ? "Edit employee" : "Add employee"}</DialogTitle>
          </DialogHeader>
          {fetchingDetails ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading employee profile...</p>
            </div>
          ) : draft ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Lbl label="Employee ID" error={formErrors.employeeId}>
                <Input value={draft.employeeId} onChange={(e) => setDraft({ ...draft, employeeId: e.target.value })} disabled={submitting} />
              </Lbl>
              <Lbl label="Shift" error={formErrors.shift}>
                <Select value={draft.shift} onValueChange={(v) => setDraft({ ...draft, shift: v })} disabled={submitting}>
                  <SelectTrigger disabled={submitting}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["General", "Morning", "Evening", "Night", "Flexible"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Lbl>
              <Lbl label="Full name" error={formErrors.fullName || formErrors.first_name || formErrors.last_name} wide>
                <Input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} disabled={submitting} />
              </Lbl>
              <Lbl label="Email" error={formErrors.email}>
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  disabled={submitting}
                />
              </Lbl>
              <Lbl label="Phone" error={formErrors.phone}>
                <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} disabled={submitting} />
              </Lbl>
              <Lbl label="Department" error={formErrors.department}>
                <Input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} disabled={submitting} />
              </Lbl>
              <Lbl label="Designation" error={formErrors.designation}>
                <Input value={draft.designation} onChange={(e) => setDraft({ ...draft, designation: e.target.value })} disabled={submitting} />
              </Lbl>
              <Lbl label="Joining date" error={formErrors.joiningDate}>
                <Input type="date" value={draft.joiningDate} onChange={(e) => setDraft({ ...draft, joiningDate: e.target.value })} disabled={submitting} />
              </Lbl>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting || fetchingDetails}>
              Cancel
            </Button>
            <Button onClick={save} disabled={submitting || fetchingDetails}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Lbl({ label, children, wide, error }: { label: string; children: React.ReactNode; wide?: boolean; error?: string }) {
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">❌ {error}</p>}
    </div>
  );
}
