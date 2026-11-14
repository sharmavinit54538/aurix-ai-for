import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/superAdmin/pages/SuperAdminUsersPage"));

export const Route = createFileRoute("/dashboard/super-admin/users")({
  head: () => ({ meta: [{ title: "Platform Users — OFC360" }] }),
  component: PageComponent,
});
