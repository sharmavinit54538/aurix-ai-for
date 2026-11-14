import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/autopilot/pages/AgentChatPage"));

export const Route = createFileRoute("/dashboard/autopilot/agent")({
  head: () => ({ meta: [{ title: "HR Agent — OFC360" }] }),
  component: PageComponent,
});
