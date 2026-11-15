import { createFileRoute } from "@tanstack/react-router";
import { PricingAndCheckoutPage } from "@/features/billing/pages/PricingAndCheckoutPage";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing & Plans — OFC360" }] }),
  component: PricingAndCheckoutPage,
});
