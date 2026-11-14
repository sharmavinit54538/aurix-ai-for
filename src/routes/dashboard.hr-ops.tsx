import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/hr-ops")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/hr-operations/command-center" as any });
  },
});
