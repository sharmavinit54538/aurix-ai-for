import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/superAdmin/pages/SuperAdminPlatformConfigPage"));

export const Route = createFileRoute("/dashboard/super-admin/platform-config")({
  head: () => ({ meta: [{ title: "Platform Configuration — OFC360" }] }),
  component: PageComponent,
});
