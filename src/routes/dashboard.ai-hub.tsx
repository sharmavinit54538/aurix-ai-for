import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/ai-hub")({
  head: () => ({ meta: [{ title: "AI Hub — OFC360" }] }),
  component: AIHubLayout,
});

function AIHubLayout() {
  return <Outlet />;
}
