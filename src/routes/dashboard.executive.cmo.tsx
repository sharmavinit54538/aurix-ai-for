import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/executive/pages/CmoDashboardPage"));

export const Route = createFileRoute("/dashboard/executive/cmo")({
  head: () => ({ meta: [{ title: "CMO Portal — OFC360" }] }),
  component: PageComponent,
});
