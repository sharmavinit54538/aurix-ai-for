import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/payroll/runs/$runId/approval")({
  head: () => ({ meta: [{ title: "Payroll Review & Approval — OFC360" }] }),
  component: PayrollApprovalRedirect,
});

function PayrollApprovalRedirect() {
  const { runId } = useParams({ strict: false }) as { runId?: string };
  return (
    <Navigate
      to={`/dashboard/payroll/runs/${runId || ""}/approval` as any}
      replace
    />
  );
}
