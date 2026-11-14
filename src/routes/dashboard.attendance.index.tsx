import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { useCurrentRole } from "@/lib/use-current-role";
import { isEmployeeAttendanceRole } from "@/lib/hrms/attendance-helpers";

const AdminAttendancePage = lazyFeaturePage(() => import("@/pages/AttendancePage"));
const EmployeeAttendancePage = lazyFeaturePage(() => import("@/pages/EmployeeAttendancePage"));

function RoleAwareAttendancePage() {
  const currentRole = useCurrentRole();
  if (isEmployeeAttendanceRole(currentRole)) {
    return <EmployeeAttendancePage />;
  }
  return <AdminAttendancePage />;
}

export const Route = createFileRoute("/dashboard/attendance/")({
  head: () => ({ meta: [{ title: "Attendance — OFC360" }] }),
  component: RoleAwareAttendancePage,
});
