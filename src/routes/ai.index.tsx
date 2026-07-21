import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AIHubDashboard = lazyFeaturePage(() => import("@/pages/AIHubDashboard"));

export const Route = createFileRoute("/ai/")({
  head: () => ({ meta: [{ title: "AI Hub — Aurix" }] }),
  component: AIHubDashboard,
});
