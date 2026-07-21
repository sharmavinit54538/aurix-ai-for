import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ChatAssistantPage = lazyFeaturePage(() => import("@/pages/ChatAssistantPage"));

export const Route = createFileRoute("/ai/chat-assistant")({
  head: () => ({ meta: [{ title: "AI Chat Assistant — Aurix" }] }),
  component: ChatAssistantPage,
});
