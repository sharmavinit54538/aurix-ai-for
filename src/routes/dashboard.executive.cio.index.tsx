import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioOverviewPage = lazyFeaturePage(
  () => import("@/features/cio/pages/CioOverviewPage"),
  "CioOverviewPage"
);

export const Route = createFileRoute("/dashboard/executive/cio/")({
  head: () => ({ meta: [{ title: "CIO IT Executive Hub — OFC360" }] }),
  component: CioOverviewPage,
});
