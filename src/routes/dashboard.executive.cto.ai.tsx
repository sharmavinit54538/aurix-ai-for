import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoAiPlatformPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoAiPlatformPage"),
  "CtoAiPlatformPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/ai")({
  head: () => ({ meta: [{ title: "AI & LLM Platform — Aurix CTO" }] }),
  component: CtoAiPlatformPage,
});
