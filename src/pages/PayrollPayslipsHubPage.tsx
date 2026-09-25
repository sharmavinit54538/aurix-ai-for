import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  History,
  Lock,
  Printer,
  RefreshCw,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react";
import { GlassCard, StatCard, EmptyState, Skeleton } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayslipHistoryItem,
} from "@/services/payrollApi";
import { toast } from "sonner";

// ── Currency Formatter (INR) ──────────────────────────────────────────
// STRICT ZERO MOCK DATA: operates purely on authentic backend numbers.
function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(val: string | null | undefined): string {
  if (!val) return "—";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(val);
  }
}

export function PayrollPayslipsHubPage() {
  const navigate = useNavigate();
  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);

  // RBAC Permission Check
  const currentRole = useCurrentRole();
  const isHr = currentRole === "hr_admin";

  const currentUserId = ws.user?.id || (ws.user as any)?.employeeId || "";

  // State
  const [payslips, setPayslips] = useState<PayslipHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ── Data Fetching ───────────────────────────────────────────────────
  const fetchPayslips = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      if (isHr) {
        // HR Admin: check my-payslips or self history first
        const res = await payrollApi.getMyPayslips();
        setPayslips(res?.items || []);
      } else if (currentUserId) {
        // Employee self-service
        const res = await payrollApi.getEmployeePayslipHistory(currentUserId);
        setPayslips(res?.items || []);
      } else {
        const res = await payrollApi.getMyPayslips();
        setPayslips(res?.items || []);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        // Authentic empty state from backend (zero mock records)
        setPayslips([]);
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payslips from backend."
        );
        setPayslips([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isHr, currentUserId]);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayslips();
    setIsRefreshing(false);
  };

  // ── Download Document Handler ───────────────────────────────────────
  const handleDownload = async (item: PayslipHistoryItem) => {
    if (!item.runId || !item.employeeId) {
      toast.info("Run or Employee identifier not provided for document download.");
      return;
    }

    setDownloadingId(item.id);
    try {
      const blob = await payrollApi.downloadPayslip(item.runId, item.employeeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${item.employeeId}_${item.periodName || item.runId}.pdf`
        .replace(/\s+/g, "_")
        .toLowerCase();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Payslip downloaded successfully.");
    } catch (err: any) {
      if (err?.response?.status === 404) {
        toast.info(
          "Backend PDF download endpoint is unavailable. Click 'View' to see and print your official statement."
        );
      } else {
        toast.error("Failed to download payslip from backend.");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  // ── Filtered Records ────────────────────────────────────────────────
  const filteredPayslips = payslips.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.periodName && p.periodName.toLowerCase().includes(q)) ||
      (p.payslipNumber && p.payslipNumber.toLowerCase().includes(q)) ||
      (p.runId && p.runId.toLowerCase().includes(q)) ||
      (p.employeeName && p.employeeName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* ── Breadcrumb & Top Bar ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="hover:text-foreground transition-colors font-medium"
          >
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">My Payslips</span>
        </div>

        {isHr ? (
          <Link
            to="/dashboard/payroll"
            className="hover:text-foreground transition-colors font-medium flex items-center gap-1 text-primary"
          >
            <span>Go to Payroll Management</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        ) : null}
      </div>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight">
              Payslips & Salary Statements
            </h1>
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary text-xs font-semibold"
            >
              Self-Service Portal
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Access and download your official finalized salary payslips generated by the OFC360 Payroll Engine.
          </p>
        </div>
      </div>

      {/* ── Search & Filter Bar ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by period, slip number, or run..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>
      </div>

      {/* ── Loading Skeleton ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : null}

      {/* ── Error State ──────────────────────────────────────────────── */}
      {!isLoading && apiError ? (
        <GlassCard className="p-8 text-center border-border/80">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-foreground">
            Unable to Retrieve Payslip History
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            {apiError}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="mt-4 text-xs gap-1.5"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Retry Connection</span>
          </Button>
        </GlassCard>
      ) : null}

      {/* ── Zero Mock Data Authentic Empty State ─────────────────────── */}
      {!isLoading && !apiError && filteredPayslips.length === 0 ? (
        <GlassCard className="p-10 text-center border-border/80">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-4">
            <FileCheck className="h-6 w-6" />
          </div>
          <h3 className="text-base font-display font-semibold text-foreground">
            No Final Payslips Available
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? `No payslip records matching "${searchQuery}".`
              : "Official final payslips will appear here once monthly payroll runs have been formally approved and finalized by your HR payroll team."}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {searchQuery ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="text-xs"
              >
                Clear Search
              </Button>
            ) : null}
            {isHr ? (
              <Button
                size="sm"
                variant="default"
                onClick={() => navigate({ to: "/dashboard/payroll" as any })}
                className="text-xs gap-1.5"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Go to Payroll Finalization</span>
              </Button>
            ) : null}
          </div>
        </GlassCard>
      ) : null}

      {/* ── Real Backend Payslips Listing ────────────────────────────── */}
      {!isLoading && !apiError && filteredPayslips.length > 0 ? (
        <div className="space-y-3">
          {filteredPayslips.map((item) => (
            <GlassCard
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-border"
            >
              <div className="flex items-start gap-3.5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.periodName || "Payroll Cycle"}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-semibold"
                    >
                      <Lock className="h-2.5 w-2.5 mr-1 inline-block" />
                      Finalized
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {item.payslipNumber ? (
                      <span>
                        Ref:{" "}
                        <strong className="font-mono text-foreground">
                          {item.payslipNumber}
                        </strong>
                      </span>
                    ) : null}
                    {item.finalizedAt ? (
                      <span>Finalized on {formatDate(item.finalizedAt)}</span>
                    ) : null}
                    {item.paymentDate ? (
                      <span>Paid on {formatDate(item.paymentDate)}</span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Right Side: Net Pay & Actions */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/50">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Net Pay
                  </div>
                  <div className="text-base font-display font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(item.netPay)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.runId && item.employeeId ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate({
                          to: `/dashboard/payroll/runs/${item.runId}/employees/${item.employeeId}/payslip` as any,
                        })
                      }
                      className="text-xs gap-1.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  ) : null}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(item)}
                    disabled={downloadingId === item.id}
                    className="text-xs gap-1.5"
                  >
                    {downloadingId === item.id ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default PayrollPayslipsHubPage;
