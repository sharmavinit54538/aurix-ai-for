import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const ChatAssistantPage = lazyFeaturePage(
  () => import("./ai.chat-assistant") as any,
  "ChatAssistantPage"
);

export const Route = createFileRoute("/dashboard/ai-hub/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — Aurix" }] }),
  component: ChatAssistantPage,
});
