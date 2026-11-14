import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentVendorsPage"));

export const Route = createFileRoute("/dashboard/recruitment/vendors")({
  head: () => ({ meta: [{ title: "Recruitment Vendors — OFC360" }] }),
  component: PageComponent,
});
