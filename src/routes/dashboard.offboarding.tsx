import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/offboarding")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/hr-operations/offboarding" });
  },
  component: () => null,
});
