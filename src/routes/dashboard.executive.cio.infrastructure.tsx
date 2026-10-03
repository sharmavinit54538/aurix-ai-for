import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/executive/cio/infrastructure")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/executive/cio" });
  },
  component: () => null,
});
