import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/PayrollReportsPage"));

export const Route = createFileRoute("/dashboard/payroll/reports/")({
  head: () => ({ meta: [{ title: "Payroll Reports & Analytics — OFC360" }] }),
  component: PageComponent,
});
