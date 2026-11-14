import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/itAdmin/pages/ItAdminPage"));

export const Route = createFileRoute("/dashboard/it-admin")({
  head: () => ({ meta: [{ title: "IT Administration — OFC360" }] }),
  component: PageComponent,
});
