import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/timeline")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/hr-operations/timeline" });
  },
  component: () => null,
});
