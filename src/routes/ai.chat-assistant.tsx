import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ai/chat-assistant")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/ai-hub/assistant" });
  },
  component: () => null,
});
