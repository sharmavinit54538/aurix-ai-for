import apiInstance from "@/api/apiInstance";
import { aurix } from "@/lib/aurix-store";
import type {
  ChangePasswordPayload,
  UpdateCurrentUserPayload,
  UserPreferences,
  UserProfile,
  UserSession,
} from "@/store/profile/profileTypes";

function extractData<T>(res: unknown, fallback?: T): T {
  const r = res as { data?: unknown; status?: number; headers?: unknown } | undefined;
  const body =
    r?.data !== undefined && (r?.status !== undefined || r?.headers !== undefined) ? r.data : res;

  if (body == null) return fallback as T;

  if (typeof body === "object") {
    const b = body as Record<string, unknown>;
    if ("data" in b && b.data !== undefined) return b.data as T;
    if ("result" in b && b.result !== undefined) return b.result as T;
  }

  return (body ?? fallback) as T;
}

export const profileApi = {
  // ── Current User Profile ───────────────────────────────────────
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const res = await apiInstance.get("/users/me");
      const data = extractData<Record<string, unknown>>(res);
      if (data && typeof data === "object") {
        return {
          id: String(data.id ?? ""),
          fullName: String(data.fullName ?? data.full_name ?? data.name ?? ""),
          name: String(data.name ?? data.fullName ?? ""),
          email: String(data.email ?? ""),
          phone: String(data.phone ?? data.phone_number ?? ""),
          designation: String(data.designation ?? data.title ?? ""),
          department: String(data.department ?? ""),
          bio: String(data.bio ?? ""),
          avatarUrl: String(data.avatarUrl ?? data.avatar_url ?? data.avatar ?? ""),
          role: String(data.role ?? ""),
          timezone: String(data.timezone ?? ""),
          language: String(data.language ?? ""),
          createdAt: String(data.createdAt ?? data.created_at ?? ""),
        };
      }
    } catch {
      // Fall through to fallback
    }

    // Fallback 1: GET /auth/me
    try {
      const authRes = await apiInstance.get("/auth/me");
      const authData = extractData<Record<string, unknown>>(authRes);
      if (authData && typeof authData === "object") {
        return {
          id: String(authData.id ?? ""),
          fullName: String(authData.fullName ?? authData.full_name ?? authData.name ?? ""),
          name: String(authData.name ?? authData.fullName ?? ""),
          email: String(authData.email ?? ""),
          phone: String(authData.phone ?? authData.phone_number ?? ""),
          designation: String(authData.designation ?? authData.title ?? ""),
          department: String(authData.department ?? ""),
          bio: String(authData.bio ?? ""),
          avatarUrl: String(authData.avatarUrl ?? authData.avatar_url ?? authData.avatar ?? ""),
          role: String(authData.role ?? ""),
          timezone: String(authData.timezone ?? "UTC+05:30 (IST)"),
          language: String(authData.language ?? "en"),
          createdAt: String(authData.createdAt ?? authData.created_at ?? ""),
        };
      }
    } catch {
      // Fall through to fallback 2
    }

    // Fallback 2: Existing active authenticated session user
    const ws = aurix.get();
    return {
      id: ws.user?.id || "",
      fullName: ws.user?.fullName || "Active User",
      name: ws.user?.fullName || "Active User",
      email: ws.user?.email || "",
      phone: ws.user?.phone || "",
      designation: "",
      department: "",
      bio: "",
      avatarUrl: "",
      role: ws.user?.role || "employee",
      timezone: "UTC+05:30 (IST)",
      language: "en",
      createdAt: ws.user?.createdAt || new Date().toISOString(),
    };
  },

  async updateCurrentUser(payload: UpdateCurrentUserPayload): Promise<UserProfile> {
    const fullName = payload.fullName;
    const cleanPayload: Record<string, unknown> = {};

    if (fullName !== undefined && fullName !== null) cleanPayload.fullName = fullName;
    if (payload.email !== undefined && payload.email !== null) cleanPayload.email = payload.email;
    if (payload.phone !== undefined && payload.phone !== null) cleanPayload.phone = payload.phone;
    if (payload.designation !== undefined && payload.designation !== null)
      cleanPayload.designation = payload.designation;
    if (payload.department !== undefined && payload.department !== null)
      cleanPayload.department = payload.department;
    if (payload.bio !== undefined && payload.bio !== null) cleanPayload.bio = payload.bio;

    const res = await apiInstance.put("/settings/profile", cleanPayload);
    const data = extractData<Record<string, unknown>>(res, cleanPayload);

    const ws = aurix.get();
    const updatedProfile: UserProfile = {
      id: String(data?.id ?? ws.user?.id ?? ""),
      fullName: String(data?.fullName ?? data?.full_name ?? fullName ?? ws.user?.fullName ?? ""),
      name: String(data?.fullName ?? data?.full_name ?? fullName ?? ws.user?.fullName ?? ""),
      email: String(data?.email ?? payload.email ?? ws.user?.email ?? ""),
      phone: String(data?.phone ?? payload.phone ?? ws.user?.phone ?? ""),
      designation: String(data?.designation ?? payload.designation ?? ""),
      department: String(data?.department ?? payload.department ?? ""),
      bio: String(data?.bio ?? payload.bio ?? ""),
      avatarUrl: String(data?.avatarUrl ?? data?.avatar_url ?? ""),
      role: String(data?.role ?? ws.user?.role ?? "employee"),
      timezone: String(data?.timezone ?? "UTC+05:30 (IST)"),
      language: String(data?.language ?? "en"),
      createdAt: String(data?.createdAt ?? data?.created_at ?? ws.user?.createdAt ?? ""),
    };

    if (ws.user) {
      aurix.set({
        user: {
          ...ws.user,
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          phone: updatedProfile.phone || ws.user.phone || "",
        },
      });
    }

    return updatedProfile;
  },

  // ── Avatar Management ──────────────────────────────────────────
  async uploadAvatar(file: File | FormData): Promise<{ avatarUrl: string; user?: UserProfile }> {
    let formData: FormData;
    if (file instanceof FormData) {
      formData = file;
    } else {
      formData = new FormData();
      formData.append("avatar", file);
      formData.append("file", file);
    }

    const res = await apiInstance.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = extractData<Record<string, unknown> | string>(res);
    const avatarUrl =
      typeof data === "string"
        ? data
        : String(data?.avatarUrl ?? data?.avatar_url ?? data?.url ?? "");

    return {
      avatarUrl,
      user:
        typeof data === "object" && data?.user ? extractData<UserProfile>(data.user) : undefined,
    };
  },

  async deleteAvatar(): Promise<{ success: boolean; avatarUrl?: string }> {
    const res = await apiInstance.delete("/users/me/avatar");
    const data = extractData<Record<string, unknown>>(res);
    return {
      success: true,
      avatarUrl: String(data?.avatarUrl ?? ""),
    };
  },

  // ── Password Management ────────────────────────────────────────
  async changePassword(
    payload: ChangePasswordPayload,
  ): Promise<{ success: boolean; message: string }> {
    // Passwords are sent securely over HTTPS; never logged
    const res = await apiInstance.patch("/users/me/password", {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
      // also supply snake_case for backend compatibility
      current_password: payload.currentPassword,
      new_password: payload.newPassword,
      confirm_password: payload.confirmPassword,
    });
    const data = extractData<{ success?: boolean; message?: string }>(res, {
      success: true,
      message: "Password changed successfully",
    });
    return {
      success: data?.success ?? true,
      message: data?.message ?? "Password updated successfully",
    };
  },

  // ── Active Sessions ────────────────────────────────────────────
  async getSessions(): Promise<UserSession[]> {
    const res = await apiInstance.get("/users/me/sessions");
    const data = extractData<UserSession[] | { sessions?: UserSession[]; items?: UserSession[] }>(
      res,
      [],
    );
    const items = Array.isArray(data)
      ? data
      : Array.isArray(data?.sessions)
        ? data.sessions
        : Array.isArray(data?.items)
          ? data.items
          : [];

    return (items as unknown as Array<Record<string, unknown>>).map((s) => ({
      id: String(s.id ?? s.session_id ?? Math.random().toString(36).substring(2, 9)),
      device: String(s.device ?? s.user_agent ?? s.deviceName ?? "Unknown Device"),
      ip: String(s.ip ?? s.ip_address ?? "127.0.0.1"),
      lastActive: String(s.lastActive ?? s.last_active ?? s.updated_at ?? "Just now"),
      current: Boolean(s.current ?? s.is_current ?? false),
      location: s.location ? String(s.location) : undefined,
      browser: s.browser ? String(s.browser) : undefined,
      os: s.os ? String(s.os) : undefined,
    }));
  },

  async revokeSession(sessionId?: string): Promise<{ success: boolean; sessionId?: string }> {
    if (sessionId) {
      try {
        await apiInstance.delete(`/users/me/sessions/${sessionId}`);
      } catch (err: unknown) {
        const error = err as { response?: { status?: number } };
        // Fallback: try DELETE /users/me/sessions with body or params
        if (error?.response?.status === 404 || error?.response?.status === 405) {
          await apiInstance.delete("/users/me/sessions", {
            data: { sessionId, session_id: sessionId },
            params: { sessionId },
          });
        } else {
          throw err;
        }
      }
    } else {
      await apiInstance.delete("/users/me/sessions");
    }

    return { success: true, sessionId };
  },

  // ── User Preferences ───────────────────────────────────────────
  async getPreferences(): Promise<UserPreferences> {
    const res = await apiInstance.get("/users/me/preferences");
    const data = extractData<Record<string, unknown>>(res);
    return {
      theme: (data?.theme as "light" | "dark" | "system") ?? "system",
      emailNotifications: Boolean(data?.emailNotifications ?? data?.email_notifications ?? true),
      pushNotifications: Boolean(data?.pushNotifications ?? data?.push_notifications ?? true),
      soundEnabled: Boolean(data?.soundEnabled ?? data?.sound_enabled ?? true),
      language: String(data?.language ?? "en"),
      timezone: String(data?.timezone ?? "UTC+05:30 (IST)"),
      dateFormat: String(data?.dateFormat ?? data?.date_format ?? "DD/MM/YYYY"),
    };
  },

  async updatePreferences(payload: Partial<UserPreferences>): Promise<UserPreferences> {
    const res = await apiInstance.patch("/users/me/preferences", payload);
    const data = extractData<Record<string, unknown>>(res);
    return {
      theme: (data?.theme as "light" | "dark" | "system") ?? payload.theme ?? "system",
      emailNotifications: Boolean(
        data?.emailNotifications ?? data?.email_notifications ?? payload.emailNotifications ?? true,
      ),
      pushNotifications: Boolean(
        data?.pushNotifications ?? data?.push_notifications ?? payload.pushNotifications ?? true,
      ),
      soundEnabled: Boolean(
        data?.soundEnabled ?? data?.sound_enabled ?? payload.soundEnabled ?? true,
      ),
      language: String(data?.language ?? payload.language ?? "en"),
      timezone: String(data?.timezone ?? payload.timezone ?? "UTC+05:30 (IST)"),
      dateFormat: String(
        data?.dateFormat ?? data?.date_format ?? payload.dateFormat ?? "DD/MM/YYYY",
      ),
    };
  },
};

export default profileApi;
