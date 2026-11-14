import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/ReferralsPage"));

export const Route = createFileRoute("/dashboard/recruitment/referrals")({
  head: () => ({ meta: [{ title: "Employee Referrals — OFC360" }] }),
  component: PageComponent,
});
