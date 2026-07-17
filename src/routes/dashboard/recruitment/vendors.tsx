import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentVendorsPage"),
  "RecruitmentVendorsPage",
);

export const Route = createFileRoute("/dashboard/recruitment/vendors")({
  head: () => ({ meta: [{ title: "Vendors — Recruitment" }] }),
  component: Page,
});
