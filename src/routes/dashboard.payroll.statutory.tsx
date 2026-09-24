import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const StatutoryCompliancePage = lazyFeaturePage(
  () => import("@/features/payroll/pages/StatutoryCompliancePage"),
);

export const Route = createFileRoute("/dashboard/payroll/statutory")({
  head: () => ({ meta: [{ title: "Statutory Compliance & Government Returns — OFC360" }] }),
  component: StatutoryCompliancePage,
});
