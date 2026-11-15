import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { PricingCard } from "./PricingCard";
import type {
  MergedPricingPlan,
  OfficialPlanId,
  OrganizationSubscription,
} from "../types/billingTypes";

export interface PricingPlansProps {
  plans: MergedPricingPlan[];
  selectedPlanId: OfficialPlanId;
  employeeCount: number;
  currentSubscription?: OrganizationSubscription | null;
  isLoadingPlans: boolean;
  plansError: string | null;
  disabled?: boolean;
  onSelectPlan: (planId: OfficialPlanId) => void;
  onContactEnterpriseSales: () => void;
  onRetryPlans?: () => void;
}

function isPlanActiveOnSubscription(
  subscription: OrganizationSubscription | null | undefined,
  planId: OfficialPlanId
): boolean {
  if (!subscription) return false;
  const status = String(
    subscription.status || subscription.access_status || subscription.payment_status || ""
  )
    .trim()
    .toLowerCase();
  if (status !== "active" && status !== "paid" && status !== "verified") {
    return false;
  }
  const rawPlan = String(
    subscription.plan_id || subscription.plan_name || subscription.plan || ""
  )
    .trim()
    .toLowerCase();
  if (planId === "starter_hr") return rawPlan.includes("starter");
  if (planId === "business_hr") return rawPlan.includes("business");
  if (planId === "enterprise") return rawPlan.includes("enterprise");
  return false;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({
  plans,
  selectedPlanId,
  employeeCount,
  currentSubscription,
  isLoadingPlans,
  plansError,
  disabled = false,
  onSelectPlan,
  onContactEnterpriseSales,
  onRetryPlans,
}) => {
  return (
    <section aria-labelledby="pricing-plans-heading" className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="pricing-plans-heading"
            className="text-xl font-bold text-slate-100 tracking-tight"
          >
            Select Your OFC360 Plan
          </h2>
          <p className="text-xs text-slate-400">
            All self-serve plans include 50 employees in the base monthly fee. Choose Business HR for full payroll & compliance automation.
          </p>
        </div>

        {plansError && onRetryPlans && (
          <div
            data-testid="plans-api-warning"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-1.5 text-xs text-amber-200"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>{plansError}</span>
            <button
              type="button"
              onClick={onRetryPlans}
              className="ml-1 inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-900/30 px-2 py-0.5 text-[11px] font-medium text-amber-100 hover:bg-amber-900/50 whitespace-nowrap"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          </div>
        )}
      </div>

      {/* 3-Column Pricing Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            employeeCount={employeeCount}
            isSelected={selectedPlanId === plan.id}
            isCurrentActivePlan={isPlanActiveOnSubscription(currentSubscription, plan.id)}
            isLoadingBackendPlans={isLoadingPlans}
            disabled={disabled}
            onSelectPlan={onSelectPlan}
            onContactEnterpriseSales={onContactEnterpriseSales}
          />
        ))}
      </div>
    </section>
  );
};
