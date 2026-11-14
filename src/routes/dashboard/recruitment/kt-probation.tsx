import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/KnowledgeTransferProbationPage"));

export const Route = createFileRoute("/dashboard/recruitment/kt-probation")({
  head: () => ({ meta: [{ title: "KT & Probation — OFC360" }] }),
  component: PageComponent,
});
