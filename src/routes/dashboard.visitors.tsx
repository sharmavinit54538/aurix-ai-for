import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/visitors")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/hr-operations/visitor-management" });
  },
  component: () => null,
});
