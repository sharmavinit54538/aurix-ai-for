import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(
  () => import("@/features/payroll/pages/PayrollSecuritySessionsPage"),
);

export const Route = createFileRoute("/dashboard/payroll/security")({
  head: () => ({ meta: [{ title: "Payroll Security & Sessions — OFC360" }] }),
  component: PageComponent,
});
