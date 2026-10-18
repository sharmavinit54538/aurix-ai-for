import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ManagersPage = lazyFeaturePage(
  () => import("@/features/admin/managers/pages/ManagersPage"),
  "ManagersPage",
);

interface ManagersSearch {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: string;
  managerId?: string;
}

export const Route = createFileRoute("/dashboard/managers")({
  validateSearch: (search: Record<string, unknown>): ManagersSearch => {
    return {
      page: search.page ? Number(search.page) : undefined,
      limit: search.limit ? Number(search.limit) : undefined,
      search: search.search ? String(search.search) : undefined,
      department: search.department ? String(search.department) : undefined,
      status: search.status ? String(search.status) : undefined,
      managerId: search.managerId ? String(search.managerId) : undefined,
    };
  },
  head: () => ({ meta: [{ title: "Managers — OFC360" }] }),
  component: ManagersPage,
});
