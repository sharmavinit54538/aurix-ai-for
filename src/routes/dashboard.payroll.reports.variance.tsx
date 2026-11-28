import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/PayrollVarianceReport"));

export const Route = createFileRoute("/dashboard/payroll/reports/variance")({
  head: () => ({ meta: [{ title: "Payroll Variance Report — OFC360" }] }),
  component: PageComponent,
});
