import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/HiringManagerRecruitmentPage"));

export const Route = createFileRoute("/dashboard/recruitment/hiring-manager")({
  head: () => ({ meta: [{ title: "Hiring Manager Hub — OFC360" }] }),
  component: PageComponent,
});
