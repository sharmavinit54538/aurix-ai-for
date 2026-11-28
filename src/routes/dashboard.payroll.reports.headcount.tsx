import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/HeadcountReport"));

export const Route = createFileRoute("/dashboard/payroll/reports/headcount")({
  head: () => ({ meta: [{ title: "Headcount Report — OFC360" }] }),
  component: PageComponent,
});
