import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoDevelopersPage"));

export const Route = createFileRoute("/dashboard/executive/cto/developers")({
  head: () => ({ meta: [{ title: "Developers Directory — OFC360" }] }),
  component: PageComponent,
});
