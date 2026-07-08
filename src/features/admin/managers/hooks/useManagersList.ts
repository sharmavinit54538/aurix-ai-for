import { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useAurix, type Manager as AurixManager } from "@/lib/aurix-store";
import type { Manager } from "../types";

function mergeManagers(reduxManagers: Manager[], aurixManagers: AurixManager[]): Manager[] {
  const merged = [...reduxManagers];
  aurixManagers.forEach((sm) => {
    if (!merged.some((m) => m.email.toLowerCase() === sm.email.toLowerCase())) {
      merged.push({
        id: sm.id,
        employeeId: sm.id,
        firstName: sm.fullName.split(" ")[0] || "Manager",
        lastName: sm.fullName.split(" ").slice(1).join(" ") || "",
        fullName: sm.fullName,
        email: sm.email,
        phone: sm.phone,
        dob: "",
        gender: "prefer_not_to_say",
        department: sm.department,
        designation: sm.designation,
        managerRole: "team_lead",
        reportingManagerId: null,
        reportingManagerName: "",
        office: "",
        workLocation: "on_site",
        joiningDate: "",
        employmentType: "full_time",
        shift: sm.shiftStart ?? "General",
        status: "active",
        teamSize: sm.team?.length ?? 0,
        teamIds: sm.team ?? [],
        permissions: {
          canApproveLeave: true,
          canApproveAttendance: true,
          canManageEmployees: true,
          canViewPayroll: false,
          canEditDepartments: false,
          canInviteUsers: false,
          canManageRecruitment: false,
          canManagePerformance: false,
        },
        lastActive: new Date().toISOString(),
        attendanceSummary: { present: 0, absent: 0, late: 0, leave: 0 },
        leaveBalance: { annual: 0, sick: 0, casual: 0 },
        performanceScore: 0,
        recentActivity: [],
      });
    }
  });
  return merged;
}

export function useManagersList(): Manager[] {
  const reduxManagers = useAppSelector((state) => state.managers.managers);
  const ws = useAurix();
  return useMemo(
    () => mergeManagers(reduxManagers, ws.managers ?? []),
    [reduxManagers, ws.managers],
  );
}
