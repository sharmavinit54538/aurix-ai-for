import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/expenses")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/resources/expenses" });
  },
  component: () => null,
});