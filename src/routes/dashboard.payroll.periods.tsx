import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PayrollPeriodsPage = lazyFeaturePage(
  () => import("@/pages/PayrollPeriodsPage")
);

export const Route = createFileRoute("/dashboard/payroll/periods")({
  head: () => ({ meta: [{ title: "Payroll Periods — OFC360" }] }),
  component: PayrollPeriodsPage,
});
