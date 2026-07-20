import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const ExpensesPage = lazyFeaturePage(
  () => import("./dashboard.expenses") as any,
  "ExpensesPage"
);

export const Route = createFileRoute("/dashboard/payroll/expense-claims")({
  head: () => ({ meta: [{ title: "Expense Claims — Aurix" }] }),
  component: ExpensesPage,
});
