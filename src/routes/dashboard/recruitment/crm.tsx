import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentCRMPage"));

export const Route = createFileRoute("/dashboard/recruitment/crm")({
  head: () => ({ meta: [{ title: "Candidate CRM — OFC360" }] }),
  component: PageComponent,
});
