import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/PayrollRegisterReport"));

export const Route = createFileRoute("/dashboard/payroll/reports/payroll-register")({
  head: () => ({ meta: [{ title: "Payroll Register — OFC360" }] }),
  component: PageComponent,
});
