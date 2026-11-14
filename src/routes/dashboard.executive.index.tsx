import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/executive/pages/ExecutiveHubPage"));

export const Route = createFileRoute("/dashboard/executive/")({
  head: () => ({ meta: [{ title: "Executive Hub — OFC360" }] }),
  component: PageComponent,
});
