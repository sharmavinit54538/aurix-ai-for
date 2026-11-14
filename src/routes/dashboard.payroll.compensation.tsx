import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/EmployeeCompensationPage"));

export const Route = createFileRoute("/dashboard/payroll/compensation")({
  head: () => ({ meta: [{ title: "Compensation — OFC360" }] }),
  component: PageComponent,
});
