import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/executive/cto/developers")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/executive/cto" });
  },
  component: () => null,
});
