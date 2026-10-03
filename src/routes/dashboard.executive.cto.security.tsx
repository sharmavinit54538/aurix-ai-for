import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/executive/cto/security")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/executive/cto" });
  },
  component: () => null,
});
