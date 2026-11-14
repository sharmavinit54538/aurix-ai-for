import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RequisitionsPage"));

export const Route = createFileRoute("/dashboard/recruitment/requisitions")({
  head: () => ({ meta: [{ title: "Job Requisitions — OFC360" }] }),
  component: PageComponent,
});
