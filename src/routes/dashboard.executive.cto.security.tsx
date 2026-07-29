import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoSecurityPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoSecurityPage"),
  "CtoSecurityPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/security")({
  head: () => ({ meta: [{ title: "Security Center — Aurix CTO" }] }),
  component: CtoSecurityPage,
});
