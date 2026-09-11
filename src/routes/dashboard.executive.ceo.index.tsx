import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoOverviewPage = lazyFeaturePage(
  () => import("@/features/ceo/pages/CeoOverviewPage"),
  "CeoOverviewPage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/")({
  head: () => ({ meta: [{ title: "CEO Executive Control Center — OFC360" }] }),
  component: CeoOverviewPage,
});
