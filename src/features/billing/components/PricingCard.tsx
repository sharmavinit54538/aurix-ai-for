import React from "react";
import { Check, Sparkles, Building2, ArrowRight, ShieldCheck } from "lucide-react";
import { calculatePlanEstimate, formatINR } from "../utils/pricingCalculator";
import type { MergedPricingPlan, OfficialPlanId } from "../types/billingTypes";

export interface PricingCardProps {
  plan: MergedPricingPlan;
  employeeCount: number;
  isSelected: boolean;
  isCurrentActivePlan: boolean;
  isLoadingBackendPlans: boolean;
  disabled?: boolean;
  onSelectPlan: (planId: OfficialPlanId) => void;
  onContactEnterpriseSales: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  employeeCount,
  isSelected,
  isCurrentActivePlan,
  isLoadingBackendPlans,
  disabled = false,
  onSelectPlan,
  onContactEnterpriseSales,
}) => {
  const estimate = calculatePlanEstimate(plan.id, employeeCount);
  const isBusinessPopular = Boolean(plan.isPopular);
  const isEnterprise = Boolean(plan.isCustom);

  const handlePrimaryAction = () => {
    if (isEnterprise) {
      onContactEnterpriseSales();
    } else {
      onSelectPlan(plan.id);
    }
  };

  return (
    <article
      data-testid={`pricing-card-${plan.id}`}
      className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
        isBusinessPopular
          ? isSelected
            ? "border-indigo-400 bg-[#141929] shadow-[0_0_35px_-10px_rgba(99,102,241,0.45)] ring-1 ring-indigo-400/50"
            : "border-indigo-500/70 bg-[#131826] shadow-[0_0_25px_-12px_rgba(99,102,241,0.3)]"
          : isSelected
            ? "border-indigo-500 bg-[#121622] ring-1 ring-indigo-500/40"
            : "border-slate-800/90 bg-[#0f131d] hover:border-slate-700"
      }`}
    >
      {/* Top Badge Row */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 min-h-[28px]">
          <div className="flex items-center gap-1.5">
            {plan.badge && (
              <span
                data-testid={`plan-badge-${plan.id}`}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-500/20 border border-indigo-400/40 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 whitespace-nowrap"
              >
                <Sparkles className="h-3 w-3 shrink-0 text-indigo-400" aria-hidden="true" />
                <span>{plan.badge}</span>
              </span>
            )}
            {isCurrentActivePlan && (
              <span
                data-testid={`active-plan-badge-${plan.id}`}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 whitespace-nowrap"
              >
                <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>Current Plan</span>
              </span>
            )}
          </div>

          {!isEnterprise && isSelected && (
            <span className="text-[11px] font-semibold text-indigo-400 whitespace-nowrap">
              Selected
            </span>
          )}
        </div>

        {/* Plan Name & Description */}
        <div className="mt-3">
          <h3 className="text-xl font-bold text-slate-100 tracking-tight">
            {plan.name}
          </h3>
          <p className="mt-1.5 text-sm text-slate-400 leading-relaxed min-h-[40px]">
            {plan.backendDescription || plan.tagline}
          </p>
        </div>

        {/* Base Price Block */}
        <div className="mt-5 pb-5 border-b border-slate-800/80">
          <div className="flex items-baseline gap-1.5">
            <span
              data-testid={`plan-base-price-${plan.id}`}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white tabular-nums"
            >
              {plan.basePriceDisplay}
            </span>
            <span className="text-sm font-medium text-slate-400">
              /{plan.billingPeriod}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {isEnterprise
              ? "Starting price for custom enterprise contract"
              : "Base monthly subscription"}
          </p>
        </div>

        {/* Employee Allowance & Additional Rate */}
        <dl className="mt-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-1">
            <dt className="text-slate-400">Included Employees</dt>
            <dd
              data-testid={`plan-included-employees-${plan.id}`}
              className="font-semibold text-slate-200 tabular-nums"
            >
              {typeof plan.includedEmployees === "number"
                ? `${plan.includedEmployees} employees`
                : "Custom"}
            </dd>
          </div>

          <div className="flex items-center justify-between py-1">
            <dt className="text-slate-400">Additional Employee</dt>
            <dd
              data-testid={`plan-extra-rate-${plan.id}`}
              className="font-semibold text-slate-200 tabular-nums"
            >
              {plan.additionalEmployeeDisplay}
            </dd>
          </div>

          {/* Live Calculated Estimate Box for Selected Headcount */}
          <div
            className={`mt-3 rounded-xl border p-3.5 ${
              isBusinessPopular
                ? "border-indigo-500/30 bg-indigo-950/25"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            {isEnterprise ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">
                    For {employeeCount.toLocaleString("en-IN")} employees
                  </span>
                  <span className="text-sm font-bold text-slate-100 tabular-nums">
                    Custom Quote
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tailored volume pricing, custom contract terms & dedicated onboarding.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 tabular-nums">
                    Estimate ({estimate.selectedEmployees} seats)
                  </span>
                  <span
                    data-testid={`plan-calculated-total-${plan.id}`}
                    className="text-base font-bold text-white tabular-nums"
                  >
                    {formatINR(estimate.monthlySubtotal)}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 tabular-nums">
                  <span>
                    Base {formatINR(estimate.basePlanAmount)} (50 incl.)
                  </span>
                  <span>
                    {estimate.extraEmployees > 0
                      ? `+ ${estimate.extraEmployees} × ${formatINR(estimate.perEmployeeRate)} = ${formatINR(estimate.additionalEmployeeAmount)}`
                      : "+ ₹0 extra seats"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </dl>

        {/* Backend-Driven Plan Entitlements */}
        <div className="mt-5 border-t border-slate-800/80 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Plan Specifications & Entitlements
          </p>

          {plan.hasBackendFeatureData && plan.backendFeatures.length > 0 ? (
            <ul
              data-testid={`plan-features-list-${plan.id}`}
              className="space-y-2 text-xs text-slate-300"
            >
              {plan.backendFeatures.map((feature, index) => (
                <li key={`${plan.id}-feat-${index}`} className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul
              data-testid={
                isLoadingBackendPlans
                  ? `plan-features-loading-${plan.id}`
                  : `plan-features-default-${plan.id}`
              }
              className="space-y-2 text-xs text-slate-300"
            >
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" aria-hidden="true" />
                <span>
                  {typeof plan.includedEmployees === "number"
                    ? `Includes ${plan.includedEmployees} active employee seats`
                    : "Custom organization employee seat capacity"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" aria-hidden="true" />
                <span>
                  {isEnterprise
                    ? "Custom per-employee contract billing"
                    : `Additional employees at ${plan.additionalEmployeeDisplay}`}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" aria-hidden="true" />
                <span>
                  {isEnterprise
                    ? "Dedicated enterprise sales & deployment agreement"
                    : "Monthly billing cycle with Razorpay verified checkout"}
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Primary CTA Button */}
      <div className="mt-6 pt-2">
        <button
          type="button"
          disabled={disabled}
          onClick={handlePrimaryAction}
          data-testid={`plan-cta-${plan.id}`}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition whitespace-nowrap ${
            isEnterprise
              ? "border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800"
              : isBusinessPopular
                ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                : isSelected
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "border border-slate-700 bg-slate-900/90 text-slate-100 hover:border-indigo-500/60 hover:bg-slate-800"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isEnterprise ? (
            <>
              <Building2 className="h-4 w-4" aria-hidden="true" />
              <span>{plan.ctaLabel}</span>
            </>
          ) : (
            <>
              <span>{isSelected ? `${plan.ctaLabel} (Selected)` : plan.ctaLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </article>
  );
};
