import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AILeaveAssistantPage = lazyFeaturePage(() => import("@/features/ai-leave/pages/AILeaveAssistantPage"));

export const Route = createFileRoute("/ai/leave-assistant")({
  head: () => ({ meta: [{ title: "AI Leave Assistant — Aurix" }] }),
  component: AILeaveAssistantPage,
});
