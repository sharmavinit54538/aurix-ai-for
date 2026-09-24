import React from "react";
import { AlertOctagon, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatPaiseToINR } from "../utils/money";
import { cn } from "@/lib/utils";
import type { PaymentReconciliation } from "../types/payment";

export interface PaymentReconciliationCardProps {
  reconciliation: PaymentReconciliation;
  className?: string;
}

export function PaymentReconciliationCard({
  reconciliation,
  className,
}: PaymentReconciliationCardProps) {
  const {
    expectedPaise,
    paidPaise,
    failedPaise,
    heldPaise,
    processingPaise,
    unmatchedPaise,
    isReconciled,
    mismatchPaise,
    summaryText,
  } = reconciliation;

  const hasMismatch = mismatchPaise !== 0 || !isReconciled;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 backdrop-blur-xl shadow-sm transition-all",
        hasMismatch
          ? "border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10"
          : "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/60 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
              hasMismatch
                ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            )}
          >
            {hasMismatch ? (
              <AlertOctagon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              Disbursement & Mathematical Reconciliation
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Strict integer paise balance verification: Expected == Paid + Failed + Held + Processing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasMismatch ? (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/40">
              <ShieldAlert className="h-4 w-4" />
              <span>Paise Discrepancy Detected</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/40">
              <CheckCircle2 className="h-4 w-4" />
              <span>100% Mathematically Reconciled</span>
            </div>
          )}
        </div>
      </div>

      {/* Discrepancy Warning Banner */}
      {hasMismatch && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-800 dark:text-rose-200">
          <div className="font-semibold flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" />
            <span>Blocking Reconciliation Warning</span>
          </div>
          <p className="mt-1">
            Expected total does not match sum of disbursement outcomes by{" "}
            <strong>{formatPaiseToINR(Math.abs(mismatchPaise))}</strong> ({Math.abs(mismatchPaise)} paise).
            This payroll run cannot transition to "Paid" until all transactions are accounted for on the backend.
          </p>
        </div>
      )}

      {/* Metric Breakdown Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-border/60 bg-background/60 p-3">
          <span className="text-[11px] font-medium text-muted-foreground uppercase">Expected</span>
          <p className="mt-1 font-mono text-sm sm:text-base font-semibold text-foreground">
            {formatPaiseToINR(expectedPaise)}
          </p>
          <span className="text-[10px] text-muted-foreground font-mono">{expectedPaise} paise</span>
        </div>

        <div className="rounded-xl border border-border/60 bg-emerald-500/5 p-3">
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase">Paid (UTR Confirmed)</span>
          <p className="mt-1 font-mono text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400">
            {formatPaiseToINR(paidPaise)}
          </p>
          <span className="text-[10px] text-muted-foreground font-mono">{paidPaise} paise</span>
        </div>

        <div className="rounded-xl border border-border/60 bg-rose-500/5 p-3">
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase">Failed</span>
          <p className="mt-1 font-mono text-sm sm:text-base font-semibold text-rose-600 dark:text-rose-400">
            {formatPaiseToINR(failedPaise)}
          </p>
          <span className="text-[10px] text-muted-foreground font-mono">{failedPaise} paise</span>
        </div>

        <div className="rounded-xl border border-border/60 bg-amber-500/5 p-3">
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase">Held</span>
          <p className="mt-1 font-mono text-sm sm:text-base font-semibold text-amber-600 dark:text-amber-400">
            {formatPaiseToINR(heldPaise)}
          </p>
          <span className="text-[10px] text-muted-foreground font-mono">{heldPaise} paise</span>
        </div>

        <div className="rounded-xl border border-border/60 bg-sky-500/5 p-3">
          <span className="text-[11px] font-medium text-sky-600 dark:text-sky-400 uppercase">Processing</span>
          <p className="mt-1 font-mono text-sm sm:text-base font-semibold text-sky-600 dark:text-sky-400">
            {formatPaiseToINR(processingPaise)}
          </p>
          <span className="text-[10px] text-muted-foreground font-mono">{processingPaise} paise</span>
        </div>

        <div className="rounded-xl border border-border/60 bg-purple-500/5 p-3">
          <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 uppercase">Unmatched</span>
          <p className="mt-1 font-mono text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-400">
            {formatPaiseToINR(unmatchedPaise)}
          </p>
          <span className="text-[10px] text-muted-foreground font-mono">{unmatchedPaise} paise</span>
        </div>
      </div>

      {summaryText && (
        <div className="mt-4 text-xs text-muted-foreground">
          {summaryText}
        </div>
      )}
    </div>
  );
}
