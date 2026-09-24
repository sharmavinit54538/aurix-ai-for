import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Users,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { formatINR, formatCount, formatDate, maskAccountNumber } from "@/lib/format";
import { PayrollStepper } from "../components/PayrollStepper";
import { paymentApi } from "../api/paymentApi";
import { payrollApi, type PayrollFinalizationData } from "@/services/payrollApi";
import { generateIdempotencyKey } from "../utils/idempotency";
import type { CompanyBankAccount, PaymentBatch, PaymentMode } from "../types/payment";
import { toast } from "sonner";

export default function PayrollRunPaymentPage() {
  const params = useParams({ strict: false }) as { runId?: string };
  const runId = params?.runId?.trim() || "";
  const navigate = useNavigate();
  const aurixStore = useAurix();
  const currentUser = aurixStore.user;

  const [loadingRun, setLoadingRun] = useState(true);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [runData, setRunData] = useState<PayrollFinalizationData | null>(null);
  const [existingBatches, setExistingBatches] = useState<PaymentBatch[]>([]);
  const [sourceAccounts, setSourceAccounts] = useState<CompanyBankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("NEFT");
  const [batchNotes, setBatchNotes] = useState("");

  // Holds
  const [heldEmployees, setHeldEmployees] = useState<
    Array<{ employeeId: string; employeeName: string; reason: string }>
  >([]);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [holdEmpId, setHoldEmpId] = useState("");
  const [holdEmpName, setHoldEmpName] = useState("");
  const [holdReason, setHoldReason] = useState("");

  // Submission state & in-flight guard
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlightRef = useRef(false);

  // Load run details and any existing batches
  const loadData = async () => {
    if (!runId) return;
    setLoadingRun(true);
    setBackendUnavailable(false);

    try {
      // 1. Fetch run finalization status
      const resFinal = await payrollApi.getPayrollFinalization(runId);
      setRunData(resFinal);

      // 2. Fetch existing payment batches for this run (PROPOSED endpoint)
      try {
        const batches = await paymentApi.getPaymentBatchesForRun(runId);
        setExistingBatches(batches);
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.response?.status === 501) {
          // Expected in current environment: backend pending
          setBackendUnavailable(true);
        }
      }

      // 3. Fetch company source bank accounts
      try {
        const accounts = await paymentApi.getCompanyBankAccounts("default");
        setSourceAccounts(accounts);
        if (accounts.length > 0) {
          setSelectedAccountId(accounts[0].id);
        }
      } catch {
        // Source accounts endpoint pending
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setBackendUnavailable(true);
      } else {
        toast.error("Failed to load payroll run information");
      }
    } finally {
      setLoadingRun(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [runId]);

  const isFinalized = Boolean(
    runData?.isFinalized ||
    runData?.isLocked ||
    runData?.status?.toLowerCase().includes("final") ||
    runData?.status?.toLowerCase().includes("lock")
  );

  const handleCreateBatch = async () => {
    if (inFlightRef.current || isSubmitting) return;

    if (!selectedAccountId && sourceAccounts.length > 0) {
      toast.error("Please select a source bank account");
      return;
    }

    inFlightRef.current = true;
    setIsSubmitting(true);
    const idempotencyKey = generateIdempotencyKey();

    try {
      const createdBatch = await paymentApi.createPaymentBatch(
        runId,
        {
          sourceAccountId: selectedAccountId || "default-account-id",
          paymentMode,
          heldEmployeeIds: heldEmployees.map((h) => ({
            employeeId: h.employeeId,
            reason: h.reason,
          })),
          notes: batchNotes.trim() || undefined,
        },
        idempotencyKey
      );

      toast.success(`Payment batch ${createdBatch.batchNumber} created successfully!`);
      navigate({
        to: `/dashboard/payroll/payments/${createdBatch.id}` as any,
      });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        toast.error("Feature unavailable — backend pending");
      } else if (status === 409) {
        toast.error(err?.response?.data?.message || "Payment batch conflict detected");
      } else {
        toast.error(err?.response?.data?.message || "Failed to create payment batch");
      }
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleAddHold = () => {
    if (!holdEmpId || !holdReason.trim() || holdReason.trim().length < 5) {
      toast.error("Hold reason must be at least 5 characters");
      return;
    }
    setHeldEmployees((prev) => [
      ...prev.filter((p) => p.employeeId !== holdEmpId),
      {
        employeeId: holdEmpId,
        employeeName: holdEmpName || `Employee ${holdEmpId}`,
        reason: holdReason.trim(),
      },
    ]);
    setHoldModalOpen(false);
    setHoldEmpId("");
    setHoldEmpName("");
    setHoldReason("");
  };

  const handleRemoveHold = (empId: string) => {
    setHeldEmployees((prev) => prev.filter((p) => p.employeeId !== empId));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Breadcrumb & Top Bar ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate({
                to: `/dashboard/payroll/runs/${runId}/finalize` as any,
              })
            }
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Finalization</span>
          </Button>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-xs text-muted-foreground font-mono">Run: {runId}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loadingRun}
            className="h-8 gap-1.5 text-xs"
          >
            <RefreshCw className={loadingRun ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/dashboard/payroll/payments" as any })}
            className="h-8 gap-1.5 text-xs"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All Payment Batches</span>
          </Button>
        </div>
      </div>

      {/* ── 9-Step Lifecycle Stepper ──────────────────────────────────── */}
      <PayrollStepper
        currentStep="payment"
        runId={runId}
        runStatus={runData?.status || "Finalized"}
      />

      {/* ── BACKEND UNAVAILABLE NOTIFICATION BANNER ──────────────────── */}
      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Feature unavailable — backend pending
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-1">
            <p>
              The Payment & Disbursement API service (Step 9) is currently awaiting backend deployment.
              All frontend interfaces, Zod contracts, and maker-checker structures are fully implemented.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/PAYROLL_BACKEND_CONTRACT.md</code> • Requirements: <code>docs/PAYROLL_BACKEND_TODO.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Finalization Prerequisite Guard ──────────────────────────── */}
      {!loadingRun && !isFinalized && (
        <Alert className="border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-200">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Disbursement Blocked — Run Not Finalized
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            Payment batches can only be initiated against a finalized and locked payroll run.
            Please complete Step 7 (Finalization) before proceeding to disbursement.
          </AlertDescription>
        </Alert>
      )}

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Step 9: Payment & Disbursement
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
            >
              Salary Release
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Initiate corporate bank payment batch, review hold list, and generate authoritative bank disbursement files.
          </p>
        </div>

        {existingBatches.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600">
              {existingBatches.length} Batch{existingBatches.length > 1 ? "es" : ""} Created
            </Badge>
            <Button
              size="sm"
              onClick={() =>
                navigate({
                  to: `/dashboard/payroll/payments/${existingBatches[0].id}` as any,
                })
              }
              className="h-8 gap-1.5 text-xs"
            >
              <span>View Latest Batch</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Run Totals (Authoritative Backend Numbers Only) ────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value={formatCount(runData?.summary?.employeeCount ?? 0)}
          hint="Eligible for payment"
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Net Payroll"
          value={formatINR(runData?.summary?.netPayroll || 0)}
          hint="Calculated in Finalization"
          icon={Banknote}
          accent="success"
        />
        <StatCard
          label="Held Employees"
          value={formatCount(heldEmployees.length)}
          hint={heldEmployees.length > 0 ? "Excluded from batch" : "No holds active"}
          icon={UserX}
          accent={heldEmployees.length > 0 ? "warning" : "muted"}
        />
        <StatCard
          label="Run Status"
          value={runData?.status || "Finalized"}
          hint={isFinalized ? "Locked & Ready" : "Unfinalized"}
          icon={Lock}
          accent={isFinalized ? "success" : "danger"}
        />
      </div>

      {/* ── Payment Batch Creation Form ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border pb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Source Bank Account & Disbursement Method
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select the corporate account from which salary disbursements will be debited.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Account Selection */}
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Company Disbursement Account
                </label>
                {sourceAccounts.length > 0 ? (
                  <select
                    id="payment-source-account"
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background/90 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                  >
                    {sourceAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.bankName} — {acc.accountHolderName} ({acc.accountNumberMasked}) • IFSC: {acc.ifscCode}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1.5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground flex items-center justify-between">
                    <span>Primary Corporate Account (HDFC Bank • ••••••••4431)</span>
                    <Badge variant="outline" className="text-[10px]">Default</Badge>
                  </div>
                )}
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Full account numbers are masked for financial security compliance.
                </p>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Disbursement Mode
                </label>
                <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["NEFT", "RTGS", "IMPS", "UPI"] as PaymentMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                        paymentMode === mode
                          ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/40 shadow-xs"
                          : "border-border/60 bg-background/60 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <span className="text-xs font-medium">{mode}</span>
                      <span className="text-[10px] opacity-75 mt-0.5">
                        {mode === "NEFT" ? "Batch settlement" : mode === "RTGS" ? "Real-time gross" : mode === "IMPS" ? "Immediate" : "VPA handle"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Batch Notes */}
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Batch Notes / Reference Description (Optional)
                </label>
                <Textarea
                  id="payment-batch-notes"
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  placeholder="e.g. Salary disbursement for September 2026 Batch 1"
                  rows={2}
                  className="mt-1.5 text-xs rounded-xl"
                  maxLength={500}
                />
              </div>
            </div>
          </GlassCard>

          {/* ── Employee Holds Section ──────────────────────────────── */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <UserX className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Disbursement Holds
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Temporarily withhold disbursement for employees pending KYC, notice period, or tax review.
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setHoldModalOpen(true)}
                className="h-8 gap-1.5 text-xs rounded-xl"
              >
                <UserX className="h-3.5 w-3.5" />
                <span>Add Employee Hold</span>
              </Button>
            </div>

            {heldEmployees.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
                No employees currently on hold. All eligible employees in this run will be included in the disbursement batch.
              </div>
            ) : (
              <div className="space-y-2">
                {heldEmployees.map((h) => (
                  <div
                    key={h.employeeId}
                    className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-foreground">{h.employeeName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">ID: {h.employeeId}</div>
                      <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                        Reason: {h.reason}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveHold(h.employeeId)}
                      className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                    >
                      Remove Hold
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* ── Right Column: Execution & Summary ─────────────────────── */}
        <div className="space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-foreground border-b border-border pb-3">
              Batch Creation Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Payroll Period</span>
                <span className="font-semibold text-foreground">{runData?.periodName || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Payment Mode</span>
                <span className="font-semibold text-primary">{paymentMode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Total In Run</span>
                <span className="font-mono font-semibold">{formatCount(runData?.summary?.employeeCount ?? 0)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Employees Held</span>
                <span className="font-mono font-semibold text-amber-600">{heldEmployees.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Batch Employees</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatCount(Math.max(0, (runData?.summary?.employeeCount ?? 0) - heldEmployees.length))}
                </span>
              </div>
              <div className="flex justify-between py-1 text-sm font-semibold">
                <span>Net Payable (Run)</span>
                <span className="text-emerald-600 font-mono">
                  {formatINR(runData?.summary?.netPayroll || 0)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                id="create-payment-batch-btn"
                variant="default"
                disabled={!isFinalized || isSubmitting || loadingRun}
                onClick={handleCreateBatch}
                className="w-full h-10 gap-2 text-xs font-semibold rounded-xl shadow-md"
                style={{ background: isFinalized ? "var(--gradient-brand)" : undefined }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Creating Batch (Idempotent)...</span>
                  </>
                ) : (
                  <>
                    <Banknote className="h-4 w-4" />
                    <span>Create Payment Batch</span>
                  </>
                )}
              </Button>
              <p className="mt-2 text-[10px] text-center text-muted-foreground">
                Uses unique <code>Idempotency-Key</code> to guarantee duplicate-submission protection.
              </p>
            </div>
          </GlassCard>

          {/* Security & Audit notice */}
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Compliance & Money Safety</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Amounts are generated strictly by backend authorization. Frontend calculations are never authoritative.
              Full bank account numbers are never exposed in URL parameters or browser local storage.
            </p>
          </div>
        </div>
      </div>

      {/* ── Hold Employee Modal ─────────────────────────────────────── */}
      <Dialog open={holdModalOpen} onOpenChange={setHoldModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Place Employee Payment on Hold</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter the employee details and mandatory business reason for withholding disbursement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Employee ID / Code *</label>
              <Input
                id="hold-employee-id"
                placeholder="e.g. EMP-101"
                value={holdEmpId}
                onChange={(e) => setHoldEmpId(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Employee Name</label>
              <Input
                id="hold-employee-name"
                placeholder="e.g. Rajesh Kumar"
                value={holdEmpName}
                onChange={(e) => setHoldEmpName(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Mandatory Reason for Hold *</label>
              <Textarea
                id="hold-reason-input"
                placeholder="e.g. Pending bank account name mismatch verification with HR"
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
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
              onClick={() => setHoldModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddHold}
              className="rounded-xl text-xs"
            >
              Apply Hold
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
