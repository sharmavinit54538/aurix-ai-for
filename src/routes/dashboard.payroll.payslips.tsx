import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/PayrollPayslipsHubPage"));

export const Route = createFileRoute("/dashboard/payroll/payslips")({
  head: () => ({ meta: [{ title: "Payslips Hub — OFC360" }] }),
  component: PageComponent,
});
