import { useQuery } from "@tanstack/react-query";
import { useAurix } from "@/lib/aurix-store";
import { apiInstance } from "@/api";

export interface CurrentEmployeeProfile {
  employeeProfileId: string;
  employeeName: string;
  employeeCode?: string;
  department?: string;
  designation?: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useCurrentEmployeeProfile() {
  const ws = useAurix();
  const user = ws.user;
  const isEmployeeRole = user?.role === "employee";

  const query = useQuery({
    queryKey: ["current-employee-profile", user?.id, user?.email],
    queryFn: async (): Promise<CurrentEmployeeProfile | null> => {
      if (!user) return null;

      // 1. If user object already has an employeeId property
      const directEmpId = (user as { employeeId?: string; employee_id?: string }).employeeId ||
        (user as { employeeId?: string; employee_id?: string }).employee_id;
      if (directEmpId && UUID_REGEX.test(directEmpId)) {
        return {
          employeeProfileId: directEmpId,
          employeeName: user.fullName || "Employee",
        };
      }

      // 2. Try GET /employees/me
      try {
        const meRes = await apiInstance.get("/employees/me");
        const meData = meRes.data?.data ?? meRes.data;
        if (meData && meData.id) {
          return {
            employeeProfileId: String(meData.id),
            employeeName:
              [meData.first_name, meData.last_name].filter(Boolean).join(" ").trim() ||
              meData.full_name ||
              user.fullName,
            employeeCode: meData.employee_id || meData.employee_code,
            department: meData.department,
            designation: meData.designation,
          };
        }
      } catch {
        // Fall through to search
      }

      // 3. Query /employees directory with user's email
      if (user.email) {
        try {
          const listRes = await apiInstance.get("/employees", {
            params: { search: user.email, limit: 10 },
          });
          const rawItems = listRes.data?.data?.items ?? listRes.data?.data ?? listRes.data ?? [];
          if (Array.isArray(rawItems)) {
            const match = rawItems.find(
              (e: Record<string, unknown>) =>
                e.user_id === user.id ||
                e.company_email === user.email ||
                e.personal_email === user.email ||
                e.email === user.email
            );
            if (match && match.id) {
              return {
                employeeProfileId: String(match.id),
                employeeName:
                  [match.first_name, match.last_name].filter(Boolean).join(" ").trim() ||
                  String(match.full_name || user.fullName),
                employeeCode: String(match.employee_id || match.employee_code || ""),
                department: String(match.department || ""),
                designation: String(match.designation || ""),
              };
            }
          }
        } catch {
          // Fall through
        }
      }

      // 4. Fallback: if user.id is already a UUID
      if (user.id && UUID_REGEX.test(user.id)) {
        return {
          employeeProfileId: user.id,
          employeeName: user.fullName || "Employee",
        };
      }

      return null;
    },
    enabled: Boolean(user?.id),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 30 * 60 * 1000,
  });

  return {
    profile: query.data,
    employeeProfileId: query.data?.employeeProfileId || (UUID_REGEX.test(user?.id || "") ? user?.id : ""),
    isLoading: query.isLoading,
    isEmployeeRole,
  };
}
