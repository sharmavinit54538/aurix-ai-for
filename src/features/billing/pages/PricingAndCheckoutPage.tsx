import React from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAurix } from "@/lib/aurix-store";
import { PricingAndBillingExperience } from "../components/PricingAndBillingExperience";

export const PricingAndCheckoutPage: React.FC = () => {
  const { user: currentUser } = useAurix();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <header className="flex flex-col gap-5 border-b border-slate-800/80 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
              <span>OFC360 Enterprise HRMS Subscription Pricing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Transparent Workforce Pricing Built for Scale
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Every self-serve plan includes up to{" "}
              <strong className="font-semibold text-slate-200 tabular-nums">
                50 employees
              </strong>{" "}
              in the base monthly subscription. Calculate your exact monthly cost by headcount and complete verified checkout via Razorpay.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser ? (
              <Link
                to="/dashboard/billing"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-100 hover:border-indigo-500/50 hover:bg-slate-800 whitespace-nowrap"
              >
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span>Open Organization Billing Console</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-100 hover:border-indigo-500/50 hover:bg-slate-800 whitespace-nowrap"
              >
                <span>Sign In to Organization Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </header>

        {/* Complete Pricing Calculator, Plan Cards & Razorpay Checkout Experience */}
        <PricingAndBillingExperience mode="public_pricing" />
      </div>
    </SiteLayout>
  );
};

export default PricingAndCheckoutPage;
