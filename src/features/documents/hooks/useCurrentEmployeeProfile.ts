import { useQuery } from "@tanstack/react-query";
import { useAurix } from "@/lib/aurix-store";
import { apiInstance } from "@/api";
import { profileApi } from "@/services/profileApi";

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

      // 2. Get current user profile from /users/me (or /auth/me fallback)
      // to get user details including potential employeeId field
      let profile: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        designation: string;
        department: string;
        employeeId?: string;
        employee_id?: string;
      } | null = null;

      try {
        const profileRes = await profileApi.getCurrentUser();
        profile = {
          id: profileRes.id,
          fullName: profileRes.fullName,
          email: profileRes.email,
          role: profileRes.role,
          designation: profileRes.designation,
          department: profileRes.department,
          employeeId: (profileRes as Record<string, unknown>).employeeId as string | undefined,
          employee_id: (profileRes as Record<string, unknown>).employee_id as string | undefined,
        };
      } catch {
        // If profile fetch fails, use stored user
        profile = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          designation: "",
          department: "",
        };
      }

      // Check if profile has employeeId
      const profileEmpId = profile.employeeId || profile.employee_id;
      if (profileEmpId && UUID_REGEX.test(profileEmpId)) {
        return {
          employeeProfileId: profileEmpId,
          employeeName: profile.fullName || "Employee",
          employeeCode: "",
          department: profile.department,
          designation: profile.designation,
        };
      }

      // 3. Query /employees directory with user's email
      if (profile?.email) {
        try {
          const listRes = await apiInstance.get("/employees", {
            params: { search: profile.email, limit: 10 },
          });
          const rawItems = listRes.data?.data?.items ?? listRes.data?.data ?? listRes.data ?? [];
          if (Array.isArray(rawItems)) {
            const match = rawItems.find(
              (e: Record<string, unknown>) =>
                e.user_id === user.id ||
                e.company_email === profile?.email ||
                e.personal_email === profile?.email ||
                e.email === profile?.email
            );
            if (match && match.id) {
              return {
                employeeProfileId: String(match.id),
                employeeName:
                  [match.first_name, match.last_name].filter(Boolean).join(" ").trim() ||
                  String(match.full_name || profile.fullName),
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
    staleTime: 60 * 60 * 1000, // 1 hour cache (once per session)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return {
    profile: query.data,
    employeeProfileId: query.data?.employeeProfileId || (UUID_REGEX.test(user?.id || "") ? user?.id : ""),
    isLoading: query.isLoading,
    isEmployeeRole,
  };
}
