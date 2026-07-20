import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/roles")({
  component: RolesRedirect,
});

function RolesRedirect() {
  return <Navigate to="/dashboard/settings/roles-permissions" replace />;
}
