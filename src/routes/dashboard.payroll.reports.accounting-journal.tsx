import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/AccountingJournalReport"));

export const Route = createFileRoute("/dashboard/payroll/reports/accounting-journal")({
  head: () => ({ meta: [{ title: "Accounting Journal Export — OFC360" }] }),
  component: PageComponent,
});
