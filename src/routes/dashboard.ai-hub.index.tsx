import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const AIHubDashboard = lazyFeaturePage(
  () => import("./ai.index") as any,
  "AIHubDashboard"
);

export const Route = createFileRoute("/dashboard/ai-hub/")({
  head: () => ({ meta: [{ title: "AI Hub — Aurix" }] }),
  component: AIHubDashboard,
});
