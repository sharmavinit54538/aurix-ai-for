import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { ReactReduxContext } from "react-redux";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Banknote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Layers,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { formatDate, formatCount, formatOptionalCount } from "@/lib/format";
import { useAurix } from "@/lib/aurix-store";
import { normalizeRole } from "@/lib/roles";
import { useCurrentRole } from "@/lib/use-current-role";
import { selectUserPermissions, selectUserRole } from "@/store/sidebar/sidebarSelectors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { paymentApi } from "../api/paymentApi";
import { generateIdempotencyKey } from "../utils/idempotency";
import {
  getHttpErrorMessage,
  resolvePaymentBatchActions,
  type PaymentActionId,
} from "../utils/paymentBatchActions";
import { PaymentBatchActionMenu } from "../components/PaymentBatchActionMenu";
import {
  PaymentBatchActionDialogs,
  type ActiveDrawerType,
  type ActiveModalType,
} from "../components/PaymentBatchActionDialogs";
import type {
  BankFileFormat,
  BankFileMetadata,
  CompanyBankAccount,
  EligiblePayrollRun,
  PaymentAuditLogEntry,
  PaymentBatch,
  PaymentBatchItem,
  PaymentBatchStatus,
  PaymentDashboardSummary,
  PaymentMode,
  PaymentReconciliation,
} from "../types/payment";
import { toast } from "sonner";

