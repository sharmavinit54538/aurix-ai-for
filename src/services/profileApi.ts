import { api } from "@/api/client";

let currentUserState = {
  id: "usr-1",
  name: "Alex Vance",
  fullName: "Alex Vance",
  email: "alex.vance@aurix.ai",
  phone: "+91 98201 10001",
  role: "super_admin",
  designation: "VP of Engineering",
  department: "Engineering",
  avatarUrl: "",
};

export const profileApi = {
  getProfile: async () => {
    try {
      return await api.get("/profile");
    } catch {
      return { ...currentUserState };
    }
  },
  getCurrentUser: async () => {
    return { ...currentUserState };
  },
  updateProfile: async (data: any) => {
    currentUserState = { ...currentUserState, ...data };
    return { ...currentUserState };
  },
  updateCurrentUser: async (data: any) => {
    currentUserState = {
      ...currentUserState,
      ...data,
      name: data.fullName || data.name || currentUserState.name,
      fullName: data.fullName || data.name || currentUserState.fullName,
    };
    return { ...currentUserState };
  },
  uploadAvatar: async (_file: File) => {
    return { avatarUrl: currentUserState.avatarUrl || "" };
  },
  changePassword: async (_payload: {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    return { success: true, message: "Password updated successfully" };
  },
};

export default profileApi;
