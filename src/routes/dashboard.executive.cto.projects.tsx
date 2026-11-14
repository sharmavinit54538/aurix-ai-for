import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoProjectsPage"));

export const Route = createFileRoute("/dashboard/executive/cto/projects")({
  head: () => ({ meta: [{ title: "Engineering Projects — OFC360" }] }),
  component: PageComponent,
});
