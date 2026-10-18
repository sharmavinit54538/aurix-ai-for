import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ItAdminPage = lazyFeaturePage(
  () => import("@/features/admin/itAdmin/pages/ItAdminPage"),
  "ItAdminPage",
);

interface ItAdminSearch {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: string;
  itAdminId?: string;
  adminId?: string;
}

export const Route = createFileRoute("/dashboard/it-admin")({
  validateSearch: (search: Record<string, unknown>): ItAdminSearch => {
    return {
      page: search.page ? Number(search.page) : undefined,
      limit: search.limit ? Number(search.limit) : undefined,
      search: search.search ? String(search.search) : undefined,
      department: search.department ? String(search.department) : undefined,
      status: search.status ? String(search.status) : undefined,
      itAdminId: search.itAdminId ? String(search.itAdminId) : undefined,
      adminId: search.adminId ? String(search.adminId) : undefined,
    };
  },
  head: () => ({ meta: [{ title: "IT Administrators — OFC360" }] }),
  component: ItAdminPage,
});
