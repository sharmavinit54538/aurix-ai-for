import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioDashboardPage = lazyFeaturePage(
  () => import("@/features/executive/pages/CioDashboardPage"),
  "CioDashboardPage"
);

export const Route = createFileRoute("/dashboard/executive/cio/")({
  head: () => ({ meta: [{ title: "CIO IT Executive Hub — OFC360" }] }),
  component: CioDashboardPage,
});
