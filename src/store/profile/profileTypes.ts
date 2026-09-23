export interface UserProfile {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  phone?: string;
  designation?: string;
  department?: string;
  bio?: string;
  avatarUrl?: string;
  role?: string;
  timezone?: string;
  language?: string;
  createdAt?: string;
}

export interface UserSession {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  current: boolean;
  location?: string;
  browser?: string;
  os?: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UpdateCurrentUserPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  designation?: string;
  department?: string;
  bio?: string;
}

export interface ProfileState {
  currentUser: UserProfile | null;
  sessions: UserSession[];
  preferences: UserPreferences | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;

  operationLoading: Record<string, boolean>;
  operationErrors: Record<string, string | null>;
  operationSuccess: Record<string, boolean>;
}
