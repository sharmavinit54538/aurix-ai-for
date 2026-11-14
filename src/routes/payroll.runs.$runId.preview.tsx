import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/payroll/runs/$runId/preview")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/payroll" as any });
  },
});
