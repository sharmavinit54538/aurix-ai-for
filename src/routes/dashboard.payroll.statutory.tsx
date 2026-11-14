import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/StatutoryCompliancePage"));

export const Route = createFileRoute("/dashboard/payroll/statutory")({
  head: () => ({ meta: [{ title: "Statutory Compliance — OFC360" }] }),
  component: PageComponent,
});
