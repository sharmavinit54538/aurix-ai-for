import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/CompensationOfferBuilderPage"),
  "CompensationOfferBuilderPage",
);

export const Route = createFileRoute("/dashboard/recruitment/compensation")({
  head: () => ({ meta: [{ title: "Compensation & Offer Builder — Recruitment" }] }),
  component: Page,
});
