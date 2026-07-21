import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/ReferralsPage"),
  "ReferralsPage",
);

export const Route = createFileRoute("/dashboard/recruitment/referrals")({
  head: () => ({ meta: [{ title: "Referrals — Recruitment" }] }),
  component: Page,
});
