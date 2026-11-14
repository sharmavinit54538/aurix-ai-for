import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/itAdmin/pages/ItAdminPage"));

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({ meta: [{ title: "System Controls — OFC360" }] }),
  component: PageComponent,
});
