import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoEngineeringPage"));

export const Route = createFileRoute("/dashboard/executive/cto/engineering")({
  head: () => ({ meta: [{ title: "Engineering Hub — OFC360" }] }),
  component: PageComponent,
});
