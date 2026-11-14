import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/superAdmin/pages/SuperAdminOrganizationsPage"));

export const Route = createFileRoute("/dashboard/super-admin/organizations")({
  head: () => ({ meta: [{ title: "Organizations — OFC360" }] }),
  component: PageComponent,
});
