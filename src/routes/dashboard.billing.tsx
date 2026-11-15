import { createFileRoute } from "@tanstack/react-router";
import { BillingSubscriptionPage } from "@/features/billing/pages/BillingSubscriptionPage";

export const Route = createFileRoute("/dashboard/billing")({
  head: () => ({ meta: [{ title: "Billing & Subscription — OFC360" }] }),
  component: BillingSubscriptionPage,
});
