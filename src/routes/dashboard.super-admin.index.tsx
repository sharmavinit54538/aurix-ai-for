import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/superAdmin/pages/SuperAdminOverviewPage"));

export const Route = createFileRoute("/dashboard/super-admin/")({
  head: () => ({ meta: [{ title: "Platform Overview — OFC360" }] }),
  component: PageComponent,
});
