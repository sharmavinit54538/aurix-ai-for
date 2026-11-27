import React from "react";
import {
  ShieldCheck,
  Users,
  Calendar,
  ArrowUpRight,
  Info,
  CreditCard,
} from "lucide-react";
import { formatINR } from "../utils/pricingCalculator";
import { OFC360_SALES_EMAIL } from "./EnterpriseContactModal";
import type {
  OfficialPlanId,
  OrganizationSubscription,
  SavedPaymentMethod,
} from "../types/billingTypes";

export interface SubscriptionOverviewProps {
  subscription: OrganizationSubscription | null;
  paymentMethods: SavedPaymentMethod[];
  isLoading: boolean;
  error: string | null;
  onSelectPlanForUpgrade: (planId: OfficialPlanId, targetSeats?: number) => void;
}

export const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({
  subscription,
  paymentMethods,
  isLoading,
  error: _error,
  onSelectPlanForUpgrade,
}) => {
  const planDisplayName =
    subscription?.plan_name ||
    subscription?.plan ||
    subscription?.plan_id ||
    "No Active Subscription";

  const statusRaw =
    subscription?.status ||
    subscription?.access_status ||
    subscription?.payment_status ||
    "inactive";

  const isActive =
    statusRaw.toLowerCase() === "active" ||
    statusRaw.toLowerCase() === "paid" ||
    statusRaw.toLowerCase() === "verified";

  const employeeLimit =
    subscription?.employee_limit ??
    subscription?.max_employees ??
    subscription?.maxLicenses ??
    subscription?.seats ??
    null;

  const activeEmployees =
    subscription?.active_employees ??
    subscription?.used_seats ??
    subscription?.usedSeats ??
    subscription?.activeLicenses ??
    null;

  const nextBillingDate =
    subscription?.next_billing_date ||
    subscription?.nextBillingDate ||
    subscription?.current_period_end ||
    null;

  const currentAmount =
    subscription?.amount ?? subscription?.mrr ?? subscription?.base_amount ?? null;

  return (
    <section
      aria-labelledby="subscription-overview-heading"
      data-testid="subscription-overview-section"
      className="rounded-2xl border border-slate-800/90 bg-[#111520] p-5 sm:p-6 shadow-sm space-y-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            Organization Subscription State
          </span>
          <h2
            id="subscription-overview-heading"
            className="mt-0.5 text-lg font-bold text-slate-100"
          >
            Current Plan & Seat Entitlements
          </h2>
        </div>
      </div>

      {isLoading ? (
        <div
          data-testid="subscription-loading-skeleton"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="h-24 animate-pulse rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            />
          ))}
        </div>
      ) : !subscription ? (
        <div
          data-testid="subscription-empty-state"
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-xs text-slate-300 space-y-2"
        >
          <p className="text-sm font-semibold text-slate-100">
            No Active Paid Subscription
          </p>
          <p className="text-slate-400">
            Select a plan (Starter HR or Business HR) and your organization headcount below to activate your subscription via Razorpay Checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Current Plan */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Current Plan</span>
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
            </div>
            <p
              data-testid="sub-current-plan"
              className="mt-2 text-lg font-bold text-slate-100 capitalize"
            >
              {planDisplayName}
            </p>
            <p className="mt-1 text-xs text-slate-400 tabular-nums">
              {currentAmount !== null
                ? `${formatINR(currentAmount)} / ${subscription.billing_cycle || subscription.billingCycle || "month"}`
                : "Monthly subscription"}
            </p>
          </div>

          {/* Card 2: Active Employee Limit */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Employee Limit</span>
              <Users className="h-4 w-4 text-indigo-400" />
            </div>
            <p
              data-testid="sub-employee-limit"
              className="mt-2 text-lg font-bold text-slate-100 tabular-nums"
            >
              {employeeLimit !== null ? `${employeeLimit} Seats` : "50 Base Seats"}
            </p>
            <p className="mt-1 text-xs text-slate-400 tabular-nums">
              {activeEmployees !== null
                ? `${activeEmployees} active employees assigned`
                : "Base allowance includes 50 employees"}
            </p>
          </div>

          {/* Card 3: Subscription Status */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Subscription Status</span>
              <CreditCard className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                data-testid="sub-status-badge"
                className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  isActive
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                    : "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                }`}
              >
                {statusRaw}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              {paymentMethods.length > 0
                ? `Default method: ${paymentMethods[0].brand || paymentMethods[0].type} ${paymentMethods[0].last4 ? `•••• ${paymentMethods[0].last4}` : ""}`
                : "Verified via Razorpay Gateway"}
            </p>
          </div>

          {/* Card 4: Next Billing Date */}
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Next Billing Date</span>
              <Calendar className="h-4 w-4 text-indigo-400" />
            </div>
            <p
              data-testid="sub-next-billing-date"
              className="mt-2 text-lg font-bold text-slate-100 tabular-nums"
            >
              {nextBillingDate || "—"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {subscription.auto_renew || subscription.autoRenew
                ? "Auto-renewal active"
                : "Standard monthly cycle"}
            </p>
          </div>
        </div>
      )}

      {/* Actionable Controls & Backend Compatibility Notice */}
      <div className="flex flex-col gap-3 border-t border-slate-800/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              onSelectPlanForUpgrade(
                "business_hr",
                typeof employeeLimit === "number" && employeeLimit >= 50
                  ? employeeLimit
                  : 50
              )
            }
            data-testid="action-upgrade-business-btn"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 whitespace-nowrap"
          >
            <span>Upgrade / Renew Business HR</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              onSelectPlanForUpgrade(
                "business_hr",
                typeof employeeLimit === "number" && employeeLimit >= 50
                  ? employeeLimit + 10
                  : 60
              )
            }
            data-testid="action-add-seats-btn"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 whitespace-nowrap"
          >
            <span>Add Employee Seats (+10)</span>
          </button>
        </div>

        {/* Support contact note for plan downgrade/cancellation */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Info className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span>
            Need plan downgrade or cancellation? Contact{" "}
            <a
              href={`mailto:${OFC360_SALES_EMAIL}?subject=Subscription%20Change%20Request`}
              className="font-medium text-indigo-400 hover:underline"
            >
              {OFC360_SALES_EMAIL}
            </a>
            .
          </span>
        </div>
      </div>
    </section>
  );
};
