import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/superAdmin/pages/SuperAdminSettingsPage"));

export const Route = createFileRoute("/dashboard/super-admin/settings")({
  head: () => ({ meta: [{ title: "Platform Settings — OFC360" }] }),
  component: PageComponent,
});
