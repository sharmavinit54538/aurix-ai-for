import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/resources/asset-management")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/asset-management" });
  },
  component: () => null,
});
