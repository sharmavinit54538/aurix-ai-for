import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/payroll/runs/$runId/finalize")({
  head: () => ({ meta: [{ title: "Payroll Finalization — OFC360" }] }),
  component: PayrollFinalizeRedirect,
});

function PayrollFinalizeRedirect() {
  const { runId } = useParams({ strict: false }) as { runId?: string };
  return (
    <Navigate
      to={`/dashboard/payroll/runs/${runId || ""}/finalize` as any}
      replace
    />
  );
}
