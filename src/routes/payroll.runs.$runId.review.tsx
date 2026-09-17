import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/payroll/runs/$runId/review")({
  head: () => ({ meta: [{ title: "Payroll Review & Approval — OFC360" }] }),
  component: PayrollReviewRedirect,
});

function PayrollReviewRedirect() {
  const { runId } = useParams({ strict: false }) as { runId?: string };
  return (
    <Navigate
      to={`/dashboard/payroll/runs/${runId || ""}/approval` as any}
      replace
    />
  );
}
