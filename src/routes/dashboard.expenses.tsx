import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ExpensesPage = lazyFeaturePage(() => import("@/pages/ExpensesPage"));

export const Route = createFileRoute("/dashboard/expenses")({
  head: () => ({ meta: [{ title: "Expense Management — Aurix" }] }),
  component: ExpensesPage,
});
