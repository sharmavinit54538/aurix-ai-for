import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoInfrastructurePage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoInfrastructurePage"),
  "CtoInfrastructurePage"
);

export const Route = createFileRoute("/dashboard/executive/cto/infrastructure")({
  head: () => ({ meta: [{ title: "Infrastructure Hub — OFC360 CTO" }] }),
  component: CtoInfrastructurePage,
});
