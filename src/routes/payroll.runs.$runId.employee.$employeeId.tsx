import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/payroll/runs/$runId/employee/$employeeId"
)({
  head: () => ({ meta: [{ title: "Employee Payroll Detail — OFC360" }] }),
  component: PayrollEmployeeDetailRedirect,
});

function PayrollEmployeeDetailRedirect() {
  const { runId, employeeId } = useParams({ strict: false }) as {
    runId?: string;
    employeeId?: string;
  };
  return (
    <Navigate
      to={
        `/dashboard/payroll/runs/${runId || ""}/employees/${employeeId || ""}` as any
      }
      replace
    />
  );
}
