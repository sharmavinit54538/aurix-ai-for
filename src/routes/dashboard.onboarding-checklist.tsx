import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/onboarding-checklist")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/hr-operations/onboarding" });
  },
  component: () => null,
});
