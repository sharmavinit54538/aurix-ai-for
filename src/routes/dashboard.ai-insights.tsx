import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/ai-insights")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/analytics/ai-insights" });
  },
  component: () => null,
});
