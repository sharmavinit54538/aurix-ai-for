import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentCRMPage"),
  "RecruitmentCRMPage",
);

export const Route = createFileRoute("/dashboard/recruitment/crm")({
  head: () => ({ meta: [{ title: "CRM — Recruitment" }] }),
  component: Page,
});
