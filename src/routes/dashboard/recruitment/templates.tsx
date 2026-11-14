import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentTemplatesPage"));

export const Route = createFileRoute("/dashboard/recruitment/templates")({
  head: () => ({ meta: [{ title: "Templates — OFC360" }] }),
  component: PageComponent,
});
