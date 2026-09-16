import apiInstance from "@/api/apiInstance";
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
    const res = await apiInstance.get("/users/me");
    const data = extractData<Record<string, unknown>>(res);
    return {
      id: String(data?.id ?? ""),
      fullName: String(data?.fullName ?? data?.full_name ?? data?.name ?? ""),
      name: String(data?.name ?? data?.fullName ?? ""),
      email: String(data?.email ?? ""),
      phone: String(data?.phone ?? data?.phone_number ?? ""),
      designation: String(data?.designation ?? data?.title ?? ""),
      department: String(data?.department ?? ""),
      bio: String(data?.bio ?? ""),
      avatarUrl: String(data?.avatarUrl ?? data?.avatar_url ?? data?.avatar ?? ""),
      role: String(data?.role ?? ""),
      timezone: String(data?.timezone ?? ""),
      language: String(data?.language ?? ""),
      createdAt: String(data?.createdAt ?? data?.created_at ?? ""),
    };
  },

  async updateCurrentUser(payload: UpdateCurrentUserPayload): Promise<UserProfile> {
    const res = await apiInstance.patch("/users/me", payload);
    const data = extractData<Record<string, unknown>>(res);
    return {
      id: String(data?.id ?? ""),
      fullName: String(data?.fullName ?? data?.full_name ?? data?.name ?? payload.fullName ?? ""),
      name: String(data?.name ?? payload.name ?? ""),
      email: String(data?.email ?? payload.email ?? ""),
      phone: String(data?.phone ?? payload.phone ?? ""),
      designation: String(data?.designation ?? payload.designation ?? ""),
      department: String(data?.department ?? payload.department ?? ""),
      bio: String(data?.bio ?? payload.bio ?? ""),
      avatarUrl: String(data?.avatarUrl ?? data?.avatar_url ?? ""),
      role: String(data?.role ?? ""),
      timezone: String(data?.timezone ?? payload.timezone ?? ""),
      language: String(data?.language ?? payload.language ?? ""),
      createdAt: String(data?.createdAt ?? data?.created_at ?? ""),
    };
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

    return items.map((s: Record<string, unknown>) => ({
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
