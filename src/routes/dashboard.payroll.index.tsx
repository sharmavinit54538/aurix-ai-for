import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "./_lib/lazyFeaturePage";

const PayrollDashboardPage = lazyFeaturePage(
  () => import("@/features/admin/payroll/pages/PayrollDashboardPage"),
  "PayrollDashboardPage",
);

export const Route = createFileRoute("/dashboard/payroll/")({
  head: () => ({ meta: [{ title: "Payroll Dashboard — Aurix" }] }),
  component: PayrollDashboardPage,
});
