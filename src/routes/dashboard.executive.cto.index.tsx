import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoPortalPage"));

export const Route = createFileRoute("/dashboard/executive/cto/")({
  head: () => ({ meta: [{ title: "CTO Control Center — OFC360" }] }),
  component: PageComponent,
});
