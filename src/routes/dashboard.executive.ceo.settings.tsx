import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/ceo/pages/CeoSettingsPage"));

export const Route = createFileRoute("/dashboard/executive/ceo/settings")({
  head: () => ({ meta: [{ title: "CEO Settings — OFC360" }] }),
  component: PageComponent,
});
