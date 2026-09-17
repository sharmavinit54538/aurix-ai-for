import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/payroll/runs/$runId/preview")({
  head: () => ({ meta: [{ title: "Payroll Preview — OFC360" }] }),
  component: PayrollPreviewRedirect,
});

function PayrollPreviewRedirect() {
  const { runId } = useParams({ strict: false }) as { runId?: string };
  return (
    <Navigate
      to={`/dashboard/payroll/runs/${runId || ""}/preview` as any}
      replace
    />
  );
}
