import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const EmployeeSelfServicePayrollPage = lazyFeaturePage(
  () => import("@/features/payroll/pages/EmployeeSelfServicePayrollPage"),
);

export const Route = createFileRoute("/dashboard/employee/payroll")({
  head: () => ({
    meta: [
      { title: "My Payroll & Payslips — OFC360" },
      {
        name: "description",
        content: "Employee self-service payroll portal — view salary, download payslips, and review tax declarations.",
      },
    ],
  }),
  component: EmployeeSelfServicePayrollPage,
});
