import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { useCurrentRole } from "@/lib/use-current-role";

const AdminExpensesPage = lazyFeaturePage(() => import("@/pages/ExpensesPage"));
const EmployeeExpensesPage = lazyFeaturePage(() => import("@/pages/EmployeeExpensesPage"));

function RoleAwareExpensesPage() {
  const currentRole = useCurrentRole();
  if (currentRole === "employee") {
    return <EmployeeExpensesPage />;
  }
  return <AdminExpensesPage />;
}

export const Route = createFileRoute("/dashboard/expenses")({
  head: () => ({ meta: [{ title: "Expenses — OFC360" }] }),
  component: RoleAwareExpensesPage,
});
