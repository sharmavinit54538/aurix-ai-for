import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AgentChatPage = lazyFeaturePage(
  () => import("@/features/autopilot/pages/AgentChatPage"),
);

export const Route = createFileRoute("/dashboard/autopilot/agent")({
  head: () => ({
    meta: [
      { title: "HR Agent that ACTS — Autopilot HR | OFC360" },
      { name: "description", content: "Natural language autonomous HR agent executing routine workforce operations with policy validation and confirmation cards." },
    ],
  }),
  component: AgentChatPage,
});
