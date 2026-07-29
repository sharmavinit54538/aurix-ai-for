import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoDevOpsPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoDevOpsPage"),
  "CtoDevOpsPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/devops")({
  head: () => ({ meta: [{ title: "DevOps & CI/CD Hub — Aurix CTO" }] }),
  component: CtoDevOpsPage,
});
