import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/HiringManagerRecruitmentPage"),
  "HiringManagerRecruitmentPage",
);

export const Route = createFileRoute("/dashboard/recruitment/hiring-manager")({
  head: () => ({ meta: [{ title: "Hiring Manager Hub — Recruitment" }] }),
  component: Page,
});
