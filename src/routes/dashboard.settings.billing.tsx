import { createFileRoute } from "@tanstack/react-router";
import { BillingSubscriptionPage } from "@/features/billing/pages/BillingSubscriptionPage";

export const Route = createFileRoute("/dashboard/settings/billing")({
  head: () => ({ meta: [{ title: "Billing Settings — OFC360" }] }),
  component: BillingSubscriptionPage,
});
