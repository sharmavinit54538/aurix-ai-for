import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  XCircle,
  WifiOff,
  ServerCrash,
  Lock,
  Info,
  RefreshCw,
} from "lucide-react";
import { formatINR } from "../utils/pricingCalculator";
import type {
  PaymentFlowState,
  VerifiedPaymentSummary,
} from "../types/billingTypes";

export interface PaymentStatusBannerProps {
  paymentState: PaymentFlowState;
  statusTitle?: string | null;
  statusMessage?: string | null;
  verifiedSummary?: VerifiedPaymentSummary | null;
  isCheckingStatus?: boolean;
  onRetryCheckout?: () => void;
  onCheckPendingStatus?: (paymentId: string) => void;
  onDismiss?: () => void;
}

export const PaymentStatusBanner: React.FC<PaymentStatusBannerProps> = ({
  paymentState,
  statusTitle,
  statusMessage,
  verifiedSummary,
  isCheckingStatus = false,
  onRetryCheckout,
  onCheckPendingStatus,
  onDismiss,
}) => {
  // Quiet baseline states when no banner is needed
  if (paymentState === "pricing_loaded" && !statusMessage) {
    return null;
  }

  if (paymentState === "loading_plans") {
    return (
      <div
        role="status"
        data-testid="payment-state-loading_plans"
        className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-xs text-slate-300"
      >
        <Loader2 className="h-4 w-4 animate-spin text-indigo-400" aria-hidden="true" />
        <span>Synchronizing plan specifications with OFC360 billing server...</span>
      </div>
    );
  }

  // Verified Success Receipt Card
  if (paymentState === "payment_verified" && verifiedSummary) {
    return (
      <section
        role="status"
        aria-live="polite"
        data-testid="payment-state-payment_verified"
        className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5 sm:p-6 shadow-md space-y-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-emerald-100">
                  Payment Verified & Subscription Activated
                </h3>
                <span
                  data-testid="verified-status-badge"
                  className="rounded bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-200"
                >
                  {verifiedSummary.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-emerald-200/90">
                {verifiedSummary.message}
              </p>
            </div>
          </div>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="self-start rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-900/50 whitespace-nowrap"
            >
              Dismiss Receipt
            </button>
          )}
        </div>

        {/* Authoritative Backend Verification Details */}
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div className="rounded-lg border border-emerald-500/20 bg-slate-950/60 p-3">
            <dt className="text-slate-400">Purchased Plan</dt>
            <dd
              data-testid="verified-plan-name"
              className="mt-1 text-sm font-bold text-slate-100"
            >
              {verifiedSummary.planName}
            </dd>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-slate-950/60 p-3">
            <dt className="text-slate-400">Purchased Employee Quantity</dt>
            <dd
              data-testid="verified-employee-quantity"
              className="mt-1 text-sm font-bold text-slate-100 tabular-nums"
            >
              {verifiedSummary.employeeQuantity} Employees
            </dd>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-slate-950/60 p-3">
            <dt className="text-slate-400">Verified Amount</dt>
            <dd
              data-testid="verified-amount"
              className="mt-1 text-sm font-bold text-emerald-300 tabular-nums"
            >
              {verifiedSummary.verifiedAmountRupees !== null
                ? formatINR(verifiedSummary.verifiedAmountRupees)
                : "Confirmed by Backend"}
            </dd>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-slate-950/60 p-3">
            <dt className="text-slate-400">Payment ID & Order ID</dt>
            <dd
              data-testid="verified-transaction-ids"
              className="mt-1 font-mono text-xs font-semibold text-slate-200 break-all"
            >
              {verifiedSummary.paymentId} / {verifiedSummary.orderId}
            </dd>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-slate-950/60 p-3">
            <dt className="text-slate-400">Subscription Status</dt>
            <dd
              data-testid="verified-subscription-status"
              className="mt-1 text-sm font-semibold capitalize text-emerald-300"
            >
              {verifiedSummary.subscriptionStatus || "Active"}
            </dd>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-slate-950/60 p-3">
            <dt className="text-slate-400">Next Billing Date</dt>
            <dd
              data-testid="verified-next-billing-date"
              className="mt-1 text-sm font-semibold text-slate-200 tabular-nums"
            >
              {verifiedSummary.nextBillingDate || "Updated in Subscription Overview"}
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  // Pending Verification State
  if (paymentState === "payment_pending") {
    return (
      <section
        role="status"
        aria-live="polite"
        data-testid="payment-state-payment_pending"
        className="rounded-xl border border-amber-500/40 bg-amber-950/25 p-4 sm:p-5 space-y-3"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold text-amber-100">
                {statusTitle || "Payment Verification Pending"}
              </h3>
              <p className="mt-1 text-xs text-amber-200/90">
                {statusMessage ||
                  verifiedSummary?.message ||
                  "Your payment is being processed by the bank/gateway. Subscription access will update once confirmed by the server."}
              </p>
              {verifiedSummary?.paymentId && (
                <p className="mt-1 font-mono text-[11px] text-amber-300">
                  Payment ID: {verifiedSummary.paymentId} | Order ID: {verifiedSummary.orderId}
                </p>
              )}
            </div>
          </div>

          {verifiedSummary?.paymentId && onCheckPendingStatus && (
            <button
              type="button"
              disabled={isCheckingStatus}
              onClick={() => onCheckPendingStatus(verifiedSummary.paymentId)}
              data-testid="check-pending-payment-btn"
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-amber-400/40 bg-amber-900/40 px-3.5 py-2 text-xs font-semibold text-amber-100 hover:bg-amber-900/60 disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isCheckingStatus ? "animate-spin" : ""}`}
              />
              <span>
                {isCheckingStatus ? "Checking Status..." : "Refresh Payment Status"}
              </span>
            </button>
          )}
        </div>
      </section>
    );
  }

  // In-flight Progress States
  if (
    paymentState === "creating_order" ||
    paymentState === "opening_checkout" ||
    paymentState === "verifying_payment"
  ) {
    const labelMap: Record<string, { title: string; detail: string }> = {
      creating_order: {
        title: "Creating Authoritative Payment Order",
        detail:
          "Requesting order ID and final tax/subtotal quote from the OFC360 billing server...",
      },
      opening_checkout: {
        title: "Razorpay Checkout Open",
        detail:
          "Complete your payment in the secure Razorpay window. Do not close or refresh this tab.",
      },
      verifying_payment: {
        title: "Verifying Payment Signature with OFC360 Backend",
        detail:
          "Validating your Razorpay order, payment reference, and cryptographic signature...",
      },
    };
    const info = labelMap[paymentState];

    return (
      <div
        role="status"
        aria-live="polite"
        data-testid={`payment-state-${paymentState}`}
        className="flex items-start gap-3 rounded-xl border border-indigo-500/40 bg-indigo-950/25 p-4 text-xs text-indigo-100"
      >
        <Loader2
          className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-indigo-400"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold text-sm">{statusTitle || info.title}</p>
          <p className="mt-0.5 text-indigo-200/85">{statusMessage || info.detail}</p>
        </div>
      </div>
    );
  }

  // Error, Cancelled, Auth, Network, Already Subscribed, or Unsupported States
  const configByState: Record<
    string,
    {
      icon: React.ReactNode;
      borderClass: string;
      defaultTitle: string;
      defaultMessage: string;
    }
  > = {
    validation_error: {
      icon: <AlertCircle className="h-5 w-5 text-rose-400" />,
      borderClass: "border-rose-500/40 bg-rose-950/25 text-rose-100",
      defaultTitle: "Invalid Employee Count",
      defaultMessage: "Please enter a valid whole number of employees before proceeding to checkout.",
    },
    payment_cancelled: {
      icon: <XCircle className="h-5 w-5 text-amber-400" />,
      borderClass: "border-amber-500/40 bg-amber-950/25 text-amber-100",
      defaultTitle: "Payment Checkout Cancelled",
      defaultMessage:
        "You closed the Razorpay checkout window before completing payment. No charge was made.",
    },
    payment_failed: {
      icon: <XCircle className="h-5 w-5 text-rose-400" />,
      borderClass: "border-rose-500/40 bg-rose-950/30 text-rose-100",
      defaultTitle: "Payment or Signature Verification Failed",
      defaultMessage:
        "The payment could not be completed or verified by the server. If an amount was debited, please check your payment history or contact billing support.",
    },
    backend_unavailable: {
      icon: <ServerCrash className="h-5 w-5 text-rose-400" />,
      borderClass: "border-rose-500/40 bg-rose-950/25 text-rose-100",
      defaultTitle: "Billing Backend Unavailable",
      defaultMessage:
        "The OFC360 payment service could not process the order right now. No charge has been made.",
    },
    network_failure: {
      icon: <WifiOff className="h-5 w-5 text-rose-400" />,
      borderClass: "border-rose-500/40 bg-rose-950/25 text-rose-100",
      defaultTitle: "Network Connection Error",
      defaultMessage:
        "Unable to reach the OFC360 backend API. Check your network connection and retry.",
    },
    auth_expired: {
      icon: <Lock className="h-5 w-5 text-amber-400" />,
      borderClass: "border-amber-500/40 bg-amber-950/25 text-amber-100",
      defaultTitle: "Authentication Required",
      defaultMessage:
        "Please sign in with an authorized Organization Admin / HR Admin account to create a subscription order.",
    },
    already_subscribed: {
      icon: <Info className="h-5 w-5 text-indigo-400" />,
      borderClass: "border-indigo-500/40 bg-indigo-950/25 text-indigo-100",
      defaultTitle: "Already Subscribed to Selected Tier",
      defaultMessage:
        "Your organization already has an active subscription matching this plan and employee limit.",
    },
    unsupported_change: {
      icon: <AlertCircle className="h-5 w-5 text-amber-400" />,
      borderClass: "border-amber-500/40 bg-amber-950/25 text-amber-100",
      defaultTitle: "Subscription Change Requires Billing Support",
      defaultMessage:
        "This plan transition is not supported via self-serve checkout on the backend API.",
    },
  };

  const visual = configByState[paymentState] || configByState.backend_unavailable;

  return (
    <div
      role="alert"
      data-testid={`payment-state-${paymentState}`}
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border p-4 text-xs ${visual.borderClass}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{visual.icon}</div>
        <div>
          <p className="text-sm font-bold">{statusTitle || visual.defaultTitle}</p>
          <p className="mt-0.5 opacity-90">{statusMessage || visual.defaultMessage}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        {onRetryCheckout &&
          (paymentState === "payment_cancelled" ||
            paymentState === "payment_failed" ||
            paymentState === "backend_unavailable" ||
            paymentState === "network_failure") && (
            <button
              type="button"
              onClick={onRetryCheckout}
              data-testid="retry-checkout-btn"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 whitespace-nowrap"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </button>
          )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-white/15 bg-black/20 px-2.5 py-1.5 text-xs font-medium text-white/80 hover:text-white whitespace-nowrap"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};
