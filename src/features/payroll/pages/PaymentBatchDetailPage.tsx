import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Lock,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Upload,
  UserCheck,
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
import { formatDate, formatDateTime, formatINR, formatCount, maskAccountNumber } from "@/lib/format";
import { PayrollStepper } from "../components/PayrollStepper";
import { MakerCheckerBanner } from "../components/MakerCheckerBanner";
import { BankValidationTable } from "../components/BankValidationTable";
import { PaymentReconciliationCard } from "../components/PaymentReconciliationCard";
import { paymentApi } from "../api/paymentApi";
import { generateIdempotencyKey } from "../utils/idempotency";
import { evaluateReconciliation, toPaise } from "../utils/money";
import type {
  PaymentBatch,
  PaymentBatchItem,
  BankValidationIssue,
  BankFileMetadata,
  PaymentReconciliation,
  BankResponsePreviewResult,
  BankFileFormat,
} from "../types/payment";
import { toast } from "sonner";

export default function PaymentBatchDetailPage() {
  const params = useParams({ strict: false }) as { batchId?: string };
  const batchId = params?.batchId?.trim() || "";
  const navigate = useNavigate();
  const aurixStore = useAurix();
  const currentUser = aurixStore.user;

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "validation" | "approval" | "file" | "submit" | "import" | "reconcile"
  >("overview");

  // Batch Data State
  const [loading, setLoading] = useState(true);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [batch, setBatch] = useState<PaymentBatch | null>(null);
  const [items, setItems] = useState<PaymentBatchItem[]>([]);
  const [validationIssues, setValidationIssues] = useState<BankValidationIssue[]>([]);
  const [bankFile, setBankFile] = useState<BankFileMetadata | null>(null);
  const [reconciliation, setReconciliation] = useState<PaymentReconciliation | null>(null);

  // In-flight guard to protect against double-click
  const inFlightRef = useRef(false);

  // Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [bankRefNumber, setBankRefNumber] = useState("");
  const [submitNotes, setSubmitNotes] = useState("");

  // Bank file format selection
  const [selectedFormat, setSelectedFormat] = useState<BankFileFormat>("HDFC_CSV");
  const [generatingFile, setGeneratingFile] = useState(false);

  // Bank Response CSV Import
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<BankResponsePreviewResult | null>(null);
  const [importingCsv, setImportingCsv] = useState(false);
  const [applyingCsv, setApplyingCsv] = useState(false);

  // Audited Account Reveal
  const [revealEmpId, setRevealEmpId] = useState<string | null>(null);
  const [revealReason, setRevealReason] = useState("");
  const [revealedAccount, setRevealedAccount] = useState<{
    accountNumber: string;
    ifscCode: string;
    autoHideSeconds: number;
  } | null>(null);
  const [revealModalOpen, setRevealModalOpen] = useState(false);

  // Load batch detail
  const loadBatchData = async () => {
    if (!batchId) return;
    setLoading(true);
    setBackendUnavailable(false);

    try {
      const res = await paymentApi.getPaymentBatch(batchId);
      setBatch(res.batch);
      setItems(res.items || []);

      // If batch has validation summary, load issues
      try {
        const valRes = await paymentApi.validatePaymentBatch(batchId);
        setValidationIssues(valRes.issues || []);
      } catch {
        // Validation endpoint optional in mock
      }

      // Check reconciliation if in progress
      if (res.batch) {
        const expected = res.batch.netAmountPaise || 0;
        const held = res.batch.heldAmountPaise || 0;
        const evalRec = evaluateReconciliation(expected, 0, 0, held, 0);

        setReconciliation({
          batchId: res.batch.id,
          runId: res.batch.runId,
          expectedPaise: expected,
          paidPaise: 0,
          failedPaise: 0,
          heldPaise: held,
          processingPaise: 0,
          unmatchedPaise: 0,
          isReconciled: evalRec.isReconciled,
          mismatchPaise: evalRec.mismatchPaise,
          summaryText: "Initial batch state prior to banking response import.",
          reconciledAt: null,
          reconciledBy: null,
        });
      }
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
      } else {
        toast.error("Failed to load payment batch details");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatchData();
  }, [batchId]);

  // Maker-checker rule: Creator cannot approve!
  const isBatchCreator = Boolean(
    currentUser?.id && batch?.createdBy?.id && currentUser.id === batch.createdBy.id
  );

  const hasBlockingValidation = validationIssues.some((v) => v.blocking);

  // ── Approval Handler ──────────────────────────────────────────────
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
    const idempotencyKey = generateIdempotencyKey();

    try {
      const updated = await paymentApi.approvePaymentBatch(
        batch.id,
        { remarks: approvalRemarks.trim() },
        idempotencyKey
      );
      setBatch(updated);
      setApproveModalOpen(false);
      setApprovalRemarks("");
      toast.success("Payment batch approved successfully!");
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        toast.error(err?.response?.data?.message || "Maker-checker violation: You cannot approve this batch.");
      } else if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        toast.error("Feature unavailable — backend pending");
      } else {
        toast.error(err?.response?.data?.message || "Failed to approve payment batch");
      }
    } finally {
      inFlightRef.current = false;
    }
  };

  // ── Reject Handler ────────────────────────────────────────────────
  const handleRejectBatch = async () => {
    if (inFlightRef.current || !batch) return;
    if (rejectReason.trim().length < 5) {
      toast.error("Rejection reason must be at least 5 characters.");
      return;
    }

    inFlightRef.current = true;
    const idempotencyKey = generateIdempotencyKey();

    try {
      const updated = await paymentApi.rejectPaymentBatch(
        batch.id,
        { reason: rejectReason.trim() },
        idempotencyKey
      );
      setBatch(updated);
      setRejectModalOpen(false);
      setRejectReason("");
      toast.warning("Payment batch sent back to Draft.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reject payment batch");
    } finally {
      inFlightRef.current = false;
    }
  };

  // ── Bank File Generation Handler ──────────────────────────────────
  const handleGenerateBankFile = async () => {
    if (inFlightRef.current || !batch) return;
    setGeneratingFile(true);
    inFlightRef.current = true;
    const idempotencyKey = generateIdempotencyKey();

    try {
      const metadata = await paymentApi.generateBankFile(
        batch.id,
        { format: selectedFormat },
        idempotencyKey
      );
      setBankFile(metadata);
      toast.success(`Bank file ${metadata.fileName} generated by backend!`);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
        toast.error("Feature unavailable — backend pending");
      } else {
        toast.error(err?.response?.data?.message || "Failed to generate bank file");
      }
    } finally {
      setGeneratingFile(false);
      inFlightRef.current = false;
    }
  };

  // ── Bank File Download Handler (Revokes Blob URL) ─────────────────
  const handleDownloadBankFile = async () => {
    if (!batch) return;
    try {
      const blob = await paymentApi.downloadBankFile(batch.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = bankFile?.fileName || `SALARY_${batch.batchNumber}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // CRITICAL: Immediately revoke Blob URL to prevent memory leaks and security exposure
      window.URL.revokeObjectURL(url);
      toast.success("Bank file downloaded.");
    } catch {
      toast.error("Failed to download bank file");
    }
  };

  // ── Submit to Bank Handler ────────────────────────────────────────
  const handleSubmitBatch = async () => {
    if (inFlightRef.current || !batch) return;
    if (!bankRefNumber.trim()) {
      toast.error("Bank reference number is required.");
      return;
    }

    inFlightRef.current = true;
    const idempotencyKey = generateIdempotencyKey();

    try {
      const updated = await paymentApi.submitPaymentBatch(
        batch.id,
        {
          bankReferenceNumber: bankRefNumber.trim(),
          submissionDate: new Date().toISOString(),
          notes: submitNotes.trim() || undefined,
        },
        idempotencyKey
      );
      setBatch(updated);
      setSubmitModalOpen(false);
      toast.success("Batch marked as submitted to bank portal.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to mark batch as submitted");
    } finally {
      inFlightRef.current = false;
    }
  };

  // ── CSV Import Preview Handler ────────────────────────────────────
  const handlePreviewCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !batch) return;

    setCsvFile(file);
    setImportingCsv(true);

    try {
      const preview = await paymentApi.previewBankResponse(batch.id, file);
      setImportPreview(preview);
      toast.info(`CSV parsed: ${preview.validRows} valid rows, ${preview.invalidRows} invalid rows.`);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
        toast.error("Feature unavailable — backend pending");
      } else {
        toast.error(err?.response?.data?.message || "Failed to parse bank response CSV");
      }
    } finally {
      setImportingCsv(false);
    }
  };

  // ── Apply CSV Outcome Handler ─────────────────────────────────────
  const handleApplyCsv = async () => {
    if (inFlightRef.current || !batch || !importPreview) return;
    setApplyingCsv(true);
    inFlightRef.current = true;
    const idempotencyKey = generateIdempotencyKey();

    try {
      const res = await paymentApi.applyBankResponse(
        batch.id,
        { previewToken: importPreview.previewToken, allowPartial: false },
        idempotencyKey
      );
      toast.success(`Disbursement applied: ${res.paidCount} paid, ${res.failedCount} failed.`);
      loadBatchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply bank response");
    } finally {
      setApplyingCsv(false);
      inFlightRef.current = false;
    }
  };

  // ── Audited Reveal Account Handler ────────────────────────────────
  const handleRevealAccount = async () => {
    if (!revealEmpId || revealReason.trim().length < 5) {
      toast.error("Justification reason of at least 5 characters is required.");
      return;
    }

    try {
      const data = await paymentApi.revealEmployeeBankAccount(revealEmpId, revealReason.trim());
      setRevealedAccount(data);

      // Auto-hide after countdown
      setTimeout(() => {
        setRevealedAccount(null);
        setRevealModalOpen(false);
      }, (data.autoHideSeconds || 15) * 1000);

      toast.warning(`Account revealed for ${data.autoHideSeconds || 15}s under audit log.`);
    } catch {
      toast.error("Failed to reveal account details");
    }
  };

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
            onClick={loadBatchData}
            disabled={loading}
            className="h-8 gap-1.5 text-xs"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* ── 9-Step Lifecycle Stepper ──────────────────────────────────── */}
      <PayrollStepper
        currentStep="payment"
        runId={batch?.runId}
        batchId={batchId}
        runStatus={batch?.status || "Finalized"}
      />

      {/* ── Backend Unavailable Banner ───────────────────────────────── */}
      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Feature unavailable — backend pending
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-1">
            <p>
              Payment batch details endpoint (<code>/api/v2/payroll/payment-batches/{batchId}</code>) is awaiting backend deployment.
              All frontend components, maker-checker guards, and schemas are operational.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/PAYROLL_BACKEND_CONTRACT.md</code> • Requirements: <code>docs/PAYROLL_BACKEND_TODO.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Maker-Checker Governance Banner ──────────────────────────── */}
      {batch && (
        <MakerCheckerBanner
          creatorId={batch.createdBy.id}
          creatorName={batch.createdBy.name}
          createdAt={batch.createdAt}
          approverName={batch.approvedBy?.name}
          approvedAt={batch.approvedAt}
          approvalRemarks={batch.approvalRemarks}
          currentUserId={currentUser?.id}
        />
      )}

      {/* ── Batch Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {batch?.batchNumber || `Payment Batch ${batchId}`}
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary capitalize"
            >
              {batch?.status ? batch.status.replace(/_/g, " ") : "Draft"}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Disbursement Period: <strong>{batch?.periodName || "—"}</strong> • Mode:{" "}
            <strong>{batch?.paymentMode || "NEFT"}</strong> • Run ID: {batch?.runId || "—"}
          </p>
        </div>

        {/* Action Button Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Approve / Reject Buttons (Checker only) */}
          {batch && batch.status === "validated" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModalOpen(true)}
                className="h-8 gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Send Back</span>
              </Button>

              <Button
                id="batch-approve-btn"
                variant="default"
                size="sm"
                disabled={isBatchCreator || hasBlockingValidation}
                onClick={() => setApproveModalOpen(true)}
                className="h-8 gap-1.5 text-xs font-semibold shadow-sm"
                title={
                  isBatchCreator
                    ? "The batch creator cannot approve this batch."
                    : hasBlockingValidation
                    ? "Cannot approve while blocking validation errors exist"
                    : "Approve this payment batch"
                }
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Approve Batch</span>
              </Button>
            </>
          )}

          {/* Submit to Bank button */}
          {batch && batch.status === "approved" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setSubmitModalOpen(true)}
              className="h-8 gap-1.5 text-xs font-semibold shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Mark as Submitted to Bank</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Summary Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value={formatCount(batch?.employeeCount || 0)}
          hint="Line items in batch"
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Gross Amount"
          value={batch?.grossAmountFormatted || "—"}
          hint="Calculated total"
          icon={Banknote}
          accent="muted"
        />
        <StatCard
          label="Held Amount"
          value={batch?.heldAmountFormatted || "₹0.00"}
          hint="Withheld from disbursement"
          icon={UserX}
          accent="warning"
        />
        <StatCard
          label="Net Payable"
          value={batch?.payableAmountFormatted || "—"}
          hint="Authorized for bank release"
          icon={ShieldCheck}
          accent="success"
        />
      </div>

      {/* ── Navigation Tabs ─────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="space-y-4"
      >
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/60">
          <TabsTrigger value="overview" className="rounded-xl text-xs">
            Overview & Employees
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
        </TabsList>

        {/* ── TAB 1: OVERVIEW & EMPLOYEES ───────────────────────────── */}
        <TabsContent value="overview" className="space-y-6">
          <GlassCard className="overflow-hidden p-0">
            <div className="p-4 border-b border-border/70 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Employee Payment Items</h3>
                <p className="text-xs text-muted-foreground">
                  Individual line items with masked banking details and disbursement status
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Bank Name</th>
                    <th className="px-4 py-3">Account Number</th>
                    <th className="px-4 py-3">IFSC</th>
                    <th className="px-4 py-3">Net Pay</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">UTR Reference</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        No employee items available. All numbers are authoritatively provided by the backend.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground">{item.employeeName}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">{item.employeeCode}</div>
                        </td>
                        <td className="px-4 py-3 text-foreground">{item.bankName}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          {item.accountNumberMasked}
                        </td>
                        <td className="px-4 py-3 font-mono text-foreground">{item.ifscCode}</td>
                        <td className="px-4 py-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {item.netAmountFormatted}
                        </td>
                        <td className="px-4 py-3">
                          {item.isHeld ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-500/40">
                              Held
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="capitalize">
                              {item.status}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          {item.utr || "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setRevealEmpId(item.employeeId);
                              setRevealModalOpen(true);
                            }}
                            className="h-7 text-xs gap-1"
                            title="Audited reveal of bank account"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Verify</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </TabsContent>

        {/* ── TAB 2: BANK VALIDATION ─────────────────────────────────── */}
        <TabsContent value="validation" className="space-y-4">
          <BankValidationTable
            issues={validationIssues}
            onRevalidate={async () => {
              if (!batch) return;
              try {
                const res = await paymentApi.validatePaymentBatch(batch.id);
                setValidationIssues(res.issues || []);
                toast.success("Validation re-run completed.");
              } catch {
                toast.error("Failed to revalidate bank details");
              }
            }}
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
                  Strict security compliance: Frontend never generates payment files.
                  The backend compiles and signs bank-formatted salary files.
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
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/90 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                >
                  <option value="HDFC_CSV">HDFC Bank Corporate NetBanking (CSV)</option>
                  <option value="ICICI_EXCEL">ICICI Bank Corporate Eazypay (Excel)</option>
                  <option value="SBI_TXT">State Bank of India Corporate (TXT)</option>
                  <option value="GENERIC_NEFT_CSV">Generic RBI NEFT/RTGS Master File (CSV)</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  id="generate-bank-file-btn"
                  onClick={handleGenerateBankFile}
                  disabled={generatingFile || !batch || batch.status === "draft"}
                  className="h-9 gap-2 text-xs font-semibold rounded-xl w-full"
                >
                  <RefreshCw className={generatingFile ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                  <span>Request File from Backend</span>
                </Button>
              </div>
            </div>

            {/* Generated File Metadata Display */}
            {bankFile ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    <span>File Ready for Corporate Banking Download</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleDownloadBankFile}
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
                    <span className="font-semibold text-foreground">Generated At:</span> {formatDateTime(bankFile.generatedAt)}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-foreground">SHA-256 Hash:</span>{" "}
                    <code className="text-[10px]">{bankFile.sha256Checksum}</code>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
                No bank payment file generated yet. Approved batches can request file compilation from the server.
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
                  Upload the bank outcome statement containing UTR references, credit timestamps, and failure reason codes.
                </p>
              </div>
            </div>

            {/* File Upload Box */}
            <div className="rounded-xl border border-dashed border-border/80 p-8 text-center space-y-3">
              <Upload className="h-8 w-8 mx-auto text-primary opacity-80" />
              <div className="text-xs">
                <label className="font-semibold text-foreground cursor-pointer text-primary hover:underline">
                  Click to select bank response CSV
                  <input
                    id="bank-csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handlePreviewCsv}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Expected columns: Payment Reference, UTR, Status (PAID/FAILED), Failure Reason, Transaction Date
                </p>
              </div>
            </div>

            {/* Preview Section */}
            {importPreview && (
              <div className="space-y-4 pt-3 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Validation Preview</h4>
                  <Button
                    size="sm"
                    disabled={applyingCsv || importPreview.validRows === 0}
                    onClick={handleApplyCsv}
                    className="h-8 gap-1.5 text-xs rounded-xl"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Apply {importPreview.validRows} Valid Rows</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                    <span className="text-muted-foreground">Total Rows</span>
                    <p className="font-mono font-semibold text-foreground mt-1">{importPreview.totalRows}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5">
                    <span className="text-emerald-600 dark:text-emerald-400">Valid Rows</span>
                    <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      {importPreview.validRows}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/5">
                    <span className="text-rose-600 dark:text-rose-400">Invalid / Errors</span>
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
                      {importPreview.errors.slice(0, 5).map((err, idx) => (
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
        <TabsContent value="reconcile" className="space-y-6">
          {reconciliation ? (
            <PaymentReconciliationCard reconciliation={reconciliation} />
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
              Reconciliation calculations await bank disbursement responses.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Approve Modal ───────────────────────────────────────────── */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Approve Payment Batch</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Sign off on the disbursement batch as a certified checker. The batch creator cannot execute this action.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Checker Approval Remarks *</label>
              <Textarea
                id="approve-remarks-input"
                placeholder="e.g. Bank split and totals verified against finalized payroll run. Approved."
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                rows={3}
                className="mt-1 rounded-lg text-xs"
              />
              <span className="text-[10px] text-muted-foreground">Minimum 5 characters required.</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setApproveModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApproveBatch}
              className="rounded-xl text-xs"
            >
              Sign & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Modal ────────────────────────────────────────────── */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Send Back Payment Batch</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Return the payment batch to Draft for revision or hold adjustments.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Rejection Reason *</label>
              <Textarea
                id="reject-reason-input"
                placeholder="e.g. Please put employee EMP204 on hold due to pending account verification."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="mt-1 rounded-lg text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRejectBatch}
              className="rounded-xl text-xs"
            >
              Send Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Submit Modal ────────────────────────────────────────────── */}
      <Dialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Mark as Submitted to Bank</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Record corporate bank portal upload details for audit tracking.
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
              <label className="font-semibold text-foreground">Notes (Optional)</label>
              <Textarea
                id="submit-notes-input"
                placeholder="e.g. Uploaded via Corporate NetBanking portal by Finance."
                value={submitNotes}
                onChange={(e) => setSubmitNotes(e.target.value)}
                rows={2}
                className="mt-1 rounded-lg text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmitModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitBatch}
              className="rounded-xl text-xs"
            >
              Confirm Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Audited Reveal Account Modal ────────────────────────────── */}
      <Dialog open={revealModalOpen} onOpenChange={setRevealModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Audited Bank Account Reveal</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Temporarily reveals unmasked bank details. An unalterable audit log entry will be created.
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
                This dialog will automatically close in {revealedAccount.autoHideSeconds} seconds.
              </p>
            </div>
          ) : (
            <div className="space-y-3 py-2 text-xs">
              <div>
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
              className="rounded-xl text-xs"
            >
              Close
            </Button>
            {!revealedAccount && (
              <Button
                size="sm"
                onClick={handleRevealAccount}
                className="rounded-xl text-xs"
              >
                Reveal (Audited)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
