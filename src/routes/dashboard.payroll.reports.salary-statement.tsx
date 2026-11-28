import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/SalaryStatementReport"));

export const Route = createFileRoute("/dashboard/payroll/reports/salary-statement")({
  head: () => ({ meta: [{ title: "Salary Statement — OFC360" }] }),
  component: PageComponent,
});
