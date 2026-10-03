import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/executive/ceo/operations")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/executive/ceo" });
  },
  component: () => null,
});
