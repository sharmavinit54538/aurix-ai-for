import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoSecurityPage"));

export const Route = createFileRoute("/dashboard/executive/cto/security")({
  head: () => ({ meta: [{ title: "Security Operations — OFC360" }] }),
  component: PageComponent,
});
