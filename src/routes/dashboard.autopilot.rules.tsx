import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/autopilot/pages/PolicyRulesBuilderPage"));

export const Route = createFileRoute("/dashboard/autopilot/rules")({
  head: () => ({ meta: [{ title: "Policy Rules Builder — OFC360" }] }),
  component: PageComponent,
});
