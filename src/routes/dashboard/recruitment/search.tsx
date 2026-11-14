import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentSearchPage"));

export const Route = createFileRoute("/dashboard/recruitment/search")({
  head: () => ({ meta: [{ title: "Talent Search — OFC360" }] }),
  component: PageComponent,
});
