import apiInstance from "@/api/apiInstance";
import type {
  ChangePasswordPayload,
  UpdateCurrentUserPayload,
  UserPreferences,
  UserProfile,
  UserSession,
} from "@/store/profile/profileTypes";

function extractData<T>(res: any, fallback?: T): T {
  const body =
    res?.data !== undefined && (res?.status !== undefined || res?.headers !== undefined)
      ? res.data
      : res;

  if (body == null) return fallback as T;

  if (typeof body === "object") {
    if ("data" in body && body.data !== undefined) return body.data as T;
    if ("result" in body && body.result !== undefined) return body.result as T;
  }

  return (body ?? fallback) as T;
}

export const profileApi = {
  // ── Current User Profile ───────────────────────────────────────
  async getCurrentUser(): Promise<UserProfile> {
    const res = await apiInstance.get("/users/me");
    const data = extractData<any>(res);
    return {
      id: String(data?.id ?? ""),
      fullName: data?.fullName ?? data?.full_name ?? data?.name ?? "",
      name: data?.name ?? data?.fullName ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? data?.phone_number ?? "",
      designation: data?.designation ?? data?.title ?? "",
      department: data?.department ?? "",
      bio: data?.bio ?? "",
      avatarUrl: data?.avatarUrl ?? data?.avatar_url ?? data?.avatar ?? "",
      role: data?.role ?? "",
      timezone: data?.timezone ?? "",
      language: data?.language ?? "",
      createdAt: data?.createdAt ?? data?.created_at ?? "",
    };
  },

  async updateCurrentUser(payload: UpdateCurrentUserPayload): Promise<UserProfile> {
    const res = await apiInstance.patch("/users/me", payload);
    const data = extractData<any>(res);
    return {
      id: String(data?.id ?? ""),
      fullName: data?.fullName ?? data?.full_name ?? data?.name ?? payload.fullName ?? "",
      name: data?.name ?? payload.name ?? "",
      email: data?.email ?? payload.email ?? "",
      phone: data?.phone ?? payload.phone ?? "",
      designation: data?.designation ?? payload.designation ?? "",
      department: data?.department ?? payload.department ?? "",
      bio: data?.bio ?? payload.bio ?? "",
      avatarUrl: data?.avatarUrl ?? data?.avatar_url ?? "",
      role: data?.role ?? "",
      timezone: data?.timezone ?? payload.timezone ?? "",
      language: data?.language ?? payload.language ?? "",
      createdAt: data?.createdAt ?? data?.created_at ?? "",
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

    const data = extractData<any>(res);
    const avatarUrl =
      data?.avatarUrl ??
      data?.avatar_url ??
      data?.url ??
      (typeof data === "string" ? data : "");

    return {
      avatarUrl,
      user: data?.user ? extractData<UserProfile>(data.user) : undefined,
    };
  },

  async deleteAvatar(): Promise<{ success: boolean; avatarUrl?: string }> {
    const res = await apiInstance.delete("/users/me/avatar");
    const data = extractData<any>(res);
    return {
      success: true,
      avatarUrl: data?.avatarUrl ?? "",
    };
  },

  // ── Password Management ────────────────────────────────────────
  async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
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
    const data = extractData<any>(res, { success: true, message: "Password changed successfully" });
    return {
      success: data?.success ?? true,
      message: data?.message ?? "Password updated successfully",
    };
  },

  // ── Active Sessions ────────────────────────────────────────────
  async getSessions(): Promise<UserSession[]> {
    const res = await apiInstance.get("/users/me/sessions");
    const data = extractData<any>(res, []);
    const items = Array.isArray(data)
      ? data
      : Array.isArray(data?.sessions)
        ? data.sessions
        : Array.isArray(data?.items)
          ? data.items
          : [];

    return items.map((s: any) => ({
      id: String(s.id ?? s.session_id ?? Math.random().toString(36).substring(2, 9)),
      device: s.device ?? s.user_agent ?? s.deviceName ?? "Unknown Device",
      ip: s.ip ?? s.ip_address ?? "127.0.0.1",
      lastActive: s.lastActive ?? s.last_active ?? s.updated_at ?? "Just now",
      current: Boolean(s.current ?? s.is_current ?? false),
      location: s.location ?? s.city ?? "",
      browser: s.browser ?? "",
      os: s.os ?? "",
    }));
  },

  async revokeSession(sessionId?: string): Promise<{ success: boolean; sessionId?: string }> {
    if (sessionId) {
      try {
        await apiInstance.delete(`/users/me/sessions/${sessionId}`);
      } catch (err: any) {
        // Fallback: try DELETE /users/me/sessions with body or params
        if (err?.response?.status === 404 || err?.response?.status === 405) {
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
    const data = extractData<any>(res);
    return {
      theme: data?.theme ?? "system",
      emailNotifications: Boolean(data?.emailNotifications ?? data?.email_notifications ?? true),
      pushNotifications: Boolean(data?.pushNotifications ?? data?.push_notifications ?? true),
      soundEnabled: Boolean(data?.soundEnabled ?? data?.sound_enabled ?? true),
      language: data?.language ?? "en",
      timezone: data?.timezone ?? "UTC+05:30 (IST)",
      dateFormat: data?.dateFormat ?? data?.date_format ?? "DD/MM/YYYY",
    };
  },

  async updatePreferences(payload: Partial<UserPreferences>): Promise<UserPreferences> {
    const res = await apiInstance.patch("/users/me/preferences", payload);
    const data = extractData<any>(res);
    return {
      theme: data?.theme ?? payload.theme ?? "system",
      emailNotifications: Boolean(
        data?.emailNotifications ?? data?.email_notifications ?? payload.emailNotifications ?? true,
      ),
      pushNotifications: Boolean(
        data?.pushNotifications ?? data?.push_notifications ?? payload.pushNotifications ?? true,
      ),
      soundEnabled: Boolean(data?.soundEnabled ?? data?.sound_enabled ?? payload.soundEnabled ?? true),
      language: data?.language ?? payload.language ?? "en",
      timezone: data?.timezone ?? payload.timezone ?? "UTC+05:30 (IST)",
      dateFormat: data?.dateFormat ?? data?.date_format ?? payload.dateFormat ?? "DD/MM/YYYY",
    };
  },
};

export default profileApi;
