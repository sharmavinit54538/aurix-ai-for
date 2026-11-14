import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoAiPlatformPage"));

export const Route = createFileRoute("/dashboard/executive/cto/ai")({
  head: () => ({ meta: [{ title: "AI & LLM Platform — OFC360" }] }),
  component: PageComponent,
});
