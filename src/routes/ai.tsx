import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "AI Hub — Aurix" }] }),
  component: DashboardShell,
});
