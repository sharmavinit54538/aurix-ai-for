import React from "react";
import { Lock, CreditCard, Building2, Loader2, ShieldCheck } from "lucide-react";
import { PricingBreakdown } from "./PricingBreakdown";
import type {
  AuthoritativeOrderQuote,
  EmployeeCountValidationResult,
  PaymentFlowState,
  PricingBreakdownEstimate,
} from "../types/billingTypes";

export interface CheckoutSummaryProps {
  estimate: PricingBreakdownEstimate;
  validation: EmployeeCountValidationResult;
  paymentState: PaymentFlowState;
  authoritativeQuote: AuthoritativeOrderQuote | null;
  organizationName?: string;
  billingEmail?: string;
  onProceedToPayment: () => void;
  onOpenEnterpriseModal: () => void;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  estimate,
  validation,
  paymentState,
  authoritativeQuote,
  organizationName,
  billingEmail,
  onProceedToPayment,
  onOpenEnterpriseModal,
}) => {
  const isBusy =
    paymentState === "creating_order" ||
    paymentState === "opening_checkout" ||
    paymentState === "verifying_payment";

  const isProceedDisabled =
    isBusy || !validation.valid || paymentState === "already_subscribed";

  return (
    <aside
      aria-labelledby="checkout-summary-heading"
      data-testid="checkout-summary-card"
      className="rounded-2xl border border-slate-800/90 bg-[#111520] p-5 sm:p-6 shadow-md space-y-5"
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            Subscription Checkout
          </span>
          <h2
            id="checkout-summary-heading"
            className="mt-0.5 text-lg font-bold text-slate-100 tracking-tight"
          >
            Order & Billing Summary
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-700/80 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300">
          <Lock className="h-3 w-3 text-indigo-400" aria-hidden="true" />
          Razorpay Secured
        </span>
      </div>

      {/* Organization / Tenant Context */}
      {(organizationName || billingEmail) && (
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 px-3.5 py-2.5 text-xs space-y-1">
          {organizationName && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Organization</span>
              <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                {organizationName}
              </span>
            </div>
          )}
          {billingEmail && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Billing Account</span>
              <span className="font-medium text-slate-300 truncate max-w-[200px]">
                {billingEmail}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Breakdown Table */}
      <PricingBreakdown
        estimate={estimate}
        authoritativeQuote={authoritativeQuote}
      />

      {/* Primary Action Button */}
      {estimate.isCustom ? (
        <button
          type="button"
          onClick={onOpenEnterpriseModal}
          data-testid="checkout-contact-sales-btn"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 whitespace-nowrap"
        >
          <Building2 className="h-4 w-4" aria-hidden="true" />
          <span>Contact Sales for Enterprise Contract</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onProceedToPayment}
          disabled={isProceedDisabled}
          data-testid="proceed-to-payment-btn"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
        >
          {isBusy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>
                {paymentState === "creating_order"
                  ? "Creating Secure Order..."
                  : paymentState === "opening_checkout"
                    ? "Opening Razorpay Checkout..."
                    : "Verifying Payment with Server..."}
              </span>
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              <span>Proceed to Secure Payment</span>
            </>
          )}
        </button>
      )}

      {/* Security & Verification Footnote */}
      <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        />
        <p>
          Orders are generated securely by the OFC360 billing server and activated only after cryptographic Razorpay signature verification.
        </p>
      </div>
    </aside>
  );
};
