import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/executive/cto/devops")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/executive/cto" });
  },
  component: () => null,
});
