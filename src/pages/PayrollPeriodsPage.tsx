import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Lock,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Unlock,
  XCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GlassCard, StatusBadge, EmptyState, Skeleton } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { MONTH_NAMES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAurix } from "@/lib/aurix-store";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollPeriod,
  type PayrollStatus,
} from "@/services/payrollApi";
import { toast } from "sonner";

// ── Date Formatter Helper ─────────────────────────────────────────────
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return String(dateStr);
  }
}

// ── Format Count Helper ───────────────────────────────────────────────
function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN").format(value);
}

// ── Status Tone Helper ────────────────────────────────────────────────
function getPeriodStatusTone(
  status?: PayrollStatus | null
): "success" | "warning" | "danger" | "info" | "muted" {
  if (!status) return "muted";
  const normalized = String(status).toLowerCase().trim();
  if (
    normalized.includes("approved") ||
    normalized.includes("finalized") ||
    normalized.includes("closed")
  ) {
    return "success";
  }
  if (
    normalized.includes("processing") ||
    normalized.includes("review") ||
    normalized.includes("provision") ||
    normalized.includes("pending") ||
    normalized.includes("locked")
  ) {
    return "warning";
  }
  if (
    normalized.includes("fail") ||
    normalized.includes("error") ||
    normalized.includes("void")
  ) {
    return "danger";
  }
  if (normalized.includes("draft") || normalized.includes("open")) {
    return "info";
  }
  return "muted";
}

