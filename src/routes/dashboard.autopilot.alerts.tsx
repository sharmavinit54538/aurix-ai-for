import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ProactiveAlertsPage = lazyFeaturePage(
  () => import("@/features/autopilot/pages/ProactiveAlertsPage"),
);

export const Route = createFileRoute("/dashboard/autopilot/alerts")({
  head: () => ({
    meta: [
      { title: "Proactive Alerts Center — OneHR | OFC360" },
      { name: "description", content: "Continuous AI monitoring of attrition risks, burnout patterns, attendance anomalies, and payroll variances." },
    ],
  }),
  component: ProactiveAlertsPage,
});
