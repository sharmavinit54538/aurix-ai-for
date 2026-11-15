import React from "react";
import { AlertTriangle, CheckCircle2, Calculator } from "lucide-react";
import { formatINR } from "../utils/pricingCalculator";
import type {
  AuthoritativeOrderQuote,
  PricingBreakdownEstimate,
} from "../types/billingTypes";

export interface PricingBreakdownProps {
  estimate: PricingBreakdownEstimate;
  authoritativeQuote?: AuthoritativeOrderQuote | null;
}

export const PricingBreakdown: React.FC<PricingBreakdownProps> = ({
  estimate,
  authoritativeQuote,
}) => {
  if (estimate.isCustom) {
    return (
      <div
        data-testid="pricing-breakdown-enterprise"
        className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Selected Tier
          </span>
          <span className="text-sm font-bold text-slate-100">Enterprise</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Starting Contract Base</span>
          <span className="font-semibold tabular-nums">₹9,999+/month</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Target Employee Headcount</span>
          <span className="font-semibold tabular-nums">
            {estimate.selectedEmployees.toLocaleString("en-IN")} employees
          </span>
        </div>
        <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
          Enterprise subscriptions are provisioned through a custom contract. ₹9,999+/month is a starting guide and not a fixed self-serve checkout price.
        </p>
      </div>
    );
  }

  const hasOrderQuote = Boolean(authoritativeQuote);

  return (
    <div
      data-testid="pricing-breakdown-panel"
      className="rounded-xl border border-slate-800/90 bg-slate-950/80 p-4 sm:p-5 space-y-3.5"
    >
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-indigo-400" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-slate-100">
            Live Pricing Breakdown
          </h3>
        </div>
        <span className="rounded bg-slate-800/90 px-2 py-0.5 text-[11px] font-medium text-slate-300">
          Monthly Billing
        </span>
      </div>

      <dl className="space-y-2.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-400">Selected Plan</dt>
          <dd
            data-testid="breakdown-selected-plan"
            className="font-semibold text-slate-100"
          >
            {estimate.planName}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-slate-400">Included Employees</dt>
          <dd
            data-testid="breakdown-included-employees"
            className="font-medium text-slate-200 tabular-nums"
          >
            {estimate.includedEmployees}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-slate-400">Total Selected Employees</dt>
          <dd
            data-testid="breakdown-selected-employees"
            className="font-semibold text-slate-100 tabular-nums"
          >
            {estimate.selectedEmployees}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-slate-400">Extra Employees</dt>
          <dd
            data-testid="breakdown-extra-employees"
            className="font-semibold text-indigo-300 tabular-nums"
          >
            {estimate.extraEmployees}
          </dd>
        </div>

        <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between">
          <dt className="text-slate-300">
            Base Plan ({estimate.includedEmployees} employees)
          </dt>
          <dd
            data-testid="breakdown-base-amount"
            className="font-semibold text-slate-100 tabular-nums"
          >
            {formatINR(estimate.basePlanAmount)}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="text-slate-300">
            Additional Employees ({estimate.extraEmployees} ×{" "}
            {formatINR(estimate.perEmployeeRate)})
          </dt>
          <dd
            data-testid="breakdown-extra-amount"
            className="font-semibold text-slate-100 tabular-nums"
          >
            {formatINR(estimate.additionalEmployeeAmount)}
          </dd>
        </div>

        <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between">
          <dt className="font-medium text-slate-200">
            Monthly Subtotal (Estimate)
          </dt>
          <dd
            data-testid="breakdown-monthly-subtotal"
            className="text-base font-bold text-white tabular-nums"
          >
            {formatINR(estimate.monthlySubtotal)}/month
          </dd>
        </div>

        {/* Taxes Row */}
        <div className="flex items-center justify-between text-xs">
          <dt className="text-slate-400">Taxes & Statutory Levies</dt>
          <dd
            data-testid="breakdown-taxes"
            className="font-medium text-slate-300 tabular-nums"
          >
            {hasOrderQuote && authoritativeQuote?.taxesRupees !== null && authoritativeQuote?.taxesRupees !== undefined
              ? formatINR(authoritativeQuote.taxesRupees)
              : "Calculated by backend at order creation"}
          </dd>
        </div>

        {/* Discount Row if returned by backend */}
        {hasOrderQuote &&
          authoritativeQuote?.discountRupees !== null &&
          authoritativeQuote?.discountRupees !== undefined &&
          authoritativeQuote.discountRupees > 0 && (
            <div className="flex items-center justify-between text-xs text-emerald-300">
              <dt>Applied Discount / Proration</dt>
              <dd className="font-semibold tabular-nums">
                -{formatINR(authoritativeQuote.discountRupees)}
              </dd>
            </div>
          )}

        {/* Authoritative Final Payable Row */}
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/25 p-3 flex items-center justify-between">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Final Payable Amount
            </dt>
            <p className="text-[11px] text-slate-400">
              {hasOrderQuote
                ? `Confirmed by backend order (${authoritativeQuote?.orderId})`
                : "Authoritative total confirmed by backend before payment"}
            </p>
          </div>
          <dd
            data-testid="breakdown-final-payable"
            className="text-lg font-extrabold text-white tabular-nums"
          >
            {hasOrderQuote && authoritativeQuote
              ? formatINR(authoritativeQuote.finalPayableRupees)
              : `${formatINR(estimate.monthlySubtotal)}*`}
          </dd>
        </div>
      </dl>

      {/* Discrepancy Notice when Backend Order Total Differs from Frontend Estimate */}
      {hasOrderQuote && authoritativeQuote?.differsFromEstimate && (
        <div
          role="status"
          data-testid="backend-estimate-discrepancy-notice"
          className="flex items-start gap-2.5 rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-200"
        >
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
            aria-hidden="true"
          />
          <div className="space-y-0.5">
            <p className="font-semibold text-amber-100">
              Backend Order Total Updated ({formatINR(authoritativeQuote.finalPayableRupees)})
            </p>
            <p className="text-amber-200/90">
              {authoritativeQuote.differenceReason ||
                "The backend billing engine returned an updated final payable amount based on applicable taxes or account rules."}
            </p>
          </div>
        </div>
      )}

      {hasOrderQuote && authoritativeQuote && !authoritativeQuote.differsFromEstimate && (
        <div className="flex items-center gap-2 text-[11px] text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span>
            Backend order total matches your {formatINR(estimate.monthlySubtotal)} estimate.
          </span>
        </div>
      )}
    </div>
  );
};
