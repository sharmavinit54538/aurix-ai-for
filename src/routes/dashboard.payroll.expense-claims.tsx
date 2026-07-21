import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ExpensesPage = lazyFeaturePage(() => import("@/pages/ExpensesPage"));

export const Route = createFileRoute("/dashboard/payroll/expense-claims")({
  head: () => ({ meta: [{ title: "Expenses — Aurix" }] }),
  component: ExpensesPage,
});
