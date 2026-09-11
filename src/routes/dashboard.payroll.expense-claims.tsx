import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";

const ExpensesPage = lazyFeaturePage(() => import("@/pages/ExpensesPage"));

export const Route = createFileRoute("/dashboard/payroll/expense-claims")({
  head: () => ({ meta: [{ title: "Expenses — OFC360" }] }),
  component: ExpenseClaimsRouteComponent,
});

function ExpenseClaimsRouteComponent() {
  return (
    <div className="space-y-4">
      <PayrollBackButton />
      <ExpensesPage />
    </div>
  );
}
