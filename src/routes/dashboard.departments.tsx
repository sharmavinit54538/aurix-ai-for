import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "./_lib/lazyFeaturePage";

const DepartmentsPage = lazyFeaturePage(
  () => import("@/features/departments/pages/DepartmentsPage"),
  "DepartmentsPage",
);

export const Route = createFileRoute("/dashboard/departments")({
  head: () => ({ meta: [{ title: "Departments — Aurix" }] }),
  component: DepartmentsPage,
});
