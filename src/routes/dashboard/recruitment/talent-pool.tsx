import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/TalentPoolPage"),
  "TalentPoolPage",
);

export const Route = createFileRoute("/dashboard/recruitment/talent-pool")({
  head: () => ({ meta: [{ title: "Talent Pool — Recruitment" }] }),
  component: Page,
});
