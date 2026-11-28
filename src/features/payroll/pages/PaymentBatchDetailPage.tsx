import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Ban,
  Banknote,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileDown,
  FileSpreadsheet,
  History,
  Pencil,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  UserX,
  Users,
  XCircle,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/use-current-role";
import {
  formatDate,
  formatDateTime,
  formatCount,
  formatOptionalCount,
  formatPaise,
} from "@/lib/format";
import { PayrollStepper } from "../components/PayrollStepper";
import { MakerCheckerBanner } from "../components/MakerCheckerBanner";
import { BankValidationTable } from "../components/BankValidationTable";
import { PaymentReconciliationCard } from "../components/PaymentReconciliationCard";
import { paymentApi } from "../api/paymentApi";
import { generateIdempotencyKey } from "../utils/idempotency";
import type {
  BankFileFormat,
  BankFileMetadata,
  BankResponsePreviewResult,
  BankValidationIssue,
  CompanyBankAccount,
  PaymentAuditLogEntry,
  PaymentBatch,
  PaymentBatchItem,
  PaymentMode,
  PaymentReconciliation,
} from "../types/payment";
import { toast } from "sonner";

const ITEM_STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "held", label: "Held" },
  { value: "released", label: "Released" },
  { value: "retried", label: "Retried" },
];

const PRE_SUBMISSION_STATUSES = new Set([
  "draft",
  "validating",
  "validation_failed",
  "validated",
  "pending_approval",
  "rejected",
  "approved",
  "file_generated",
]);

const EDITABLE_BATCH_STATUSES = new Set([
  "draft",
  "validation_failed",
  "validated",
  "rejected",
]);

const EXPORTABLE_BATCH_STATUSES = new Set([
  "approved",
  "file_generated",
  "submitted",
  "processing",
  "partial",
  "paid",
  "failed",
  "reconciled",
  "closed",
]);

function getItemStatusBadge(item: PaymentBatchItem) {
  if (item.isHeld || item.status === "held") {
    return (
      <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/10">
        Held
      </Badge>
    );
  }
  switch (item.status) {
    case "paid":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
          Paid
        </Badge>
      );
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "processing":
      return (
        <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30">
          Processing
        </Badge>
      );
    case "released":
      return (
        <Badge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30">
          Released
        </Badge>
      );
    case "retried":
      return (
        <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30">
          Queued Retry
        </Badge>
      );
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
}

