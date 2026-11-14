import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoSettingsPage"));

export const Route = createFileRoute("/dashboard/executive/cto/settings")({
  head: () => ({ meta: [{ title: "CTO Settings — OFC360" }] }),
  component: PageComponent,
});
