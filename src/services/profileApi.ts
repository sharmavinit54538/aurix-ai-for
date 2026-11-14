import apiInstance from "@/api/apiInstance";

export const profileApi = {
  getProfile: async () => {
    const res = await apiInstance.get("/profile");
    return res.data?.data ?? res.data;
  },
  getCurrentUser: async () => {
    const res = await apiInstance.get("/auth/me");
    return res.data?.data ?? res.data;
  },
  updateProfile: async (data: Record<string, unknown>) => {
    const res = await apiInstance.put("/profile", data);
    return res.data?.data ?? res.data;
  },
  updateCurrentUser: async (data: Record<string, unknown>) => {
    const res = await apiInstance.put("/profile", data);
    return res.data?.data ?? res.data;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  },
  changePassword: async (payload: {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const res = await apiInstance.post("/profile/change-password", payload);
    return res.data?.data ?? res.data;
  },
};

export default profileApi;
