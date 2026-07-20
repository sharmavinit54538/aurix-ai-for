import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/ai-hub")({
  head: () => ({ meta: [{ title: "AI Hub — Aurix" }] }),
  component: AIHubLayout,
});

function AIHubLayout() {
  return <Outlet />;
}
