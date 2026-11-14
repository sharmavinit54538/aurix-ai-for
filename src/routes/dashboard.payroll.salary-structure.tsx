import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/SalaryStructurePage"));

export const Route = createFileRoute("/dashboard/payroll/salary-structure")({
  head: () => ({ meta: [{ title: "Salary Structure — OFC360" }] }),
  component: PageComponent,
});
