import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PayrollReportsPage = lazyFeaturePage(
  () => import("@/features/payroll/pages/PayrollReportsPage"),
);

export const Route = createFileRoute("/dashboard/payroll/reports")({
  head: () => ({ meta: [{ title: "Payroll Reports & Exports — OFC360" }] }),
  component: PayrollReportsPage,
});
