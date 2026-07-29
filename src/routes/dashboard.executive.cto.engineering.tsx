import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoEngineeringPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoEngineeringPage"),
  "CtoEngineeringPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/engineering")({
  head: () => ({ meta: [{ title: "Engineering Hub — Aurix CTO" }] }),
  component: CtoEngineeringPage,
});
