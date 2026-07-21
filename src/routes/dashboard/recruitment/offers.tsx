import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/OffersPage"),
  "OffersPage",
);

export const Route = createFileRoute("/dashboard/recruitment/offers")({
  head: () => ({ meta: [{ title: "Offers — Recruitment" }] }),
  component: Page,
});
