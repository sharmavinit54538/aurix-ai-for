import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/payroll/runs/$runId/validation")({
  head: () => ({ meta: [{ title: "Payroll Validation & Issues — OFC360" }] }),
  component: PayrollValidationRedirect,
});

function PayrollValidationRedirect() {
  const { runId } = useParams({ strict: false }) as { runId?: string };
  return (
    <Navigate
      to={`/dashboard/payroll/runs/${runId || ""}/validation` as any}
      replace
    />
  );
}
