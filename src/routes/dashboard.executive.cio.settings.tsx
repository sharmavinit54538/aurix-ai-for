import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cio/pages/CioSettingsPage"));

export const Route = createFileRoute("/dashboard/executive/cio/settings")({
  head: () => ({ meta: [{ title: "CIO Settings — OFC360" }] }),
  component: PageComponent,
});
