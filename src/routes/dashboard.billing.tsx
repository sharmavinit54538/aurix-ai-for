import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/superAdmin/pages/SuperAdminSettingsPage"));

export const Route = createFileRoute("/dashboard/billing")({
  head: () => ({ meta: [{ title: "Billing — OFC360" }] }),
  component: PageComponent,
});
