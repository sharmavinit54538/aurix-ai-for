import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cio/pages/CioOverviewPage"));

export const Route = createFileRoute("/dashboard/executive/cio/")({
  head: () => ({ meta: [{ title: "CIO Overview — OFC360" }] }),
  component: PageComponent,
});
