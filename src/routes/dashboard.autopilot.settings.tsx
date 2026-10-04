import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AutonomySettingsPage = lazyFeaturePage(
  () => import("@/features/autopilot/pages/AutonomySettingsPage"),
);

export const Route = createFileRoute("/dashboard/autopilot/settings")({
  head: () => ({
    meta: [
      { title: "Autonomy Settings — OneHR | OFC360" },
      { name: "description", content: "Configure autonomous execution thresholds and policy guardrails." },
    ],
  }),
  component: AutonomySettingsPage,
});
