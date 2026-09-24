import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const VariableInputsPage = lazyFeaturePage(
  () => import("@/features/payroll/pages/VariableInputsPage"),
);

export const Route = createFileRoute("/dashboard/payroll/variable-inputs")({
  head: () => ({ meta: [{ title: "Variable Payroll Inputs & Adjustments — OFC360" }] }),
  component: VariableInputsPage,
});
