import React from "react";
import { CreditCard } from "lucide-react";
import { useAurix } from "@/lib/aurix-store";
import { PricingAndBillingExperience } from "../components/PricingAndBillingExperience";

export const BillingSubscriptionPage: React.FC = () => {
  const { user: currentUser, company: currentCompany } = useAurix();
  const orgName =
    currentCompany?.name ||
    currentUser?.company_name ||
    currentUser?.companyName ||
    "Organization Workspace";

  return (
    <div
      data-testid="workspace-billing-subscription-page"
      className="mx-auto max-w-7xl space-y-8 pb-12"
    >
      {/* Top Workspace Header */}
      <header className="flex flex-col gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Subscription & Payment Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Billing, Plans & Seat Management
          </h1>
          <p className="text-sm text-slate-400">
            Manage subscription tier, active employee seat limits, Razorpay order verification, and GST invoices for{" "}
            <span className="font-semibold text-slate-200">{orgName}</span>.
          </p>
        </div>
      </header>

      {/* Complete Workspace Subscription Overview, Pricing Calculator, Checkout & History */}
      <PricingAndBillingExperience mode="workspace_billing" />
    </div>
  );
};

export default BillingSubscriptionPage;
