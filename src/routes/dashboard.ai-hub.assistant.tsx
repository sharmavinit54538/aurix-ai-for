import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ChatAssistantPage = lazyFeaturePage(() => import("@/pages/ChatAssistantPage"));

export const Route = createFileRoute("/dashboard/ai-hub/assistant")({
  head: () => ({ meta: [{ title: "Chat Assistant — Aurix" }] }),
  component: ChatAssistantPage,
});
