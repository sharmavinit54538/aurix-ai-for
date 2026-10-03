import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/exit-management")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/hr-operations/exit-management" });
  },
  component: () => null,
});
