import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/EmployeeSelfServicePayrollPage"));

export const Route = createFileRoute("/dashboard/employee/payroll")({
  head: () => ({ meta: [{ title: "My Payroll — OFC360" }] }),
  component: PageComponent,
});
