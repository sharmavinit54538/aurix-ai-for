import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, CreditCard, Download, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectBillingData, selectSettingsLoading } from "@/store/settings/settingsSelectors";
import { fetchBilling } from "@/store/settings/settingsThunk";

export const Route = createFileRoute("/dashboard/settings/billing")({
  head: () => ({ meta: [{ title: "Billing & Subscriptions — Aurix" }] }),
  component: BillingPage,
});

function BillingPage() {
  const dispatch = useAppDispatch();
  const billing = useAppSelector(selectBillingData);
  const loading = useAppSelector(selectSettingsLoading);

  useEffect(() => {
    dispatch(fetchBilling());
  }, [dispatch]);

  const handleUpgrade = () => {
    toast.info("Subscription plan upgrade request initiated.");
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

  const planName = billing?.currentPlan || "Enterprise AI Tier";
  const billingCycle = billing?.billingCycle || "Annual";
  const amount = billing?.amount || "₹ 49,999 / mo";
  const seats = billing?.seats || 350;
  const usedSeats = billing?.usedSeats || 142;
  const seatPct = Math.round((usedSeats / seats) * 100);
  const invoices = billing?.invoices || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Billing & Enterprise Plan</h2>
          <p className="text-xs text-muted-foreground">Manage your subscription, seat allocation, payment methods, and invoice history.</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-xs">
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> Active Subscription
        </Badge>
      </div>

      {/* Plan Card */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-20" style={{ background: "var(--gradient-brand)" }} />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Plan</div>
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
              <span>{usedSeats} / {seats} Seats Used ({seatPct}%)</span>
            </div>
            <Progress value={seatPct} className="h-2" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <div>Next renewal date: <span className="font-medium text-foreground">{billing?.nextBillingDate || "2026-12-31"}</span></div>
            <Button size="sm" onClick={handleUpgrade}>
              <Zap className="mr-2 h-4 w-4" /> Upgrade Seats
            </Button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <CreditCard className="h-4 w-4" /> Payment Method
            </div>
            <div className="mt-4 font-medium text-foreground">{billing?.paymentMethod || "Visa ending in •••• 4821"}</div>
            <div className="mt-1 text-xs text-muted-foreground">Auto-debit enabled for annual renewals.</div>
          </div>
          <Button variant="outline" size="sm" className="mt-6 w-full" onClick={() => toast.success("Payment method update opened")}>
            Update Payment Method
          </Button>
        </div>
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
                    <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20">{inv.status}</Badge>
                  </td>
                  <td className="text-right">
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Downloaded ${inv.id}`)}>
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