export default function PaymentBatchDetailPage() {
  const params = useParams({ strict: false }) as { batchId?: string };
  const batchId = params?.batchId?.trim() || "";
  const navigate = useNavigate();
  const aurixStore = useAurix();
  const currentUser = aurixStore.user;
  const currentRole = useCurrentRole();
  const isSuperAdmin = currentRole === "super_admin";

  const initialSearch =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const rawInitialTab = initialSearch?.get("tab");
  const validInitialTab =
    rawInitialTab === "overview" ||
    rawInitialTab === "validation" ||
    rawInitialTab === "file" ||
    rawInitialTab === "import" ||
    rawInitialTab === "reconcile" ||
    rawInitialTab === "history"
      ? rawInitialTab
      : "overview";
  const rawInitialStatus = initialSearch?.get("status");
  const validInitialStatus =
    rawInitialStatus && ITEM_STATUS_FILTERS.some((f) => f.value === rawInitialStatus)
      ? rawInitialStatus
      : "all";

  const [activeTab, setActiveTab] = useState<
    "overview" | "validation" | "file" | "import" | "reconcile" | "history"
  >(validInitialTab);

  // Batch Data State
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [batch, setBatch] = useState<PaymentBatch | null>(null);
  const [items, setItems] = useState<PaymentBatchItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [itemPage, setItemPage] = useState(1);
  const [itemLimit] = useState(25);
  const [itemStatusFilter, setItemStatusFilter] = useState<string>(validInitialStatus);
  const [itemSearchInput, setItemSearchInput] = useState("");
  const [debouncedItemSearch, setDebouncedItemSearch] = useState("");

  const [validationIssues, setValidationIssues] = useState<BankValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [bankFile, setBankFile] = useState<BankFileMetadata | null>(null);
  const [bankFiles, setBankFiles] = useState<BankFileMetadata[]>([]);
  const [reconciliation, setReconciliation] = useState<PaymentReconciliation | null>(null);
  const [auditLogs, setAuditLogs] = useState<PaymentAuditLogEntry[]>([]);

  const inFlightRef = useRef(false);
  const loadAbortRef = useRef<AbortController | null>(null);

  // Batch Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Edit Draft Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [companyAccounts, setCompanyAccounts] = useState<CompanyBankAccount[]>([]);
  const [editSourceAccountId, setEditSourceAccountId] = useState("");
  const [editPaymentMode, setEditPaymentMode] = useState<PaymentMode>("NEFT");
  const [editPaymentDate, setEditPaymentDate] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Submit to Bank Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [bankRefNumber, setBankRefNumber] = useState("");
  const [submitDate, setSubmitDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitNotes, setSubmitNotes] = useState("");

  // Bank File Format
  const [selectedFormat, setSelectedFormat] = useState<BankFileFormat>("HDFC_ENET_CSV");
  const [generatingFile, setGeneratingFile] = useState(false);

  // Bank Response CSV Import
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<BankResponsePreviewResult | null>(null);
  const [allowPartialImport, setAllowPartialImport] = useState(true);
  const [importingCsv, setImportingCsv] = useState(false);
  const [applyingCsv, setApplyingCsv] = useState(false);

  // Item Actions: Hold / Release / Record Result / Retry Item / Reveal / Transaction Detail
  const [holdTargetItem, setHoldTargetItem] = useState<PaymentBatchItem | null>(null);
  const [holdItemReason, setHoldItemReason] = useState("");

  const [releaseTargetItem, setReleaseTargetItem] = useState<PaymentBatchItem | null>(null);
  const [releaseRemarks, setReleaseRemarks] = useState("");

  const [recordResultTarget, setRecordResultTarget] = useState<PaymentBatchItem | null>(null);
  const [recordResultStatus, setRecordResultStatus] = useState<"PAID" | "FAILED">("PAID");
  const [recordResultUtr, setRecordResultUtr] = useState("");
  const [recordResultErr, setRecordResultErr] = useState("");

  const [retryTargetItem, setRetryTargetItem] = useState<PaymentBatchItem | null>(null);
  const [retryReason, setRetryReason] = useState("");
  const [retryAccNumber, setRetryAccNumber] = useState("");
  const [retryIfsc, setRetryIfsc] = useState("");
  const [retryHolderName, setRetryHolderName] = useState("");

  // Batch-level Retry Failed Modal
  const [batchRetryModalOpen, setBatchRetryModalOpen] = useState(false);
  const [batchRetryReason, setBatchRetryReason] = useState("");

  // Reconcile Confirm Modal
  const [reconcileModalOpen, setReconcileModalOpen] = useState(false);
  const [reconcileNotes, setReconcileNotes] = useState("");

  // Audited Reveal & Item Transaction Detail Modal
  const [revealEmpId, setRevealEmpId] = useState<string | null>(null);
  const [revealReason, setRevealReason] = useState("");
  const [revealedAccount, setRevealedAccount] = useState<{
    accountNumber: string;
    ifscCode: string;
    autoHideSeconds: number;
  } | null>(null);
  const [revealModalOpen, setRevealModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<PaymentBatchItem | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const clean = itemSearchInput.trim();
      setDebouncedItemSearch((prev) => {
        if (prev !== clean) {
          setItemPage(1);
        }
        return clean;
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [itemSearchInput]);

  const loadBatchData = useCallback(async () => {
    if (!batchId || isSuperAdmin) {
      setLoading(false);
      return;
    }
    loadAbortRef.current?.abort();
    const controller = new AbortController();
    loadAbortRef.current = controller;

    setLoading(true);
    setLoadError(null);

    try {
      const [detailRes, valRes, reconRes, fileMetaRes, logsRes] = await Promise.all([
        paymentApi.getPaymentBatch(
          batchId,
          {
            page: itemPage,
            limit: itemLimit,
            status: itemStatusFilter !== "all" ? itemStatusFilter : undefined,
            search: debouncedItemSearch || undefined,
          },
          controller.signal
        ),
        paymentApi.getBatchValidation(batchId, controller.signal).catch(() => null),
        paymentApi.getReconciliation(batchId, controller.signal).catch(() => null),
        paymentApi.getBankFileMetadata(batchId, controller.signal).catch(() => null),
        paymentApi.getBatchAuditLogs(batchId, controller.signal).catch(() => []),
      ]);

      if (controller.signal.aborted) return;

      setBatch(detailRes.batch);
      setItems(detailRes.items || []);
      setTotalItems(detailRes.totalItems ?? 0);
      if (valRes) {
        setValidationIssues(valRes.issues || []);
      }
      if (reconRes) {
        setReconciliation(reconRes);
      }
      if (fileMetaRes) {
        setBankFile(fileMetaRes.latest);
        setBankFiles(fileMetaRes.files || []);
      }
      setAuditLogs(logsRes || []);
    } catch (err: any) {
      if (controller.signal.aborted || err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
        return;
      }
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load payment batch details";
      setLoadError(msg);
      toast.error(msg);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [batchId, isSuperAdmin, itemPage, itemLimit, itemStatusFilter, debouncedItemSearch]);

  useEffect(() => {
    loadBatchData();
    return () => loadAbortRef.current?.abort();
  }, [loadBatchData]);

  const isBatchCreator = Boolean(
    currentUser?.id && batch?.createdBy?.id && currentUser.id === batch.createdBy.id
  );
  const hasBlockingValidation = validationIssues.some((v) => v.blocking);
  const statusNorm = batch?.status || "draft";
  const isPreSubmission = PRE_SUBMISSION_STATUSES.has(statusNorm);
  const isEditable = EDITABLE_BATCH_STATUSES.has(statusNorm);
  const canExportBankFile = EXPORTABLE_BATCH_STATUSES.has(statusNorm);
  const isSettling = ["submitted", "processing", "partial", "paid", "failed"].includes(statusNorm);
  const hasEligibleFailedForRetry = items.some(
    (it) => (it.status === "failed" || it.status === "retried") && !it.repayoutBatchId
  );

  // ── Action Handlers ───────────────────────────────────────────────

  const handleValidateBatch = async () => {
    if (!batch || isValidating) return;
    setIsValidating(true);
    try {
      const res = await paymentApi.validatePaymentBatch(batch.id);
      setValidationIssues(res.issues || []);
      toast[res.hasBlockingErrors ? "warning" : "success"](
        res.hasBlockingErrors
          ? `Validation found ${res.errorCount} blocking issue(s)`
          : "Validation passed — batch is ready for approval"
      );
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to validate batch");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!batch || inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      await paymentApi.submitForApproval(batch.id);
      toast.success("Batch submitted for checker approval.");
      await loadBatchData();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const msg = typeof detail === "object" && detail?.message ? detail.message : detail || err?.message;
      toast.error(msg || "Unable to submit batch for approval");
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleApproveBatch = async () => {
    if (inFlightRef.current || !batch) return;
    if (isBatchCreator) {
      toast.error("The batch creator cannot approve this batch.");
      return;
    }
    if (approvalRemarks.trim().length < 5) {
      toast.error("Approval remarks must be at least 5 characters.");
      return;
    }
    inFlightRef.current = true;
    try {
      await paymentApi.approvePaymentBatch(
        batch.id,
        { remarks: approvalRemarks.trim() },
        generateIdempotencyKey()
      );
      setApproveModalOpen(false);
      setApprovalRemarks("");
      toast.success("Payment batch approved successfully!");
      await loadBatchData();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail?.message ||
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to approve payment batch"
      );
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleRejectBatch = async () => {
    if (inFlightRef.current || !batch) return;
    if (rejectReason.trim().length < 5) {
      toast.error("Rejection reason must be at least 5 characters.");
      return;
    }
    inFlightRef.current = true;
    try {
      await paymentApi.rejectPaymentBatch(
        batch.id,
        { reason: rejectReason.trim() },
        generateIdempotencyKey()
      );
      setRejectModalOpen(false);
      setRejectReason("");
      toast.warning("Payment batch rejected and returned for editing.");
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || "Failed to reject batch");
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleOpenEditModal = async () => {
    if (!batch) return;
    setEditSourceAccountId(batch.sourceAccountId || "");
    setEditPaymentMode(batch.paymentMode || "NEFT");
    setEditPaymentDate(batch.submissionDate ? batch.submissionDate.slice(0, 10) : "");
    setEditNotes(batch.notes || "");
    setEditModalOpen(true);
    try {
      const accounts = await paymentApi.getTenantBankAccounts();
      setCompanyAccounts(accounts);
    } catch {
      setCompanyAccounts(batch.sourceAccount ? [batch.sourceAccount] : []);
    }
  };

  const handleSaveDraftEdit = async () => {
    if (!batch || inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      await paymentApi.updatePaymentBatch(
        batch.id,
        {
          sourceAccountId: editSourceAccountId || undefined,
          paymentMode: editPaymentMode,
          paymentDate: editPaymentDate || undefined,
          notes: editNotes,
        },
        generateIdempotencyKey()
      );
      setEditModalOpen(false);
      toast.success("Payment batch instructions updated.");
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update batch instructions");
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleDeleteDraft = async () => {
    if (!batch || inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      await paymentApi.deletePaymentBatch(batch.id);
      toast.success(`Deleted batch ${batch.batchNumber}`);
      setDeleteModalOpen(false);
      navigate({ to: "/dashboard/payroll/payments" as any });
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to delete draft batch");
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleCancelBatch = async () => {
    if (!batch || inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      await paymentApi.cancelPaymentBatch(
        batch.id,
        cancelReason.trim() || "Cancelled prior to bank submission",
        generateIdempotencyKey()
      );
      setCancelModalOpen(false);
      setCancelReason("");
      toast.success("Payment batch cancelled.");
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to cancel payment batch");
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleGenerateBankFile = async () => {
    if (inFlightRef.current || !batch) return;
    setGeneratingFile(true);
    inFlightRef.current = true;
    try {
      const metadata = await paymentApi.generateBankFile(
        batch.id,
        { format: selectedFormat },
        generateIdempotencyKey()
      );
      setBankFile(metadata);
      toast.success(`Generated ${metadata.fileName}`);
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || "Failed to generate bank file");
    } finally {
      setGeneratingFile(false);
      inFlightRef.current = false;
    }
  };

  const handleDownloadBankFile = async () => {
    if (!batch) return;
    try {
      const { blob, filename, mimeType } = await paymentApi.downloadBankFile(batch.id);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: mimeType || blob.type || "application/octet-stream" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || bankFile?.fileName || `SALARY_${batch.batchNumber}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to download bank file");
    }
  };

  const handleExportCsvReport = async () => {
    if (!batch) return;
    try {
      const { blob, filename, mimeType } = await paymentApi.exportBatchReport(batch.id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType || "text/csv" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `${batch.batchNumber}_Report.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Exported ${filename}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to export report");
    }
  };

  const handleSubmitBatch = async () => {
    if (inFlightRef.current || !batch) return;
    if (!bankRefNumber.trim()) {
      toast.error("Bank reference number is required.");
      return;
    }
    inFlightRef.current = true;
    try {
      await paymentApi.submitPaymentBatch(
        batch.id,
        {
          bankReferenceNumber: bankRefNumber.trim(),
          submissionDate: submitDate || new Date().toISOString().slice(0, 10),
          notes: submitNotes.trim() || undefined,
        },
        generateIdempotencyKey()
      );
      setSubmitModalOpen(false);
      setBankRefNumber("");
      setSubmitNotes("");
      toast.success("Batch marked as submitted to bank.");
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || "Failed to submit batch");
    } finally {
      inFlightRef.current = false;
    }
  };

  const handlePreviewCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !batch) return;
    setCsvFile(file);
    setImportingCsv(true);
    try {
      const preview = await paymentApi.previewBankResponse(batch.id, file);
      setImportPreview(preview);
      toast.info(`CSV parsed: ${preview.validRows} valid row(s), ${preview.invalidRows} invalid row(s).`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || "Failed to parse bank response CSV");
    } finally {
      setImportingCsv(false);
      e.target.value = "";
    }
  };

  const handleApplyCsv = async () => {
    if (inFlightRef.current || !batch || !importPreview) return;
    setApplyingCsv(true);
    inFlightRef.current = true;
    try {
      const res = await paymentApi.applyBankResponse(
        batch.id,
        {
          previewToken: importPreview.previewToken,
          allowPartial: importPreview.invalidRows > 0 ? allowPartialImport : true,
        },
        generateIdempotencyKey()
      );
      toast.success(`Applied bank response: ${res.paidCount} paid, ${res.failedCount} failed.`);
      setImportPreview(null);
      setCsvFile(null);
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || "Failed to apply bank response");
    } finally {
      setApplyingCsv(false);
      inFlightRef.current = false;
    }
  };

  const handleConfirmReconcile = async () => {
    if (inFlightRef.current || !batch) return;
    inFlightRef.current = true;
    try {
      await paymentApi.reconcilePaymentBatch(
        batch.id,
        reconcileNotes.trim() || undefined,
        generateIdempotencyKey()
      );
      setReconcileModalOpen(false);
      setReconcileNotes("");
      toast.success("Payment batch formally reconciled.");
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.response?.data?.message || "Cannot reconcile batch yet");
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleConfirmBatchRetry = async () => {
    if (!batch || inFlightRef.current) return;
    if (batchRetryReason.trim().length < 2) {
      toast.error("Please provide a short reason for creating a retry batch.");
      return;
    }
    inFlightRef.current = true;
    try {
      const retryBatch = await paymentApi.retryFailedBatch(batch.id, {
        reason: batchRetryReason.trim(),
      });
      setBatchRetryModalOpen(false);
      setBatchRetryReason("");
      toast.success(`Created retry batch ${retryBatch.batchNumber}`);
      navigate({ to: `/dashboard/payroll/payments/${retryBatch.id}` as any });
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create retry batch");
    } finally {
      inFlightRef.current = false;
    }
  };

  // ── Item-Level Action Handlers ────────────────────────────────────

  const handleHoldItem = async () => {
    if (!batch || !holdTargetItem || holdItemReason.trim().length < 2) {
      toast.error("Hold reason is required.");
      return;
    }
    try {
      await paymentApi.holdPaymentItem(batch.id, holdTargetItem.id, {
        reason: holdItemReason.trim(),
      });
      setHoldTargetItem(null);
      setHoldItemReason("");
      toast.success("Employee payment placed on hold.");
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to hold employee item");
    }
  };

  const handleReleaseItem = async () => {
    if (!batch || !releaseTargetItem) return;
    try {
      await paymentApi.releasePaymentItem(batch.id, releaseTargetItem.id, {
        remarks: releaseRemarks.trim() || undefined,
      });
      setReleaseTargetItem(null);
      setReleaseRemarks("");
      toast.success("Employee hold released.");
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to release hold");
    }
  };

  const handleRecordSingleItemResult = async () => {
    if (!batch || !recordResultTarget) return;
    if (recordResultStatus === "PAID" && !recordResultUtr.trim()) {
      toast.error("UTR / Bank Transaction Reference is required to confirm payment.");
      return;
    }
    try {
      await paymentApi.recordPaymentResults(batch.id, {
        results: [
          {
            itemId: recordResultTarget.id,
            status: recordResultStatus,
            utrNumber: recordResultStatus === "PAID" ? recordResultUtr.trim() : undefined,
            errorMessage: recordResultStatus === "FAILED" ? (recordResultErr.trim() || "Bank transfer failed") : undefined,
          },
        ],
        allowPartial: false,
      });
      setRecordResultTarget(null);
      setRecordResultUtr("");
      setRecordResultErr("");
      toast.success(`Recorded ${recordResultStatus} outcome for ${recordResultTarget.employeeName}`);
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to record item payment outcome");
    }
  };

  const handleRetrySingleItem = async () => {
    if (!batch || !retryTargetItem || retryReason.trim().length < 2) {
      toast.error("Retry reason is required.");
      return;
    }
    const updatedBankDetails =
      retryAccNumber.trim() || retryIfsc.trim() || retryHolderName.trim()
        ? {
            accountNumber: retryAccNumber.trim(),
            ifscCode: retryIfsc.trim().toUpperCase(),
            accountHolderName: retryHolderName.trim(),
          }
        : undefined;
    try {
      await paymentApi.retryPaymentItem(batch.id, retryTargetItem.id, {
        reason: retryReason.trim(),
        updatedBankDetails,
      });
      setRetryTargetItem(null);
      setRetryReason("");
      setRetryAccNumber("");
      setRetryIfsc("");
      setRetryHolderName("");
      toast.success("Item queued for retry.");
      await loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to queue retry");
    }
  };

  const handleViewItemDetail = async (item: PaymentBatchItem) => {
    if (!batch) return;
    setDetailItem(item);
    try {
      const fresh = await paymentApi.getPaymentBatchItemDetail(batch.id, item.id);
      setDetailItem(fresh);
    } catch {
      // Keep row snapshot if detail endpoint fails transiently
    }
  };

  const handleRevealAccount = async () => {
    if (!revealEmpId || revealReason.trim().length < 5) {
      toast.error("Justification reason of at least 5 characters is required.");
      return;
    }
    try {
      const data = await paymentApi.revealEmployeeBankAccount(revealEmpId, revealReason.trim());
      setRevealedAccount(data);
      window.setTimeout(() => {
        setRevealedAccount(null);
        setRevealModalOpen(false);
      }, (data.autoHideSeconds || 15) * 1000);
      toast.warning(`Account revealed for ${data.autoHideSeconds || 15}s under audit log.`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to reveal account details");
    }
  };

  if (isSuperAdmin) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Alert variant="destructive" className="rounded-2xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold">Tenant Payroll Access Restricted</AlertTitle>
          <AlertDescription className="text-xs mt-1">
            Platform Super Admin accounts cannot inspect tenant payroll disbursement batches or employee bank records.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalItemPages = Math.max(1, Math.ceil(totalItems / itemLimit));
  const reconPct = reconciliation?.reconciliationPercentage ?? 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Breadcrumb & Top Bar ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/dashboard/payroll/payments" as any })}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Payment Batches</span>
          </Button>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-xs text-muted-foreground font-mono">
            {batch?.batchNumber || `Batch: ${batchId}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadBatchData()}
            disabled={loading}
            className="h-8 gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          {batch && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleExportCsvReport()}
              className="h-8 gap-1.5 text-xs"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── 9-Step Lifecycle Stepper ──────────────────────────────────── */}
      <PayrollStepper
        currentStep="payment"
        runId={batch?.runId}
        batchId={batchId}
        runStatus={batch?.status || "Finalized"}
      />

      {loadError && (
        <Alert variant="destructive" className="rounded-2xl text-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">Failed to load payment batch</AlertTitle>
          <AlertDescription className="text-xs flex items-center justify-between mt-1">
            <span>{loadError}</span>
            <Button size="sm" variant="outline" onClick={() => void loadBatchData()} className="h-7 text-xs">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Maker-Checker Governance Banner ──────────────────────────── */}
      {batch && (
        <MakerCheckerBanner
          creatorId={batch.createdBy?.id || ""}
          creatorName={batch.createdBy?.name || "System"}
          createdAt={batch.createdAt}
          approverName={batch.approvedBy?.name}
          approvedAt={batch.approvedAt}
          approvalRemarks={batch.approvalRemarks}
          currentUserId={currentUser?.id}
        />
      )}

      {/* ── Batch Header & Lifecycle Buttons ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {batch?.batchNumber || `Payment Batch ${batchId}`}
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary capitalize"
            >
              {batch?.status ? batch.status.replace(/_/g, " ") : "Loading"}
            </Badge>
            {batch?.retryOfBatchId && (
              <Badge variant="outline" className="text-xs border-purple-500/40 text-purple-600 dark:text-purple-300">
                Re-payout Batch
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Disbursement Period: <strong>{batch?.periodName || "—"}</strong> • Mode:{" "}
            <strong>{batch?.paymentMode || "—"}</strong> • Run:{" "}
            <span className="font-mono">{batch?.runNumber || batch?.runId || "—"}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {batch && isEditable && (
            <>
              <Button size="sm" variant="outline" onClick={() => void handleOpenEditModal()} className="h-8 gap-1.5 text-xs">
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isValidating}
                onClick={() => void handleValidateBatch()}
                className="h-8 gap-1.5 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isValidating ? "animate-spin" : ""}`} />
                <span>Validate</span>
              </Button>
            </>
          )}

          {batch && (statusNorm === "draft" || statusNorm === "validated") && (
            <Button size="sm" variant="secondary" onClick={() => void handleSubmitForApproval()} className="h-8 gap-1.5 text-xs">
              <Send className="h-3.5 w-3.5" />
              <span>Submit for Approval</span>
            </Button>
          )}

          {batch && ["draft", "validated", "pending_approval"].includes(statusNorm) && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModalOpen(true)}
                className="h-8 gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Reject / Send Back</span>
              </Button>

              <Button
                id="batch-approve-btn"
                variant="default"
                size="sm"
                disabled={isBatchCreator || hasBlockingValidation || statusNorm === "draft"}
                onClick={() => setApproveModalOpen(true)}
                className="h-8 gap-1.5 text-xs font-semibold shadow-sm"
                title={
                  isBatchCreator
                    ? "The batch creator cannot approve this batch."
                    : hasBlockingValidation
                    ? "Resolve blocking validation errors first."
                    : statusNorm === "draft"
                    ? "Validate batch before approving."
                    : "Approve this payment batch"
                }
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Approve Batch</span>
              </Button>
            </>
          )}

          {batch && (statusNorm === "approved" || statusNorm === "file_generated") && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setSubmitModalOpen(true)}
              className="h-8 gap-1.5 text-xs font-semibold shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Mark Submitted to Bank</span>
            </Button>
          )}

          {batch && statusNorm === "draft" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteModalOpen(true)}
              className="h-8 gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Draft</span>
            </Button>
          )}

          {batch && isPreSubmission && statusNorm !== "draft" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCancelModalOpen(true)}
              className="h-8 gap-1.5 text-xs text-muted-foreground"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>Cancel Batch</span>
            </Button>
          )}

          {batch && (reconciliation?.canReconcile || hasEligibleFailedForRetry) && (
            <>
              {hasEligibleFailedForRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBatchRetryModalOpen(true)}
                  className="h-8 gap-1.5 text-xs border-amber-500/40 text-amber-700 dark:text-amber-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Create Retry Batch</span>
                </Button>
              )}
              {reconciliation?.canReconcile && !reconciliation.isReconciled && (
                <Button
                  size="sm"
                  onClick={() => setReconcileModalOpen(true)}
                  className="h-8 gap-1.5 text-xs font-semibold"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mark Reconciled</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Summary Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Payable Employees"
          value={formatOptionalCount(batch?.employeeCount)}
          hint={
            batch
              ? `${batch.paidCount ?? 0} paid • ${batch.pendingCount ?? 0} pending • ${batch.heldCount ?? 0} held`
              : "Loading"
          }
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Net Payable"
          value={batch?.payableAmountFormatted || "—"}
          hint={`Gross: ${batch?.grossAmountFormatted || "—"}`}
          icon={ShieldCheck}
          accent="success"
        />
        <StatCard
          label="Paid Amount"
          value={batch?.paidAmountFormatted || (reconciliation ? formatPaise(reconciliation.paidPaise) : "—")}
          hint={`${Math.round(reconPct)}% settled`}
          icon={Banknote}
          accent="brand"
        />
        <StatCard
          label="Held / Failed"
          value={batch?.heldAmountFormatted || "₹0.00"}
          hint={`Failed: ${batch?.failedAmountFormatted || "₹0.00"}`}
          icon={UserX}
          accent="warning"
        />
      </div>

      {/* ── Navigation Tabs ─────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="space-y-4"
      >
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/60 flex flex-wrap h-auto">
          <TabsTrigger value="overview" className="rounded-xl text-xs">
            Overview & Employees ({formatCount(totalItems)})
          </TabsTrigger>
          <TabsTrigger value="validation" className="rounded-xl text-xs">
            Bank Validation
            {validationIssues.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 px-1 py-0 text-[10px]">
                {validationIssues.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="file" className="rounded-xl text-xs">
            Bank Payment File
          </TabsTrigger>
          <TabsTrigger value="import" className="rounded-xl text-xs">
            Bank Response Import
          </TabsTrigger>
          <TabsTrigger value="reconcile" className="rounded-xl text-xs">
            Reconciliation
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl text-xs">
            History & Audit ({auditLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: OVERVIEW & EMPLOYEES ───────────────────────────── */}
        <TabsContent value="overview" className="space-y-6">
          {/* Batch Metadata & Bank Split Summary */}
          {batch && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <GlassCard className="p-4 lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Batch Information</h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    ID: {batch.id}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-muted-foreground">Company</span>
                    <p className="font-medium text-foreground mt-0.5">{batch.companyName || "—"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Payroll Period</span>
                    <p className="font-medium text-foreground mt-0.5">{batch.periodName || "—"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Payroll Run</span>
                    <p className="font-mono font-medium text-foreground mt-0.5">{batch.runNumber || batch.runId || "—"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Source Bank Account</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {batch.sourceAccount
                        ? `${batch.sourceAccount.bankName} (${batch.sourceAccount.accountNumberMasked})`
                        : batch.sourceAccountId || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Created</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {batch.createdBy?.name || "System"} • {formatDate(batch.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Approved</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {batch.approvedAt
                        ? `${batch.approvedBy?.name || "Approver"} • ${formatDate(batch.approvedAt)}`
                        : "Pending"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Submitted to Bank</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {batch.submittedAt
                        ? `${batch.bankReferenceNumber || "Ref recorded"} • ${formatDate(batch.submittedAt)}`
                        : "Not submitted"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Reconciled</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {batch.reconciledAt
                        ? `${batch.reconciledBy?.name || "Finance"} • ${formatDate(batch.reconciledAt)}`
                        : "Not reconciled"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Notes / Remarks</span>
                    <p className="text-foreground mt-0.5 truncate" title={batch.rejectionReason || batch.notes || ""}>
                      {batch.rejectionReason || batch.notes || "—"}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-sm font-semibold text-foreground">Bank Split & Progress</span>
                  <span className="font-mono text-xs font-semibold text-primary">{Math.round(reconPct)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, reconPct))}%` }}
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      {batch.paidAmountFormatted || "₹0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending Settlement</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400">
                      {batch.pendingAmountFormatted || "₹0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Failed</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400">
                      {batch.failedAmountFormatted || "₹0.00"}
                    </span>
                  </div>
                </div>
                {batch.bankSplitSummary && batch.bankSplitSummary.length > 0 && (
                  <div className="pt-2 border-t border-border/60 space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase">By Beneficiary Bank</span>
                    {batch.bankSplitSummary.map((sp) => (
                      <div key={sp.bankName} className="flex justify-between text-xs">
                        <span className="truncate pr-2">{sp.bankName} ({sp.count})</span>
                        <span className="font-mono shrink-0">{sp.amountFormatted}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          <GlassCard className="overflow-hidden p-0">
            <div className="p-4 border-b border-border/70 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Employee Payment Items</h3>
                <p className="text-xs text-muted-foreground">
                  Individual salary transactions with masked banking details, UTR tracking, and settlement controls
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search employee, code, UTR, IFSC..."
                    value={itemSearchInput}
                    onChange={(e) => setItemSearchInput(e.target.value)}
                    className="pl-8 h-8 rounded-xl text-xs"
                  />
                </div>
                <select
                  aria-label="Filter items by status"
                  value={itemStatusFilter}
                  onChange={(e) => {
                    setItemStatusFilter(e.target.value);
                    setItemPage(1);
                  }}
                  className="h-8 rounded-xl border border-input bg-background px-2.5 text-xs"
                >
                  {ITEM_STATUS_FILTERS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Bank & Account</th>
                    <th className="px-4 py-3">Payable</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">UTR / Ref & Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No employee payment records match the current filter.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const canHold = isPreSubmission && !item.isHeld && item.status !== "paid" && item.status !== "processing";
                      const canRelease = isPreSubmission && item.isHeld;
                      const canRecordResult = isSettling && !item.isHeld && item.status !== "paid";
                      const canRetry = (item.status === "failed" || item.status === "retried") && !item.repayoutBatchId;
                      return (
                        <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-foreground">{item.employeeName}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {item.employeeCode}
                              {item.department ? ` • ${item.department}` : ""}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-foreground">{item.bankName}</div>
                            <div className="text-[11px] font-mono text-muted-foreground">
                              {item.accountNumberMasked} • {item.ifscCode}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              {item.payableAmountFormatted || item.netAmountFormatted}
                            </div>
                            {item.isHeld && (
                              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                                Net: {item.netSalaryFormatted || item.netAmountFormatted}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {getItemStatusBadge(item)}
                            {(item.holdReason || item.failureReason) && (
                              <p
                                className="mt-1 max-w-[200px] truncate text-[10px] text-muted-foreground"
                                title={item.holdReason || item.failureReason || ""}
                              >
                                {item.holdReason || item.failureReason}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                            <div>{item.utr || item.transactionRef || item.paymentReference || "—"}</div>
                            {(item.creditedDate || item.reconciledAt) && (
                              <div className="text-[10px] opacity-75">
                                {formatDate(item.creditedDate || item.reconciledAt)}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center justify-end gap-1">
                              {canHold && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setHoldTargetItem(item)}
                                  className="h-7 text-xs text-amber-600 hover:text-amber-700"
                                >
                                  Hold
                                </Button>
                              )}
                              {canRelease && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setReleaseTargetItem(item)}
                                  className="h-7 text-xs text-indigo-600 hover:text-indigo-700"
                                >
                                  Release
                                </Button>
                              )}
                              {canRecordResult && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setRecordResultTarget(item);
                                    setRecordResultStatus("PAID");
                                    setRecordResultUtr(item.utr || "");
                                    setRecordResultErr("");
                                  }}
                                  className="h-7 text-xs text-primary"
                                >
                                  Record
                                </Button>
                              )}
                              {canRetry && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setRetryTargetItem(item);
                                    setRetryReason("");
                                    setRetryAccNumber("");
                                    setRetryIfsc(item.ifscCode !== "—" ? item.ifscCode : "");
                                    setRetryHolderName(item.accountHolderName || item.employeeName);
                                  }}
                                  className="h-7 text-xs text-purple-600 hover:text-purple-700"
                                >
                                  Retry
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => void handleViewItemDetail(item)}
                                className="h-7 text-xs"
                              >
                                Details
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setRevealEmpId(item.employeeId);
                                  setRevealReason("");
                                  setRevealedAccount(null);
                                  setRevealModalOpen(true);
                                }}
                                className="h-7 text-xs gap-1"
                                title="Audited reveal of bank account"
                              >
                                <Eye className="h-3 w-3" />
                                <span>Verify</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalItems > itemLimit && (
              <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
                <span>
                  Page {itemPage} of {totalItemPages} ({totalItems} items)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={itemPage <= 1 || loading}
                    onClick={() => setItemPage((p) => Math.max(1, p - 1))}
                    className="h-7 px-2 text-xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={itemPage >= totalItemPages || loading}
                    onClick={() => setItemPage((p) => Math.min(totalItemPages, p + 1))}
                    className="h-7 px-2 text-xs"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        </TabsContent>

        {/* ── TAB 2: BANK VALIDATION ─────────────────────────────────── */}
        <TabsContent value="validation" className="space-y-4">
          <BankValidationTable
            issues={validationIssues}
            isValidating={isValidating}
            onRevalidate={() => void handleValidateBatch()}
          />
        </TabsContent>

        {/* ── TAB 3: BANK PAYMENT FILE ──────────────────────────────── */}
        <TabsContent value="file" className="space-y-6">
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border pb-4">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Server-Side Bank Payment File Generation
                </h3>
                <p className="text-xs text-muted-foreground">
                  Bank advice files are compiled server-side from approved payment items and tracked with SHA-256 verification.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Select Corporate Banking Format
                </label>
                <select
                  id="bank-file-format-select"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as BankFileFormat)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/90 px-3 py-2 text-xs text-foreground"
                >
                  <option value="HDFC_ENET_CSV">HDFC Bank Corporate NetBanking (CSV)</option>
                  <option value="ICICI_CORPORATE">ICICI Bank Corporate (CSV)</option>
                  <option value="SBI_CMP_TXT">State Bank of India Corporate (TXT)</option>
                  <option value="GENERIC_NEFT_RTGS_CSV">Generic RBI NEFT/RTGS Master File (CSV)</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  id="generate-bank-file-btn"
                  onClick={() => void handleGenerateBankFile()}
                  disabled={generatingFile || !batch || !canExportBankFile}
                  className="h-9 gap-2 text-xs font-semibold rounded-xl w-full"
                >
                  <RefreshCw className={generatingFile ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                  <span>{generatingFile ? "Generating..." : "Generate Bank File"}</span>
                </Button>
              </div>
            </div>

            {bankFile ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    <span>Latest Bank File Ready</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => void handleDownloadBankFile()}
                    className="h-8 gap-1.5 text-xs rounded-xl"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download File</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                  <div>
                    <span className="font-semibold text-foreground">File Name:</span> {bankFile.fileName}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Format:</span> {bankFile.format}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Generated:</span> {formatDateTime(bankFile.generatedAt)}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-foreground">SHA-256:</span>{" "}
                    <code className="text-[10px]">{bankFile.sha256Checksum || "—"}</code>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
                No bank payment file generated yet. Approve the batch first, then generate a corporate bank payment file.
              </div>
            )}

            {bankFiles.length > 1 && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-foreground">Previous File Generations ({bankFiles.length})</span>
                <div className="space-y-1.5 text-xs">
                  {bankFiles.slice(1).map((bf) => (
                    <div key={bf.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                      <span className="font-mono">{bf.fileName}</span>
                      <span className="text-muted-foreground">
                        {bf.format} • {formatDateTime(bf.generatedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </TabsContent>

        {/* ── TAB 4: BANK RESPONSE IMPORT ───────────────────────────── */}
        <TabsContent value="import" className="space-y-6">
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border pb-4">
              <Upload className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Import Bank Disbursement Outcome (CSV)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Upload bank acknowledgement or UTR reverse feed CSV to update employee settlement statuses.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-border/80 p-8 text-center space-y-3">
              <Upload className="h-8 w-8 mx-auto text-primary opacity-80" />
              <div className="text-xs">
                <label className="font-semibold cursor-pointer text-primary hover:underline">
                  {importingCsv ? "Parsing CSV..." : "Click to select bank response CSV"}
                  <input
                    id="bank-csv-upload"
                    type="file"
                    accept=".csv"
                    disabled={importingCsv}
                    onChange={handlePreviewCsv}
                    className="hidden"
                  />
                </label>
                {csvFile && (
                  <p className="text-xs font-mono text-foreground mt-1">Selected: {csvFile.name}</p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1">
                  Supported columns: Payment Reference / TransactionRef / Employee Code / Account, UTR, Status (PAID/FAILED), Failure Reason, Transaction Date
                </p>
              </div>
            </div>

            {importPreview && (
              <div className="space-y-4 pt-3 border-t border-border/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground">Validation Preview ({importPreview.fileName})</h4>
                  <div className="flex items-center gap-3">
                    {importPreview.invalidRows > 0 && (
                      <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowPartialImport}
                          onChange={(e) => setAllowPartialImport(e.target.checked)}
                        />
                        <span>Apply valid rows even with warnings</span>
                      </label>
                    )}
                    <Button
                      size="sm"
                      disabled={applyingCsv || importPreview.validRows === 0}
                      onClick={() => void handleApplyCsv()}
                      className="h-8 gap-1.5 text-xs rounded-xl"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{applyingCsv ? "Applying..." : `Apply ${importPreview.validRows} Valid Rows`}</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                    <span className="text-muted-foreground">Total Rows</span>
                    <p className="font-mono font-semibold text-foreground mt-1">{importPreview.totalRows}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5">
                    <span className="text-emerald-600 dark:text-emerald-400">Valid ({importPreview.summary.paidCount} Paid / {importPreview.summary.failedCount} Failed)</span>
                    <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      {importPreview.validRows}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/5">
                    <span className="text-rose-600 dark:text-rose-400">Invalid / Unmatched</span>
                    <p className="font-mono font-semibold text-rose-600 dark:text-rose-400 mt-1">
                      {importPreview.invalidRows}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/5">
                    <span className="text-amber-600 dark:text-amber-400">Duplicate Rows</span>
                    <p className="font-mono font-semibold text-amber-600 dark:text-amber-400 mt-1">
                      {importPreview.duplicateRows}
                    </p>
                  </div>
                </div>

                {importPreview.errors.length > 0 && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-500/5 p-4 text-xs space-y-2">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      Row Errors Detected (Will Not Be Applied)
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px]">
                      {importPreview.errors.slice(0, 10).map((err, idx) => (
                        <li key={idx}>
                          Row {err.rowNumber} ({err.paymentReference}): {err.errorMessage}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </TabsContent>

        {/* ── TAB 5: RECONCILIATION ─────────────────────────────────── */}
        <TabsContent value="reconcile" className="space-y-4">
          {reconciliation ? (
            <>
              <PaymentReconciliationCard reconciliation={reconciliation} />
              {(reconciliation.canReconcile || hasEligibleFailedForRetry) && (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {hasEligibleFailedForRetry && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setBatchRetryModalOpen(true)}
                      className="h-8 gap-1.5 text-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Create Re-payout Batch for Failed Items</span>
                    </Button>
                  )}
                  {reconciliation.canReconcile && !reconciliation.isReconciled && (
                    <Button
                      size="sm"
                      onClick={() => setReconcileModalOpen(true)}
                      className="h-8 gap-1.5 text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Confirm & Mark Batch Reconciled</span>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
              Reconciliation summary unavailable.
            </div>
          )}
        </TabsContent>

        {/* ── TAB 6: HISTORY & AUDIT LOGS ───────────────────────────── */}
        <TabsContent value="history" className="space-y-4">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <History className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Payment Status History & Audit Trail</h3>
            </div>
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No audit log events recorded for this batch yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {log.action}
                        </Badge>
                        {log.oldStatus || log.newStatus ? (
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {log.oldStatus || "—"} → <strong className="text-foreground">{log.newStatus || "—"}</strong>
                          </span>
                        ) : null}
                      </div>
                      {log.reason && <p className="text-foreground">{log.reason}</p>}
                      <p className="text-[11px] text-muted-foreground">
                        Actor: {log.actorName || "System"}
                        {log.actorRole ? ` (${log.actorRole})` : ""}
                      </p>
                    </div>
                    <div className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDateTime(log.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Approve Payment Batch</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Sign off on the disbursement batch as an independent checker.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <label className="font-semibold text-foreground">Checker Approval Remarks *</label>
            <Textarea
              id="approve-remarks-input"
              placeholder="e.g. Bank split and totals verified against finalized payroll run."
              value={approvalRemarks}
              onChange={(e) => setApprovalRemarks(e.target.value)}
              rows={3}
              className="mt-1 rounded-lg text-xs"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleApproveBatch()}>
              Sign & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Send Back Payment Batch</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Reject the batch and return it for corrections before approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <label className="font-semibold text-foreground">Rejection Reason *</label>
            <Textarea
              id="reject-reason-input"
              placeholder="e.g. Employee bank details need updating prior to bank export."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="mt-1 rounded-lg text-xs"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={() => void handleRejectBatch()}>
              Reject Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Edit Batch Instructions</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update debit account, payment mode, payment date, or notes for this editable batch.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Source Bank Account</label>
              <select
                value={editSourceAccountId}
                onChange={(e) => setEditSourceAccountId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
              >
                {companyAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bankName} ({acc.accountNumberMasked})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Payment Mode</label>
              <select
                value={editPaymentMode}
                onChange={(e) => setEditPaymentMode(e.target.value as PaymentMode)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
              >
                {["NEFT", "RTGS", "IMPS", "UPI"].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Planned Payment Date</label>
              <Input
                type="date"
                value={editPaymentDate}
                onChange={(e) => setEditPaymentDate(e.target.value)}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Notes</label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                className="mt-1 text-xs"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleSaveDraftEdit()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Delete Draft Batch</DialogTitle>
            <DialogDescription className="text-xs">
              Permanently delete <strong className="font-mono">{batch?.batchNumber}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={() => void handleDeleteDraft()}>
              Delete Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Cancel Pre-Submission Batch</DialogTitle>
            <DialogDescription className="text-xs">
              Cancel this batch cleanly while preserving its audit log record.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <label className="font-semibold text-foreground">Cancellation Reason</label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Superseded by revised salary disbursement batch."
              rows={2}
              className="text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCancelModalOpen(false)}>
              Keep Batch
            </Button>
            <Button variant="destructive" size="sm" onClick={() => void handleCancelBatch()}>
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Mark as Submitted to Bank</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record corporate bank portal reference and submission date for audit tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Bank Reference / Acknowledgement Number *</label>
              <Input
                id="bank-ref-number-input"
                placeholder="e.g. HDFC-CMS-991204"
                value={bankRefNumber}
                onChange={(e) => setBankRefNumber(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Submission Date *</label>
              <Input
                type="date"
                value={submitDate}
                onChange={(e) => setSubmitDate(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Notes (Optional)</label>
              <Textarea
                id="submit-notes-input"
                placeholder="e.g. Uploaded via Corporate NetBanking portal."
                value={submitNotes}
                onChange={(e) => setSubmitNotes(e.target.value)}
                rows={2}
                className="mt-1 rounded-lg text-xs"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleSubmitBatch()}>
              Confirm Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reconcileModalOpen} onOpenChange={setReconcileModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Confirm Formal Reconciliation</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              All payable employee transactions have confirmed outcomes. Mark this batch reconciled?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <label className="font-semibold text-foreground">Reconciliation Notes (Optional)</label>
            <Textarea
              value={reconcileNotes}
              onChange={(e) => setReconcileNotes(e.target.value)}
              placeholder="e.g. Verified against bank MT940 statement."
              rows={2}
              className="text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setReconcileModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleConfirmReconcile()}>
              Mark Reconciled
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={batchRetryModalOpen} onOpenChange={setBatchRetryModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Create Linked Retry Batch</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Creates a new DRAFT re-payout batch containing only eligible failed transactions. Paid records are excluded to prevent double payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <label className="font-semibold text-foreground">Retry Reason *</label>
            <Textarea
              value={batchRetryReason}
              onChange={(e) => setBatchRetryReason(e.target.value)}
              placeholder="e.g. Updated beneficiary IFSC details received from employees."
              rows={3}
              className="text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setBatchRetryModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleConfirmBatchRetry()}>
              Create Retry Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Hold Modal */}
      <Dialog open={Boolean(holdTargetItem)} onOpenChange={(open) => !open && setHoldTargetItem(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Place Salary Payout on Hold</DialogTitle>
            <DialogDescription className="text-xs">
              Withhold payout for <strong>{holdTargetItem?.employeeName}</strong> ({holdTargetItem?.netAmountFormatted}).
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={holdItemReason}
            onChange={(e) => setHoldItemReason(e.target.value)}
            placeholder="Mandatory reason for hold (e.g. Exit clearance pending)..."
            rows={3}
            className="text-xs"
          />
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setHoldTargetItem(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleHoldItem()}>
              Hold Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Release Modal */}
      <Dialog open={Boolean(releaseTargetItem)} onOpenChange={(open) => !open && setReleaseTargetItem(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Release Held Salary Payout</DialogTitle>
            <DialogDescription className="text-xs">
              Include <strong>{releaseTargetItem?.employeeName}</strong> ({releaseTargetItem?.netAmountFormatted}) back into disbursement.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={releaseRemarks}
            onChange={(e) => setReleaseRemarks(e.target.value)}
            placeholder="Optional release remarks..."
            rows={2}
            className="text-xs"
          />
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setReleaseTargetItem(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleReleaseItem()}>
              Release Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Single Item Result Modal */}
      <Dialog open={Boolean(recordResultTarget)} onOpenChange={(open) => !open && setRecordResultTarget(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Record Bank Settlement Outcome</DialogTitle>
            <DialogDescription className="text-xs">
              Update outcome for <strong>{recordResultTarget?.employeeName}</strong> ({recordResultTarget?.netAmountFormatted}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={recordResultStatus === "PAID" ? "default" : "outline"}
                onClick={() => setRecordResultStatus("PAID")}
              >
                Mark Paid (UTR)
              </Button>
              <Button
                type="button"
                size="sm"
                variant={recordResultStatus === "FAILED" ? "destructive" : "outline"}
                onClick={() => setRecordResultStatus("FAILED")}
              >
                Mark Failed
              </Button>
            </div>
            {recordResultStatus === "PAID" ? (
              <div>
                <label className="font-semibold text-foreground">Bank UTR / Settlement Reference *</label>
                <Input
                  value={recordResultUtr}
                  onChange={(e) => setRecordResultUtr(e.target.value)}
                  placeholder="e.g. UTRN20261128000123"
                  className="mt-1 h-8 text-xs font-mono"
                />
              </div>
            ) : (
              <div>
                <label className="font-semibold text-foreground">Failure Reason *</label>
                <Textarea
                  value={recordResultErr}
                  onChange={(e) => setRecordResultErr(e.target.value)}
                  placeholder="e.g. Invalid IFSC / beneficiary account frozen"
                  rows={2}
                  className="mt-1 text-xs"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRecordResultTarget(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleRecordSingleItemResult()}>
              Save Outcome
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Retry Single Item Modal */}
      <Dialog open={Boolean(retryTargetItem)} onOpenChange={(open) => !open && setRetryTargetItem(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Retry Failed Payout Item</DialogTitle>
            <DialogDescription className="text-xs">
              Optionally correct beneficiary bank details and queue <strong>{retryTargetItem?.employeeName}</strong> for re-payout.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Retry Reason *</label>
              <Input
                value={retryReason}
                onChange={(e) => setRetryReason(e.target.value)}
                placeholder="e.g. Beneficiary provided corrected account number"
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Updated Account Number (Optional)</label>
              <Input
                value={retryAccNumber}
                onChange={(e) => setRetryAccNumber(e.target.value)}
                placeholder="Leave blank to retain existing"
                className="mt-1 h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">IFSC Code (Optional)</label>
              <Input
                value={retryIfsc}
                onChange={(e) => setRetryIfsc(e.target.value.toUpperCase())}
                className="mt-1 h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Account Holder Name (Optional)</label>
              <Input
                value={retryHolderName}
                onChange={(e) => setRetryHolderName(e.target.value)}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRetryTargetItem(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => void handleRetrySingleItem()}>
              Queue for Retry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Transaction Detail Modal */}
      <Dialog open={Boolean(detailItem)} onOpenChange={(open) => !open && setDetailItem(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Transaction Details</DialogTitle>
            <DialogDescription className="text-xs font-mono">
              {detailItem?.employeeCode} • {detailItem?.employeeName}
            </DialogDescription>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <div className="mt-0.5">{getItemStatusBadge(detailItem)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Payable Amount</span>
                  <p className="font-mono font-semibold mt-0.5">{detailItem.payableAmountFormatted || detailItem.netAmountFormatted}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Bank Account</span>
                  <p className="font-mono mt-0.5">{detailItem.bankName} ({detailItem.accountNumberMasked})</p>
                </div>
                <div>
                  <span className="text-muted-foreground">IFSC</span>
                  <p className="font-mono mt-0.5">{detailItem.ifscCode}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">UTR / Ref</span>
                  <p className="font-mono mt-0.5">{detailItem.utr || detailItem.transactionRef || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Reconciliation</span>
                  <p className="mt-0.5">{detailItem.reconciliationStatus || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Retry Count</span>
                  <p className="font-mono mt-0.5">{detailItem.retryCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Settlement Date</span>
                  <p className="mt-0.5">{formatDateTime(detailItem.paymentDate || detailItem.reconciledAt)}</p>
                </div>
              </div>
              {(detailItem.holdReason || detailItem.failureReason || detailItem.remarks) && (
                <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                  <span className="font-semibold">Notes / Reason:</span>
                  <p className="mt-1 text-muted-foreground">
                    {detailItem.holdReason || detailItem.failureReason || detailItem.remarks}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setDetailItem(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audited Reveal Modal */}
      <Dialog open={revealModalOpen} onOpenChange={setRevealModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Audited Bank Account Reveal</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Temporarily reveals unmasked bank details. An unalterable audit log entry is recorded.
            </DialogDescription>
          </DialogHeader>

          {revealedAccount ? (
            <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs space-y-2">
              <div className="font-mono text-base font-bold text-foreground">
                Account Number: {revealedAccount.accountNumber}
              </div>
              <div className="font-mono text-sm text-foreground">
                IFSC Code: {revealedAccount.ifscCode}
              </div>
              <p className="text-[10px] text-amber-800 dark:text-amber-200">
                This dialog automatically closes in {revealedAccount.autoHideSeconds} seconds.
              </p>
            </div>
          ) : (
            <div className="space-y-3 py-2 text-xs">
              <label className="font-semibold text-foreground">Mandatory Audit Justification *</label>
              <Textarea
                id="reveal-reason-input"
                placeholder="e.g. Validating employee banking information for failed UTR reconciliation"
                value={revealReason}
                onChange={(e) => setRevealReason(e.target.value)}
                rows={3}
                className="mt-1 rounded-lg text-xs"
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRevealModalOpen(false);
                setRevealedAccount(null);
              }}
            >
              Close
            </Button>
            {!revealedAccount && (
              <Button size="sm" onClick={() => void handleRevealAccount()}>
                Reveal (Audited)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
