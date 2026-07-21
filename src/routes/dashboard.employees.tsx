import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const EmployeesPage = lazyFeaturePage(
  () => import("@/features/admin/employees/pages/EmployeesPage"),
  "EmployeesPage",
);

interface EmployeesSearch {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  designation?: string;
  shift?: string;
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export const Route = createFileRoute("/dashboard/employees")({
  validateSearch: (search: Record<string, unknown>): EmployeesSearch => {
    return {
      page: search.page ? Number(search.page) : undefined,
      limit: search.limit ? Number(search.limit) : undefined,
      search: search.search ? String(search.search) : undefined,
      department: search.department ? String(search.department) : undefined,
      designation: search.designation ? String(search.designation) : undefined,
      shift: search.shift ? String(search.shift) : undefined,
      status: search.status ? String(search.status) : undefined,
      sort: search.sort ? String(search.sort) : undefined,
      order: (search.order === "asc" || search.order === "desc") ? search.order : undefined,
    };
  },
  head: () => ({ meta: [{ title: "Employees — Aurix" }] }),
  component: EmployeesPage,
});
