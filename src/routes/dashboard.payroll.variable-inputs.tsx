import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/VariableInputsPage"));

export const Route = createFileRoute("/dashboard/payroll/variable-inputs")({
  head: () => ({ meta: [{ title: "Variable Inputs — OFC360" }] }),
  component: PageComponent,
});
