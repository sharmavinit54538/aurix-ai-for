import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/TalentPoolPage"));

export const Route = createFileRoute("/dashboard/recruitment/talent-pool")({
  head: () => ({ meta: [{ title: "Talent Pool — OFC360" }] }),
  component: PageComponent,
});
