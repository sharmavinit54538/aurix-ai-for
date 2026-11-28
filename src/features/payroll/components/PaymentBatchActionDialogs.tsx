import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck,
  History,
  Loader2,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Unlock,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDateTime, formatOptionalCount, formatPaise } from "@/lib/format";
import type {
  BankFileFormat,
  BankFileMetadata,
  CompanyBankAccount,
  PaymentAuditLogEntry,
  PaymentBatch,
  PaymentBatchItem,
  PaymentMode,
  PaymentReconciliation,
} from "../types/payment";

export type ActiveModalType =
  | null
  | "edit_batch"
  | "submit_for_approval"
  | "approve_batch"
  | "reject_batch"
  | "generate_bank_file"
  | "submit_to_bank"
  | "reconcile_payment"
  | "retry_failed"
  | "cancel_batch"
  | "delete_draft";

export type ActiveDrawerType =
  | null
  | "details"
  | "audit_log"
  | "approval_history"
  | "held_items"
  | "failure_reason";

export interface PaymentBatchActionDialogsProps {
  batch: PaymentBatch | null;
  activeModal: ActiveModalType;
  activeDrawer: ActiveDrawerType;
  loadingDrawerData: boolean;
  reconciliation: PaymentReconciliation | null;
  auditLogs: PaymentAuditLogEntry[];
  heldItems: PaymentBatchItem[];
  failedItems: PaymentBatchItem[];
  companyAccounts: CompanyBankAccount[];
  generatedBankFile: BankFileMetadata | null;
  isCreator: boolean;
  isSubmitting: boolean;
  onCloseModal: () => void;
  onCloseDrawer: () => void;
  onNavigateToBatch: (batchId: string, tab?: string, statusFilter?: string) => void;
  onSaveEdit: (payload: {
    sourceAccountId?: string;
    paymentMode?: PaymentMode;
    paymentDate?: string;
    notes?: string;
  }) => Promise<void>;
  onConfirmSubmitForApproval: (remarks?: string) => Promise<void>;
  onConfirmApprove: (remarks: string) => Promise<void>;
  onConfirmReject: (reason: string) => Promise<void>;
  onGenerateBankFile: (format: BankFileFormat) => Promise<void>;
  onDownloadLatestBankFile: (batch: PaymentBatch) => Promise<void>;
  onConfirmSubmitToBank: (payload: {
    bankReferenceNumber: string;
    submissionDate: string;
    notes?: string;
  }) => Promise<void>;
  onConfirmReconcile: (notes?: string) => Promise<void>;
  onConfirmRetryFailed: (reason: string) => Promise<void>;
  onConfirmReleaseHeldItem: (item: PaymentBatchItem, remarks?: string) => Promise<void>;
  onConfirmCancel: (reason: string) => Promise<void>;
  onConfirmDeleteDraft: () => Promise<void>;
}

function BatchSummaryBox({ batch }: { batch: PaymentBatch }) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs grid grid-cols-2 gap-2">
      <div>
        <span className="text-[11px] text-muted-foreground">Batch Number</span>
        <p className="font-mono font-semibold text-foreground">{batch.batchNumber}</p>
      </div>
      <div>
        <span className="text-[11px] text-muted-foreground">Payroll Period</span>
        <p className="font-medium text-foreground">{batch.periodName}</p>
      </div>
      <div>
        <span className="text-[11px] text-muted-foreground">Payable Employees</span>
        <p className="font-mono font-semibold text-foreground">
          {formatOptionalCount(batch.employeeCount)}
        </p>
      </div>
      <div>
        <span className="text-[11px] text-muted-foreground">Affected Amount</span>
        <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
          {batch.payableAmountFormatted}
        </p>
      </div>
    </div>
  );
}

