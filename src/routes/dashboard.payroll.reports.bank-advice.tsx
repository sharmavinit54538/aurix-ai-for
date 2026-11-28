import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/BankAdviceReport"));

export const Route = createFileRoute("/dashboard/payroll/reports/bank-advice")({
  head: () => ({ meta: [{ title: "Bank Advice Report — OFC360" }] }),
  component: PageComponent,
});
