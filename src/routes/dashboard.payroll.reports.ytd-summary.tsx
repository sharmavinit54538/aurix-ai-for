import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/YtdPayrollReport"));

export const Route = createFileRoute("/dashboard/payroll/reports/ytd-summary")({
  head: () => ({ meta: [{ title: "YTD Payroll Summary — OFC360" }] }),
  component: PageComponent,
});
