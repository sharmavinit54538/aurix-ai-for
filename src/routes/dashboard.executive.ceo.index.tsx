import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoDashboardPage = lazyFeaturePage(
  () => import("@/features/executive/pages/CeoDashboardPage"),
  "CeoDashboardPage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/")({
  head: () => ({ meta: [{ title: "CEO Executive Control Center — OFC360" }] }),
  component: CeoDashboardPage,
});
