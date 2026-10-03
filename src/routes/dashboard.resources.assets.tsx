import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/resources/assets")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/assets" });
  },
  component: () => null,
});
