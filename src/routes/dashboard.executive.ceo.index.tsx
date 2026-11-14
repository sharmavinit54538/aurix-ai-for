import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/ceo/pages/CeoOverviewPage"));

export const Route = createFileRoute("/dashboard/executive/ceo/")({
  head: () => ({ meta: [{ title: "CEO Overview — OFC360" }] }),
  component: PageComponent,
});
