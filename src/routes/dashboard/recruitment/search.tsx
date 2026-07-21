import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentSearchPage"),
  "RecruitmentSearchPage",
);

export const Route = createFileRoute("/dashboard/recruitment/search")({
  head: () => ({ meta: [{ title: "Search — Recruitment" }] }),
  component: Page,
});
