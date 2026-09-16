import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, CreditCard, Download, RefreshCw, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectBillingSettings,
  selectSettingsErrors,
  selectSettingsLoading,
  selectSettingsOperationLoading,
  selectSubscriptionPlans,
} from "@/store/settings/settingsSelectors";
import {
  cancelSubscription,
  fetchBillingSettings,
  fetchSubscriptionPlans,
  upgradeSubscription,
} from "@/store/settings/settingsThunk";
import type { SubscriptionPlan } from "@/store/settings/settingsTypes";

export const Route = createFileRoute("/dashboard/settings/billing")({
  head: () => ({ meta: [{ title: "Billing & Subscriptions — OFC360" }] }),
  component: BillingPage,
});

function BillingPage() {
  const dispatch = useAppDispatch();
  const billing = useAppSelector(selectBillingSettings);
  const subscriptionPlans = useAppSelector(selectSubscriptionPlans);
  const loading = useAppSelector(selectSettingsLoading);
  const errors = useAppSelector(selectSettingsErrors);
  const opLoading = useAppSelector(selectSettingsOperationLoading);

  useEffect(() => {
    dispatch(fetchBillingSettings());
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    try {
      await dispatch(upgradeSubscription({ planId: plan.id })).unwrap();
      toast.success(`Upgraded to ${plan.name} plan successfully!`);
      dispatch(fetchBillingSettings());
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to upgrade subscription");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your current subscription?")) return;
    try {
      await dispatch(cancelSubscription({ reason: "User cancelled from billing page" })).unwrap();
      toast.info("Subscription cancelled successfully.");
      dispatch(fetchBillingSettings());
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to cancel subscription");
    }
  };

  if (loading && !billing) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const planName = billing?.currentPlan || "No Active Plan";
  const billingCycle = billing?.billingCycle || "N/A";
  const amount = billing?.amount || "N/A";
  const seats = billing?.seats || 0;
  const usedSeats = billing?.usedSeats || 0;
  const seatPct = seats > 0 ? Math.min(100, Math.round((usedSeats / seats) * 100)) : 0;
  const invoices = billing?.invoices || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Billing & Enterprise Plan</h2>
          <p className="text-xs text-muted-foreground">
            Manage your subscription, seat allocation, payment methods, and invoice history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {errors.billing && (
            <Button size="sm" variant="outline" onClick={() => dispatch(fetchBillingSettings())}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
            </Button>
          )}
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> Active Subscription
          </Badge>
        </div>
      </div>

      {/* Plan Card */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl lg:col-span-2">
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-20"
            style={{ background: "var(--gradient-brand)" }}
          />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Plan
              </div>
              <div className="font-display text-2xl font-bold tracking-tight">{planName}</div>
            </div>
            <div className="text-right">
              <div className="font-display text-xl font-bold">{amount}</div>
              <div className="text-xs text-muted-foreground">Billed {billingCycle}</div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Employee Seat Allocation</span>
              <span>
                {usedSeats} / {seats} Seats Used ({seatPct}%)
              </span>
            </div>
            <Progress value={seatPct} className="h-2" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <div>
              Next renewal date:{" "}
              <span className="font-medium text-foreground">
                {billing?.nextBillingDate || "N/A"}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleCancel}
              disabled={opLoading.cancelSubscription}
            >
              Cancel Subscription
            </Button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <CreditCard className="h-4 w-4" /> Payment Method
            </div>
            <div className="mt-4 font-medium text-foreground">
              {billing?.paymentMethod || "No payment method configured"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Auto-debit enabled for scheduled renewals.
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-6 w-full"
            onClick={() => toast.info("Payment method update opened")}
          >
            Update Payment Method
          </Button>
        </div>
      </div>

      {/* Subscription Plans Selection */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
        <h3 className="text-sm font-semibold tracking-tight">Available Subscription Plans</h3>
        {subscriptionPlans.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No subscription plans available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  plan.current
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border/60 bg-background/40 hover:border-primary/40"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Popular
                  </span>
                )}
                <div>
                  <div className="font-semibold text-sm text-foreground">{plan.name}</div>
                  <div className="mt-2 font-display text-2xl font-bold text-foreground">
                    {typeof plan.price === "number"
                      ? `₹ ${plan.price.toLocaleString()}`
                      : plan.price}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{plan.billingCycle || "mo"}
                    </span>
                  </div>
                  {plan.seats && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Up to {plan.seats} employee seats
                    </div>
                  )}

                  <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                    {plan.features?.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-border/60">
                  {plan.current ? (
                    <Button size="sm" variant="secondary" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleUpgrade(plan)}
                      disabled={opLoading.upgradeSubscription}
                    >
                      <Zap className="mr-1.5 h-3.5 w-3.5" /> Upgrade Plan
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice History */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold tracking-tight">Invoice & Payment History</h3>
        {invoices.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">No invoices found.</div>
        ) : (
          <table className="w-full text-xs">
            <thead className="border-b border-border/60 uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2.5 text-left">Invoice ID</th>
                <th className="text-left">Billing Date</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 font-mono font-medium">{inv.id}</td>
                  <td className="text-muted-foreground">{inv.date}</td>
                  <td className="font-semibold text-foreground">{inv.amount}</td>
                  <td>
                    <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => toast.success(`Downloaded ${inv.id}`)}
                    >
                      <Download className="mr-1 h-3.5 w-3.5" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
