import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/executive/pages/CfoDashboardPage"));

export const Route = createFileRoute("/dashboard/executive/cfo")({
  head: () => ({ meta: [{ title: "CFO Portal — OFC360" }] }),
  component: PageComponent,
});
