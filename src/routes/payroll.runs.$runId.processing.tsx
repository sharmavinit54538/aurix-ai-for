import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/payroll/runs/$runId/processing")({
  head: () => ({ meta: [{ title: "Payroll Processing — OFC360" }] }),
  component: PayrollProcessingRedirect,
});

function PayrollProcessingRedirect() {
  const { runId } = useParams({ strict: false }) as { runId?: string };
  return (
    <Navigate
      to={`/dashboard/payroll/runs/${runId || ""}/processing` as any}
      replace
    />
  );
}
