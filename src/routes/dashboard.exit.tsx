import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { useCurrentRole } from "@/lib/use-current-role";

const AdminExitPage = lazyFeaturePage(() => import("@/pages/ExitManagementPage"));
const EmployeeSelfServiceExitPage = lazyFeaturePage(() => import("@/pages/EmployeeExitPage"));

function RoleAwareExitPage() {
  const currentRole = useCurrentRole();
  if (currentRole === "employee") {
    return <EmployeeSelfServiceExitPage />;
  }
  return <AdminExitPage />;
}

export const Route = createFileRoute("/dashboard/exit")({
  head: () => ({ meta: [{ title: "Exit & Resignation — OFC360" }] }),
  component: RoleAwareExitPage,
});
