import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/superAdmin/pages/SuperAdminActivityPage"));

export const Route = createFileRoute("/dashboard/super-admin/activity")({
  head: () => ({ meta: [{ title: "System Activity — OFC360" }] }),
  component: PageComponent,
});
