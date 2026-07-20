import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingRedirect,
});

function BillingRedirect() {
  return <Navigate to="/dashboard/settings/billing" replace />;
}
