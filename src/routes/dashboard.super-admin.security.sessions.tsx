import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(
  () => import("@/features/superAdmin/pages/SuperAdminSecurityPage"),
);

export const Route = createFileRoute("/dashboard/super-admin/security/sessions")({
  head: () => ({ meta: [{ title: "Active Sessions — Super Admin — OFC360" }] }),
  component: PageComponent,
});
