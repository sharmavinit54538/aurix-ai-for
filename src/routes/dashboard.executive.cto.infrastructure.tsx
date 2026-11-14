import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoInfrastructurePage"));

export const Route = createFileRoute("/dashboard/executive/cto/infrastructure")({
  head: () => ({ meta: [{ title: "Infrastructure Hub — OFC360" }] }),
  component: PageComponent,
});
