import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/payroll/runs/$runId/employee/$employeeId/payslip"
)({
  head: () => ({ meta: [{ title: "Final Payslip — OFC360" }] }),
  component: PayrollPayslipRedirect,
});

function PayrollPayslipRedirect() {
  const { runId, employeeId } = useParams({ strict: false }) as {
    runId?: string;
    employeeId?: string;
  };
  return (
    <Navigate
      to={
        `/dashboard/payroll/runs/${runId || ""}/employees/${employeeId || ""}/payslip` as any
      }
      replace
    />
  );
}
