import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoDashboardPage = lazyFeaturePage(
  () => import("@/features/executive/pages/CtoDashboardPage"),
  "CtoDashboardPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/")({
  head: () => ({ meta: [{ title: "CTO Executive Control Center — OFC360" }] }),
  component: CtoDashboardPage,
});
