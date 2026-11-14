import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoDevOpsPage"));

export const Route = createFileRoute("/dashboard/executive/cto/devops")({
  head: () => ({ meta: [{ title: "DevOps & CI/CD — OFC360" }] }),
  component: PageComponent,
});
