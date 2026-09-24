import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const EmployeeCompensationPage = lazyFeaturePage(
  () => import("@/features/payroll/pages/EmployeeCompensationPage"),
);

export const Route = createFileRoute("/dashboard/payroll/compensation")({
  head: () => ({ meta: [{ title: "Employee Compensation & Revisions — OFC360" }] }),
  component: EmployeeCompensationPage,
});