export function PayrollPeriodsPage() {
  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);

  // ── RBAC Permission Checks ──────────────────────────────────────────
  const normalizedRole = (
    ws.user?.role ||
    (typeof window !== "undefined" ? localStorage.getItem("user_role") : null) ||
    ""
  )
    .toLowerCase()
    .trim();

  const isAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "super_admin" ||
    normalizedRole === "superadmin" ||
    normalizedRole === "hr_admin" ||
    normalizedRole === "hradmin" ||
    normalizedRole === "hr-admin" ||
    normalizedRole.includes("admin");

  const isHr =
    normalizedRole === "hr" ||
    normalizedRole === "hr_manager" ||
    normalizedRole === "hrmanager" ||
    normalizedRole === "hr_executive" ||
    normalizedRole.includes("hr");

  const canViewPeriods =
    isAdmin ||
    isHr ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*") ||
    !normalizedRole;

  const canCreatePeriod =
    isAdmin ||
    isHr ||
    userPermissions.includes("payroll.create") ||
    userPermissions.includes("payroll.process") ||
    userPermissions.includes("*");

  const canLockPeriod =
    isAdmin ||
    userPermissions.includes("payroll.process") ||
    userPermissions.includes("*");

  // ── Data State ──────────────────────────────────────────────────────
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState<boolean>(false);
  const [createFormError, setCreateFormError] = useState<string | null>(null);

  // Create Form Fields
  const now = new Date();
  const [formMonth, setFormMonth] = useState<number>(now.getMonth() + 1);
  const [formYear, setFormYear] = useState<number>(now.getFullYear());
  const [formName, setFormName] = useState<string>(
    `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`
  );
  const [formStartDate, setFormStartDate] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
  );
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const [formEndDate, setFormEndDate] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
  );
  const [formPayDate, setFormPayDate] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
  );
  const [formRemarks, setFormRemarks] = useState<string>("");

  // Details Modal State
  const [selectedDetailsPeriod, setSelectedDetailsPeriod] =
    useState<PayrollPeriod | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);

  // Lock / Action In-Flight State
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  // ── Fetch Periods From Real Backend ─────────────────────────────────
  const fetchPeriods = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await payrollApi.getPeriodsList({
        page,
        limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        year: yearFilter !== "all" ? Number(yearFilter) : undefined,
        search: searchQuery.trim() || undefined,
      });

      setPeriods(res.items);
      setTotalPages(res.totalPages || 1);
      setTotalRecords(res.total || res.items.length);
    } catch (err: any) {
      // STRICT ZERO-MOCK RULE: Do NOT fallback to local fake data
      setPeriods([]);
      setTotalPages(1);
      setTotalRecords(0);

      if (err?.response?.status === 404) {
        setApiError(
          "Backend payroll service is currently unavailable or pending deployment (404 Not Found). Live payroll periods will appear once the backend endpoint is accessible."
        );
      } else if (err?.response?.status === 401) {
        setApiError(
          "Authentication session has expired or is invalid. Please sign in to view payroll periods."
        );
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payroll periods from the server."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, yearFilter, searchQuery]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  // Dynamically extract distinct available years from real records (no hard-coded list)
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    periods.forEach((p) => {
      if (p.periodYear) years.add(p.periodYear);
      else if (p.startDate) {
        const yr = new Date(p.startDate).getFullYear();
        if (!isNaN(yr)) years.add(yr);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [periods]);

  // Client search filtering if backend returned full set or subset
  const filteredPeriods = useMemo(() => {
    if (!searchQuery.trim()) return periods;
    const q = searchQuery.toLowerCase().trim();
    return periods.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.status && p.status.toLowerCase().includes(q))
    );
  }, [periods, searchQuery]);

  // ── Month/Year selector helper for Create Modal ─────────────────────
  const handleMonthYearChange = (newMonth: number, newYear: number) => {
    setFormMonth(newMonth);
    setFormYear(newYear);
    const mName = MONTH_NAMES[newMonth - 1] || `Month ${newMonth}`;
    setFormName(`${mName} ${newYear}`);

    const sDay = "01";
    const lDay = String(new Date(newYear, newMonth, 0).getDate()).padStart(2, "0");
    const mStr = String(newMonth).padStart(2, "0");

    setFormStartDate(`${newYear}-${mStr}-${sDay}`);
    setFormEndDate(`${newYear}-${mStr}-${lDay}`);
    setFormPayDate(`${newYear}-${mStr}-${lDay}`);
  };

  // ── Create Payroll Period Handler ───────────────────────────────────
  const handleCreatePeriodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFormError(null);

    // Basic UX Validation
    if (!formName.trim()) {
      setCreateFormError("Payroll Period Name is required.");
      return;
    }
    if (!formStartDate) {
      setCreateFormError("Start Date is required.");
      return;
    }
    if (!formEndDate) {
      setCreateFormError("End Date is required.");
      return;
    }
    if (!formPayDate) {
      setCreateFormError("Pay Date is required.");
      return;
    }

    const start = new Date(formStartDate);
    const end = new Date(formEndDate);
    const pay = new Date(formPayDate);

    if (isNaN(start.getTime())) {
      setCreateFormError("Start Date is invalid.");
      return;
    }
    if (isNaN(end.getTime())) {
      setCreateFormError("End Date is invalid.");
      return;
    }
    if (isNaN(pay.getTime())) {
      setCreateFormError("Pay Date is invalid.");
      return;
    }
    if (end < start) {
      setCreateFormError("End Date cannot be earlier than Start Date.");
      return;
    }

    setIsSubmittingCreate(true);
    try {
      // Call REAL backend API
      const newPeriod = await payrollApi.createPeriod({
        name: formName.trim(),
        startDate: formStartDate,
        endDate: formEndDate,
        payDate: formPayDate,
        periodMonth: formMonth,
        periodYear: formYear,
        remarks: formRemarks.trim() || undefined,
      });

      toast.success(
        `Payroll period "${newPeriod.name || formName}" created successfully.`
      );
      setCreateModalOpen(false);
      setFormRemarks("");
      // Refresh REAL backend list
      await fetchPeriods();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create payroll period on backend.";
      setCreateFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // ── Lock / Unlock Handler ───────────────────────────────────────────
  const handleToggleLock = async (period: PayrollPeriod) => {
    if (!period.id) return;
    setActionInProgressId(period.id);
    try {
      if (period.isLocked) {
        await payrollApi.reopenPeriod(
          period.id,
          "Reopened by administrator request"
        );
        toast.success(`Period "${period.name}" unlocked successfully.`);
      } else {
        await payrollApi.lockPeriod(
          period.id,
          "Locked by administrator request"
        );
        toast.success(`Period "${period.name}" locked successfully.`);
      }
      await fetchPeriods();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update period lock status."
      );
    } finally {
      setActionInProgressId(null);
    }
  };

  // ── Void Handler ────────────────────────────────────────────────────
  const handleVoidPeriod = async (period: PayrollPeriod) => {
    if (!period.id) return;
    if (
      !window.confirm(
        `Are you sure you want to void the payroll period "${period.name}"? This action cancels the period.`
      )
    ) {
      return;
    }

    setActionInProgressId(period.id);
    try {
      await payrollApi.voidPeriod(period.id, "Voided by user request");
      toast.success(`Period "${period.name}" has been voided.`);
      await fetchPeriods();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to void payroll period."
      );
    } finally {
      setActionInProgressId(null);
    }
  };

  // ── Open Details Modal ──────────────────────────────────────────────
  const handleViewDetails = (period: PayrollPeriod) => {
    setSelectedDetailsPeriod(period);
    setDetailsModalOpen(true);
  };

  // ── Access Restricted Guard ─────────────────────────────────────────
  if (!canViewPeriods) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <EmptyState
          title="Access Restricted"
          description="You do not have permission to view Payroll Periods. Please contact your system administrator for access."
          icon={AlertCircle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Payroll Periods
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, manage, and monitor payroll periods.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Navigation Tabs (Segmented Control matching Attendance) */}
          <div className="flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <Link to="/dashboard/payroll">Payroll Dashboard</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
            >
              <Link to="/dashboard/payroll/periods">Payroll Periods</Link>
            </Button>
          </div>

          {canCreatePeriod ? (
            <Button
              size="sm"
              onClick={() => {
                setCreateFormError(null);
                setCreateModalOpen(true);
              }}
              className="h-8 gap-1.5 cursor-pointer text-xs text-brand-foreground shadow-sm"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Plus className="h-4 w-4" />
              <span>Create Payroll Period</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* ── Filter & Search Toolbar ───────────────────────────────── */}
      <GlassCard className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by period name or ID…"
                className="h-9 pl-9 text-xs"
              />
            </div>

            {/* Status Filter */}
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Provision Generated">
                    Provision Generated
                  </SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Pending Approval">
                    Pending Approval
                  </SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Finalized">Finalized</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Locked">Locked</SelectItem>
                  <SelectItem value="Void">Void</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Year Filter (from real data) */}
            {availableYears.length > 0 ? (
              <div className="w-32">
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.map((yr) => (
                      <SelectItem key={yr} value={String(yr)}>
                        {yr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <div className="text-xs text-muted-foreground">
            {totalRecords > 0 ? (
              <span>
                Showing {filteredPeriods.length} of {totalRecords} record
                {totalRecords === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
        </div>
      </GlassCard>

      {/* ── Error Banner ──────────────────────────────────────────── */}
      {apiError && (
        <Alert variant="destructive" className="border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <div className="flex flex-1 items-center justify-between gap-2">
            <AlertDescription className="text-xs font-medium">
              {apiError}
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPeriods}
              className="h-7 text-xs"
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* ── Table / Content Area ──────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card/60 p-4">
            <Skeleton className="mb-4 h-6 w-48" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      ) : filteredPeriods.length === 0 ? (
        /* Empty State — strictly no sample/dummy rows */
        <div className="py-8">
          <EmptyState
            title="No payroll periods found"
            description="Create a payroll period to begin payroll processing."
            icon={Calendar}
          />
          {canCreatePeriod ? (
            <div className="mt-4 flex justify-center">
              <Button
                size="sm"
                onClick={() => {
                  setCreateFormError(null);
                  setCreateModalOpen(true);
                }}
                className="gap-1.5 text-brand-foreground shadow-sm"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Plus className="h-4 w-4" />
                <span>Create Payroll Period</span>
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        /* Production-Ready Table */
        <GlassCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold">Payroll Period</TableHead>
                  <TableHead className="font-semibold">Start Date</TableHead>
                  <TableHead className="font-semibold">End Date</TableHead>
                  <TableHead className="font-semibold">Pay Date</TableHead>
                  <TableHead className="font-semibold text-right">
                    Employee Count
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold">Created Date</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeriods.map((period) => {
                  const tone = getPeriodStatusTone(period.status);
                  const isLockedOrFinalized = Boolean(
                    period.isLocked ||
                      period.status?.toLowerCase() === "finalized" ||
                      period.status?.toLowerCase() === "closed"
                  );

                  return (
                    <TableRow
                      key={period.id}
                      className="border-b border-border/60 hover:bg-accent/40 transition-colors"
                    >
                      {/* Period Name */}
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>{period.name}</span>
                          {period.isCurrent ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                            >
                              Current
                            </Badge>
                          ) : null}
                          {period.isLocked ? (
                            <span title="Locked period">
                              <Lock className="h-3 w-3 text-amber-500 shrink-0" />
                            </span>
                          ) : null}
                        </div>
                      </TableCell>

                      {/* Start Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(period.startDate)}
                      </TableCell>

                      {/* End Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(period.endDate)}
                      </TableCell>

                      {/* Pay Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(period.payDate)}
                      </TableCell>

                      {/* Employee Count */}
                      <TableCell className="text-xs text-right font-mono text-muted-foreground">
                        {formatCount(period.employeeCount)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <StatusBadge
                          status={period.status || "Draft"}
                          tone={tone}
                        />
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(period.createdAt)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={actionInProgressId === period.id}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(period)}
                              className="gap-2 cursor-pointer text-xs"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View Details</span>
                            </DropdownMenuItem>

                            {canLockPeriod ? (
                              <DropdownMenuItem
                                onClick={() => handleToggleLock(period)}
                                className="gap-2 cursor-pointer text-xs"
                              >
                                {period.isLocked ? (
                                  <>
                                    <Unlock className="h-3.5 w-3.5 text-amber-500" />
                                    <span>Reopen Period</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Lock Period</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            ) : null}

                            {!isLockedOrFinalized && canCreatePeriod ? (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleVoidPeriod(period)}
                                  className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>Void Period</span>
                                </DropdownMenuItem>
                              </>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Server-Side Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
              <div>
                Page {page} of {totalPages} ({totalRecords} total periods)
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1 || loading}
                  className="h-8 px-2.5"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page >= totalPages || loading}
                  className="h-8 px-2.5"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* ── Create Payroll Period Dialog ──────────────────────────── */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleCreatePeriodSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-foreground" />
                <span>Create Payroll Period</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure a new payroll period based on your company's pay cycle.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {createFormError && (
                <Alert variant="destructive" className="py-2 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <AlertDescription>{createFormError}</AlertDescription>
                </Alert>
              )}

              {/* Month & Year Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="period-month" className="text-xs font-medium">
                    Month <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={String(formMonth)}
                    onValueChange={(val) =>
                      handleMonthYearChange(Number(val), formYear)
                    }
                  >
                    <SelectTrigger id="period-month" className="h-9 text-xs">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_NAMES.map((m, idx) => (
                        <SelectItem key={idx + 1} value={String(idx + 1)}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="period-year" className="text-xs font-medium">
                    Year <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={String(formYear)}
                    onValueChange={(val) =>
                      handleMonthYearChange(formMonth, Number(val))
                    }
                  >
                    <SelectTrigger id="period-year" className="h-9 text-xs">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[formYear - 1, formYear, formYear + 1].map((yr) => (
                        <SelectItem key={yr} value={String(yr)}>
                          {yr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Period Name */}
              <div className="space-y-1.5">
                <Label htmlFor="period-name" className="text-xs font-medium">
                  Payroll Period Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="period-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., September 2026"
                  required
                  className="h-9 text-xs"
                />
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="period-start-date"
                    className="text-xs font-medium"
                  >
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="period-start-date"
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="period-end-date"
                    className="text-xs font-medium"
                  >
                    End Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="period-end-date"
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Pay Date */}
              <div className="space-y-1.5">
                <Label htmlFor="period-pay-date" className="text-xs font-medium">
                  Pay Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="period-pay-date"
                  type="date"
                  value={formPayDate}
                  onChange={(e) => setFormPayDate(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  The scheduled date when salary disbursement is planned.
                </p>
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <Label htmlFor="period-remarks" className="text-xs font-medium">
                  Remarks / Notes
                </Label>
                <Textarea
                  id="period-remarks"
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="Optional operational remarks or cycle notes"
                  rows={2}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateModalOpen(false)}
                disabled={isSubmittingCreate}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingCreate}
                className="gap-1.5 text-brand-foreground shadow-sm"
                style={{ background: "var(--gradient-brand)" }}
              >
                {isSubmittingCreate ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Creating Period…</span>
                  </>
                ) : (
                  <span>Create Period</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Period Details Dialog ─────────────────────────────────── */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-foreground" />
              <span>{selectedDetailsPeriod?.name || "Payroll Period Details"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review live period configurations and status recorded on backend.
            </DialogDescription>
          </DialogHeader>

          {selectedDetailsPeriod && (
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card/60 p-3">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1">
                    <StatusBadge
                      status={selectedDetailsPeriod.status || "Draft"}
                      tone={getPeriodStatusTone(selectedDetailsPeriod.status)}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Lock State:</span>
                  <div className="mt-1 font-medium">
                    {selectedDetailsPeriod.isLocked ? (
                      <span className="text-amber-500 font-semibold flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <Unlock className="h-3 w-3" /> Open
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-border bg-card/40 p-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period ID:</span>
                  <span className="font-mono text-[11px]">
                    {selectedDetailsPeriod.id || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">
                    {formatDate(selectedDetailsPeriod.startDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span className="font-medium">
                    {formatDate(selectedDetailsPeriod.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pay Date:</span>
                  <span className="font-medium">
                    {formatDate(selectedDetailsPeriod.payDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee Count:</span>
                  <span className="font-medium">
                    {formatCount(selectedDetailsPeriod.employeeCount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At:</span>
                  <span>{formatDate(selectedDetailsPeriod.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated At:</span>
                  <span>{formatDate(selectedDetailsPeriod.updatedAt)}</span>
                </div>
                {selectedDetailsPeriod.remarks ? (
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground">Remarks:</span>
                    <p className="mt-0.5 text-foreground">
                      {selectedDetailsPeriod.remarks}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDetailsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayrollPeriodsPage;
