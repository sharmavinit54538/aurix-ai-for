import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PayrollDashboardPage = lazyFeaturePage(
  () => import("@/pages/PayrollDashboardPage")
);

export const Route = createFileRoute("/dashboard/payroll/")({
  head: () => ({ meta: [{ title: "Payroll Dashboard — OFC360" }] }),
  component: PayrollDashboardPage,
});
