import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/DepartmentWiseReport"));

export const Route = createFileRoute("/dashboard/payroll/reports/department-wise")({
  head: () => ({ meta: [{ title: "Department-wise Payroll — OFC360" }] }),
  component: PageComponent,
});
