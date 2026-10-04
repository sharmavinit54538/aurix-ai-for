import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PolicyRulesBuilderPage = lazyFeaturePage(
  () => import("@/features/autopilot/pages/PolicyRulesBuilderPage"),
);

export const Route = createFileRoute("/dashboard/autopilot/rules")({
  head: () => ({
    meta: [
      { title: "Policy Rules Builder — Autopilot HR | OFC360" },
      { name: "description", content: "Build, configure, and dry-run if/then policy rules for autonomous HR decisions." },
    ],
  }),
  component: PolicyRulesBuilderPage,
});