const STATUS_FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "validated", label: "Validated" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "file_generated", label: "File Generated" },
  { value: "submitted", label: "Submitted" },
  { value: "partial", label: "Partial" },
  { value: "failed", label: "Failed" },
  { value: "reconciled", label: "Reconciled" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_MODE_FILTERS = ["all", "NEFT", "RTGS", "IMPS", "UPI"];

function getBatchStatusBadge(status?: PaymentBatchStatus | string) {
  const norm = (status || "").toLowerCase();
  switch (norm) {
    case "draft":
      return <Badge className="bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30">Draft</Badge>;
    case "validating":
      return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30">Validating</Badge>;
    case "validated":
      return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">Validated</Badge>;
    case "pending_approval":
      return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">Pending Approval</Badge>;
    case "approved":
      return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Approved</Badge>;
    case "file_generated":
      return <Badge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30">Bank File Ready</Badge>;
    case "submitted":
      return <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30">Submitted to Bank</Badge>;
    case "processing":
      return <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30">Bank Processing</Badge>;
    case "partial":
      return <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30">Partial</Badge>;
    case "paid":
      return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Paid</Badge>;
    case "reconciled":
    case "closed":
      return <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30">Reconciled</Badge>;
    case "validation_failed":
      return <Badge variant="destructive">Validation Failed</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="text-muted-foreground">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{norm ? norm.replace(/_/g, " ") : "Unknown"}</Badge>;
  }
}

function triggerBlobDownload(blob: Blob, filename: string, mimeType?: string) {
  const url = window.URL.createObjectURL(
    new Blob([blob], { type: mimeType || blob.type || "application/octet-stream" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export default function PaymentBatchListPage() {
  const navigate = useNavigate();
  const aurixStore = useAurix();
  const currentRole = useCurrentRole();

  const reduxCtx = useContext(ReactReduxContext);
  const readReduxSidebar = useCallback(() => {
    if (!reduxCtx?.store) {
      return { userPermissions: ["*"], userRole: null as string | null };
    }
    const st = reduxCtx.store.getState();
    return {
      userPermissions: selectUserPermissions(st),
      userRole: selectUserRole(st),
    };
  }, [reduxCtx]);

  const [sidebarState, setSidebarState] = useState(readReduxSidebar);

  useEffect(() => {
    setSidebarState(readReduxSidebar());
    if (!reduxCtx?.store) return;
    return reduxCtx.store.subscribe(() => {
      setSidebarState(readReduxSidebar());
    });
  }, [reduxCtx, readReduxSidebar]);

  const userPermissions = sidebarState.userPermissions;
  const effectiveRole: string | null = currentRole ?? sidebarState.userRole ?? null;
  const isSuperAdmin = normalizeRole(effectiveRole) === "super_admin";

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summary, setSummary] = useState<PaymentDashboardSummary | null>(null);
  const [batches, setBatches] = useState<PaymentBatch[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [loadError, setLoadError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  // Eligible Run selection modal state
  const [selectRunModalOpen, setSelectRunModalOpen] = useState(false);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [availableRuns, setAvailableRuns] = useState<EligiblePayrollRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [customRunId, setCustomRunId] = useState("");

  // Three-Dot Menu Active State
  const [busyAction, setBusyAction] = useState<{ batchId: string; actionId: PaymentActionId } | null>(null);
  const [actionBatch, setActionBatch] = useState<PaymentBatch | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawerType>(null);
  const [loadingDrawerData, setLoadingDrawerData] = useState(false);
  const [isDialogSubmitting, setIsDialogSubmitting] = useState(false);

  const [drawerRecon, setDrawerRecon] = useState<PaymentReconciliation | null>(null);
  const [drawerAuditLogs, setDrawerAuditLogs] = useState<PaymentAuditLogEntry[]>([]);
  const [drawerHeldItems, setDrawerHeldItems] = useState<PaymentBatchItem[]>([]);
  const [drawerFailedItems, setDrawerFailedItems] = useState<PaymentBatchItem[]>([]);
  const [companyAccounts, setCompanyAccounts] = useState<CompanyBankAccount[]>([]);
  const [generatedBankFile, setGeneratedBankFile] = useState<BankFileMetadata | null>(null);

  const listAbortRef = useRef<AbortController | null>(null);
  const summaryAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = searchInput.trim();
      setDebouncedSearch((prev) => {
        if (prev !== next) {
          setPage(1);
        }
        return next;
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadSummary = useCallback(async () => {
    if (isSuperAdmin) {
      setSummaryLoading(false);
      return;
    }
    summaryAbortRef.current?.abort();
    const controller = new AbortController();
    summaryAbortRef.current = controller;
    setSummaryLoading(true);
    try {
      const data = await paymentApi.getDashboardSummary(controller.signal);
      if (!controller.signal.aborted) {
        setSummary(data);
      }
    } catch (err: any) {
      if (controller.signal.aborted || err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
        return;
      }
    } finally {
      if (!controller.signal.aborted) {
        setSummaryLoading(false);
      }
    }
  }, [isSuperAdmin]);

  const loadBatches = useCallback(async () => {
    if (isSuperAdmin) {
      setLoading(false);
      return;
    }
    listAbortRef.current?.abort();
    const controller = new AbortController();
    listAbortRef.current = controller;

    setLoading(true);
    setLoadError(null);
    setBackendUnavailable(false);
    try {
      const data = await paymentApi.getPaymentBatches(
        {
          page,
          limit,
          status: statusFilter !== "all" ? statusFilter : undefined,
          paymentMode: paymentModeFilter !== "all" ? paymentModeFilter : undefined,
          search: debouncedSearch || undefined,
          sortBy,
          sortDir,
        },
        controller.signal
      );
      if (!controller.signal.aborted) {
        setBatches(data?.items || []);
        setTotalCount(data?.total ?? 0);
        setTotalPages(data?.totalPages ?? Math.max(1, Math.ceil((data?.total ?? 0) / limit)));
      }
    } catch (err: any) {
      if (controller.signal.aborted || err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
        return;
      }
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
        setBatches([]);
        setTotalCount(0);
      } else {
        const msg = getHttpErrorMessage(err, "Failed to load payment batches");
        setLoadError(msg);
        toast.error(msg);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [isSuperAdmin, page, limit, statusFilter, paymentModeFilter, debouncedSearch, sortBy, sortDir]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadSummary(), loadBatches()]);
  }, [loadSummary, loadBatches]);

  useEffect(() => {
    loadSummary();
    return () => summaryAbortRef.current?.abort();
  }, [loadSummary]);

  useEffect(() => {
    loadBatches();
    return () => listAbortRef.current?.abort();
  }, [loadBatches]);

  const fetchAvailableRuns = async () => {
    setLoadingRuns(true);
    try {
      const runs = await paymentApi.getEligibleRuns();
      setAvailableRuns(runs);
      setSelectedRunId(runs.length > 0 ? runs[0].id : "");
    } catch {
      setAvailableRuns([]);
    } finally {
      setLoadingRuns(false);
    }
  };

  const handleOpenNewBatchModal = () => {
    setSelectRunModalOpen(true);
    fetchAvailableRuns();
  };

  const handleProceedToRunPayment = (runIdToUse?: string) => {
    const targetRunId = (runIdToUse || customRunId.trim() || selectedRunId).trim();
    if (!targetRunId) {
      toast.error("Please select an eligible payroll run or enter a Run ID");
      return;
    }
    setSelectRunModalOpen(false);
    navigate({
      to: `/dashboard/payroll/runs/${targetRunId}/payment` as any,
    });
  };

  const navigateToBatch = (batchId: string, tab?: string, statusFilterParam?: string) => {
    if (!tab && !statusFilterParam) {
      navigate({ to: `/dashboard/payroll/payments/${batchId}` as any });
      return;
    }
    const qs = new URLSearchParams();
    if (tab) qs.set("tab", tab);
    if (statusFilterParam) qs.set("status", statusFilterParam);
    navigate({ to: `/dashboard/payroll/payments/${batchId}?${qs.toString()}` as any });
  };

  const handleToggleSort = (columnKey: string) => {
    setPage(1);
    if (sortBy === columnKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(columnKey);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPaymentModeFilter("all");
    setSortBy("created_at");
    setSortDir("desc");
    setPage(1);
  };

  // ── Three-Dot Action Menu Handler ─────────────────────────────────

  const handleMenuAction = async (actionId: PaymentActionId, batch: PaymentBatch) => {
    if (busyAction || isDialogSubmitting) return;

    switch (actionId) {
      case "manage_batch":
        navigateToBatch(batch.id);
        return;
      case "view_employees":
      case "view_transactions":
        navigateToBatch(batch.id, "overview");
        return;
      case "view_successful_payments":
        navigateToBatch(batch.id, "overview", "paid");
        return;
      case "view_failed_payments":
        navigateToBatch(batch.id, "overview", "failed");
        return;

      case "view_details":
      case "track_status": {
        setActionBatch(batch);
        setDrawerRecon(null);
        setActiveDrawer("details");
        setLoadingDrawerData(true);
        try {
          const [detailRes, reconRes] = await Promise.all([
            paymentApi.getPaymentBatch(batch.id, { page: 1, limit: 1 }),
            paymentApi.getReconciliation(batch.id).catch(() => null),
          ]);
          setActionBatch(detailRes.batch);
          setDrawerRecon(reconRes);
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to load batch details"));
        } finally {
          setLoadingDrawerData(false);
        }
        return;
      }

      case "view_approval_history":
      case "view_audit_log": {
        setActionBatch(batch);
        setDrawerAuditLogs([]);
        setActiveDrawer(actionId === "view_approval_history" ? "approval_history" : "audit_log");
        setLoadingDrawerData(true);
        try {
          const logs = await paymentApi.getBatchAuditLogs(batch.id);
          setDrawerAuditLogs(logs);
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to load batch history"));
        } finally {
          setLoadingDrawerData(false);
        }
        return;
      }

      case "view_held_employees":
      case "release_held": {
        setActionBatch(batch);
        setDrawerHeldItems([]);
        setActiveDrawer("held_items");
        setLoadingDrawerData(true);
        try {
          const res = await paymentApi.getPaymentBatchItems(batch.id, { status: "held", limit: 100 });
          setDrawerHeldItems(res.items);
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to load held employees"));
        } finally {
          setLoadingDrawerData(false);
        }
        return;
      }

      case "view_failure_reason": {
        setActionBatch(batch);
        setDrawerFailedItems([]);
        setActiveDrawer("failure_reason");
        setLoadingDrawerData(true);
        try {
          const res = await paymentApi.getFailedPaymentItems(batch.id, { limit: 100 });
          setDrawerFailedItems(res.items);
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to load failed transactions"));
        } finally {
          setLoadingDrawerData(false);
        }
        return;
      }

      case "edit_batch": {
        setActionBatch(batch);
        setBusyAction({ batchId: batch.id, actionId });
        try {
          const accounts = await paymentApi.getTenantBankAccounts();
          setCompanyAccounts(accounts);
          setActiveModal("edit_batch");
        } catch (err: any) {
          if (batch.sourceAccount) {
            setCompanyAccounts([batch.sourceAccount]);
            setActiveModal("edit_batch");
          } else {
            toast.error(getHttpErrorMessage(err, "Unable to load company bank accounts"));
          }
        } finally {
          setBusyAction(null);
        }
        return;
      }

      case "validate_batch": {
        setBusyAction({ batchId: batch.id, actionId });
        try {
          const res = await paymentApi.validatePaymentBatch(batch.id);
          if (res.hasBlockingErrors) {
            toast.warning(
              `Validation found ${res.errorCount} blocking issue(s). Review bank details.`
            );
          } else {
            toast.success(`Batch ${batch.batchNumber} validated successfully.`);
          }
          await refreshAll();
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to validate batch"));
        } finally {
          setBusyAction(null);
        }
        return;
      }

      case "submit_for_approval":
        setActionBatch(batch);
        setActiveModal("submit_for_approval");
        return;

      case "approve_batch":
        setActionBatch(batch);
        setActiveModal("approve_batch");
        return;

      case "reject_batch":
        setActionBatch(batch);
        setActiveModal("reject_batch");
        return;

      case "generate_bank_file":
        setActionBatch(batch);
        setGeneratedBankFile(batch.latestBankFile || null);
        setActiveModal("generate_bank_file");
        return;

      case "download_bank_file": {
        setBusyAction({ batchId: batch.id, actionId });
        try {
          const { blob, filename, mimeType } = await paymentApi.downloadBankFile(batch.id);
          triggerBlobDownload(blob, filename, mimeType);
          toast.success(`Downloaded ${filename}`);
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to download bank file"));
        } finally {
          setBusyAction(null);
        }
        return;
      }

      case "export_report": {
        setBusyAction({ batchId: batch.id, actionId });
        try {
          const { blob, filename, mimeType } = await paymentApi.exportBatchReport(batch.id);
          triggerBlobDownload(blob, filename, mimeType);
          toast.success(`Downloaded ${filename}`);
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to export payment report"));
        } finally {
          setBusyAction(null);
        }
        return;
      }

      case "download_reconciliation_report": {
        setBusyAction({ batchId: batch.id, actionId });
        try {
          const { blob, filename, mimeType } = await paymentApi.exportReconciliationReport(batch.id);
          triggerBlobDownload(blob, filename, mimeType);
          toast.success(`Downloaded ${filename}`);
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to export reconciliation report"));
        } finally {
          setBusyAction(null);
        }
        return;
      }

      case "submit_to_bank":
        setActionBatch(batch);
        setActiveModal("submit_to_bank");
        return;

      case "reconcile_payment": {
        setActionBatch(batch);
        setBusyAction({ batchId: batch.id, actionId });
        try {
          const recon = await paymentApi.getReconciliation(batch.id);
          setDrawerRecon(recon);
          setActiveModal("reconcile_payment");
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to fetch reconciliation status"));
        } finally {
          setBusyAction(null);
        }
        return;
      }

      case "retry_failed": {
        setActionBatch(batch);
        setBusyAction({ batchId: batch.id, actionId });
        try {
          const res = await paymentApi.getFailedPaymentItems(batch.id, { limit: 100 });
          setDrawerFailedItems(res.items);
          setActiveModal("retry_failed");
        } catch (err: any) {
          toast.error(getHttpErrorMessage(err, "Failed to load failed transactions"));
        } finally {
          setBusyAction(null);
        }
        return;
      }

      case "cancel_batch":
        setActionBatch(batch);
        setActiveModal("cancel_batch");
        return;

      case "delete_draft":
        setActionBatch(batch);
        setActiveModal("delete_draft");
        return;
    }
  };

  // ── Confirmed Dialog Execution Callbacks ──────────────────────────

  const runMutation = async (fn: () => Promise<void>, fallbackErr: string) => {
    if (isDialogSubmitting) return;
    setIsDialogSubmitting(true);
    try {
      await fn();
    } catch (err: any) {
      toast.error(getHttpErrorMessage(err, fallbackErr));
    } finally {
      setIsDialogSubmitting(false);
    }
  };

  const hasActiveFilters =
    Boolean(searchInput.trim()) || statusFilter !== "all" || paymentModeFilter !== "all";

  if (isSuperAdmin) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Alert variant="destructive" className="rounded-2xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold">Tenant Payroll Access Restricted</AlertTitle>
          <AlertDescription className="text-xs mt-1">
            Platform Super Admin accounts are restricted from viewing or operating on organization salary disbursements and bank payment records. Sign in as an authorized company Payroll Admin or Executive.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const startIndex = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);
  const currentUserId = aurixStore.user?.id;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Top Actions Bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2">
        <Button
          size="sm"
          onClick={handleOpenNewBatchModal}
          className="h-8 gap-1.5 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Batch from Run</span>
        </Button>
      </div>

      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-2xl text-xs">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-xs">Payment Batches API unavailable</AlertTitle>
          <AlertDescription className="text-xs mt-0.5">
            Unable to reach the payment batches service right now.
          </AlertDescription>
        </Alert>
      )}

      {loadError && (
        <Alert variant="destructive" className="rounded-2xl text-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-xs font-semibold">Failed to load payment batches</AlertTitle>
          <AlertDescription className="text-xs flex items-center justify-between">
            <span>{loadError}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void refreshAll()}
              className="h-7 text-xs rounded-xl"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Summary Stat Cards (Backend-calculated across ALL company batches) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Batches"
          value={summary ? formatCount(summary.totalBatches) : summaryLoading ? "Loading..." : "—"}
          hint="All time disbursements"
          icon={Layers}
          accent="brand"
        />
        <StatCard
          label="Pending Approval"
          value={summary ? formatCount(summary.awaitingApprovalBatches) : summaryLoading ? "Loading..." : "—"}
          hint="Awaiting checker"
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Submitted to Bank"
          value={summary ? formatCount(summary.inBankingProcessingBatches) : summaryLoading ? "Loading..." : "—"}
          hint="In banking processing"
          icon={Banknote}
          accent="brand"
        />
        <StatCard
          label="Reconciled"
          value={summary ? formatCount(summary.reconciledBatches) : summaryLoading ? "Loading..." : "—"}
          hint={
            summary
              ? summary.totalBatches > 0
                ? `${Math.round(summary.reconciliationPercentage)}% reconciled`
                : "No batches"
              : summaryLoading
              ? "Loading..."
              : "—"
          }
          icon={CheckCircle2}
          accent="success"
        />
      </div>

      {/* ── Search and Filter Controls ──────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              id="batch-search-input"
              type="search"
              placeholder="Search batch, period, month, ref..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setDebouncedSearch(searchInput.trim());
                  setPage(1);
                }
              }}
              className="pl-8 h-9 rounded-xl text-xs"
            />
          </div>

          <select
            aria-label="Filter by payment mode"
            value={paymentModeFilter}
            onChange={(e) => {
              setPaymentModeFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground"
          >
            {PAYMENT_MODE_FILTERS.map((mode) => (
              <option key={mode} value={mode}>
                {mode === "all" ? "All Modes" : mode}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearFilters}
              className="h-8 gap-1 text-xs rounded-xl text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto scrollbar-none pb-1 lg:pb-0">
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={statusFilter === opt.value ? "default" : "outline"}
              onClick={() => {
                setStatusFilter(opt.value);
                setPage(1);
              }}
              className="rounded-xl text-xs h-8 shrink-0"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Batches Table ───────────────────────────────────────────── */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleSort("batch_number")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span>Batch Number</span>
                    {renderSortIcon("batch_number")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleSort("payroll_period")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span>Payroll Period</span>
                    {renderSortIcon("payroll_period")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleSort("payment_mode")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span>Payment Mode</span>
                    {renderSortIcon("payment_mode")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleSort("employee_count")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span>Employees</span>
                    {renderSortIcon("employee_count")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleSort("payable_amount")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span>Payable Amount</span>
                    {renderSortIcon("payable_amount")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleSort("status")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span>Status</span>
                    {renderSortIcon("status")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleSort("created_at")}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span>Created Date</span>
                    {renderSortIcon("created_at")}
                  </button>
                </th>
                <th className="px-4 py-3.5 text-right w-[84px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    <span>Loading payment batches...</span>
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="font-semibold text-foreground text-sm">
                      {hasActiveFilters ? "No Matching Payment Batches" : "No Payment Batches Found"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {hasActiveFilters
                        ? "Try clearing or adjusting your search term and status filters."
                        : "Create a payment batch from any locked payroll run to get started."}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      {hasActiveFilters && (
                        <Button size="sm" variant="outline" onClick={handleClearFilters} className="h-8 text-xs">
                          Clear Filters
                        </Button>
                      )}
                      <Button size="sm" onClick={handleOpenNewBatchModal} className="h-8 gap-1.5 text-xs">
                        <Plus className="h-3.5 w-3.5" />
                        <span>New Batch from Run</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                batches.map((batch) => {
                  const rowActions = resolvePaymentBatchActions(batch, {
                    role: currentRole,
                    permissions: userPermissions,
                    currentUserId,
                  });
                  return (
                    <tr
                      key={batch.id}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => navigateToBatch(batch.id)}
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-foreground">
                        <div className="flex items-center gap-1.5">
                          <span>{batch.batchNumber}</span>
                          {batch.retryOfBatchId && (
                            <Badge variant="outline" className="text-[10px] font-sans">
                              Retry
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground">{batch.periodName || "—"}</td>
                      <td className="px-4 py-3 font-medium text-primary">{batch.paymentMode}</td>
                      <td className="px-4 py-3 font-mono">
                        {formatOptionalCount(batch.employeeCount)}
                        {batch.heldCount ? (
                          <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400">
                            (+{batch.heldCount} held)
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {batch.payableAmountFormatted || "—"}
                      </td>
                      <td className="px-4 py-3">{getBatchStatusBadge(batch.status)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(batch.createdAt)}</td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <PaymentBatchActionMenu
                          batch={batch}
                          actions={rowActions}
                          busyActionId={busyAction?.batchId === batch.id ? busyAction.actionId : null}
                          onAction={(actionId, target) => void handleMenuAction(actionId, target)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Bar ──────────────────────────────────────────── */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{startIndex}–{endIndex}</strong> of{" "}
              <strong className="text-foreground">{totalCount}</strong> batch{totalCount === 1 ? "" : "es"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2.5 text-xs gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </Button>
              <span className="font-mono text-xs">
                Page {page} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2.5 text-xs gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* ── Select Payroll Run Dialog ─────────────────────────────── */}
      <Dialog open={selectRunModalOpen} onOpenChange={setSelectRunModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              <span>Create Payment Batch from Run</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select a locked/finalized payroll run without an active batch or enter a Run UUID directly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {loadingRuns ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground gap-2 text-xs">
                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                <span>Loading eligible payroll runs...</span>
              </div>
            ) : availableRuns.length > 0 ? (
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Eligible Payroll Runs</label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {availableRuns.map((r) => {
                    const isSelected = selectedRunId === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => {
                          setSelectedRunId(r.id);
                          setCustomRunId("");
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "border-border/70 hover:border-border hover:bg-muted/40"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">
                            {r.periodName} ({r.runNumber})
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {r.employeeCount} employees · {r.totalNetFormatted}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-[10px]">
                            {r.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "ghost"}
                            className="h-7 text-xs px-2.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProceedToRunPayment(r.id);
                            }}
                          >
                            <span>Select</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 p-4 text-center">
                <Clock className="h-6 w-6 text-muted-foreground/60 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-foreground">No pending eligible payroll runs</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  All finalized runs already have payment batches or no locked payroll runs exist yet.
                </p>
              </div>
            )}

            <div className="space-y-1.5 pt-1 border-t border-border/60">
              <label className="text-xs font-medium text-muted-foreground">
                Or enter Payroll Run UUID directly:
              </label>
              <Input
                placeholder="e.g. 8b854a91-d16a-4006-8e84-200cbb127054"
                value={customRunId}
                onChange={(e) => {
                  setCustomRunId(e.target.value);
                  if (e.target.value) setSelectedRunId("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleProceedToRunPayment();
                }}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 border-t border-border/60 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectRunModalOpen(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleProceedToRunPayment()}
              disabled={!selectedRunId && !customRunId.trim()}
              className="h-8 text-xs gap-1.5"
            >
              <span>Continue to Payment Batch</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Three-Dot Action Modals & Side Drawers ────────────────── */}
      <PaymentBatchActionDialogs
        batch={actionBatch}
        activeModal={activeModal}
        activeDrawer={activeDrawer}
        loadingDrawerData={loadingDrawerData}
        reconciliation={drawerRecon}
        auditLogs={drawerAuditLogs}
        heldItems={drawerHeldItems}
        failedItems={drawerFailedItems}
        companyAccounts={companyAccounts}
        generatedBankFile={generatedBankFile}
        isCreator={Boolean(
          currentUserId && actionBatch?.createdBy?.id && currentUserId === actionBatch.createdBy.id
        )}
        isSubmitting={isDialogSubmitting}
        onCloseModal={() => setActiveModal(null)}
        onCloseDrawer={() => setActiveDrawer(null)}
        onNavigateToBatch={navigateToBatch}
        onSaveEdit={(payload) =>
          runMutation(async () => {
            if (!actionBatch) return;
            await paymentApi.updatePaymentBatch(actionBatch.id, payload, generateIdempotencyKey());
            toast.success(`Updated batch ${actionBatch.batchNumber}`);
            setActiveModal(null);
            await refreshAll();
          }, "Failed to update batch")
        }
        onConfirmSubmitForApproval={(remarks) =>
          runMutation(async () => {
            if (!actionBatch) return;
            await paymentApi.submitForApproval(actionBatch.id, remarks, generateIdempotencyKey());
            toast.success(`Submitted ${actionBatch.batchNumber} for approval`);
            setActiveModal(null);
            await refreshAll();
          }, "Failed to submit batch for approval")
        }
        onConfirmApprove={(remarks) =>
          runMutation(async () => {
            if (!actionBatch) return;
            await paymentApi.approvePaymentBatch(actionBatch.id, { remarks }, generateIdempotencyKey());
            toast.success(`Approved payment batch ${actionBatch.batchNumber}`);
            setActiveModal(null);
            await refreshAll();
          }, "Failed to approve payment batch")
        }
        onConfirmReject={(reason) =>
          runMutation(async () => {
            if (!actionBatch) return;
            await paymentApi.rejectPaymentBatch(actionBatch.id, { reason }, generateIdempotencyKey());
            toast.warning(`Rejected payment batch ${actionBatch.batchNumber}`);
            setActiveModal(null);
            await refreshAll();
          }, "Failed to reject payment batch")
        }
        onGenerateBankFile={(format: BankFileFormat) =>
          runMutation(async () => {
            if (!actionBatch) return;
            const meta = await paymentApi.generateBankFile(
              actionBatch.id,
              { format },
              generateIdempotencyKey()
            );
            setGeneratedBankFile(meta);
            toast.success(`Generated ${meta.fileName}`);
            await refreshAll();
          }, "Failed to generate bank file")
        }
        onDownloadLatestBankFile={async (b) => {
          try {
            const { blob, filename, mimeType } = await paymentApi.downloadBankFile(b.id);
            triggerBlobDownload(blob, filename, mimeType);
            toast.success(`Downloaded ${filename}`);
          } catch (err: any) {
            toast.error(getHttpErrorMessage(err, "Failed to download bank file"));
          }
        }}
        onConfirmSubmitToBank={(payload) =>
          runMutation(async () => {
            if (!actionBatch) return;
            await paymentApi.submitPaymentBatch(actionBatch.id, payload, generateIdempotencyKey());
            toast.success(`Batch ${actionBatch.batchNumber} submitted to bank`);
            setActiveModal(null);
            await refreshAll();
          }, "Failed to submit batch to bank")
        }
        onConfirmReconcile={(notes) =>
          runMutation(async () => {
            if (!actionBatch) return;
            await paymentApi.reconcilePaymentBatch(actionBatch.id, notes, generateIdempotencyKey());
            toast.success(`Reconciled payment batch ${actionBatch.batchNumber}`);
            setActiveModal(null);
            await refreshAll();
          }, "Failed to reconcile batch")
        }
        onConfirmRetryFailed={(reason) =>
          runMutation(async () => {
            if (!actionBatch) return;
            const retryBatch = await paymentApi.retryFailedBatch(
              actionBatch.id,
              { reason },
              generateIdempotencyKey()
            );
            toast.success(`Created retry batch ${retryBatch.batchNumber}`);
            setActiveModal(null);
            await refreshAll();
            navigateToBatch(retryBatch.id);
          }, "Failed to create retry batch")
        }
        onConfirmReleaseHeldItem={(item, remarks) =>
          runMutation(async () => {
            if (!actionBatch) return;
            await paymentApi.releasePaymentItem(
              actionBatch.id,
              item.id,
              { remarks },
              generateIdempotencyKey()
            );
            toast.success(`Released hold for ${item.employeeName}`);
            const updatedHeld = await paymentApi.getPaymentBatchItems(actionBatch.id, {
              status: "held",
              limit: 100,
            });
            setDrawerHeldItems(updatedHeld.items);
            await refreshAll();
          }, "Failed to release held payment")
        }
        onConfirmCancel={(reason) =>
          runMutation(async () => {
            if (!actionBatch) return;
            await paymentApi.cancelPaymentBatch(actionBatch.id, reason, generateIdempotencyKey());
            toast.success(`Cancelled payment batch ${actionBatch.batchNumber}`);
            setActiveModal(null);
            await refreshAll();
          }, "Failed to cancel payment batch")
        }
        onConfirmDeleteDraft={() =>
          runMutation(async () => {
            if (!actionBatch) return;
            await paymentApi.deletePaymentBatch(actionBatch.id);
            toast.success(`Deleted draft batch ${actionBatch.batchNumber}`);
            setActiveModal(null);
            await refreshAll();
          }, "Failed to delete draft payment batch")
        }
      />
    </div>
  );
}
