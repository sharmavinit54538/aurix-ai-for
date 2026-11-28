import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Banknote,
  Building2,
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
import { useCurrentRole } from "@/lib/use-current-role";
import { formatINR, formatCount } from "@/lib/format";
import { PayrollStepper } from "../components/PayrollStepper";
import { paymentApi } from "../api/paymentApi";
import { payrollApi, type PayrollFinalizationData } from "@/services/payrollApi";
import type { PayrollPreviewEmployee } from "@/services/payroll/types";
import { generateIdempotencyKey } from "../utils/idempotency";
import type {
  CompanyBankAccount,
  PaymentBatch,
  PaymentMode,
  SupportedPaymentMode,
} from "../types/payment";
import { toast } from "sonner";

export default function PayrollRunPaymentPage() {
  const params = useParams({ strict: false }) as { runId?: string };
  const runId = params?.runId?.trim() || "";
  const navigate = useNavigate();
  const aurixStore = useAurix();
  const currentUser = aurixStore.user;
  const currentRole = useCurrentRole();
  const isSuperAdmin = currentRole === "super_admin";

  const [loadingRun, setLoadingRun] = useState(true);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [runData, setRunData] = useState<PayrollFinalizationData | null>(null);
  const [runEmployees, setRunEmployees] = useState<PayrollPreviewEmployee[]>([]);
  const [existingBatches, setExistingBatches] = useState<PaymentBatch[]>([]);
  const [sourceAccounts, setSourceAccounts] = useState<CompanyBankAccount[]>([]);
  const [supportedModes, setSupportedModes] = useState<SupportedPaymentMode[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("NEFT");
  const [paymentDate, setPaymentDate] = useState("");
  const [batchNotes, setBatchNotes] = useState("");

  // Holds
  const [heldEmployees, setHeldEmployees] = useState<
    Array<{ employeeId: string; employeeCode?: string; employeeName: string; reason: string }>
  >([]);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [holdEmpId, setHoldEmpId] = useState("");
  const [holdEmpName, setHoldEmpName] = useState("");
  const [holdReason, setHoldReason] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlightRef = useRef(false);

  const loadData = async () => {
    if (!runId || isSuperAdmin) {
      setLoadingRun(false);
      return;
    }
    setLoadingRun(true);
    setBackendUnavailable(false);

    try {
      const [resFinal, runEmpRes, batchesRes, accountsRes, modesRes] = await Promise.all([
        payrollApi.getPayrollFinalization(runId),
        payrollApi.getPayrollRunEmployees(runId, { limit: 200 }).catch(() => ({ items: [] as PayrollPreviewEmployee[] })),
        paymentApi.getPaymentBatchesForRun(runId).catch((err: any) => {
          if (err?.response?.status === 404 || err?.response?.status === 501) {
            setBackendUnavailable(true);
          }
          return [] as PaymentBatch[];
        }),
        paymentApi.getTenantBankAccounts().catch(async () => {
          const companyId = aurixStore.company?.id || currentUser?.companyId || "";
          return companyId ? paymentApi.getCompanyBankAccounts(companyId) : [];
        }),
        paymentApi.getSupportedPaymentModes().catch(() => [] as SupportedPaymentMode[]),
      ]);

      setRunData(resFinal);
      setRunEmployees(runEmpRes.items || []);
      setExistingBatches(batchesRes);
      setSourceAccounts(accountsRes);
      if (accountsRes.length > 0) {
        const primary = accountsRes.find((a) => a.isPrimary && a.isActive) || accountsRes[0];
        setSelectedAccountId(primary.id);
      }
      setSupportedModes(modesRes);
      const firstEnabled = modesRes.find((m) => m.enabled);
      if (firstEnabled) {
        setPaymentMode(firstEnabled.code);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setBackendUnavailable(true);
      } else {
        toast.error(err?.response?.data?.detail || "Failed to load payroll run information");
      }
    } finally {
      setLoadingRun(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [runId, isSuperAdmin]);

  const activeExistingBatch = existingBatches.find((b) => b.status !== "cancelled");

  const isFinalized = Boolean(
    runData?.isFinalized ||
      runData?.isLocked ||
      runData?.status?.toLowerCase().includes("final") ||
      runData?.status?.toLowerCase().includes("lock") ||
      runData?.status?.toLowerCase() === "paid"
  );

  const handleCreateBatch = async () => {
    if (inFlightRef.current || isSubmitting) return;

    if (!selectedAccountId) {
      toast.error("Please select a verified corporate bank account for disbursement.");
      return;
    }
    if (activeExistingBatch) {
      toast.info(`Batch ${activeExistingBatch.batchNumber} already exists for this run.`);
      navigate({ to: `/dashboard/payroll/payments/${activeExistingBatch.id}` as any });
      return;
    }

    inFlightRef.current = true;
    setIsSubmitting(true);

    try {
      const createdBatch = await paymentApi.createPaymentBatch(
        runId,
        {
          sourceAccountId: selectedAccountId,
          paymentMode,
          heldEmployeeIds: heldEmployees.map((h) => ({
            employeeId: h.employeeId,
            reason: h.reason,
          })),
          paymentDate: paymentDate || undefined,
          notes: batchNotes.trim() || undefined,
        },
        generateIdempotencyKey()
      );

      toast.success(`Payment batch ${createdBatch.batchNumber} created successfully!`);
      navigate({
        to: `/dashboard/payroll/payments/${createdBatch.id}` as any,
      });
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        toast.error(typeof detail === "string" ? detail : "Payment batch endpoint unavailable");
      } else if (status === 409) {
        toast.error(
          (typeof detail === "object" && detail?.message) ||
            (typeof detail === "string" ? detail : null) ||
            err?.response?.data?.message ||
            "Payment batch conflict detected"
        );
      } else {
        toast.error(
          (typeof detail === "string" ? detail : null) ||
            err?.response?.data?.message ||
            "Failed to create payment batch"
        );
      }
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleAddHold = () => {
    if (!holdEmpId.trim() || holdReason.trim().length < 5) {
      toast.error("Select an employee and enter a hold reason of at least 5 characters.");
      return;
    }
    const matched = runEmployees.find((e) => e.employeeId === holdEmpId);
    setHeldEmployees((prev) => [
      ...prev.filter((p) => p.employeeId !== holdEmpId),
      {
        employeeId: holdEmpId.trim(),
        employeeCode: matched?.employeeId,
        employeeName: matched?.name || holdEmpName || `Employee ${holdEmpId}`,
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

  if (isSuperAdmin) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Alert variant="destructive" className="rounded-2xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold">Tenant Payroll Access Restricted</AlertTitle>
          <AlertDescription className="text-xs mt-1">
            Platform Super Admin accounts cannot initiate or manage tenant salary disbursements.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const modeChoices: SupportedPaymentMode[] =
    supportedModes.length > 0
      ? supportedModes
      : [
          {
            code: "NEFT",
            label: "NEFT",
            description: "Batch settlement",
            minAmountPaise: 100,
            maxAmountPaise: null,
            settlementWindow: "Half-hourly",
            enabled: true,
          },
          {
            code: "RTGS",
            label: "RTGS",
            description: "Real-time gross",
            minAmountPaise: 20000000,
            maxAmountPaise: null,
            settlementWindow: "Real-time",
            enabled: true,
          },
          {
            code: "IMPS",
            label: "IMPS",
            description: "Immediate",
            minAmountPaise: 100,
            maxAmountPaise: 50000000,
            settlementWindow: "Instant",
            enabled: true,
          },
          {
            code: "UPI",
            label: "UPI",
            description: "Instant payout",
            minAmountPaise: 100,
            maxAmountPaise: 10000000,
            settlementWindow: "Instant",
            enabled: true,
          },
        ];

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

      {/* ── 9-Step Lifecycle Stepper ──────────────────────────────────── */}
      <PayrollStepper
        currentStep="payment"
        runId={runId}
        runStatus={runData?.status || "Finalized"}
      />

      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-2xl text-xs">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">Unable to load payroll run</AlertTitle>
          <AlertDescription className="text-xs mt-1">
            Verify the payroll run ID exists and belongs to your company before creating a payment batch.
          </AlertDescription>
        </Alert>
      )}

      {!loadingRun && !isFinalized && !backendUnavailable && (
        <Alert className="border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-200">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Disbursement Blocked — Run Not Finalized
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            Payment batches can only be initiated against a finalized and locked payroll run.
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
            Initiate corporate bank payment batch, manage pre-disbursement holds, and track bank release.
          </p>
        </div>

        {activeExistingBatch && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600">
              Active Batch: {activeExistingBatch.batchNumber}
            </Badge>
            <Button
              size="sm"
              onClick={() =>
                navigate({
                  to: `/dashboard/payroll/payments/${activeExistingBatch.id}` as any,
                })
              }
              className="h-8 gap-1.5 text-xs"
            >
              <span>Manage Batch</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* ── Run Totals ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value={formatCount(runData?.summary?.employeeCount ?? runEmployees.length)}
          hint="Eligible for payment"
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Net Payroll"
          value={formatINR(runData?.summary?.netPayroll ?? null)}
          hint="Calculated in Finalization"
          icon={Banknote}
          accent="success"
        />
        <StatCard
          label="Held Employees"
          value={formatCount(heldEmployees.length)}
          hint={heldEmployees.length > 0 ? "Excluded from initial release" : "No holds active"}
          icon={UserX}
          accent={heldEmployees.length > 0 ? "warning" : "muted"}
        />
        <StatCard
          label="Run Status"
          value={runData?.status || "—"}
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
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Company Disbursement Account
                </label>
                {sourceAccounts.length > 0 ? (
                  <select
                    id="payment-source-account"
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background/90 px-3 py-2 text-xs text-foreground shadow-xs"
                  >
                    {sourceAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.bankName} — {acc.accountHolderName} ({acc.accountNumberMasked}) • IFSC: {acc.ifscCode}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
                    No active corporate bank accounts configured. Configure a company bank account before creating a payment batch.
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Disbursement Mode
                </label>
                <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {modeChoices.map((mode) => (
                    <button
                      key={mode.code}
                      type="button"
                      disabled={!mode.enabled}
                      onClick={() => setPaymentMode(mode.code)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                        !mode.enabled
                          ? "opacity-45 cursor-not-allowed border-border/40 bg-muted/20"
                          : paymentMode === mode.code
                          ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/40 shadow-xs"
                          : "border-border/60 bg-background/60 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <span className="text-xs font-medium">{mode.code}</span>
                      <span className="text-[10px] opacity-75 mt-0.5">
                        {mode.settlementWindow || mode.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Planned Payment Date (Optional)
                  </label>
                  <Input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="mt-1.5 h-9 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Batch Notes / Reference Description (Optional)
                  </label>
                  <Input
                    id="payment-batch-notes"
                    value={batchNotes}
                    onChange={(e) => setBatchNotes(e.target.value)}
                    placeholder="e.g. Monthly salary batch 1"
                    className="mt-1.5 h-9 text-xs rounded-xl"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <UserX className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Disbursement Holds
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Withhold disbursement for employees pending KYC, notice period, or compliance review.
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (runEmployees.length > 0 && !holdEmpId) {
                    setHoldEmpId(runEmployees[0].employeeId);
                    setHoldEmpName(runEmployees[0].name);
                  }
                  setHoldModalOpen(true);
                }}
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
                      <div className="font-semibold text-foreground">
                        {h.employeeName} {h.employeeCode ? `(${h.employeeCode})` : ""}
                      </div>
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
                <span className="font-mono font-semibold">{formatCount(runData?.summary?.employeeCount ?? runEmployees.length)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Employees Held</span>
                <span className="font-mono font-semibold text-amber-600">{heldEmployees.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Batch Employees</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatCount(
                    Math.max(0, (runData?.summary?.employeeCount ?? runEmployees.length) - heldEmployees.length)
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1 text-sm font-semibold">
                <span>Net Payable (Run)</span>
                <span className="text-emerald-600 font-mono">
                  {formatINR(runData?.summary?.netPayroll ?? null)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              {activeExistingBatch ? (
                <Button
                  size="sm"
                  onClick={() => navigate({ to: `/dashboard/payroll/payments/${activeExistingBatch.id}` as any })}
                  className="w-full h-10 gap-2 text-[13px] font-semibold rounded-xl shadow-xs"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Existing Batch ({activeExistingBatch.batchNumber})</span>
                </Button>
              ) : (
                <Button
                  id="create-payment-batch-btn"
                  variant="default"
                  disabled={!isFinalized || !selectedAccountId || isSubmitting || loadingRun}
                  onClick={() => void handleCreateBatch()}
                  className="w-full h-10 gap-2 text-[13px] font-semibold rounded-xl shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Creating Batch...</span>
                    </>
                  ) : (
                    <>
                      <Banknote className="h-4 w-4" />
                      <span>Create Payment Batch</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </GlassCard>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Compliance & Money Safety</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Payable totals and employee bank details are derived strictly by backend authorization. Account numbers remain masked across UI state and network payloads.
            </p>
          </div>
        </div>
      </div>

      {/* Hold Employee Modal */}
      <Dialog open={holdModalOpen} onOpenChange={setHoldModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Place Employee Payment on Hold</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select an employee from this payroll run and provide a business reason for holding disbursement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {runEmployees.length > 0 ? (
              <div>
                <label className="font-semibold text-foreground">Select Employee *</label>
                <select
                  value={holdEmpId}
                  onChange={(e) => {
                    const selected = runEmployees.find((emp) => emp.employeeId === e.target.value);
                    setHoldEmpId(e.target.value);
                    setHoldEmpName(selected?.name || "");
                  }}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="">Choose an employee...</option>
                  {runEmployees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.name} ({emp.employeeId}) — {formatINR(emp.netPay)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="font-semibold text-foreground">Employee UUID *</label>
                <Input
                  id="hold-employee-id"
                  placeholder="Employee UUID"
                  value={holdEmpId}
                  onChange={(e) => setHoldEmpId(e.target.value)}
                  className="mt-1 h-8 rounded-lg text-xs font-mono"
                />
              </div>
            )}
            <div>
              <label className="font-semibold text-foreground">Mandatory Reason for Hold *</label>
              <Textarea
                id="hold-reason-input"
                placeholder="e.g. Pending bank account verification with HR"
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                rows={3}
                className="mt-1 rounded-lg text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setHoldModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddHold}>
              Apply Hold
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
