import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoProjectsPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoProjectsPage"),
  "CtoProjectsPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/projects")({
  head: () => ({ meta: [{ title: "Project Portfolio — Aurix CTO" }] }),
  component: CtoProjectsPage,
});