export function PaymentBatchActionDialogs({
  batch,
  activeModal,
  activeDrawer,
  loadingDrawerData,
  reconciliation,
  auditLogs,
  heldItems,
  failedItems,
  companyAccounts,
  generatedBankFile,
  isCreator,
  isSubmitting,
  onCloseModal,
  onCloseDrawer,
  onNavigateToBatch,
  onSaveEdit,
  onConfirmSubmitForApproval,
  onConfirmApprove,
  onConfirmReject,
  onGenerateBankFile,
  onDownloadLatestBankFile,
  onConfirmSubmitToBank,
  onConfirmReconcile,
  onConfirmRetryFailed,
  onConfirmReleaseHeldItem,
  onConfirmCancel,
  onConfirmDeleteDraft,
}: PaymentBatchActionDialogsProps) {
  // Local controlled inputs reset whenever activeModal changes
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("NEFT");
  const [paymentDate, setPaymentDate] = useState("");
  const [notes, setNotes] = useState("");

  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [bankFormat, setBankFormat] = useState<BankFileFormat>("HDFC_ENET_CSV");
  const [bankRefNumber, setBankRefNumber] = useState("");
  const [submissionDate, setSubmissionDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [releaseTarget, setReleaseTarget] = useState<PaymentBatchItem | null>(null);
  const [releaseRemarks, setReleaseRemarks] = useState("");

  useEffect(() => {
    if (!batch) return;
    setSourceAccountId(batch.sourceAccountId || "");
    setPaymentMode(batch.paymentMode || "NEFT");
    setPaymentDate(batch.submissionDate ? batch.submissionDate.slice(0, 10) : "");
    setNotes(batch.notes || "");
    setApprovalRemarks("");
    setReasonInput("");
    setBankRefNumber("");
    setSubmissionDate(new Date().toISOString().slice(0, 10));
    setReleaseTarget(null);
    setReleaseRemarks("");
  }, [batch?.id, activeModal]);

  if (!batch) return null;

  const totalEmployeesAll =
    batch.totalItemsCount ?? (batch.employeeCount ?? 0) + (batch.heldCount ?? 0);
  const paidAmountDisplay =
    batch.paidAmountFormatted ||
    (reconciliation ? formatPaise(reconciliation.paidPaise) : "₹0.00");
  const outstandingDisplay =
    batch.outstandingAmountFormatted ||
    (reconciliation
      ? formatPaise(reconciliation.processingPaise + reconciliation.failedPaise)
      : "—");

  const approvalLogs = auditLogs.filter((l) =>
    ["APPROVE", "REJECT", "SUBMIT_FOR_APPROVAL", "VALIDATE"].includes(l.action.toUpperCase())
  );
  const shownLogs =
    activeDrawer === "approval_history" && approvalLogs.length > 0 ? approvalLogs : auditLogs;

  const failedTotalPaise = failedItems.reduce((acc, it) => acc + (it.netAmountPaise || 0), 0);

  return (
    <>
      {/* ── RIGHT SIDE DRAWER: Details / Audit History / Held / Failures ── */}
      <Sheet open={Boolean(activeDrawer)} onOpenChange={(open) => !open && onCloseDrawer()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl overflow-y-auto flex flex-col gap-4"
        >
          <SheetHeader className="border-b border-border/60 pb-3 text-left">
            <div className="flex flex-wrap items-center gap-2 pr-6">
              <SheetTitle className="font-mono text-base font-bold">
                {batch.batchNumber}
              </SheetTitle>
              <Badge variant="outline" className="text-xs capitalize">
                {batch.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <SheetDescription className="text-xs">
              {activeDrawer === "details" && "Authoritative batch breakdown & settlement metrics"}
              {activeDrawer === "approval_history" && "Approval workflow & governance history"}
              {activeDrawer === "audit_log" && "Complete immutable payment batch audit log"}
              {activeDrawer === "held_items" && "Employees currently withheld from disbursement"}
              {activeDrawer === "failure_reason" && "Bank failure breakdown & retry eligibility"}
            </SheetDescription>
          </SheetHeader>

          {loadingDrawerData && (
            <div className="flex items-center justify-center py-6 text-xs text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Fetching latest records...</span>
            </div>
          )}

          {activeDrawer === "details" && (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[11px] text-muted-foreground">Total Employees</span>
                  <p className="mt-1 font-mono text-sm font-semibold">{formatCountSafe(totalEmployeesAll)}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[11px] text-muted-foreground">Payable Employees</span>
                  <p className="mt-1 font-mono text-sm font-semibold">
                    {formatOptionalCount(batch.employeeCount)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-amber-500/5 p-3">
                  <span className="text-[11px] text-amber-600 dark:text-amber-400">Held Employees</span>
                  <p className="mt-1 font-mono text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {formatCountSafe(batch.heldCount ?? 0)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-emerald-500/5 p-3">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Successful Payments</span>
                  <p className="mt-1 font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCountSafe(reconciliation?.paidCount ?? batch.paidCount ?? 0)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-rose-500/5 p-3">
                  <span className="text-[11px] text-rose-600 dark:text-rose-400">Failed Payments</span>
                  <p className="mt-1 font-mono text-sm font-semibold text-rose-600 dark:text-rose-400">
                    {formatCountSafe(reconciliation?.failedCount ?? batch.failedCount ?? 0)}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[11px] text-muted-foreground">Payment Mode</span>
                  <p className="mt-1 font-semibold text-primary text-sm">{batch.paymentMode}</p>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 p-4 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Payable Amount</span>
                  <span className="font-mono font-semibold text-foreground">{batch.payableAmountFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Paid Amount</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {paidAmountDisplay}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outstanding Amount</span>
                  <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                    {outstandingDisplay}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 font-semibold text-foreground pb-1 border-b border-border/50">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>Lifecycle & Settlement Audit</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-muted-foreground">Payroll Period</span>
                    <p className="font-medium mt-0.5">{batch.periodName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Payroll Run</span>
                    <p className="font-mono mt-0.5">{batch.runNumber || batch.runId || "—"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Created By</span>
                    <p className="mt-0.5">{batch.createdBy?.name || "System"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Created Date</span>
                    <p className="mt-0.5">{formatDateTime(batch.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Approved By</span>
                    <p className="mt-0.5">{batch.approvedBy?.name || "—"}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Approval Date</span>
                    <p className="mt-0.5">{formatDateTime(batch.approvedAt)}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Bank Submission Date</span>
                    <p className="mt-0.5">{formatDateTime(batch.submittedAt || batch.submissionDate)}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">Reconciliation Date</span>
                    <p className="mt-0.5">{formatDateTime(batch.reconciledAt)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] text-muted-foreground">Bank Payment Reference Number</span>
                    <p className="font-mono font-medium mt-0.5">{batch.bankReferenceNumber || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onCloseDrawer();
                    onNavigateToBatch(batch.id, "overview");
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>View Employee Payments</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onCloseDrawer();
                    onNavigateToBatch(batch.id);
                  }}
                  className="gap-1.5 text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Full Workspace</span>
                </Button>
              </div>
            </div>
          )}

          {(activeDrawer === "audit_log" || activeDrawer === "approval_history") && (
            <div className="space-y-3 text-xs">
              {!loadingDrawerData && shownLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 p-8 text-center text-muted-foreground">
                  No audit events recorded for this batch yet.
                </div>
              ) : (
                shownLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {log.action}
                        </Badge>
                        {(log.oldStatus || log.newStatus) && (
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {log.oldStatus || "—"} → <strong className="text-foreground">{log.newStatus || "—"}</strong>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>
                    {log.reason && <p className="text-foreground">{log.reason}</p>}
                    <p className="text-[11px] text-muted-foreground">
                      By {log.actorName || "System"}
                      {log.actorRole ? ` (${log.actorRole})` : ""}
                    </p>
                  </div>
                ))
              )}
              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onCloseDrawer();
                    onNavigateToBatch(batch.id, "history");
                  }}
                  className="gap-1.5 text-xs"
                >
                  <History className="h-3.5 w-3.5" />
                  <span>Open Full Audit Tab</span>
                </Button>
              </div>
            </div>
          )}

          {activeDrawer === "held_items" && (
            <div className="space-y-3 text-xs">
              {!loadingDrawerData && heldItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 p-8 text-center text-muted-foreground">
                  No employees are currently on hold in this batch.
                </div>
              ) : (
                heldItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="font-semibold text-foreground">{item.employeeName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {item.employeeCode} · {item.netAmountFormatted}
                      </div>
                      {item.holdReason && (
                        <p className="text-amber-800 dark:text-amber-200 text-xs">
                          Hold Reason: {item.holdReason}
                        </p>
                      )}
                    </div>
                    {["approved", "file_generated", "draft", "validated", "pending_approval", "rejected"].includes(batch.status) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReleaseTarget(item);
                          setReleaseRemarks("");
                        }}
                        className="h-7 text-xs gap-1 shrink-0"
                      >
                        <Unlock className="h-3 w-3" />
                        <span>Release</span>
                      </Button>
                    )}
                  </div>
                ))
              )}
              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onCloseDrawer();
                    onNavigateToBatch(batch.id, "overview", "held");
                  }}
                >
                  View in Employee Table
                </Button>
              </div>
            </div>
          )}

          {activeDrawer === "failure_reason" && (
            <div className="space-y-3 text-xs">
              {!loadingDrawerData && failedItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 p-8 text-center text-muted-foreground">
                  No failed employee transactions found in this batch.
                </div>
              ) : (
                failedItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-foreground">{item.employeeName}</span>
                      <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                        {item.netAmountFormatted}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {item.employeeCode} · {item.bankName} ({item.accountNumberMasked})
                    </div>
                    <p className="text-rose-700 dark:text-rose-300">
                      {item.failureReason || "Bank rejected disbursement"}
                    </p>
                  </div>
                ))
              )}
              <div className="pt-2 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onCloseDrawer();
                    onNavigateToBatch(batch.id, "overview", "failed");
                  }}
                >
                  Inspect Failed Rows
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Release Held Employee Confirmation Dialog ─────────────────── */}
      <Dialog open={Boolean(releaseTarget)} onOpenChange={(open) => !open && setReleaseTarget(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Confirm Release of Held Payment</DialogTitle>
            <DialogDescription className="text-xs">
              Verify releasing <strong>{releaseTarget?.employeeName}</strong> ({releaseTarget?.netAmountFormatted}) back into disbursement for batch{" "}
              <span className="font-mono">{batch.batchNumber}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
              <div>Current Hold Reason: {releaseTarget?.holdReason || "—"}</div>
              <div className="mt-1 text-muted-foreground">
                Consequence: Increases batch payable total and includes this employee in bank exports.
              </div>
            </div>
            <div>
              <label className="font-semibold text-foreground">Release Remarks (Optional)</label>
              <Textarea
                value={releaseRemarks}
                onChange={(e) => setReleaseRemarks(e.target.value)}
                placeholder="e.g. KYC verification completed by HR"
                rows={2}
                className="mt-1 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={() => setReleaseTarget(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={async () => {
                if (!releaseTarget) return;
                await onConfirmReleaseHeldItem(releaseTarget, releaseRemarks.trim() || undefined);
                setReleaseTarget(null);
              }}
            >
              {isSubmitting ? "Releasing..." : "Confirm Release"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Draft Batch Dialog ───────────────────────────────────── */}
      <Dialog open={activeModal === "edit_batch"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Edit Payment Batch</DialogTitle>
            <DialogDescription className="text-xs">
              Update disbursement account, transfer mode, planned date, or notes for{" "}
              <strong className="font-mono">{batch.batchNumber}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Company Source Bank Account</label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
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
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
              >
                {(["NEFT", "RTGS", "IMPS", "UPI"] as PaymentMode[]).map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Planned Payment Date</label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Notes</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={() =>
                void onSaveEdit({
                  sourceAccountId: sourceAccountId || undefined,
                  paymentMode,
                  paymentDate: paymentDate || undefined,
                  notes,
                })
              }
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Submit for Approval Confirmation ──────────────────────────── */}
      <Dialog open={activeModal === "submit_for_approval"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Submit Batch for Approval</DialogTitle>
            <DialogDescription className="text-xs">
              Locks validated payment instructions and routes them to an independent checker.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <BatchSummaryBox batch={batch} />
            <div>
              <label className="font-semibold text-foreground">Submission Remarks (Optional)</label>
              <Textarea
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                placeholder="e.g. Verified employee bank details for disbursement"
                rows={2}
                className="mt-1 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={() => void onConfirmSubmitForApproval(approvalRemarks.trim() || undefined)}
            >
              {isSubmitting ? "Submitting..." : "Confirm Submit for Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Approve Batch Confirmation ────────────────────────────────── */}
      <Dialog open={activeModal === "approve_batch"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Approve Payment Batch</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Authorizes salary disbursement instructions for bank file generation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <BatchSummaryBox batch={batch} />
            {isCreator && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Maker-checker policy prevents the batch creator from approving this batch.</span>
              </div>
            )}
            <div>
              <label className="font-semibold text-foreground">Approval Remarks *</label>
              <Textarea
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                placeholder="Minimum 5 characters verifying batch figures..."
                rows={3}
                className="mt-1 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting || isCreator || approvalRemarks.trim().length < 5}
              onClick={() => void onConfirmApprove(approvalRemarks.trim())}
            >
              {isSubmitting ? "Approving..." : "Sign & Approve Batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Batch Confirmation ─────────────────────────────────── */}
      <Dialog open={activeModal === "reject_batch"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Reject Payment Batch</DialogTitle>
            <DialogDescription className="text-xs">
              Returns the batch to Rejected state so corrections or employee holds can be applied.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <BatchSummaryBox batch={batch} />
            <div>
              <label className="font-semibold text-foreground">Rejection Reason *</label>
              <Textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Explain required corrections (minimum 5 characters)..."
                rows={3}
                className="mt-1 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isSubmitting || reasonInput.trim().length < 5}
              onClick={() => void onConfirmReject(reasonInput.trim())}
            >
              {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Generate Bank File Dialog ─────────────────────────────────── */}
      <Dialog open={activeModal === "generate_bank_file"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Generate Bank Payment File</DialogTitle>
            <DialogDescription className="text-xs">
              Compiles bank-ready transfer advice excluding held employees. Does not mark payments as Paid.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <BatchSummaryBox batch={batch} />
            <div>
              <label className="font-semibold text-foreground">Bank Advice Format</label>
              <select
                value={bankFormat}
                onChange={(e) => setBankFormat(e.target.value as BankFileFormat)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="HDFC_ENET_CSV">HDFC Bank Corporate NetBanking (CSV)</option>
                <option value="ICICI_CORPORATE">ICICI Bank Corporate (CSV)</option>
                <option value="SBI_CMP_TXT">State Bank of India Corporate (TXT)</option>
                <option value="GENERIC_NEFT_RTGS_CSV">Generic RBI NEFT/RTGS Master File (CSV)</option>
              </select>
            </div>
            {generatedBankFile && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <FileCheck className="h-4 w-4" />
                    {generatedBankFile.fileName}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => void onDownloadLatestBankFile(batch)}
                    className="h-7 text-xs gap-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </Button>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground truncate">
                  SHA-256: {generatedBankFile.sha256Checksum}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Close
            </Button>
            <Button size="sm" disabled={isSubmitting} onClick={() => void onGenerateBankFile(bankFormat)}>
              {isSubmitting ? "Generating..." : "Generate File"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Submit to Bank Confirmation Dialog ────────────────────────── */}
      <Dialog open={activeModal === "submit_to_bank"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Confirm Submission to Bank</DialogTitle>
            <DialogDescription className="text-xs">
              Transitions batch to Submitted using Idempotency-Key protection. Transactions await bank UTR confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <BatchSummaryBox batch={batch} />
            <div>
              <label className="font-semibold text-foreground">Bank Reference / Acknowledgement Number *</label>
              <Input
                value={bankRefNumber}
                onChange={(e) => setBankRefNumber(e.target.value)}
                placeholder="e.g. HDFC-CMS-20261128"
                className="mt-1 h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Submission Date *</label>
              <Input
                type="date"
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Submission Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting || bankRefNumber.trim().length < 2}
              onClick={() =>
                void onConfirmSubmitToBank({
                  bankReferenceNumber: bankRefNumber.trim(),
                  submissionDate,
                  notes: notes.trim() || undefined,
                })
              }
            >
              {isSubmitting ? "Submitting..." : "Confirm Bank Submission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Retry Failed Payments Confirmation Dialog ─────────────────── */}
      <Dialog open={activeModal === "retry_failed"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-primary" />
              <span>Retry Eligible Failed Payments</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Creates one linked DRAFT re-payout batch containing only eligible failed items. Paid transactions are strictly excluded to prevent double salary payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-3 grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-muted-foreground">Batch Number</span>
                <p className="font-mono font-semibold">{batch.batchNumber}</p>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground">Payroll Period</span>
                <p className="font-medium">{batch.periodName}</p>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground">Eligible Failed Items</span>
                <p className="font-mono font-semibold">{failedItems.length || batch.failedCount || 0}</p>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground">Retry Amount</span>
                <p className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                  {failedItems.length > 0
                    ? formatPaise(failedTotalPaise)
                    : batch.failedAmountFormatted || "—"}
                </p>
              </div>
            </div>
            <div>
              <label className="font-semibold text-foreground">Retry Justification *</label>
              <Textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="e.g. Updated beneficiary account / IFSC confirmed by HR"
                rows={3}
                className="mt-1 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting || reasonInput.trim().length < 2}
              onClick={() => void onConfirmRetryFailed(reasonInput.trim())}
            >
              {isSubmitting ? "Creating Retry Batch..." : "Create Retry Batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reconcile Payment Confirmation Dialog ─────────────────────── */}
      <Dialog open={activeModal === "reconcile_payment"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Reconcile Payment Batch</DialogTitle>
            <DialogDescription className="text-xs">
              Verify bank settlement outcomes and close reconciliation for{" "}
              <strong className="font-mono">{batch.batchNumber}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <BatchSummaryBox batch={batch} />
            {reconciliation && reconciliation.pendingCount && reconciliation.pendingCount > 0 ? (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-amber-800 dark:text-amber-200 space-y-2">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{reconciliation.pendingCount} transaction(s) still awaiting bank confirmation</span>
                </div>
                <p>
                  Upload the bank response CSV or record individual UTR outcomes before marking the batch formally reconciled.
                </p>
              </div>
            ) : (
              <div>
                <label className="font-semibold text-foreground">Reconciliation Notes (Optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. All bank UTR references matched against statement"
                  rows={2}
                  className="mt-1 text-xs"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onCloseModal();
                onNavigateToBatch(
                  batch.id,
                  reconciliation?.pendingCount ? "import" : "reconcile"
                );
              }}
            >
              Open Bank Statement Workspace
            </Button>
            {(!reconciliation?.pendingCount || reconciliation.canReconcile) && (
              <Button
                size="sm"
                disabled={isSubmitting || !reconciliation?.canReconcile}
                onClick={() => void onConfirmReconcile(notes.trim() || undefined)}
              >
                {isSubmitting ? "Reconciling..." : "Confirm Reconcile"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Cancel Batch Confirmation Dialog ──────────────────────────── */}
      <Dialog open={activeModal === "cancel_batch"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-rose-600 dark:text-rose-400">
              Confirm Cancel Payment Batch
            </DialogTitle>
            <DialogDescription className="text-xs">
              Cancels this pre-submission payment batch and releases the payroll run for a fresh batch while retaining audit records.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <BatchSummaryBox batch={batch} />
            <div>
              <label className="font-semibold text-foreground">Cancellation Reason *</label>
              <Textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Reason for cancelling this batch..."
                rows={2}
                className="mt-1 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Keep Batch
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isSubmitting || reasonInput.trim().length < 2}
              onClick={() => void onConfirmCancel(reasonInput.trim())}
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancel Batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Draft Batch Confirmation Dialog ────────────────────── */}
      <Dialog open={activeModal === "delete_draft"} onOpenChange={(open) => !open && onCloseModal()}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-rose-600 dark:text-rose-400">
              Confirm Delete Draft Batch
            </DialogTitle>
            <DialogDescription className="text-xs">
              Permanently deletes this unsubmitted draft batch and all its draft disbursement line items. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <BatchSummaryBox batch={batch} />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onCloseModal}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isSubmitting}
              onClick={() => void onConfirmDeleteDraft()}
            >
              {isSubmitting ? "Deleting..." : "Delete Draft Batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatCountSafe(val: number): string {
  return new Intl.NumberFormat("en-IN").format(val);
}
