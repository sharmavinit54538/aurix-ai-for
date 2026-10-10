import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/travel")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/resources/travel" });
  },
  component: () => null,
});