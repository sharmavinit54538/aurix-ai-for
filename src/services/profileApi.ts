import apiInstance from "@/api/apiInstance";
import { AUTH_ENDPOINTS } from "@/api/endpoints";

export const profileApi = {
  getProfile: async () => {
    const res = await apiInstance.get("/api/v1/settings/profile");
    return res.data?.data ?? res.data;
  },
  getCurrentUser: async () => {
    const res = await apiInstance.get(AUTH_ENDPOINTS.me);
    return res.data?.data ?? res.data;
  },
  updateProfile: async (data: Record<string, unknown>) => {
    const res = await apiInstance.put("/api/v1/settings/profile", data);
    return res.data?.data ?? res.data;
  },
  updateCurrentUser: async (data: Record<string, unknown>) => {
    const res = await apiInstance.put("/api/v1/settings/profile", data);
    return res.data?.data ?? res.data;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post("/api/v1/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  },
  changePassword: async (payload: {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const res = await apiInstance.post(AUTH_ENDPOINTS.changePassword, payload);
    return res.data?.data ?? res.data;
  },
};

export default profileApi;
