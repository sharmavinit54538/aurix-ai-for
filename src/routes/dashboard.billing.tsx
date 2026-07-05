import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/billing")({
  head: () => ({ meta: [{ title: "Billing — Aurix" }] }),
  component: BillingPage,
});

function BillingPage() {
  return (
    <>
      <PageHeader title="Billing" description="Plan, invoices, and payment methods." />
      <ComingSoon title="Billing & invoices" description="Manage your subscription, download invoices, and update payment methods." icon={CreditCard} />
    </>
  );
}
